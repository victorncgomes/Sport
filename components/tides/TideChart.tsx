'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import type { TideDay } from '@/types/tides';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TideChartProps {
    data: TideDay[];
}

export const TideChart: React.FC<TideChartProps> = ({ data }) => {
    // Preparar dados para o gráfico
    // Criar pontos para cada horário de maré + interpolação
    const chartData = data.flatMap(day => {
        return day.tides.map(tide => ({
            date: format(day.date, 'dd/MM', { locale: ptBR }),
            time: tide.time,
            height: tide.height,
            fullDate: `${format(day.date, 'dd/MM')} ${tide.time}`,
            type: tide.type
        }));
    });

    return (
        <AnimatedCard variant="carbon" hover={false} className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-display text-2xl text-white mb-1">
                        Tábua de Marés
                    </h3>
                    <p className="text-sm text-gray-400">
                        Próximos {data.length} dias • Rio Potengi
                    </p>
                </div>

                {/* Legend */}
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-400">Maré Alta</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-sm text-gray-400">Maré Baixa</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300} minWidth={300} minHeight={300}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="fullDate"
                        stroke="#6B7280"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis
                        label={{ value: 'Altura (m)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                        stroke="#6B7280"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#FFF'
                        }}
                        labelStyle={{ color: '#9CA3AF' }}
                    />
                    <ReferenceLine y={1.5} stroke="#6B7280" strokeDasharray="3 3" />
                    <Area
                        type="monotone"
                        dataKey="height"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#tideGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Coefficients Timeline */}
            <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-3">Coeficiente de Marés</p>
                <div className="flex gap-2">
                    {data.map((day, idx) => (
                        <motion.div
                            key={idx}
                            className="flex-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <div className="text-center mb-2">
                                <span className="text-xs text-gray-500">
                                    {format(day.date, 'dd/MM')}
                                </span>
                            </div>
                            <div className="h-16 bg-gray-800 rounded-lg overflow-hidden flex flex-col justify-end">
                                <motion.div
                                    className="bg-gradient-to-t from-blue-600 to-cyan-600"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${day.coefficient}%` }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                />
                            </div>
                            <div className="text-center mt-1">
                                <span className="text-xs font-mono text-white">
                                    {day.coefficient}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AnimatedCard>
    );
};
