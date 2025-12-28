'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, MapPin, Clock, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { getGPSTracker, destroyGPSTracker } from '@/lib/gps/tracker';
import { formatDuration, formatDistance, calculatePace } from '@/lib/utils/workout-calculations';

export default function LiveWorkoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('sessionId');

    const [isTracking, setIsTracking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [distance, setDistance] = useState(0);
    const [currentPace, setCurrentPace] = useState<string>('--:--');
    const [calories, setCalories] = useState(0);
    const [gpsPoints, setGpsPoints] = useState<any[]>([]);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const trackerRef = useRef<any>(null);

    useEffect(() => {
        if (!sessionId) {
            router.push('/training/start');
            return;
        }

        // Iniciar tracking automaticamente
        handleStart();

        return () => {
            if (trackerRef.current) {
                trackerRef.current.stopTracking();
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            destroyGPSTracker();
        };
    }, [sessionId]);

    const handleStart = async () => {
        if (!sessionId) return;

        try {
            // Iniciar GPS tracker
            trackerRef.current = getGPSTracker(sessionId);
            await trackerRef.current.startTracking();

            setIsTracking(true);
            setIsPaused(false);

            // Timer
            intervalRef.current = setInterval(() => {
                if (!isPaused) {
                    setDuration(prev => prev + 1);

                    // Atualizar métricas do GPS
                    if (trackerRef.current) {
                        const dist = trackerRef.current.getTotalDistance();
                        setDistance(dist);

                        const pace = trackerRef.current.calculateCurrentPace();
                        if (pace) setCurrentPace(pace);

                        const points = trackerRef.current.getTrack();
                        setGpsPoints(points);

                        // Estimar calorias (aproximação)
                        const cal = Math.floor((dist / 1000) * 8 * 70); // ~8 cal/kg/km
                        setCalories(cal);
                    }
                }
            }, 1000);

        } catch (error) {
            console.error('Error starting workout:', error);
            alert('Erro ao iniciar GPS. Verifique as permissões.');
        }
    };

    const handlePause = () => {
        setIsPaused(true);
        if (trackerRef.current) {
            trackerRef.current.pause();
        }
    };

    const handleResume = () => {
        setIsPaused(false);
        if (trackerRef.current) {
            trackerRef.current.resume();
        }
    };

    const handleFinish = async () => {
        if (!sessionId) return;

        const confirmed = confirm('Deseja finalizar o treino?');
        if (!confirmed) return;

        try {
            // Parar tracking
            if (trackerRef.current) {
                trackerRef.current.stopTracking();
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            // Salvar pontos GPS finais
            if (gpsPoints.length > 0) {
                await fetch(`/api/workouts/${sessionId}/gps-points`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ points: gpsPoints })
                });
            }

            // Redirecionar para checklist/summary
            router.push(`/training/summary?sessionId=${sessionId}&duration=${duration}&distance=${distance}`);

        } catch (error) {
            console.error('Error finishing workout:', error);
            alert('Erro ao finalizar treino');
        }
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Treino ao Vivo"
                subtitle={isPaused ? 'Pausado' : 'Em Progresso'}
                description="Acompanhe suas métricas em tempo real"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">

                {/* Cronômetro Principal */}
                <AnimatedCard variant="gradient" className="p-8 text-center">
                    <div className="text-7xl font-bold text-white mb-4">
                        {formatDuration(duration)}
                    </div>
                    {isPaused && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            PAUSADO
                        </Badge>
                    )}
                </AnimatedCard>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4">
                    <AnimatedCard variant="glass" className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-club-red" />
                            <span className="text-white/60 text-sm">Distância</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {formatDistance(distance)}
                        </div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-club-gold" />
                            <span className="text-white/60 text-sm">Pace</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {currentPace}/500m
                        </div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            <span className="text-white/60 text-sm">Calorias</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {calories} kcal
                        </div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <span className="text-white/60 text-sm">Pontos GPS</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {gpsPoints.length}
                        </div>
                    </AnimatedCard>
                </div>

                {/* Mapa Placeholder (será implementado com Leaflet depois) */}
                <AnimatedCard variant="glass" className="p-6">
                    <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white/40">
                            <MapPin className="w-12 h-12 mx-auto mb-2" />
                            <p>Mapa GPS</p>
                            <p className="text-sm">{gpsPoints.length} pontos coletados</p>
                        </div>
                    </div>
                </AnimatedCard>

                {/* Controles */}
                <div className="space-y-3">
                    {!isPaused ? (
                        <Button
                            onClick={handlePause}
                            className="w-full bg-orange-600 hover:bg-orange-700 h-14 text-lg"
                        >
                            <Pause className="w-6 h-6 mr-2" />
                            Pausar
                        </Button>
                    ) : (
                        <Button
                            onClick={handleResume}
                            className="w-full bg-club-red hover:bg-club-red/90 h-14 text-lg"
                        >
                            <Play className="w-6 h-6 mr-2 fill-white" />
                            Retomar
                        </Button>
                    )}

                    <Button
                        onClick={handleFinish}
                        variant="outline"
                        className="w-full h-14 text-lg border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                        <Square className="w-6 h-6 mr-2" />
                        Finalizar Treino
                    </Button>
                </div>
            </div>
        </div>
    );
}
