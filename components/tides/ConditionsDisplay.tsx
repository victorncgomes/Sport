'use client';

import { SlotAnalysis } from '@/types/rowing-conditions';
import { cn } from '@/lib/utils';
import { Navigation, Waves, Gauge, Wind, Droplets, Anchor } from 'lucide-react';
import { calculateWaterSurface, calculateDualPaceImpact, TideType } from '@/lib/utils/rowing-calculations';

interface ConditionsDisplayProps {
    slot: SlotAnalysis;
}

export function ConditionsDisplay({ slot }: ConditionsDisplayProps) {
    // Calcular superfície da água
    const waterSurface = calculateWaterSurface(
        slot.environmentFactors.windSpeed / 3.6, // km/h para m/s
        slot.environmentFactors.windDirection
    );

    // Mapear tipo de maré
    const tideType: TideType = slot.tideFactors.departureCurrentType === 'flood' ? 'flood' :
        slot.tideFactors.departureCurrentType === 'ebb' ? 'ebb' : 'slack';

    // Calcular impacto no pace com física realista do Rio Potengi
    // Considera: correnteza natural do rio + maré + vento
    const dualPace = calculateDualPaceImpact(
        slot.tideFactors.departureCurrentSpeed,
        tideType,
        slot.environmentFactors.windSpeed / 3.6, // km/h para m/s
        slot.environmentFactors.windDirection
    );

    // Conversão m/s para nós: 1 nó = 0.5144 m/s
    const currentSpeedKnots = Math.abs(dualPace.netForce / 0.5144);

    return (
        <div className="space-y-3">
            {/* 1ª Linha: Classificação e Correnteza */}
            <div className="grid grid-cols-2 gap-3">
                {/* Classificação */}
                <div className={cn(
                    "p-3 rounded-xl border flex flex-col items-center justify-center text-center",
                    slot.classification === 'EXCELENTE' && "bg-green-500/20 border-green-400/50",
                    slot.classification === 'BOA' && "bg-blue-500/20 border-blue-400/50",
                    slot.classification === 'MODERADA' && "bg-yellow-500/20 border-yellow-400/50",
                    slot.classification === 'DIFÍCIL' && "bg-orange-500/20 border-orange-400/50",
                    slot.classification === 'PERIGOSA' && "bg-red-500/20 border-red-400/50"
                )}>
                    <div className="text-[10px] text-white/60 uppercase tracking-wider mb-1 font-bold">Classificação</div>
                    <div className={cn(
                        "text-2xl font-bold uppercase mb-1",
                        slot.classification === 'EXCELENTE' && "text-green-300",
                        slot.classification === 'BOA' && "text-blue-300",
                        slot.classification === 'MODERADA' && "text-yellow-300",
                        slot.classification === 'DIFÍCIL' && "text-orange-300",
                        slot.classification === 'PERIGOSA' && "text-red-300"
                    )}>
                        {slot.classification}
                    </div>
                    <div className="text-xs text-white/70">Score: {slot.score}/100</div>
                </div>

                {/* Correnteza */}
                <div className="rounded-xl bg-cyan-500/20 p-3 border border-cyan-400/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-cyan-300" />
                        <span className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Correnteza</span>
                    </div>
                    <p className="text-xl font-bold text-white">{slot.tideFactors.departureCurrentSpeed.toFixed(2)} <span className="text-sm">m/s</span></p>
                    <p className="text-sm text-cyan-300">
                        {slot.tideFactors.departureCurrentType === 'flood' && '⬆️ Enchente'}
                        {slot.tideFactors.departureCurrentType === 'ebb' && '⬇️ Vazante'}
                        {slot.tideFactors.departureCurrentType === 'slack' && '〰️ Estofa'}
                    </p>
                    <p className="text-[10px] text-white/50 mt-1">{slot.tideFactors.departurePhase}</p>
                </div>
            </div>

            {/* 2ª Linha: Superfície e Vento */}
            <div className="grid grid-cols-2 gap-3">
                {/* Superfície da Água */}
                <div className="rounded-xl bg-blue-500/20 p-3 border border-blue-400/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Waves className="w-4 h-4 text-blue-300" />
                        <span className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Superfície</span>
                    </div>
                    <p className="text-lg font-bold text-white leading-tight">
                        {waterSurface.surface === 'mirror' && '🪞 Espelho'}
                        {waterSurface.surface === 'ripple' && '〰️ Ondulação'}
                        {waterSurface.surface === 'chaotic' && '🌊 Caótico'}
                    </p>
                    <div className="mt-2">
                        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
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
                        <p className="text-[9px] text-white/40 mt-1 text-right">Chop {waterSurface.side_chop_index}%</p>
                    </div>
                </div>

                {/* Vento */}
                <div className="rounded-xl bg-purple-500/20 p-3 border border-purple-400/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Wind className="w-4 h-4 text-purple-300" />
                        <span className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Vento</span>
                    </div>
                    <p className="text-xl font-bold text-white">{slot.environmentFactors.windSpeed} <span className="text-sm">km/h</span></p>
                    <p className="text-[10px] text-white/50 mt-1">
                        Dir. {slot.environmentFactors.windDirection}°
                    </p>
                </div>
            </div>

            {/* 3ª Linha: Correnteza para Ponte de Igapó e Ponte da Redinha */}
            <div className="grid grid-cols-2 gap-3">
                {/* Ponte de Igapó (Nascente/SW) - PRIMEIRO */}
                <div className={cn(
                    "rounded-xl p-3 border relative",
                    dualPace.towardsUpstream.delta_s_per_500m <= 0
                        ? "bg-green-500/10 border-green-400/20"
                        : "bg-red-500/10 border-red-400/20"
                )}>
                    <div className="flex items-center gap-2 mb-2">
                        <Anchor className="w-4 h-4 text-orange-300" />
                        <span className="text-[9px] text-white/60 uppercase tracking-wider font-bold">
                            Ponte de Igapó
                        </span>
                    </div>
                    {/* Valor principal em nós */}
                    <p className={cn(
                        "text-xl font-bold",
                        dualPace.towardsUpstream.delta_s_per_500m <= 0 ? "text-green-300" : "text-red-300"
                    )}>
                        {currentSpeedKnots.toFixed(2)} <span className="text-sm">nós</span>
                    </p>
                    <p className="text-[9px] text-white/40 mt-0.5">
                        {dualPace.towardsUpstream.delta_s_per_500m <= 0 ? 'A favor' : 'Contra'}
                    </p>
                    {/* Impacto no pace - canto inferior direito */}
                    <div className="absolute bottom-2 right-2 text-right">
                        <p className="text-[8px] text-white/30 uppercase">Pace 500m</p>
                        <p className={cn(
                            "text-[10px] font-bold",
                            dualPace.towardsUpstream.delta_s_per_500m <= 0 ? "text-green-400/70" : "text-red-400/70"
                        )}>
                            {dualPace.towardsUpstream.delta_s_per_500m > 0 ? '+' : ''}
                            {dualPace.towardsUpstream.delta_s_per_500m.toFixed(1)}s
                        </p>
                    </div>
                </div>

                {/* Ponte da Redinha (Mar/NE) - SEGUNDO */}
                <div className={cn(
                    "rounded-xl p-3 border relative",
                    dualPace.towardsSea.delta_s_per_500m <= 0
                        ? "bg-green-500/10 border-green-400/20"
                        : "bg-red-500/10 border-red-400/20"
                )}>
                    <div className="flex items-center gap-2 mb-2">
                        <Anchor className="w-4 h-4 text-blue-300" />
                        <span className="text-[9px] text-white/60 uppercase tracking-wider font-bold">
                            Ponte da Redinha
                        </span>
                    </div>
                    {/* Valor principal em nós */}
                    <p className={cn(
                        "text-xl font-bold",
                        dualPace.towardsSea.delta_s_per_500m <= 0 ? "text-green-300" : "text-red-300"
                    )}>
                        {currentSpeedKnots.toFixed(2)} <span className="text-sm">nós</span>
                    </p>
                    <p className="text-[9px] text-white/40 mt-0.5">
                        {dualPace.towardsSea.delta_s_per_500m <= 0 ? 'A favor' : 'Contra'}
                    </p>
                    {/* Impacto no pace - canto inferior direito */}
                    <div className="absolute bottom-2 right-2 text-right">
                        <p className="text-[8px] text-white/30 uppercase">Pace 500m</p>
                        <p className={cn(
                            "text-[10px] font-bold",
                            dualPace.towardsSea.delta_s_per_500m <= 0 ? "text-green-400/70" : "text-red-400/70"
                        )}>
                            {dualPace.towardsSea.delta_s_per_500m > 0 ? '+' : ''}
                            {dualPace.towardsSea.delta_s_per_500m.toFixed(1)}s
                        </p>
                    </div>
                </div>
            </div>

            {/* Força Dominante */}
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                <p className="text-[10px] text-white/50">
                    ⚡ {dualPace.dominantForce} • Força: {dualPace.netForce > 0 ? '+' : ''}{dualPace.netForce.toFixed(2)} m/s
                </p>
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
