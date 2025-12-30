'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Activity,
    User,
    Clock,
    MapPin,
    Heart,
    Zap,
    RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ActiveWorkout {
    id: string;
    userName: string;
    userAvatar: string;
    type: 'outdoor' | 'indoor' | 'gym';
    startTime: Date;
    duration: number;
    distance: number;
    heartRate: number;
    spm: number;
    location?: string;
}

// Dados simulados de treinos ativos
const mockActiveWorkouts: ActiveWorkout[] = [
    {
        id: '1',
        userName: 'João Silva',
        userAvatar: 'JS',
        type: 'outdoor',
        startTime: new Date(Date.now() - 45 * 60 * 1000),
        duration: 2700,
        distance: 6500,
        heartRate: 145,
        spm: 24,
        location: 'Rio Potengi'
    },
    {
        id: '2',
        userName: 'Maria Santos',
        userAvatar: 'MS',
        type: 'outdoor',
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        duration: 1800,
        distance: 4200,
        heartRate: 138,
        spm: 26,
        location: 'Rio Potengi'
    },
    {
        id: '3',
        userName: 'Carlos Melo',
        userAvatar: 'CM',
        type: 'indoor',
        startTime: new Date(Date.now() - 20 * 60 * 1000),
        duration: 1200,
        distance: 3000,
        heartRate: 152,
        spm: 28
    },
    {
        id: '4',
        userName: 'Ana Beatriz',
        userAvatar: 'AB',
        type: 'gym',
        startTime: new Date(Date.now() - 55 * 60 * 1000),
        duration: 3300,
        distance: 0,
        heartRate: 125,
        spm: 0
    }
];

export default function ActiveWorkoutsPage() {
    const [workouts, setWorkouts] = useState<ActiveWorkout[]>(mockActiveWorkouts);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Simular atualização de dados
    useEffect(() => {
        const interval = setInterval(() => {
            setWorkouts(prev => prev.map(w => ({
                ...w,
                duration: w.duration + 5,
                heartRate: w.heartRate + Math.floor(Math.random() * 3) - 1,
                spm: w.spm > 0 ? w.spm + Math.floor(Math.random() * 2) - 1 : 0
            })));
            setLastUpdate(new Date());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'outdoor': return { label: 'Remo Outdoor', color: 'bg-blue-500/20 text-blue-400' };
            case 'indoor': return { label: 'Remo Indoor', color: 'bg-purple-500/20 text-purple-400' };
            case 'gym': return { label: 'Musculação', color: 'bg-orange-500/20 text-orange-400' };
            default: return { label: 'Treino', color: 'bg-white/20 text-white' };
        }
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/coach/painel" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Painel
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Activity className="w-8 h-8 text-club-red animate-pulse" />
                                Treinos Ativos
                            </h1>
                            <p className="text-white/50">Monitoramento em tempo real</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-3xl font-bold text-club-red">{workouts.length}</div>
                        <div className="text-xs text-white/40">Atletas Ativos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-3xl font-bold text-blue-400">
                            {workouts.filter(w => w.type === 'outdoor').length}
                        </div>
                        <div className="text-xs text-white/40">Na Água</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400">
                            {workouts.filter(w => w.type === 'indoor').length}
                        </div>
                        <div className="text-xs text-white/40">Ergômetro</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-3xl font-bold text-orange-400">
                            {workouts.filter(w => w.type === 'gym').length}
                        </div>
                        <div className="text-xs text-white/40">Academia</div>
                    </AnimatedCard>
                </div>

                {/* Lista de Treinos */}
                <div className="space-y-4">
                    {workouts.map((workout, i) => {
                        const typeConfig = getTypeConfig(workout.type);
                        return (
                            <motion.div
                                key={workout.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-club-red/20 flex items-center justify-center text-club-red font-bold">
                                                {workout.userAvatar}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{workout.userName}</h3>
                                                <Badge className={`${typeConfig.color} border-0 mt-1`}>
                                                    {typeConfig.label}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-6 text-center">
                                            <div>
                                                <div className="text-xl font-mono font-bold text-white">
                                                    {formatDuration(workout.duration)}
                                                </div>
                                                <div className="text-[10px] text-white/40 flex items-center justify-center gap-1">
                                                    <Clock className="w-3 h-3" /> Tempo
                                                </div>
                                            </div>
                                            {workout.type !== 'gym' && (
                                                <div>
                                                    <div className="text-xl font-mono font-bold text-blue-400">
                                                        {(workout.distance / 1000).toFixed(1)}km
                                                    </div>
                                                    <div className="text-[10px] text-white/40 flex items-center justify-center gap-1">
                                                        <MapPin className="w-3 h-3" /> Dist.
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-xl font-mono font-bold text-red-400">
                                                    {workout.heartRate}
                                                </div>
                                                <div className="text-[10px] text-white/40 flex items-center justify-center gap-1">
                                                    <Heart className="w-3 h-3" /> BPM
                                                </div>
                                            </div>
                                            {workout.type !== 'gym' && workout.spm > 0 && (
                                                <div>
                                                    <div className="text-xl font-mono font-bold text-purple-400">
                                                        {workout.spm}
                                                    </div>
                                                    <div className="text-[10px] text-white/40 flex items-center justify-center gap-1">
                                                        <Zap className="w-3 h-3" /> SPM
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {workout.location && (
                                        <div className="mt-3 text-xs text-white/30 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {workout.location}
                                        </div>
                                    )}
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>

                {workouts.length === 0 && (
                    <AnimatedCard variant="glass" className="p-12 text-center">
                        <Activity className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h3 className="text-white font-bold mb-2">Nenhum treino ativo no momento</h3>
                        <p className="text-white/40">Os treinos em andamento aparecerão aqui</p>
                    </AnimatedCard>
                )}
            </div>
        </div>
    );
}
