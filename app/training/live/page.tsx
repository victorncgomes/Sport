'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, MapPin, Heart, Timer, TrendingUp } from 'lucide-react';

export default function LiveWorkoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');

    const [isRunning, setIsRunning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [distance, setDistance] = useState(0);
    const [pace, setPace] = useState('--:--');
    const [heartRate, setHeartRate] = useState(0);
    const [gpsPoints, setGpsPoints] = useState<any[]>([]);

    // Timer
    useEffect(() => {
        if (!isRunning || isPaused) return;

        const interval = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, isPaused]);

    // GPS Tracking
    useEffect(() => {
        if (!isRunning || isPaused) return;

        const watchId = navigator.geolocation?.watchPosition(
            (position) => {
                const point = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: Date.now(),
                    accuracy: position.coords.accuracy
                };

                setGpsPoints(prev => [...prev, point]);

                // Calcular distância e pace
                if (gpsPoints.length > 0) {
                    const lastPoint = gpsPoints[gpsPoints.length - 1];
                    const dist = calculateDistance(lastPoint.lat, lastPoint.lng, point.lat, point.lng);
                    setDistance(prev => prev + dist);
                }
            },
            (error) => console.error('GPS Error:', error),
            { enableHighAccuracy: true, maximumAge: 0 }
        );

        return () => {
            if (watchId) navigator.geolocation?.clearWatch(watchId);
        };
    }, [isRunning, isPaused, gpsPoints]);

    // Calcular pace
    useEffect(() => {
        if (distance > 0 && duration > 0) {
            const paceSeconds = (duration / (distance / 500)); // pace por 500m
            const minutes = Math.floor(paceSeconds / 60);
            const seconds = Math.floor(paceSeconds % 60);
            setPace(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
    }, [distance, duration]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371000; // metros
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
        try {
            // Salvar pontos GPS
            if (gpsPoints.length > 0) {
                await fetch(`/api/workouts/${sessionId}/gps-points`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ points: gpsPoints })
                });
            }

            // Finalizar treino
            await fetch(`/api/workouts/${sessionId}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    duration,
                    distance,
                    avgPace: pace
                })
            });

            router.push(`/training/cooldown?sessionId=${sessionId}`);
        } catch (error) {
            console.error('Error finishing workout:', error);
        }
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Treino em Andamento"
                subtitle={isPaused ? 'Pausado' : 'Ativo'}
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Timer Principal */}
                <AnimatedCard variant="gradient" className="p-8 text-center">
                    <div className="text-6xl font-bold text-white mb-2">
                        {formatTime(duration)}
                    </div>
                    <div className="text-white/60">Tempo Decorrido</div>
                </AnimatedCard>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4">
                    <AnimatedCard variant="glass" className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-club-red" />
                            <span className="text-white/60 text-sm">Distância</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {(distance / 1000).toFixed(2)}
                        </div>
                        <div className="text-white/40 text-xs">km</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-club-red" />
                            <span className="text-white/60 text-sm">Pace</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {pace}
                        </div>
                        <div className="text-white/40 text-xs">/500m</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Heart className="w-5 h-5 text-club-red" />
                            <span className="text-white/60 text-sm">Frequência</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {heartRate || '--'}
                        </div>
                        <div className="text-white/40 text-xs">bpm</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Timer className="w-5 h-5 text-club-red" />
                            <span className="text-white/60 text-sm">GPS</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {gpsPoints.length}
                        </div>
                        <div className="text-white/40 text-xs">pontos</div>
                    </AnimatedCard>
                </div>

                {/* Controles */}
                <div className="flex gap-4">
                    <Button
                        onClick={handlePauseResume}
                        variant="outline"
                        className="flex-1 h-14 gap-2"
                    >
                        {isPaused ? (
                            <>
                                <Play className="w-5 h-5" />
                                Retomar
                            </>
                        ) : (
                            <>
                                <Pause className="w-5 h-5" />
                                Pausar
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleFinish}
                        className="flex-1 h-14 gap-2 bg-club-red hover:bg-club-red/90"
                    >
                        <Square className="w-5 h-5" />
                        Finalizar
                    </Button>
                </div>

                {/* Info */}
                <AnimatedCard variant="glass" className="p-4">
                    <p className="text-white/60 text-sm text-center">
                        {isPaused ? '⏸️ Treino pausado' : '🏃 Treino em andamento'}
                    </p>
                    <p className="text-white/40 text-xs text-center mt-1">
                        GPS: {gpsPoints.length > 0 ? '✅ Ativo' : '⏳ Aguardando sinal'}
                    </p>
                </AnimatedCard>
            </div>
        </div>
    );
}
