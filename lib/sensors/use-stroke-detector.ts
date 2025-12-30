/**
 * Hook React para detecção de strokes (remadas)
 * Integra o StrokeDetector com componentes React
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    createStrokeDetector,
    StrokeDetector,
    SimulatedStrokeDetector,
    StrokeStats,
    StrokeEvent,
    StrokeDetectorConfig
} from './accelerometer-stroke-detector';

export interface UseStrokeDetectorOptions {
    /** Inicia automaticamente ao montar */
    autoStart?: boolean;
    /** Força uso do modo simulado */
    useSimulated?: boolean;
    /** Configurações do detector */
    config?: Partial<StrokeDetectorConfig>;
    /** Callback quando um stroke é detectado */
    onStroke?: (event: StrokeEvent) => void;
}

export interface UseStrokeDetectorReturn {
    /** Estatísticas atuais */
    stats: StrokeStats;
    /** Se está detectando */
    isActive: boolean;
    /** Se está usando modo simulado */
    isSimulated: boolean;
    /** Se o acelerômetro está disponível */
    isSupported: boolean;
    /** Inicia detecção */
    start: () => Promise<boolean>;
    /** Para detecção */
    stop: () => void;
    /** Reseta contadores */
    reset: () => void;
    /** SPM atual (atalho) */
    spm: number;
    /** Total de strokes (atalho) */
    totalStrokes: number;
}

export function useStrokeDetector(
    options: UseStrokeDetectorOptions = {}
): UseStrokeDetectorReturn {
    const {
        autoStart = false,
        useSimulated = false,
        config = {},
        onStroke
    } = options;

    const [stats, setStats] = useState<StrokeStats>({
        totalStrokes: 0,
        currentSPM: 0,
        averageSPM: 0,
        lastStrokeTime: 0,
        isDetecting: false,
    });

    const [isActive, setIsActive] = useState(false);
    const [isSimulated, setIsSimulated] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    const detectorRef = useRef<StrokeDetector | SimulatedStrokeDetector | null>(null);
    const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cria o detector
    useEffect(() => {
        const strokeCallback = (event: StrokeEvent) => {
            // Atualiza stats imediatamente no stroke
            setStats(prev => ({
                ...prev,
                totalStrokes: event.strokeNumber,
                currentSPM: event.spm,
            }));

            // Chama callback externo
            onStroke?.(event);
        };

        const detector = createStrokeDetector(
            { ...config, onStroke: strokeCallback },
            useSimulated
        );

        detectorRef.current = detector;
        setIsSimulated(detector instanceof SimulatedStrokeDetector);
        setIsSupported(StrokeDetector.isSupported() || useSimulated);

        return () => {
            detector.stop();
            detectorRef.current = null;
        };
    }, [useSimulated]); // Re-cria se useSimulated mudar

    // Auto-start
    useEffect(() => {
        if (autoStart && detectorRef.current) {
            start();
        }
    }, [autoStart]);

    // Atualiza stats periodicamente quando ativo
    useEffect(() => {
        if (isActive) {
            updateIntervalRef.current = setInterval(() => {
                if (detectorRef.current) {
                    setStats(detectorRef.current.getStats());
                }
            }, 500); // Atualiza a cada 500ms
        } else {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
                updateIntervalRef.current = null;
            }
        }

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
            }
        };
    }, [isActive]);

    const start = useCallback(async (): Promise<boolean> => {
        if (!detectorRef.current) return false;

        const success = await detectorRef.current.start();
        setIsActive(success);
        return success;
    }, []);

    const stop = useCallback(() => {
        if (detectorRef.current) {
            detectorRef.current.stop();
            setStats(detectorRef.current.getStats());
        }
        setIsActive(false);
    }, []);

    const reset = useCallback(() => {
        if (detectorRef.current) {
            detectorRef.current.reset();
            setStats(detectorRef.current.getStats());
        }
    }, []);

    return {
        stats,
        isActive,
        isSimulated,
        isSupported,
        start,
        stop,
        reset,
        spm: stats.currentSPM,
        totalStrokes: stats.totalStrokes,
    };
}

/**
 * Hook para calcular distância por stroke (DPS)
 * Combina dados de GPS com detecção de strokes
 */
export function useDistancePerStroke(
    distance: number, // metros totais
    totalStrokes: number
): number {
    if (totalStrokes === 0) return 0;
    const dps = distance / totalStrokes;
    // DPS típico: 6-12 metros
    return Math.round(dps * 10) / 10; // 1 casa decimal
}
