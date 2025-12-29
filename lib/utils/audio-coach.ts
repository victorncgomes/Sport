/**
 * Sistema de Audio Coaching para treinos
 * 
 * Fornece feedback auditivo durante o treino, incluindo:
 * - Contagem de intervalos
 * - Alertas de pace
 * - Motivação
 * - Comandos de técnica
 */

type AudioType = 'countdown' | 'pace' | 'motivation' | 'technique' | 'milestone' | 'warning';

interface AudioMessage {
    type: AudioType;
    text: string;
    priority: number; // 1 = baixa, 5 = alta
}

// Mensagens de motivação
const MOTIVATION_MESSAGES = [
    "Você está indo muito bem! Continue assim!",
    "Mantenha o ritmo! Foco na técnica!",
    "Força! Cada remada conta!",
    "Excelente trabalho! Não desista agora!",
    "Você consegue! Mais um pouco!",
    "Concentre-se na respiração e no ritmo!",
];

// Mensagens de técnica
const TECHNIQUE_MESSAGES = [
    "Lembre-se: puxe com as costas, não só com os braços",
    "Mantenha o core ativado durante toda a remada",
    "Extensão completa das pernas antes de puxar",
    "Braços esticados na recuperação",
    "Olhe para frente, postura ereta",
    "Respire no final da tração",
];

// Alertas de pace
const PACE_ALERTS = {
    tooFast: "Você está acima do pace. Reduza um pouco!",
    tooSlow: "Pace abaixo do esperado. Acelere!",
    onTarget: "Pace perfeito! Continue assim!",
    improving: "Seu pace está melhorando!",
};

// Milestones
const MILESTONE_MESSAGES = {
    '500m': "500 metros! Continue firme!",
    '1km': "1 quilômetro completado! Excelente!",
    '2km': "2 quilômetros! Você está voando!",
    '5km': "5 quilômetros! Isso é impressionante!",
    'halfway': "Metade do caminho! Quase lá!",
    'almostDone': "Faltam apenas 500 metros!",
    'finished': "Treino concluído! Parabéns pelo esforço!",
};

export class AudioCoach {
    private isMuted: boolean = false;
    private speechSynthesis: SpeechSynthesis | null = null;
    private lastMotivationTime: number = 0;
    private lastTechniqueTime: number = 0;
    private motivationInterval: number = 300000; // 5 min entre motivações
    private techniqueInterval: number = 180000; // 3 min entre técnicas
    private voice: SpeechSynthesisVoice | null = null;

    constructor() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;

            // Selecionar voz em português
            const loadVoices = () => {
                const voices = this.speechSynthesis?.getVoices() || [];
                this.voice = voices.find(v => v.lang.startsWith('pt')) || voices[0] || null;
            };

            loadVoices();
            this.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    /**
     * Falar uma mensagem usando Text-to-Speech
     */
    speak(message: string, priority: number = 3): void {
        if (this.isMuted || !this.speechSynthesis) return;

        // Cancelar fala atual se prioridade for maior
        if (priority >= 4) {
            this.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        if (this.voice) {
            utterance.voice = this.voice;
        }

        this.speechSynthesis.speak(utterance);
    }

    /**
     * Contagem regressiva falada
     */
    countdown(seconds: number): void {
        if (seconds <= 5 && seconds > 0) {
            this.speak(`${seconds}`, 5);
        } else if (seconds === 0) {
            this.speak("Vai! Comece!", 5);
        }
    }

    /**
     * Anunciar distância percorrida
     */
    announceDistance(meters: number): void {
        const milestones = [500, 1000, 2000, 3000, 5000, 10000];

        for (const milestone of milestones) {
            if (meters >= milestone && meters < milestone + 50) {
                if (milestone === 500) {
                    this.speak(MILESTONE_MESSAGES['500m'], 4);
                } else if (milestone === 1000) {
                    this.speak(MILESTONE_MESSAGES['1km'], 4);
                } else if (milestone === 2000) {
                    this.speak(MILESTONE_MESSAGES['2km'], 4);
                } else if (milestone === 5000) {
                    this.speak(MILESTONE_MESSAGES['5km'], 4);
                }
                break;
            }
        }
    }

    /**
     * Feedback de pace
     */
    announcePace(currentPace: number, targetPace: number): void {
        const diff = currentPace - targetPace;

        if (diff > 10) {
            this.speak(PACE_ALERTS.tooSlow, 3);
        } else if (diff < -10) {
            this.speak(PACE_ALERTS.tooFast, 3);
        }
    }

    /**
     * Motivação periódica
     */
    checkMotivation(): void {
        const now = Date.now();
        if (now - this.lastMotivationTime >= this.motivationInterval) {
            const message = MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];
            this.speak(message, 2);
            this.lastMotivationTime = now;
        }
    }

    /**
     * Dica de técnica periódica
     */
    checkTechnique(): void {
        const now = Date.now();
        if (now - this.lastTechniqueTime >= this.techniqueInterval) {
            const message = TECHNIQUE_MESSAGES[Math.floor(Math.random() * TECHNIQUE_MESSAGES.length)];
            this.speak(message, 2);
            this.lastTechniqueTime = now;
        }
    }

    /**
     * Aviso de intervalo
     */
    intervalAlert(restSeconds: number): void {
        this.speak(`Intervalo de ${restSeconds} segundos. Descanse e hidrate-se.`, 4);
    }

    /**
     * Início de série
     */
    seriesStart(seriesNumber: number, totalSeries: number): void {
        this.speak(`Série ${seriesNumber} de ${totalSeries}. Vamos lá!`, 4);
    }

    /**
     * Treino finalizado
     */
    workoutComplete(): void {
        this.speak(MILESTONE_MESSAGES.finished, 5);
    }

    /**
     * Mutar/desmutar
     */
    toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
        return this.isMuted;
    }

    /**
     * Verificar se está mutado
     */
    getMuted(): boolean {
        return this.isMuted;
    }

    /**
     * Definir intervalo de motivação (ms)
     */
    setMotivationInterval(ms: number): void {
        this.motivationInterval = ms;
    }

    /**
     * Definir intervalo de técnica (ms)
     */
    setTechniqueInterval(ms: number): void {
        this.techniqueInterval = ms;
    }
}

// Singleton
let audioCoachInstance: AudioCoach | null = null;

export function getAudioCoach(): AudioCoach {
    if (!audioCoachInstance) {
        audioCoachInstance = new AudioCoach();
    }
    return audioCoachInstance;
}

// Hook para React
export function useAudioCoach() {
    const coach = getAudioCoach();

    return {
        speak: coach.speak.bind(coach),
        countdown: coach.countdown.bind(coach),
        announceDistance: coach.announceDistance.bind(coach),
        announcePace: coach.announcePace.bind(coach),
        checkMotivation: coach.checkMotivation.bind(coach),
        checkTechnique: coach.checkTechnique.bind(coach),
        intervalAlert: coach.intervalAlert.bind(coach),
        seriesStart: coach.seriesStart.bind(coach),
        workoutComplete: coach.workoutComplete.bind(coach),
        toggleMute: coach.toggleMute.bind(coach),
        isMuted: coach.getMuted.bind(coach)
    };
}
