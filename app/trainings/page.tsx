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
    Award,
    ChevronRight,
    Ship,
    History,
    CalendarDays,
    Waves,
    Dumbbell,
    FileText,
    Activity,
    Flame,
    StretchHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// APENAS 5 MODALIDADES: Remo, Musculação, Outras Atividades, Aquecimento, Alongamento
const sports = [
    { id: 'ROWING', title: 'Remo', icon: Waves, color: 'from-blue-600 to-cyan-600' },
    { id: 'GYM', title: 'Musculação', icon: Dumbbell, color: 'from-purple-600 to-pink-600' },
    { id: 'OTHER', title: 'Outras Atividades', icon: Activity, color: 'from-gray-600 to-slate-600' },
    { id: 'WARMUP', title: 'Aquecimento', icon: Flame, color: 'from-orange-600 to-red-600' },
    { id: 'STRETCHING', title: 'Alongamento', icon: StretchHorizontal, color: 'from-green-600 to-emerald-600' }
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
                    sport: 'REMO',
                    distance: 8500,
                    duration: 2400,
                    avgPace: '2:20/500m',
                    completedAt: new Date(Date.now() - 86400000),
                    pointsEarned: 25
                },
                {
                    id: '2',
                    mode: 'INDOOR_TANK',
                    sport: 'REMO',
                    duration: 3600,
                    distance: 6000,
                    avgSPM: 26,
                    completedAt: new Date(Date.now() - 172800000),
                    pointsEarned: 20
                },
                {
                    id: '3',
                    mode: 'OTHER',
                    sport: 'CORRIDA',
                    distance: 5000,
                    duration: 1800,
                    avgPace: '6:00/km',
                    completedAt: new Date(Date.now() - 259200000),
                    pointsEarned: 18
                },
                {
                    id: '4',
                    mode: 'INDOOR_GENERAL',
                    sport: 'MUSCULAÇÃO',
                    duration: 2700,
                    completedAt: new Date(Date.now() - 345600000),
                    pointsEarned: 15
                },
                {
                    id: '5',
                    mode: 'OUTDOOR',
                    sport: 'REMO',
                    distance: 10000,
                    duration: 3000,
                    avgPace: '2:30/500m',
                    completedAt: new Date(Date.now() - 432000000),
                    pointsEarned: 30
                },
                {
                    id: '6',
                    mode: 'OTHER',
                    sport: 'BIKE',
                    distance: 25000,
                    duration: 4200,
                    avgPace: '35 km/h',
                    completedAt: new Date(Date.now() - 518400000),
                    pointsEarned: 22
                },
                {
                    id: '7',
                    mode: 'INDOOR_TANK',
                    sport: 'REMO',
                    distance: 4000,
                    duration: 1200,
                    avgSPM: 28,
                    completedAt: new Date(Date.now() - 604800000),
                    pointsEarned: 16
                },
                {
                    id: '8',
                    mode: 'OTHER',
                    sport: 'CORRIDA',
                    distance: 10000,
                    duration: 3300,
                    avgPace: '5:30/km',
                    completedAt: new Date(Date.now() - 691200000),
                    pointsEarned: 28
                },
                {
                    id: '9',
                    mode: 'OUTDOOR',
                    sport: 'REMO',
                    distance: 7500,
                    duration: 2100,
                    avgPace: '2:18/500m',
                    completedAt: new Date(Date.now() - 777600000),
                    pointsEarned: 24
                },
                {
                    id: '10',
                    mode: 'INDOOR_GENERAL',
                    sport: 'MUSCULAÇÃO',
                    duration: 3000,
                    completedAt: new Date(Date.now() - 864000000),
                    pointsEarned: 17
                }
            ]);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleSportSelect = (sportId: string) => {
        if (sportId === 'WARMUP') {
            router.push('/training/warmup');
        } else if (sportId === 'STRETCHING') {
            router.push('/training/stretching');
        } else if (sportId === 'OTHER') {
            router.push('/training/other-activities');
        } else {
            router.push(`/training/start?sport=${sportId}`);
        }
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

                {/* Seleção de Modalidade - 5 Cards */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Play className="w-5 h-5 text-club-red" />
                        Iniciar Treino
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                        {sports.slice(0, 3).map((sport, index) => {
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
                                    <div className={`bg-gradient-to-br ${sport.color} rounded-xl p-3 text-center hover:scale-105 transition-transform flex flex-col items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white mb-1" />
                                        <span className="text-[10px] font-bold text-white">{sport.title}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        {sports.slice(3).map((sport, index) => {
                            const Icon = sport.icon;
                            return (
                                <motion.button
                                    key={sport.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (index + 3) * 0.05 }}
                                    onClick={() => handleSportSelect(sport.id)}
                                    className="w-full"
                                >
                                    <div className={`bg-gradient-to-br ${sport.color} rounded-xl p-3 text-center hover:scale-105 transition-transform flex flex-col items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white mb-1" />
                                        <span className="text-[10px] font-bold text-white">{sport.title}</span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Atalhos Rápidos - MEU TREINO */}
                <div>
                    <h2 className="text-sm font-bold text-white/60 mb-3 uppercase tracking-wider">Meu Treino</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/training/my-program">
                            <AnimatedCard variant="glass" className="p-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <CalendarDays className="w-6 h-6 text-purple-400" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Programa</p>
                                        <p className="text-[10px] text-white/40">Meu plano</p>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </Link>
                        <Link href="/profile/anamnese">
                            <AnimatedCard variant="glass" className="p-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-emerald-400" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Anamnese</p>
                                        <p className="text-[10px] text-white/40">Saúde</p>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </Link>
                        <Link href="/boats">
                            <AnimatedCard variant="glass" className="p-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Ship className="w-6 h-6 text-club-red" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Barcos</p>
                                        <p className="text-[10px] text-white/40">Garagem</p>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </Link>
                        <Link href="/training/history">
                            <AnimatedCard variant="glass" className="p-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <History className="w-6 h-6 text-blue-400" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Histórico</p>
                                        <p className="text-[10px] text-white/40">Treinos</p>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </Link>
                        <Link href="/training/analytics" className="col-span-2">
                            <AnimatedCard variant="glass" className="p-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-6 h-6 text-club-gold" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Analytics</p>
                                        <p className="text-[10px] text-white/40">Estatísticas e performance</p>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </Link>
                    </div>
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
                        {recentWorkouts.slice(0, 5).map((workout, i) => (
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
                                                    {workout.sport}
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
