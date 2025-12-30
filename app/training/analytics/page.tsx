'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    TrendingUp, Clock, MapPin, Activity, Award, Calendar, Flame, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Analytics {
    totalWorkouts: number;
    totalDistance: number;
    totalDuration: number;
    avgPace: string | null;
    workoutsByType: Record<string, number>;
    weeklyVolume: { week: string; km: number }[];
    paceProgression: { date: string; pace: string }[];
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    async function loadAnalytics() {
        try {
            const response = await fetch('/api/workouts/analytics');
            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    }

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${mins}min`;
        }
        return `${mins}min`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-club-black pb-24">
                <HeroSection
                    title="Analytics"
                    subtitle="Suas Estatísticas"
                    description="Carregando..."
                    compact
                />
                <div className="flex items-center justify-center py-20">
                    <motion.div
                        className="w-12 h-12 border-4 border-club-red border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-club-black pb-24">
                <HeroSection
                    title="Analytics"
                    subtitle="Suas Estatísticas"
                    description="Acompanhe sua evolução"
                    compact
                />
                <div className="container mx-auto px-4 py-8">
                    <AnimatedCard variant="glass" className="p-8 text-center">
                        <Activity className="w-12 h-12 text-white/30 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">
                            Sem dados disponíveis
                        </h3>
                        <p className="text-white/60">
                            Complete treinos para ver suas estatísticas
                        </p>
                    </AnimatedCard>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Analytics"
                subtitle="Suas Estatísticas"
                description="Acompanhe sua evolução no remo"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Cards de estatísticas principais */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AnimatedCard variant="gradient" className="p-4 text-center">
                            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                            <div className="text-3xl font-black text-white">
                                {analytics.totalWorkouts}
                            </div>
                            <div className="text-xs text-white/60">Treinos</div>
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AnimatedCard variant="gradient" className="p-4 text-center">
                            <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                            <div className="text-3xl font-black text-white">
                                {(analytics.totalDistance / 1000).toFixed(1)}
                            </div>
                            <div className="text-xs text-white/60">km Total</div>
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <AnimatedCard variant="glass" className="p-4 text-center">
                            <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">
                                {formatDuration(analytics.totalDuration)}
                            </div>
                            <div className="text-xs text-white/60">Tempo Total</div>
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <AnimatedCard variant="glass" className="p-4 text-center">
                            <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">
                                {analytics.avgPace || '--:--'}
                            </div>
                            <div className="text-xs text-white/60">Pace Médio /500m</div>
                        </AnimatedCard>
                    </motion.div>
                </div>

                {/* Distribuição por tipo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <AnimatedCard variant="glass" className="p-5">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-club-red" />
                            Treinos por Tipo
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(analytics.workoutsByType).map(([type, count]) => {
                                const total = analytics.totalWorkouts;
                                const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
                                return (
                                    <div key={type}>
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge className="text-xs">{type}</Badge>
                                            <span className="text-white/60 text-sm">{count} ({percentage}%)</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-club-red"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.5, delay: 0.6 }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            {Object.keys(analytics.workoutsByType).length === 0 && (
                                <p className="text-white/40 text-sm text-center py-4">
                                    Nenhum treino registrado ainda
                                </p>
                            )}
                        </div>
                    </AnimatedCard>
                </motion.div>

                {/* Volume Semanal */}
                {analytics.weeklyVolume.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <AnimatedCard variant="glass" className="p-5">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-club-gold" />
                                Volume Semanal
                            </h3>
                            <div className="flex items-end gap-1 h-32">
                                {analytics.weeklyVolume.slice(-8).map((week, i) => {
                                    const maxKm = Math.max(...analytics.weeklyVolume.map(w => w.km));
                                    const height = maxKm > 0 ? (week.km / maxKm) * 100 : 0;
                                    return (
                                        <div
                                            key={week.week}
                                            className="flex-1 flex flex-col items-center gap-1"
                                        >
                                            <motion.div
                                                className="w-full bg-gradient-to-t from-club-red to-orange-500 rounded-t"
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(4, height)}%` }}
                                                transition={{ duration: 0.5, delay: 0.7 + i * 0.05 }}
                                            />
                                            <span className="text-[9px] text-white/40">
                                                {week.week.slice(5, 10)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-xs text-white/40">km por semana</span>
                            </div>
                        </AnimatedCard>
                    </motion.div>
                )}

                {/* Progressão de Pace */}
                {analytics.paceProgression.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <AnimatedCard variant="glass" className="p-5">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                Evolução do Pace
                            </h3>
                            <div className="space-y-2">
                                {analytics.paceProgression.slice(-5).map((entry, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                                    >
                                        <span className="text-white/60 text-sm">{entry.date}</span>
                                        <span className="text-white font-bold">{entry.pace}</span>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>
                    </motion.div>
                )}

                {/* Conquistas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <AnimatedCard variant="gradient" className="p-5">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-400" />
                            Marcos Alcançados
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {analytics.totalWorkouts >= 1 && (
                                <div className="p-3 bg-white/10 rounded-lg text-center">
                                    <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                                    <div className="text-xs text-white/60">Primeiro Treino</div>
                                </div>
                            )}
                            {analytics.totalWorkouts >= 10 && (
                                <div className="p-3 bg-white/10 rounded-lg text-center">
                                    <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                                    <div className="text-xs text-white/60">10 Treinos</div>
                                </div>
                            )}
                            {analytics.totalDistance >= 10000 && (
                                <div className="p-3 bg-white/10 rounded-lg text-center">
                                    <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                                    <div className="text-xs text-white/60">10km Remados</div>
                                </div>
                            )}
                            {analytics.totalDistance >= 100000 && (
                                <div className="p-3 bg-white/10 rounded-lg text-center">
                                    <Award className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                                    <div className="text-xs text-white/60">100km Remados</div>
                                </div>
                            )}
                            {analytics.totalWorkouts < 1 && (
                                <div className="col-span-2 p-3 bg-white/5 rounded-lg text-center">
                                    <p className="text-white/40 text-sm">
                                        Complete treinos para desbloquear marcos!
                                    </p>
                                </div>
                            )}
                        </div>
                    </AnimatedCard>
                </motion.div>
            </div>
        </div>
    );
}
