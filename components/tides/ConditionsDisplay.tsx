'use client';

import { SlotAnalysis } from '@/types/rowing-conditions';
import { cn } from '@/lib/utils';
import { Navigation, Waves, Gauge, Wind, Droplets } from 'lucide-react';
import { calculateWaterSurface, calculatePaceImpact } from '@/lib/utils/rowing-calculations';

interface ConditionsDisplayProps {
    slot: SlotAnalysis;
}

export function ConditionsDisplay({ slot }: ConditionsDisplayProps) {
    // Calcular superfície da água
    const waterSurface = calculateWaterSurface(
        slot.environmentFactors.windSpeed / 3.6, // km/h para m/s
        slot.environmentFactors.windDirection
    );

    // Calcular impacto no pace
    const paceImpact = calculatePaceImpact(
        slot.tideFactors.departureCurrentSpeed,
        0 // ângulo relativo simplificado
    );

    return (
        <div className="space-y-4">
            {/* Classificação Principal */}
            <div className={cn(
                "p-4 rounded-xl border-2 text-center",
                slot.classification === 'EXCELENTE' && "bg-green-500/20 border-green-400/50",
                slot.classification === 'BOA' && "bg-blue-500/20 border-blue-400/50",
                slot.classification === 'MODERADA' && "bg-yellow-500/20 border-yellow-400/50",
                slot.classification === 'DIFÍCIL' && "bg-orange-500/20 border-orange-400/50",
                slot.classification === 'PERIGOSA' && "bg-red-500/20 border-red-400/50"
            )}>
                <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Classificação</div>
                <div className={cn(
                    "text-3xl font-bold uppercase mb-2",
                    slot.classification === 'EXCELENTE' && "text-green-300",
                    slot.classification === 'BOA' && "text-blue-300",
                    slot.classification === 'MODERADA' && "text-yellow-300",
                    slot.classification === 'DIFÍCIL' && "text-orange-300",
                    slot.classification === 'PERIGOSA' && "text-red-300"
                )}>
                    {slot.classification}
                </div>
                <div className="text-sm text-white/70">Score: {slot.score}/100</div>
            </div>

            {/* Grid de Condições */}
            <div className="grid grid-cols-2 gap-3">
                {/* Correnteza */}
                <div className="rounded-xl bg-cyan-500/20 p-3 border border-cyan-400/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-cyan-300" />
                        <span className="text-xs text-white/60 uppercase tracking-wider font-bold">Correnteza</span>
                    </div>
                    <p className="text-xl font-bold text-white">{slot.tideFactors.departureCurrentSpeed.toFixed(2)} <span className="text-sm">m/s</span></p>
                    <p className="text-sm text-cyan-300">
                        {slot.tideFactors.departureCurrentType === 'flood' && '⬆️ Enchente'}
                        {slot.tideFactors.departureCurrentType === 'ebb' && '⬇️ Vazante'}
                        {slot.tideFactors.departureCurrentType === 'slack' && '〰️ Estofa'}
                    </p>
                    <p className="text-xs text-white/50 mt-1">{slot.tideFactors.departurePhase}</p>
                </div>

                {/* Superfície da Água */}
                <div className="rounded-xl bg-blue-500/20 p-3 border border-blue-400/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Waves className="w-4 h-4 text-blue-300" />
                        <span className="text-xs text-white/60 uppercase tracking-wider font-bold">Superfície</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                        {waterSurface.surface === 'mirror' && '🪞 Espelho'}
                        {waterSurface.surface === 'ripple' && '〰️ Ondulação'}
                        {waterSurface.surface === 'chaotic' && '🌊 Caótico'}
                    </p>
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                            <span>Chop Lateral</span>
                            <span>{waterSurface.side_chop_index}%</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    'h-full rounded-full',
                                    waterSurface.side_chop_index < 30 && 'bg-green-400',
                                    waterSurface.side_chop_index >= 30 && waterSurface.side_chop_index < 60 && 'bg-yellow-400',
                                    waterSurface.side_chop_index >= 60 && 'bg-red-400'
                                )}
                                style={{ width: `${waterSurface.side_chop_index}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Vento */}
                <div className="rounded-xl bg-purple-500/20 p-3 border border-purple-400/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-purple-300" />
                        <span className="text-xs text-white/60 uppercase tracking-wider font-bold">Vento</span>
                    </div>
                    <p className="text-xl font-bold text-white">{slot.environmentFactors.windSpeed} <span className="text-sm">km/h</span></p>
                    <p className="text-xs text-white/50 mt-1">
                        Ajustado para horário ({slot.period === 'morning' ? 'manhã' : 'tarde'})
                    </p>
                </div>

                {/* Impacto no Pace */}
                <div className="rounded-xl bg-pink-500/20 p-3 border border-pink-400/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-4 h-4 text-pink-300" />
                        <span className="text-xs text-white/60 uppercase tracking-wider font-bold">Pace</span>
                    </div>
                    <p className={cn(
                        "text-xl font-bold",
                        paceImpact.delta_s_per_500m < 0 ? 'text-green-300' : 'text-red-300'
                    )}>
                        {paceImpact.delta_s_per_500m > 0 && '+'}
                        {paceImpact.delta_s_per_500m.toFixed(1)}s
                    </p>
                    <p className="text-xs text-white/50 mt-1">por 500m</p>
                </div>
            </div>

            {/* Recomendação */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-white/70 leading-relaxed">
                    💡 {slot.recommendation}
                </p>
            </div>
        </div>
    );
}
