'use client';

import React from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Waves, Wind, Thermometer, Activity } from 'lucide-react';
import type { WaveConditions } from '@/types/tides';

interface WaveWidgetProps {
    waves: WaveConditions;
}

const SeaStateConfig = {
    'calm': { label: 'Calmo', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    'moderate': { label: 'Moderado', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    'rough': { label: 'Agitado', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    'very-rough': { label: 'Muito Agitado', color: 'text-red-400', bgColor: 'bg-red-500/20' },
};

export const WaveWidget: React.FC<WaveWidgetProps> = ({ waves }) => {
    const seaState = SeaStateConfig[waves.seaState as keyof typeof SeaStateConfig];

    return (
        <AnimatedCard variant="carbon" hover="lift">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl text-white">
                    Ondas & Vento
                </h3>
                <Waves className="h-6 w-6 text-cyan-400" />
            </div>

            {/* Wave Height */}
            <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Altura das Ondas</p>
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-display text-white">
                        {waves.height.toFixed(1)}
                    </span>
                    <span className="text-2xl text-gray-400 mb-2">m</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Período: {waves.period.toFixed(1)}s • Direção: {waves.direction} ({waves.directionDegrees}°)
                </p>
            </div>

            {/* Sea State */}
            <div className={`p-4 rounded-lg ${seaState.bgColor} border border-${seaState.color.replace('text-', '')}/30 mb-4`}>
                <div className="flex items-center  justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className={`h-5 w-5 ${seaState.color}`} />
                        <span className="text-white font-semibold">Mar {seaState.label}</span>
                    </div>
                </div>
            </div>

            {/* Water Temperature */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 mb-4">
                <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-400">Temperatura da Água</span>
                </div>
                <span className="font-display text-2xl text-white">
                    {waves.waterTemp.toFixed(1)}°C
                </span>
            </div>

            {/* Wind Info */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-400">Vento de Costa</span>
                </div>
                <span className="text-white font-semibold">
                    {waves.direction}
                </span>
            </div>
        </AnimatedCard>
    );
};
