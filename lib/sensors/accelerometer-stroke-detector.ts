/**
 * Stroke Detector - Marcador de Voga
 * Detecta remadas usando o acelerômetro do smartphone
 * 
 * Inspirado em: SpeedCoach GPS 2, CoxBox Core, Concept2 PM5
 * 
 * Algoritmo:
 * 1. Detecta picos de aceleração (catch/pegada)
 * 2. Filtra ruído baseado em threshold configurável
 * 3. Calcula intervalo entre strokes
 * 4. Converte para SPM (Strokes Per Minute / VOGA)
 */

export interface StrokeData {
    timestamp: number;
    acceleration: number;
}

export interface StrokeDetectorConfig {
    /** Threshold mínimo de aceleração para detectar stroke (m/s²) */
    accelerationThreshold: number;
    /** Tempo mínimo entre strokes em ms (evita dupla contagem) */
    minStrokeInterval: number;
    /** Tamanho da janela para média móvel */
    smoothingWindow: number;
    /** Callback quando um stroke é detectado */
    onStroke?: (data: StrokeEvent) => void;
}

export interface StrokeEvent {
    strokeNumber: number;
    spm: number;
    timestamp: number;
    peakAcceleration: number;
}

export interface StrokeStats {
    totalStrokes: number;
    currentSPM: number;
    averageSPM: number;
    lastStrokeTime: number;
    isDetecting: boolean;
}

const DEFAULT_CONFIG: StrokeDetectorConfig = {
    accelerationThreshold: 2.5, // m/s² - ajustável para sensibilidade
    minStrokeInterval: 1200,    // 1.2s = máx 50 SPM
    smoothingWindow: 3,
};

export class StrokeDetector {
    private config: StrokeDetectorConfig;
    private isRunning: boolean = false;
    private strokeCount: number = 0;
    private lastStrokeTime: number = 0;
    private strokeIntervals: number[] = [];
    private accelerationBuffer: number[] = [];
    private deviceMotionHandler: ((event: DeviceMotionEvent) => void) | null = null;

    // Para detectar picos
    private previousAcceleration: number = 0;
    private isRising: boolean = false;

    constructor(config: Partial<StrokeDetectorConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Verifica se DeviceMotion API está disponível
     */
    static isSupported(): boolean {
        return 'DeviceMotionEvent' in window;
    }

    /**
     * Solicita permissão para usar sensores (necessário no iOS 13+)
     */
    static async requestPermission(): Promise<boolean> {
        // iOS 13+ requer permissão explícita
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            try {
                const permission = await (DeviceMotionEvent as any).requestPermission();
                return permission === 'granted';
            } catch (error) {
                console.error('Erro ao solicitar permissão de motion:', error);
                return false;
            }
        }
        // Android e iOS anteriores não precisam de permissão
        return true;
    }

    /**
     * Inicia detecção de strokes
     */
    async start(): Promise<boolean> {
        if (this.isRunning) return true;

        if (!StrokeDetector.isSupported()) {
            console.warn('DeviceMotion API não suportada');
            return false;
        }

        const hasPermission = await StrokeDetector.requestPermission();
        if (!hasPermission) {
            console.warn('Permissão de motion negada');
            return false;
        }

        this.reset();
        this.isRunning = true;

        this.deviceMotionHandler = (event: DeviceMotionEvent) => {
            this.processMotionEvent(event);
        };

        window.addEventListener('devicemotion', this.deviceMotionHandler);
        return true;
    }

    /**
     * Para detecção de strokes
     */
    stop(): void {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.deviceMotionHandler) {
            window.removeEventListener('devicemotion', this.deviceMotionHandler);
            this.deviceMotionHandler = null;
        }
    }

    /**
     * Reseta contadores
     */
    reset(): void {
        this.strokeCount = 0;
        this.lastStrokeTime = 0;
        this.strokeIntervals = [];
        this.accelerationBuffer = [];
        this.previousAcceleration = 0;
        this.isRising = false;
    }

    /**
     * Retorna estatísticas atuais
     */
    getStats(): StrokeStats {
        return {
            totalStrokes: this.strokeCount,
            currentSPM: this.calculateCurrentSPM(),
            averageSPM: this.calculateAverageSPM(),
            lastStrokeTime: this.lastStrokeTime,
            isDetecting: this.isRunning,
        };
    }

    /**
     * Processa evento de movimento
     */
    private processMotionEvent(event: DeviceMotionEvent): void {
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;

        // Calcula magnitude total da aceleração (removendo gravidade ~9.8)
        const magnitude = Math.sqrt(
            (acceleration.x || 0) ** 2 +
            (acceleration.y || 0) ** 2 +
            (acceleration.z || 0) ** 2
        ) - 9.8;

        // Aplica smoothing (média móvel)
        this.accelerationBuffer.push(Math.abs(magnitude));
        if (this.accelerationBuffer.length > this.config.smoothingWindow) {
            this.accelerationBuffer.shift();
        }

        const smoothedAcceleration = this.accelerationBuffer.reduce((a, b) => a + b, 0)
            / this.accelerationBuffer.length;

        // Detecta pico (estava subindo e agora está descendo)
        const wasRising = this.isRising;
        this.isRising = smoothedAcceleration > this.previousAcceleration;

        if (wasRising && !this.isRising) {
            // Pico detectado - verifica se é um stroke válido
            if (this.previousAcceleration >= this.config.accelerationThreshold) {
                this.registerStroke(this.previousAcceleration);
            }
        }

        this.previousAcceleration = smoothedAcceleration;
    }

    /**
     * Registra um stroke detectado
     */
    private registerStroke(peakAcceleration: number): void {
        const now = Date.now();

        // Verifica intervalo mínimo (evita dupla contagem)
        if (this.lastStrokeTime > 0) {
            const interval = now - this.lastStrokeTime;
            if (interval < this.config.minStrokeInterval) {
                return; // Muito rápido, provavelmente ruído
            }
            this.strokeIntervals.push(interval);
            // Mantém apenas últimos 10 intervalos para cálculo de SPM
            if (this.strokeIntervals.length > 10) {
                this.strokeIntervals.shift();
            }
        }

        this.strokeCount++;
        this.lastStrokeTime = now;

        // Callback
        if (this.config.onStroke) {
            this.config.onStroke({
                strokeNumber: this.strokeCount,
                spm: this.calculateCurrentSPM(),
                timestamp: now,
                peakAcceleration,
            });
        }
    }

    /**
     * Calcula SPM atual baseado nos últimos intervalos
     */
    private calculateCurrentSPM(): number {
        if (this.strokeIntervals.length < 2) {
            return 0;
        }

        // Usa média dos últimos 3 intervalos para suavizar
        const recentIntervals = this.strokeIntervals.slice(-3);
        const avgInterval = recentIntervals.reduce((a, b) => a + b, 0) / recentIntervals.length;

        // SPM = 60000ms / intervalo_médio_ms
        const spm = 60000 / avgInterval;

        // Limita a faixa realista (16-40 SPM para remo)
        return Math.max(16, Math.min(40, Math.round(spm)));
    }

    /**
     * Calcula SPM médio da sessão
     */
    private calculateAverageSPM(): number {
        if (this.strokeIntervals.length < 2) {
            return 0;
        }

        const avgInterval = this.strokeIntervals.reduce((a, b) => a + b, 0)
            / this.strokeIntervals.length;

        const spm = 60000 / avgInterval;
        return Math.max(16, Math.min(40, Math.round(spm)));
    }

    /**
     * Atualiza configuração em tempo real
     */
    updateConfig(config: Partial<StrokeDetectorConfig>): void {
        this.config = { ...this.config, ...config };
    }
}

/**
 * Modo simulado para testes e desenvolvimento
 */
export class SimulatedStrokeDetector {
    private isRunning: boolean = false;
    private strokeCount: number = 0;
    private intervalId: NodeJS.Timeout | null = null;
    private config: StrokeDetectorConfig;
    private strokeIntervals: number[] = [];
    private lastStrokeTime: number = 0;

    constructor(config: Partial<StrokeDetectorConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    static isSupported(): boolean {
        return true; // Sempre disponível
    }

    static async requestPermission(): Promise<boolean> {
        return true;
    }

    async start(): Promise<boolean> {
        if (this.isRunning) return true;

        this.reset();
        this.isRunning = true;

        // Simula strokes a cada 2-2.5 segundos (24-30 SPM)
        const simulateStroke = () => {
            if (!this.isRunning) return;

            const now = Date.now();
            const targetSPM = 24 + Math.random() * 6; // 24-30 SPM
            const interval = 60000 / targetSPM;

            if (this.lastStrokeTime > 0) {
                this.strokeIntervals.push(now - this.lastStrokeTime);
                if (this.strokeIntervals.length > 10) {
                    this.strokeIntervals.shift();
                }
            }

            this.strokeCount++;
            this.lastStrokeTime = now;

            if (this.config.onStroke) {
                this.config.onStroke({
                    strokeNumber: this.strokeCount,
                    spm: this.calculateCurrentSPM(),
                    timestamp: now,
                    peakAcceleration: 3 + Math.random() * 2,
                });
            }

            // Próximo stroke
            const nextInterval = interval + (Math.random() - 0.5) * 200;
            this.intervalId = setTimeout(simulateStroke, nextInterval);
        };

        // Primeiro stroke após 1 segundo
        this.intervalId = setTimeout(simulateStroke, 1000);
        return true;
    }

    stop(): void {
        this.isRunning = false;
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
    }

    reset(): void {
        this.strokeCount = 0;
        this.lastStrokeTime = 0;
        this.strokeIntervals = [];
    }

    getStats(): StrokeStats {
        return {
            totalStrokes: this.strokeCount,
            currentSPM: this.calculateCurrentSPM(),
            averageSPM: this.calculateAverageSPM(),
            lastStrokeTime: this.lastStrokeTime,
            isDetecting: this.isRunning,
        };
    }

    private calculateCurrentSPM(): number {
        if (this.strokeIntervals.length < 2) return 0;
        const recent = this.strokeIntervals.slice(-3);
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        return Math.round(60000 / avg);
    }

    private calculateAverageSPM(): number {
        if (this.strokeIntervals.length < 2) return 0;
        const avg = this.strokeIntervals.reduce((a, b) => a + b, 0) / this.strokeIntervals.length;
        return Math.round(60000 / avg);
    }

    updateConfig(config: Partial<StrokeDetectorConfig>): void {
        this.config = { ...this.config, ...config };
    }
}

/**
 * Factory que retorna o detector apropriado
 * Usa o real se disponível, senão usa simulado
 */
export function createStrokeDetector(
    config: Partial<StrokeDetectorConfig> = {},
    preferSimulated: boolean = false
): StrokeDetector | SimulatedStrokeDetector {
    if (preferSimulated || !StrokeDetector.isSupported()) {
        console.log('Usando detector de strokes simulado');
        return new SimulatedStrokeDetector(config);
    }
    console.log('Usando detector de strokes via acelerômetro');
    return new StrokeDetector(config);
}
