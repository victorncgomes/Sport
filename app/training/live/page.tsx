'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { XPGain, useXPGain } from '@/components/gamification';
import { useAudioCoach } from '@/lib/utils/audio-coach';
import {
    Play, Pause, Square, MapPin, Heart, Timer, TrendingUp,
    Activity, Waves, Volume2, VolumeX, Target, Zap
} from 'lucide-react';

interface WorkoutMetrics {
    duration: number;
    distance: number;
    pace: string;
    heartRate: number;
    spm: number; // strokes per minute
    calories: number;
}

function LiveWorkoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const workoutType = searchParams.get('type') || 'outdoor';

    const [isRunning, setIsRunning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [metrics, setMetrics] = useState<WorkoutMetrics>({
        duration: 0,
        distance: 0,
        pace: '--:--',
        heartRate: 0,
        spm: 0,
        calories: 0
    });
    const [gpsPoints, setGpsPoints] = useState<any[]>([]);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);

    const { showXPGain, XPGainComponent } = useXPGain();
    const watchIdRef = useRef<number | null>(null);
    const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);

    // Timer
    useEffect(() => {
        if (!isRunning || isPaused) return;

        const interval = setInterval(() => {
            setMetrics(prev => {
                const newDuration = prev.duration + 1;
                // Simular calorias (aproximação)
                const newCalories = Math.round(newDuration * 0.15);
                return { ...prev, duration: newDuration, calories: newCalories };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, isPaused]);

    // GPS Tracking (apenas outdoor)
    useEffect(() => {
        if (!isRunning || isPaused || workoutType !== 'outdoor') return;

        if ('geolocation' in navigator) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude, accuracy, altitude, speed } = position.coords;

                    // Filtrar pontos com baixa precisão
                    if (accuracy > 30) return;

                    const point = {
                        lat: latitude,
                        lng: longitude,
                        timestamp: Date.now(),
                        accuracy,
                        altitude: altitude || undefined,
                        speed: speed || undefined
                    };

                    setGpsPoints(prev => [...prev, point]);

                    // Calcular distância
                    if (lastPositionRef.current) {
                        const dist = calculateDistance(
                            lastPositionRef.current.lat,
                            lastPositionRef.current.lng,
                            latitude,
                            longitude
                        );

                        if (dist > 1) { // Mínimo 1 metro para contar
                            setMetrics(prev => ({
                                ...prev,
                                distance: prev.distance + dist
                            }));
                        }
                    }

                    lastPositionRef.current = { lat: latitude, lng: longitude };
                },
                (error) => console.error('GPS Error:', error),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );
        }

        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [isRunning, isPaused, workoutType]);

    // Calcular pace
    useEffect(() => {
        if (metrics.distance > 0 && metrics.duration > 0) {
            const paceSeconds = (metrics.duration / (metrics.distance / 500));
            const minutes = Math.floor(paceSeconds / 60);
            const seconds = Math.floor(paceSeconds % 60);
            setMetrics(prev => ({
                ...prev,
                pace: `${minutes}:${seconds.toString().padStart(2, '0')}`
            }));
        }
    }, [metrics.distance, metrics.duration]);

    // Simular SPM (strokes per minute) para demo
    useEffect(() => {
        if (!isRunning || isPaused) return;

        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                spm: 24 + Math.floor(Math.random() * 8) // 24-32 SPM
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, [isRunning, isPaused]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    const handleFinish = async () => {
        setShowFinishConfirm(false);
        setIsRunning(false);

        try {
            // Salvar pontos GPS
            if (gpsPoints.length > 0 && sessionId) {
                await fetch(`/api/workouts/${sessionId}/gps-points`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ points: gpsPoints })
                });
            }

            // Finalizar treino
            if (sessionId) {
                await fetch(`/api/workouts/${sessionId}/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        duration: metrics.duration,
                        distance: metrics.distance,
                        avgPace: metrics.pace,
                        calories: metrics.calories
                    })
                });
            }

            // Mostrar XP ganho
            showXPGain(25);

            // Aguardar animação e redirecionar
            setTimeout(() => {
                router.push(`/training/cooldown?sessionId=${sessionId}`);
            }, 2000);

        } catch (error) {
            console.error('Error finishing workout:', error);
            router.push('/training');
        }
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <XPGainComponent />

            {/* Header minimalista */}
            <div className="bg-gradient-to-b from-club-red/20 to-transparent p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Waves className="w-5 h-5 text-club-red" />
                        <span className="text-white font-bold">
                            {workoutType === 'outdoor' ? 'Treino no Rio' : 'Treino Indoor'}
                        </span>
                    </div>
                    <button
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className="p-2 rounded-full bg-white/10"
                    >
                        {audioEnabled ? (
                            <Volume2 className="w-5 h-5 text-white" />
                        ) : (
                            <VolumeX className="w-5 h-5 text-white/50" />
                        )}
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 space-y-4">
                {/* Timer Principal - Hero */}
                <motion.div
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-club-red to-red-700 p-8 text-center"
                    animate={isPaused ? { opacity: 0.7 } : { opacity: 1 }}
                >
                    {/* Ondas animadas de fundo */}
                    <div className="absolute inset-0 opacity-20">
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-20 bg-white/20"
                            style={{ borderRadius: '50% 50% 0 0' }}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    <div className="relative">
                        <motion.div
                            className="text-7xl font-bold text-white tracking-wider"
                            key={metrics.duration}
                            initial={{ scale: 1.02 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.1 }}
                        >
                            {formatTime(metrics.duration)}
                        </motion.div>
                        <div className="text-white/60 mt-2 flex items-center justify-center gap-2">
                            <Timer className="w-4 h-4" />
                            {isPaused ? 'Pausado' : 'Tempo Decorrido'}
                        </div>
                    </div>
                </motion.div>

                {/* Métricas Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Distância */}
                    <AnimatedCard variant="glass" className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span className="text-white/60 text-xs">Distância</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {(metrics.distance / 1000).toFixed(2)}
                        </div>
                        <div className="text-white/40 text-xs">km</div>
                    </AnimatedCard>

                    {/* Pace */}
                    <AnimatedCard variant="glass" className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-white/60 text-xs">Pace</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {metrics.pace}
                        </div>
                        <div className="text-white/40 text-xs">/500m</div>
                    </AnimatedCard>

                    {/* SPM */}
                    <AnimatedCard variant="glass" className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity className="w-4 h-4 text-purple-400" />
                            <span className="text-white/60 text-xs">Remadas</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {metrics.spm || '--'}
                        </div>
                        <div className="text-white/40 text-xs">SPM</div>
                    </AnimatedCard>

                    {/* Calorias */}
                    <AnimatedCard variant="glass" className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-orange-400" />
                            <span className="text-white/60 text-xs">Calorias</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {metrics.calories}
                        </div>
                        <div className="text-white/40 text-xs">kcal</div>
                    </AnimatedCard>
                </div>

                {/* Frequência Cardíaca (se disponível) */}
                {metrics.heartRate > 0 && (
                    <AnimatedCard variant="gradient" className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                >
                                    <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                                </motion.div>
                                <div>
                                    <div className="text-4xl font-bold text-white">{metrics.heartRate}</div>
                                    <div className="text-white/60 text-xs">BPM</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-emerald-400 text-sm font-bold">Zona 3</div>
                                <div className="text-white/40 text-xs">Aeróbico</div>
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {/* GPS Status */}
                <AnimatedCard variant="glass" className="p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${gpsPoints.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'}`} />
                            <span className="text-white/60 text-sm">
                                GPS: {gpsPoints.length > 0 ? `${gpsPoints.length} pontos` : 'Aguardando sinal...'}
                            </span>
                        </div>
                        {workoutType === 'outdoor' && (
                            <Target className="w-4 h-4 text-white/40" />
                        )}
                    </div>
                </AnimatedCard>

                {/* Controles */}
                <div className="flex gap-3 pt-4">
                    <Button
                        onClick={handlePauseResume}
                        variant="outline"
                        className="flex-1 h-16 gap-2 text-lg"
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
                        onClick={() => setShowFinishConfirm(true)}
                        className="flex-1 h-16 gap-2 text-lg bg-club-red hover:bg-club-red/90"
                    >
                        <Square className="w-6 h-6" />
                        Finalizar
                    </Button>
                </div>
            </div>

            {/* Modal de confirmação */}
            <AnimatePresence>
                {showFinishConfirm && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Finalizar Treino?</h3>
                            <p className="text-white/60 mb-6">
                                Você remou por {formatTime(metrics.duration)} e percorreu {(metrics.distance / 1000).toFixed(2)} km.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setShowFinishConfirm(false)}
                                >
                                    Continuar
                                </Button>
                                <Button
                                    className="flex-1 bg-club-red hover:bg-club-red/90"
                                    onClick={handleFinish}
                                >
                                    Finalizar
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function LiveWorkoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-club-black flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        className="w-16 h-16 border-4 border-club-red border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="text-white/60">Preparando treino...</p>
                </div>
            </div>
        }>
            <LiveWorkoutContent />
        </Suspense>
    );
}
