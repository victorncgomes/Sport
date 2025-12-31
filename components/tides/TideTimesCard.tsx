'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import { ArrowUp, ArrowDown, Waves } from 'lucide-react';
import type { TideDay } from '@/types/tides';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TideTimesCardProps {
    tideDay: TideDay;
}

export const TideTimesCard: React.FC<TideTimesCardProps> = ({ tideDay }) => {
    return (
        <AnimatedCard variant="gradient" hover="lift">
            {/* Coordenadas do Sport Club */}
            <div className="mb-4 pb-3 border-b border-white/10">
                <p className="text-xs text-white/50 text-center leading-relaxed">
                    Sport Club de Natal: Latitude 5°46'31 S • Longitude 35°12'22 W • Fuso UTC -03:00h
                </p>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-display text-xl text-white mb-1">
                        Marés de Hoje
                    </h3>
                    <p className="text-sm text-white/60">
                        {format(tideDay.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </p>
                </div>
                <Waves className="h-8 w-8 text-white/40" />
            </div>

            {/* Tide Times */}
            <div className="space-y-3 mb-6">
                {tideDay.tides.map((tide, idx) => (
                    <motion.div
                        key={idx}
                        className="flex justify-between items-center py-3 px-4 rounded-lg bg-white/10 backdrop-blur-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${tide.type === 'HIGH' ? 'bg-blue-500/20' : 'bg-orange-500/20'
                                }`}>
                                {tide.type === 'HIGH' ? (
                                    <ArrowUp className="h-5 w-5 text-blue-400" />
                                ) : (
                                    <ArrowDown className="h-5 w-5 text-orange-400" />
                                )}
                            </div>
                            <div>
                                <p className="text-white font-semibold">
                                    {tide.type === 'HIGH' ? 'Maré Alta' : 'Maré Baixa'}
                                </p>
                                <p className="text-sm text-white/60">
                                    {tide.time}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-display text-white">
                                {tide.height.toFixed(2)}m
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Coeficiente */}
            <div className="p-4 rounded-lg bg-white/5">
                <p className="text-sm text-white/60 mb-2">Coeficiente de Marés</p>
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${tideDay.coefficient}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                    <span className="font-display text-3xl text-white min-w-[60px] text-right">
                        {tideDay.coefficient}
                    </span>
                </div>
                <p className="text-xs text-white/40 mt-2">
                    {tideDay.coefficient > 70 && 'Marés fortes - correntes intensas'}
                    {tideDay.coefficient >= 40 && tideDay.coefficient <= 70 && 'Marés moderadas'}
                    {tideDay.coefficient < 40 && 'Marés fracas'}
                </p>
            </div>

            {/* Sun & Moon Times */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-white/40 mb-1">Nascer do Sol</p>
                    <p className="font-mono text-white">{tideDay.sunrise}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-white/40 mb-1">Pôr do Sol</p>
                    <p className="font-mono text-white">{tideDay.sunset}</p>
                </div>
            </div>
        </AnimatedCard>
    );
};
