'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { XPGain, useXPGain } from '@/components/gamification';
import { useAudioCoach } from '@/lib/utils/audio-coach';
import {
    Play, Pause, Square, MapPin, Timer, TrendingUp,
    Trophy, Target, User, Zap, Flag, CheckCircle
} from 'lucide-react';

interface RaceMetrics {
    duration: number;
    distance: number;
    pace: string;
    position: number; // 1 = winning, 2 = losing
}

interface Ghost {
    id: string;
    name: string;
    avgPace: string;
    distance: number;
    isYou?: boolean;
}

function CompeteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const distance = parseInt(searchParams.get('distance') || '2000');
    const ghostType = searchParams.get('ghost') || 'personal'; // personal, club, world

    const [phase, setPhase] = useState<'countdown' | 'racing' | 'finished'>('countdown');
    const [countdown, setCountdown] = useState(3);
    const [metrics, setMetrics] = useState<RaceMetrics>({
        duration: 0,
        distance: 0,
        pace: '--:--',
        position: 2
    });
    const [ghosts, setGhosts] = useState<Ghost[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    const audioCoach = useAudioCoach();
    const { showXPGain, XPGainComponent } = useXPGain();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Inicializar ghosts
    useEffect(() => {
        const personalBest: Ghost = {
            id: 'personal',
            name: 'Seu Recorde',
            avgPace: '2:15',
            distance: 0
        };

        const you: Ghost = {
            id: 'you',
            name: 'Você',
            avgPace: '--:--',
            distance: 0,
            isYou: true
        };

        setGhosts([personalBest, you]);
    }, []);

    // Countdown
    useEffect(() => {
        if (phase !== 'countdown') return;

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setPhase('racing');
                    audioCoach.speak('Vai! Comece!', 5);
                    return 0;
                }
                audioCoach.countdown(prev - 1);
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [phase, audioCoach]);

    // Racing simulation
    useEffect(() => {
        if (phase !== 'racing' || isPaused) return;

        intervalRef.current = setInterval(() => {
            setMetrics(prev => {
                const newDuration = prev.duration + 1;
                // Simular distância baseada em pace
                const metersPerSecond = 500 / 135; // ~2:15/500m pace
                const newDistance = Math.min(distance, prev.distance + metersPerSecond + (Math.random() * 0.5));

                // Calcular pace
                const paceSeconds = newDuration / (newDistance / 500);
                const minutes = Math.floor(paceSeconds / 60);
                const seconds = Math.floor(paceSeconds % 60);
                const newPace = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                // Verificar se terminou
                if (newDistance >= distance) {
                    setPhase('finished');
                    audioCoach.workoutComplete();
                    showXPGain(50);
                }

                return {
                    duration: newDuration,
                    distance: newDistance,
                    pace: newPace,
                    position: 1
                };
            });

            // Atualizar ghost (simular correndo também)
            setGhosts(prev => prev.map(ghost => {
                if (ghost.isYou) {
                    return { ...ghost, distance: metrics.distance };
                }
                // Ghost corre com pace constante de 2:15/500m
                const ghostSpeed = 500 / 135;
                return { ...ghost, distance: Math.min(distance, ghost.distance + ghostSpeed) };
            }));

            // Milestones
            if (metrics.distance > 0 && metrics.distance % 500 < 5) {
                audioCoach.announceDistance(metrics.distance);
            }

        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [phase, isPaused, distance, metrics.distance, audioCoach, showXPGain]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = (dist: number) => (dist / distance) * 100;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <XPGainComponent />

            {/* Countdown Overlay */}
            <AnimatePresence>
                {phase === 'countdown' && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            key={countdown}
                            className="text-9xl font-black text-club-red"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {countdown > 0 ? countdown : 'VAI!'}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-gradient-to-b from-club-red/20 to-transparent p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-bold">Modo Competição</span>
                    </div>
                    <div className="text-white/60 text-sm">
                        {distance}m
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 space-y-4">
                {/* Pista de Corrida Visual */}
                <AnimatedCard variant="gradient" className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-xs">PISTA</span>
                        <Flag className="w-4 h-4 text-yellow-400" />
                    </div>

                    <div className="space-y-3">
                        {ghosts.map((ghost, index) => (
                            <div key={ghost.id} className="relative">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${ghost.isYou ? 'bg-club-red' : 'bg-white/20'
                                        }`}>
                                        <User className="w-3 h-3 text-white" />
                                    </div>
                                    <span className={`text-sm ${ghost.isYou ? 'text-white font-bold' : 'text-white/60'}`}>
                                        {ghost.name}
                                    </span>
                                    <span className="text-xs text-white/40 ml-auto">
                                        {Math.round(ghost.distance)}m
                                    </span>
                                </div>
                                <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
                                    <motion.div
                                        className={`h-full rounded-full ${ghost.isYou
                                                ? 'bg-gradient-to-r from-club-red to-orange-500'
                                                : 'bg-white/30'
                                            }`}
                                        style={{ width: `${getProgress(ghost.distance)}%` }}
                                        animate={{ width: `${getProgress(ghost.distance)}%` }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                    {/* Runner icon */}
                                    <motion.div
                                        className={`absolute top-0 h-full flex items-center ${ghost.isYou ? 'text-yellow-400' : 'text-white/50'
                                            }`}
                                        style={{ left: `${Math.min(95, getProgress(ghost.distance))}%` }}
                                    >
                                        🚣
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-3 text-xs text-white/40">
                        <span>0m</span>
                        <span>{distance / 2}m</span>
                        <span>{distance}m 🏁</span>
                    </div>
                </AnimatedCard>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-3">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Timer className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-white">
                            {formatTime(metrics.duration)}
                        </div>
                        <div className="text-xs text-white/60">Tempo</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <MapPin className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-white">
                            {Math.round(metrics.distance)}m
                        </div>
                        <div className="text-xs text-white/60">Distância</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-white">
                            {metrics.pace}
                        </div>
                        <div className="text-xs text-white/60">/500m</div>
                    </AnimatedCard>
                </div>

                {/* Posição */}
                <AnimatedCard variant={metrics.position === 1 ? 'gradient' : 'glass'} className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${metrics.position === 1 ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/60'
                                }`}>
                                {metrics.position}º
                            </div>
                            <div>
                                <div className="text-white font-bold">
                                    {metrics.position === 1 ? 'Você está na frente!' : 'Continue! Você consegue!'}
                                </div>
                                <div className="text-white/60 text-sm">
                                    {metrics.position === 1 ? 'Mantenha o ritmo!' : 'Acelere para ultrapassar!'}
                                </div>
                            </div>
                        </div>
                        {metrics.position === 1 && <Trophy className="w-8 h-8 text-yellow-400" />}
                    </div>
                </AnimatedCard>

                {/* Finished */}
                {phase === 'finished' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AnimatedCard variant="gradient" className="p-6 text-center">
                            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {metrics.position === 1 ? 'Você Venceu!' : 'Bom Esforço!'}
                            </h2>
                            <p className="text-white/60 mb-4">
                                Tempo: {formatTime(metrics.duration)} | Pace: {metrics.pace}/500m
                            </p>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                <span className="text-yellow-400 font-bold">+50 XP</span>
                            </div>
                            <Button
                                onClick={() => router.push('/training/cooldown')}
                                className="w-full bg-club-red hover:bg-club-red/90"
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Finalizar
                            </Button>
                        </AnimatedCard>
                    </motion.div>
                )}

                {/* Controls */}
                {phase === 'racing' && (
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={() => setIsPaused(!isPaused)}
                            variant="outline"
                            className="flex-1 h-14 gap-2"
                        >
                            {isPaused ? (
                                <>
                                    <Play className="w-6 h-6" />
                                    Retomar
                                </>
                            ) : (
                                <>
                                    <Pause className="w-6 h-6" />
                                    Pausar
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={() => router.push('/training')}
                            variant="outline"
                            className="h-14 gap-2 text-red-400 border-red-400/30"
                        >
                            <Square className="w-6 h-6" />
                            Desistir
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CompetePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-club-black flex items-center justify-center">
                <motion.div
                    className="w-16 h-16 border-4 border-club-red border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        }>
            <CompeteContent />
        </Suspense>
    );
}
