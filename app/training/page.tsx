'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StreakDisplay } from '@/components/gamification';
import {
    Play,
    TrendingUp,
    Clock,
    MapPin,
    Award,
    ChevronRight,
    Ship,
    History,
    CalendarDays,
    Waves,
    Dumbbell,
    Bike,
    PersonStanding
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Modalidades de treino
const sports = [
    { id: 'ROWING', title: 'Remo', icon: Waves, color: 'from-blue-600 to-cyan-600' },
    { id: 'RUNNING', title: 'Corrida', icon: PersonStanding, color: 'from-green-600 to-emerald-600' },
    { id: 'CYCLING', title: 'Bike', icon: Bike, color: 'from-orange-600 to-amber-600' },
    { id: 'GYM', title: 'Musculação', icon: Dumbbell, color: 'from-purple-600 to-pink-600' }
];

export default function TrainingDashboard() {
    const router = useRouter();
    const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
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

    const handleSportSelect = (sportId: string) => {
        router.push(`/training/start?sport=${sportId}`);
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Treinos"
                subtitle="Sport Club de Natal"
                description="Escolha uma modalidade e comece a treinar"
                compact
            />

            <div className="container mx-auto px-4 py-6 space-y-6">

                {/* Streak Display */}
                <StreakDisplay variant="compact" />

                {/* Seleção de Modalidade - Cards Compactos */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Play className="w-5 h-5 text-club-red" />
                        Iniciar Treino
                    </h2>
                    <div className="grid grid-cols-4 gap-2">
                        {sports.map((sport, index) => {
                            const Icon = sport.icon;
                            return (
                                <motion.button
                                    key={sport.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleSportSelect(sport.id)}
                                    className="w-full"
                                >
                                    <div className={`bg-gradient-to-br ${sport.color} rounded-xl p-3 text-center hover:scale-105 transition-transform aspect-square flex flex-col items-center justify-center`}>
                                        <Icon className="w-8 h-8 text-white mb-1" />
                                        <span className="text-xs font-bold text-white">{sport.title}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Atalhos Rápidos */}
                <div className="grid grid-cols-4 gap-2">
                    <Link href="/training/my-program">
                        <AnimatedCard variant="glass" className="p-3 text-center hover:bg-white/10 transition-colors">
                            <CalendarDays className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                            <p className="text-[10px] font-bold text-white">Programa</p>
                        </AnimatedCard>
                    </Link>
                    <Link href="/boats">
                        <AnimatedCard variant="glass" className="p-3 text-center hover:bg-white/10 transition-colors">
                            <Ship className="w-6 h-6 text-club-red mx-auto mb-1" />
                            <p className="text-[10px] font-bold text-white">Barcos</p>
                        </AnimatedCard>
                    </Link>
                    <Link href="/training/history">
                        <AnimatedCard variant="glass" className="p-3 text-center hover:bg-white/10 transition-colors">
                            <History className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                            <p className="text-[10px] font-bold text-white">Histórico</p>
                        </AnimatedCard>
                    </Link>
                    <Link href="/training/analytics">
                        <AnimatedCard variant="glass" className="p-3 text-center hover:bg-white/10 transition-colors">
                            <TrendingUp className="w-6 h-6 text-club-gold mx-auto mb-1" />
                            <p className="text-[10px] font-bold text-white">Analytics</p>
                        </AnimatedCard>
                    </Link>
                </div>

                {/* Treinos Recentes */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
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

                    <div className="space-y-2">
                        {recentWorkouts.map((workout, i) => (
                            <motion.div
                                key={workout.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" className="p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className="text-[10px] font-black uppercase">
                                                    {workout.mode}
                                                </Badge>
                                                <span className="text-xs text-white/40">
                                                    {new Date(workout.completedAt).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
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
                                            <ChevronRight className="w-4 h-4 text-white/30" />
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
