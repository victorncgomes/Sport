'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { XPGain, useXPGain } from '@/components/gamification';
import { useStrokeDetector, useDistancePerStroke } from '@/lib/sensors';
import {
    Play, Pause, Square, MapPin, Heart, Timer, TrendingUp,
    Activity, Waves, Volume2, VolumeX, Target, Zap, Flame, Radio,
    Maximize2, Minimize2
} from 'lucide-react';
import {
    LineChart, Line, ResponsiveContainer, YAxis
} from 'recharts';

interface WorkoutMetrics {
    duration: number;
    distance: number;
    pace: string;
    paceSeconds: number;
    heartRate: number;
    spm: number;
    calories: number;
}

interface IntensityPoint {
    time: number;
    spm: number;
    pace: number;
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
        paceSeconds: 0,
        heartRate: 0,
        spm: 0,
        calories: 0
    });
    const [gpsPoints, setGpsPoints] = useState<any[]>([]);
    const [intensityData, setIntensityData] = useState<IntensityPoint[]>([]);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { showXPGain, XPGainComponent } = useXPGain();
    const watchIdRef = useRef<number | null>(null);
    const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Função para entrar em tela cheia
    const enterFullscreen = useCallback(async () => {
        try {
            if (containerRef.current && document.fullscreenEnabled) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            }
        } catch (error) {
            console.warn('Fullscreen não disponível:', error);
        }
    }, []);

    // Função para sair da tela cheia
    const exitFullscreen = useCallback(async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (error) {
            console.warn('Erro ao sair de fullscreen:', error);
        }
    }, []);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }, [isFullscreen, enterFullscreen, exitFullscreen]);

    // Entrar em tela cheia automaticamente ao iniciar o treino
    useEffect(() => {
        // Delay para garantir que o componente foi montado
        const timer = setTimeout(() => {
            enterFullscreen();
        }, 500);

        // Listener para detectar mudanças de fullscreen
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            // Sair da tela cheia ao desmontar
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
        };
    }, [enterFullscreen]);

    // Marcador de Voga via Acelômetro
    const strokeDetector = useStrokeDetector({
        autoStart: false,
        useSimulated: typeof window === 'undefined', // Simula no SSR
        onStroke: (event) => {
            // Atualiza SPM quando stroke é detectado
            setMetrics(prev => ({ ...prev, spm: event.spm }));

            // Adiciona ao gráfico
            setIntensityData(prev => {
                const newPoint = {
                    time: metrics.duration,
                    spm: event.spm,
                    pace: metrics.paceSeconds || 120
                };
                return [...prev, newPoint].slice(-60);
            });
        }
    });

    // Distância por Stroke (DPS)
    const distancePerStroke = useDistancePerStroke(metrics.distance, strokeDetector.totalStrokes);

    // Timer
    useEffect(() => {
        if (!isRunning || isPaused) return;

        const interval = setInterval(() => {
            setMetrics(prev => {
                const newDuration = prev.duration + 1;
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

                    if (lastPositionRef.current) {
                        const dist = calculateDistance(
                            lastPositionRef.current.lat,
                            lastPositionRef.current.lng,
                            latitude,
                            longitude
                        );

                        if (dist > 1) {
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
                pace: `${minutes}:${seconds.toString().padStart(2, '0')}`,
                paceSeconds
            }));
        }
    }, [metrics.distance, metrics.duration]);

    // Iniciar/Parar detector de strokes junto com o treino
    useEffect(() => {
        if (isRunning && !isPaused) {
            strokeDetector.start();
        } else {
            strokeDetector.stop();
        }
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
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePauseResume = () => {
        setIsPaused(!isPaused);
    };

    // Verifica se o treino é curto (menos de 3 minutos = 180 segundos)
    const isShortWorkout = metrics.duration < 180;

    const handleFinish = async () => {
        setShowFinishConfirm(false);
        setIsRunning(false);

        try {
            if (gpsPoints.length > 0 && sessionId) {
                await fetch(`/api/workouts/${sessionId}/gps-points`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ points: gpsPoints })
                });
            }

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

            showXPGain(isShortWorkout ? 5 : 25);

            setTimeout(() => {
                if (sessionId) {
                    router.push(`/training/cooldown?sessionId=${sessionId}`);
                } else {
                    router.push('/training/cooldown');
                }
            }, 2000);

        } catch (error) {
            console.error('Error finishing workout:', error);
            router.push('/training');
        }
    };

    const handleDiscard = async () => {
        setShowFinishConfirm(false);
        setIsRunning(false);

        // Excluir sessão do banco se existir
        if (sessionId) {
            try {
                await fetch(`/api/workouts/${sessionId}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Error discarding workout:', error);
            }
        }

        // Sair da tela cheia e voltar
        if (document.fullscreenElement) {
            await document.exitFullscreen().catch(() => { });
        }

        router.push('/training');
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black flex flex-col">
            <XPGainComponent />

            {/* Header Minimalista */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isRunning && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
                    <span className="text-white/60 text-sm font-medium">
                        {workoutType === 'outdoor' ? 'OUTDOOR' : 'INDOOR'}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {/* GPS Status */}
                    {workoutType === 'outdoor' && (
                        <div className="flex items-center gap-1 text-xs text-white/40">
                            <Target className="w-3 h-3" />
                            {gpsPoints.length}
                        </div>
                    )}
                    {/* Fullscreen Toggle */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                        title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-5 h-5" />
                        ) : (
                            <Maximize2 className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className="p-2"
                    >
                        {audioEnabled ? (
                            <Volume2 className="w-5 h-5 text-white/60" />
                        ) : (
                            <VolumeX className="w-5 h-5 text-white/30" />
                        )}
                    </button>
                </div>
            </div>

            {/* Conteúdo Principal - Layout Vertical Centralizado */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 space-y-6">

                {/* TIMER - O maior elemento */}
                <motion.div
                    className="text-center"
                    animate={isPaused ? { opacity: 0.5 } : { opacity: 1 }}
                >
                    <motion.div
                        className="text-[72px] md:text-[96px] font-mono font-bold text-white tracking-tight leading-none"
                        key={metrics.duration}
                        initial={{ scale: 1.02 }}
                        animate={{ scale: 1 }}
                    >
                        {formatTime(metrics.duration)}
                    </motion.div>
                    <div className="text-white/40 text-sm mt-1">
                        {isPaused ? '⏸ PAUSADO' : '● GRAVANDO'}
                    </div>
                </motion.div>

                {/* PACE e SPM - Métricas Principais lado a lado */}
                <div className="flex items-center justify-center gap-8 w-full max-w-md">
                    {/* Pace */}
                    <div className="text-center flex-1">
                        <div className="text-[48px] md:text-[56px] font-mono font-bold text-emerald-400 leading-none">
                            {metrics.pace}
                        </div>
                        <div className="text-white/50 text-xs mt-1 uppercase tracking-wider">
                            /500m
                        </div>
                    </div>

                    {/* Divisor */}
                    <div className="w-px h-16 bg-white/10" />

                    {/* SPM */}
                    <div className="text-center flex-1">
                        <div className="text-[48px] md:text-[56px] font-mono font-bold text-purple-400 leading-none">
                            {metrics.spm || '--'}
                        </div>
                        <div className="text-white/50 text-xs mt-1 uppercase tracking-wider">
                            SPM
                        </div>
                    </div>
                </div>

                {/* Gráfico de Intensidade */}
                <div className="w-full max-w-md h-24 bg-white/5 rounded-lg overflow-hidden">
                    {intensityData.length > 1 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={intensityData}>
                                <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                                <Line
                                    type="monotone"
                                    dataKey="spm"
                                    stroke="#a855f7"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-white/20 text-sm">
                            <Activity className="w-5 h-5 mr-2" />
                            Gerando gráfico...
                        </div>
                    )}
                </div>

                {/* Métricas Secundárias - Grid 2x2 + indicadores */}
                <div className="w-full max-w-md space-y-3">
                    {/* Linha 1: Distância e DPS */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Distância */}
                        <div className="text-center bg-white/5 rounded-xl p-4">
                            <div className="text-2xl md:text-3xl font-mono font-bold text-blue-400">
                                {(metrics.distance / 1000).toFixed(2)}
                            </div>
                            <div className="text-white/40 text-xs mt-1 flex items-center justify-center gap-1">
                                <MapPin className="w-3 h-3" />
                                KM
                            </div>
                        </div>

                        {/* DPS - Distance Per Stroke */}
                        <div className="text-center bg-white/5 rounded-xl p-4">
                            <div className="text-2xl md:text-3xl font-mono font-bold text-cyan-400">
                                {distancePerStroke > 0 ? distancePerStroke.toFixed(1) : '--'}
                            </div>
                            <div className="text-white/40 text-xs mt-1 flex items-center justify-center gap-1">
                                <Waves className="w-3 h-3" />
                                M/STROKE
                            </div>
                        </div>
                    </div>

                    {/* Linha 2: Calorias, Strokes, HR */}
                    <div className="grid grid-cols-3 gap-3">
                        {/* Calorias */}
                        <div className="text-center bg-white/5 rounded-xl p-3">
                            <div className="text-xl md:text-2xl font-mono font-bold text-orange-400">
                                {metrics.calories}
                            </div>
                            <div className="text-white/40 text-[10px] mt-1 flex items-center justify-center gap-1">
                                <Flame className="w-3 h-3" />
                                KCAL
                            </div>
                        </div>

                        {/* Total Strokes */}
                        <div className="text-center bg-white/5 rounded-xl p-3">
                            <div className="text-xl md:text-2xl font-mono font-bold text-purple-300">
                                {strokeDetector.totalStrokes || '--'}
                            </div>
                            <div className="text-white/40 text-[10px] mt-1 flex items-center justify-center gap-1">
                                <Activity className="w-3 h-3" />
                                STROKES
                            </div>
                        </div>

                        {/* Frequência Cardíaca */}
                        <div className="text-center bg-white/5 rounded-xl p-3">
                            <div className="text-xl md:text-2xl font-mono font-bold text-red-400">
                                {metrics.heartRate || '--'}
                            </div>
                            <div className="text-white/40 text-[10px] mt-1 flex items-center justify-center gap-1">
                                <Heart className="w-3 h-3" />
                                BPM
                            </div>
                        </div>
                    </div>

                    {/* Indicador de Modo de Detecção */}
                    <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                        <Radio className={`w-3 h-3 ${strokeDetector.isActive ? 'text-emerald-400 animate-pulse' : ''}`} />
                        {strokeDetector.isSimulated ? 'Modo Simulado' : 'Acelerômetro'}
                        {strokeDetector.isActive && <span className="text-emerald-400">● Ativo</span>}
                    </div>
                </div>
            </div>

            {/* Controles Fixos na Base */}
            <div className="px-4 pb-8 pt-4 border-t border-white/10 bg-black">
                <div className="flex gap-4 max-w-md mx-auto">
                    <Button
                        onClick={handlePauseResume}
                        variant="outline"
                        className="flex-1 h-16 gap-3 text-lg border-white/20 hover:bg-white/10"
                    >
                        {isPaused ? (
                            <>
                                <Play className="w-7 h-7 fill-current" />
                                RETOMAR
                            </>
                        ) : (
                            <>
                                <Pause className="w-7 h-7" />
                                PAUSAR
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={() => setShowFinishConfirm(true)}
                        className="flex-1 h-16 gap-3 text-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                        <Square className="w-6 h-6 fill-current" />
                        FINALIZAR
                    </Button>
                </div>
            </div>

            {/* Modal de confirmação */}
            <AnimatePresence>
                {showFinishConfirm && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-2">
                                {isShortWorkout ? 'Treino Muito Curto' : 'Finalizar Treino?'}
                            </h3>

                            {/* Aviso para treino curto */}
                            {isShortWorkout && (
                                <p className="text-amber-400 text-sm mb-4">
                                    ⚠️ Seu treino tem menos de 3 minutos. Deseja armazenar mesmo assim?
                                </p>
                            )}

                            {/* Resumo */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                    <div className={`text-2xl font-mono font-bold ${isShortWorkout ? 'text-amber-400' : 'text-white'}`}>
                                        {formatTime(metrics.duration)}
                                    </div>
                                    <div className="text-white/40 text-xs">Tempo</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-mono font-bold text-blue-400">
                                        {(metrics.distance / 1000).toFixed(2)} km
                                    </div>
                                    <div className="text-white/40 text-xs">Distância</div>
                                </div>
                            </div>

                            {/* Botões condicionais */}
                            {isShortWorkout ? (
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                                        onClick={handleDiscard}
                                    >
                                        Descartar
                                    </Button>
                                    <Button
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                        onClick={handleFinish}
                                    >
                                        Armazenar
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-white/20"
                                        onClick={() => setShowFinishConfirm(false)}
                                    >
                                        Continuar
                                    </Button>
                                    <Button
                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                        onClick={handleFinish}
                                    >
                                        Finalizar
                                    </Button>
                                </div>
                            )}
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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
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
