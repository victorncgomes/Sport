'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WorkoutHistoryPage() {
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        loadHistory();
    }, [filter]);

    async function loadHistory() {
        try {
            const params = new URLSearchParams();
            if (filter !== 'ALL') {
                params.append('mode', filter);
            }

            const response = await fetch(`/api/workouts/history?${params}`);
            const data = await response.json();
            setWorkouts(data.workouts || []);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setLoading(false);
        }
    }

    const modes = [
        { value: 'ALL', label: 'Todos' },
        { value: 'OUTDOOR', label: 'Outdoor' },
        { value: 'INDOOR_TANK', label: 'Tanque' },
        { value: 'INDOOR_GENERAL', label: 'Indoor' }
    ];

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Histórico de Treinos"
                subtitle="Seus treinos anteriores"
                description="Acompanhe sua evolução"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Filtros */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {modes.map((mode) => (
                        <button
                            key={mode.value}
                            onClick={() => setFilter(mode.value)}
                            className="flex-shrink-0"
                        >
                            <Badge
                                className={`cursor-pointer transition-all ${filter === mode.value
                                        ? 'bg-club-red text-white border-club-red'
                                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {mode.label}
                            </Badge>
                        </button>
                    ))}
                </div>

                {/* Lista de Treinos */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center text-white/60 py-12">
                            Carregando histórico...
                        </div>
                    ) : workouts.length === 0 ? (
                        <AnimatedCard variant="glass" className="p-8 text-center">
                            <p className="text-white/60">
                                Nenhum treino encontrado
                            </p>
                        </AnimatedCard>
                    ) : (
                        workouts.map((workout, i) => (
                            <motion.div
                                key={workout.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className="text-[10px] font-black uppercase">
                                                    {workout.mode}
                                                </Badge>
                                                <span className="text-xs text-white/40 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(workout.completedAt || workout.startedAt).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                {workout.distance && (
                                                    <span className="text-white">
                                                        <strong>{(workout.distance / 1000).toFixed(1)}</strong> km
                                                    </span>
                                                )}
                                                <span className="text-white/60 flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {Math.floor((workout.duration || 0) / 60)} min
                                                </span>
                                                {workout.avgPace && (
                                                    <span className="text-white/60">
                                                        {workout.avgPace}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {workout.pointsEarned > 0 && (
                                            <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                                                <Award className="w-4 h-4" />
                                                +{workout.pointsEarned}
                                            </div>
                                        )}
                                    </div>

                                    {/* Checklist (se outdoor) */}
                                    {workout.mode === 'OUTDOOR' && (
                                        <div className="flex gap-2 text-xs">
                                            {workout.boatStored && (
                                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                                    ✓ Guardado
                                                </Badge>
                                            )}
                                            {workout.boatWashed && (
                                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                                    ✓ Lavado
                                                </Badge>
                                            )}
                                            {workout.damageReported && (
                                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                                    ! Avaria Reportada
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </AnimatedCard>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
