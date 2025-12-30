'use client';

import React from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Activity, Clock, TrendingUp, Zap, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateMockWorkoutSessions, calculateWorkoutStats } from '@/lib/data/mock-workout-sessions';

interface AnalyticsSummary {
    totalWorkouts7Days: number;
    totalWorkouts30Days: number;
    totalDistance: number;
    totalTime: number;
    avgPace: string;
    weeklyTrend: { day: string; workouts: number }[];
}

interface WorkoutAnalyticsDashboardProps {
    data?: AnalyticsSummary;
}

// Gera dados reais das 10 sessões simuladas
const mockSessions = generateMockWorkoutSessions();
const realData = calculateWorkoutStats(mockSessions);

export function WorkoutAnalyticsDashboard({ data = realData }: WorkoutAnalyticsDashboardProps) {
    const formatDistance = (meters: number) => {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(1)} km`;
        }
        return `${meters} m`;
    };

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}min`;
        }
        return `${mins}min`;
    };

    return (
        <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-club-red" />
                    Resumo de Atividades
                </h2>
                <span className="text-xs text-white/40">Últimos 30 dias</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatedCard variant="glass" className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-club-red/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-club-red" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50">Treinos (7d)</p>
                            <p className="text-2xl font-bold text-white">{data.totalWorkouts7Days}</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard variant="glass" className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50">Distância Total</p>
                            <p className="text-2xl font-bold text-white">{formatDistance(data.totalDistance)}</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard variant="glass" className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50">Tempo Total</p>
                            <p className="text-2xl font-bold text-white">{formatTime(data.totalTime)}</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard variant="glass" className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50">Pace Médio</p>
                            <p className="text-2xl font-bold text-white">{data.avgPace}/500m</p>
                        </div>
                    </div>
                </AnimatedCard>
            </div>

            {/* Weekly Trend Chart */}
            <AnimatedCard variant="carbon" className="p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase mb-4">Frequência Semanal</h3>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={data.weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="day" stroke="#ffffff40" fontSize={12} />
                        <YAxis stroke="#ffffff40" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', color: '#fff' }}
                            itemStyle={{ color: '#DC2626' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="workouts"
                            stroke="#DC2626"
                            strokeWidth={2}
                            dot={{ fill: '#DC2626', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </AnimatedCard>
        </div>
    );
}
