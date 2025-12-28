'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Play,
    Calendar,
    TrendingUp,
    Clock,
    MapPin,
    Award,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TrainingDashboard() {
    const [todayWorkout, setTodayWorkout] = useState<any>(null);
    const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            // TODO: Buscar da API
            // const response = await fetch('/api/workouts/dashboard');
            // const data = await response.json();

            // Mock data por enquanto
            setTodayWorkout({
                id: '1',
                title: 'Treino de Base - 10km',
                type: 'BASE',
                duration: 60,
                distance: 10000
            });

            setRecentWorkouts([
                {
                    id: '1',
                    mode: 'OUTDOOR',
                    distance: 8500,
                    duration: 2400,
                    avgPace: '2:20/500m',
                    completedAt: new Date(Date.now() - 86400000),
                    pointsEarned: 25
                },
                {
                    id: '2',
                    mode: 'INDOOR_TANK',
                    duration: 3600,
                    avgSPM: 26,
                    completedAt: new Date(Date.now() - 172800000),
                    pointsEarned: 20
                }
            ]);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Treinos"
                subtitle="Sport Club de Natal"
                description="Acompanhe seu progresso e melhore sua performance"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-8">

                {/* Treino de Hoje */}
                {todayWorkout && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-club-red" />
                            Meu Treino Hoje
                        </h2>
                        <AnimatedCard variant="gradient" className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {todayWorkout.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-white/60">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {todayWorkout.duration} min
                                        </span>
                                        {todayWorkout.distance && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {(todayWorkout.distance / 1000).toFixed(1)} km
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Badge className="bg-club-red/20 text-club-red border-club-red/30">
                                    {todayWorkout.type}
                                </Badge>
                            </div>
                            <Link href="/training/start">
                                <Button className="w-full bg-club-red hover:bg-club-red/90 gap-2 h-12">
                                    <Play className="w-5 h-5 fill-white" />
                                    Iniciar Treino
                                </Button>
                            </Link>
                        </AnimatedCard>
                    </motion.div>
                )}

                {/* CTA se não tem treino hoje */}
                {!todayWorkout && !loading && (
                    <AnimatedCard variant="glass" className="p-8 text-center">
                        <Play className="w-12 h-12 text-white/30 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">
                            Nenhum treino programado para hoje
                        </h3>
                        <p className="text-white/60 mb-6">
                            Comece um treino livre ou veja as planilhas disponíveis
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link href="/training/start">
                                <Button className="bg-club-red hover:bg-club-red/90">
                                    Treino Livre
                                </Button>
                            </Link>
                            <Link href="/training/plans">
                                <Button variant="outline">
                                    Ver Planilhas
                                </Button>
                            </Link>
                        </div>
                    </AnimatedCard>
                )}

                {/* Treinos Recentes */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-club-gold" />
                            Últimos Treinos
                        </h2>
                        <Link href="/training/history">
                            <Button variant="ghost" className="text-white/60 hover:text-white text-sm gap-1">
                                Ver Todos
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentWorkouts.map((workout, i) => (
                            <motion.div
                                key={workout.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className="text-[10px] font-black uppercase">
                                                    {workout.mode}
                                                </Badge>
                                                <span className="text-xs text-white/40">
                                                    {new Date(workout.completedAt).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                {workout.distance && (
                                                    <span className="text-white">
                                                        <strong>{(workout.distance / 1000).toFixed(1)}</strong> km
                                                    </span>
                                                )}
                                                <span className="text-white/60">
                                                    {Math.floor(workout.duration / 60)} min
                                                </span>
                                                {workout.avgPace && (
                                                    <span className="text-white/60">
                                                        {workout.avgPace}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                                                <Award className="w-4 h-4" />
                                                +{workout.pointsEarned}
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-white/30" />
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Atalhos */}
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/training/plans">
                        <AnimatedCard variant="glass" className="p-4 text-center hover:bg-white/10 transition-colors">
                            <Calendar className="w-8 h-8 text-club-red mx-auto mb-2" />
                            <p className="text-sm font-bold text-white">Planilhas</p>
                        </AnimatedCard>
                    </Link>
                    <Link href="/training/analytics">
                        <AnimatedCard variant="glass" className="p-4 text-center hover:bg-white/10 transition-colors">
                            <TrendingUp className="w-8 h-8 text-club-gold mx-auto mb-2" />
                            <p className="text-sm font-bold text-white">Analytics</p>
                        </AnimatedCard>
                    </Link>
                </div>
            </div>
        </div>
    );
}
