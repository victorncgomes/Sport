
'use client';

import React from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { activeNauticalData } from '@/lib/data/nautical-data';
import {
    Thermometer,
    Wind,
    Droplets,
    Eye,
    Waves,
    Sun,
    ArrowUp,
    ArrowDown,
    Clock,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function NauticalPage() {
    const data = activeNauticalData;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Potengi Real-Time"
                subtitle="Condições Náuticas"
                description="Dados em tempo real do Rio Potengi para navegação segura."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                {/* Status Alert */}
                <AnimatedCard
                    variant="glass"
                    className={cn(
                        "mb-8 border-l-4",
                        data.condition === 'Optimal' ? "border-l-emerald-500 bg-emerald-500/5" :
                            data.condition === 'Caution' ? "border-l-amber-500 bg-amber-500/5" :
                                "border-l-red-500 bg-red-500/5"
                    )}
                >
                    <div className="flex items-center gap-4">
                        {data.condition === 'Optimal' ? (
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        ) : (
                            <AlertTriangle className="w-8 h-8 text-amber-500" />
                        )}
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                                STATUS: {data.condition === 'Optimal' ? 'Navegação Liberada' : 'Atenção Necessária'}
                            </h3>
                            <p className="text-white/60 text-sm font-bold">{data.message}</p>
                        </div>
                    </div>
                </AnimatedCard>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Stats */}
                    <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <AnimatedCard variant="carbon" className="p-6">
                            <Wind className="w-6 h-6 text-club-gold mb-4" />
                            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Vento</p>
                            <h4 className="text-3xl font-black text-white">{data.windSpeed} <span className="text-sm font-bold text-white/40">kt</span></h4>
                            <p className="text-xs text-white/60 font-medium">Direção: {data.windDirection}</p>
                        </AnimatedCard>

                        <AnimatedCard variant="carbon" className="p-6">
                            <Thermometer className="w-6 h-6 text-club-red mb-4" />
                            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Temperatura</p>
                            <h4 className="text-3xl font-black text-white">{data.temperature}°<span className="text-sm font-bold text-white/40">C</span></h4>
                            <p className="text-xs text-white/60 font-medium">Água: {data.waterTemp}°C</p>
                        </AnimatedCard>

                        <AnimatedCard variant="carbon" className="p-6">
                            <Droplets className="w-6 h-6 text-blue-400 mb-4" />
                            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Umidade</p>
                            <h4 className="text-3xl font-black text-white">{data.humidity}<span className="text-sm font-bold text-white/40">%</span></h4>
                            <p className="text-xs text-white/60 font-medium">Pressão: {data.pressure} hPa</p>
                        </AnimatedCard>

                        <AnimatedCard variant="carbon" className="p-6">
                            <Sun className="w-6 h-6 text-yellow-500 mb-4" />
                            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Índice UV</p>
                            <h4 className="text-3xl font-black text-white">{data.uvIndex}</h4>
                            <p className="text-xs text-white/60 font-medium">Risco: Muito Alto</p>
                        </AnimatedCard>

                        <AnimatedCard variant="carbon" className="p-6">
                            <Eye className="w-6 h-6 text-emerald-400 mb-4" />
                            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Visibilidade</p>
                            <h4 className="text-3xl font-black text-white">{data.visibility}<span className="text-sm font-bold text-white/40">km</span></h4>
                            <p className="text-xs text-white/60 font-medium">Condição Limpa</p>
                        </AnimatedCard>

                        <AnimatedCard variant="carbon" className="p-6">
                            <Waves className="w-6 h-6 text-blue-500 mb-4" />
                            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Maré Atual</p>
                            <div className="flex items-center gap-2">
                                <h4 className="text-3xl font-black text-white">0.3<span className="text-sm font-bold text-white/40">m</span></h4>
                                <ArrowDown className="w-4 h-4 text-emerald-500" />
                            </div>
                            <p className="text-xs text-white/60 font-medium italic">Baixando</p>
                        </AnimatedCard>
                    </div>

                    {/* Tides Timeline */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em] ml-2">Tábua de Marés</h3>
                        {data.tides.map((tide, idx) => (
                            <AnimatedCard key={idx} variant="glass" className="py-4 px-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        tide.type === 'high' ? "bg-club-red/20 text-club-red" : "bg-blue-400/20 text-blue-400"
                                    )}>
                                        {tide.type === 'high' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-lg">{tide.time}</p>
                                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Maré {tide.type === 'high' ? 'Cheia' : 'Baixa'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-black text-xl">{tide.height}m</p>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>
                </div>

                {/* Tide Chart */}
                <div className="mt-8">
                    <AnimatedCard variant="carbon" className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Variação da Maré</h3>
                                <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mt-1">Estimativa de altura nas próximas 24h</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-club-red" />
                                    <span className="text-xs text-white/50 font-bold uppercase">Preamar</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-xs text-white/50 font-bold uppercase">Baixa-mar</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.tides}>
                                    <defs>
                                        <linearGradient id="colorTide" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#ffffff20"
                                        fontSize={10}
                                        fontWeight="bold"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#ffffff20"
                                        fontSize={10}
                                        fontWeight="bold"
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(v) => `${v}m`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        labelStyle={{ color: '#ffffff50', fontWeight: 'bold', fontSize: '10px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="height"
                                        stroke="#DC2626"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorTide)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </AnimatedCard>
                </div>
            </div>
        </div>
    );
}
