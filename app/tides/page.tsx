'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Waves,
    ArrowLeft,
    Navigation,
    Wind,
    Gauge,
    Droplets,
    Sunrise,
    Sunset,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Info,
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    Calendar,
    Moon,
    Sun,
    Cloud,
    CloudRain,
    CloudSun,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getTidesForDate, isHighTide } from '@/lib/data/tide-data-official';

export default function TidesPage() {
    // Usar mesma fonte de dados que o widget da home
    const tideData = useMemo(() => {
        const today = new Date();
        const officialDay = getTidesForDate(today);

        const high: { time: string; height: number }[] = [];
        const low: { time: string; height: number }[] = [];

        if (officialDay) {
            officialDay.tides.forEach(tide => {
                if (isHighTide(tide.height)) {
                    high.push({ time: tide.time, height: tide.height });
                } else {
                    low.push({ time: tide.time, height: tide.height });
                }
            });
        } else {
            // Fallback se não houver dados oficiais
            high.push({ time: '06:00', height: 2.3 }, { time: '18:30', height: 2.4 });
            low.push({ time: '00:15', height: 0.4 }, { time: '12:15', height: 0.3 });
        }

        return { high, low, source: officialDay ? 'Marinha do Brasil' : 'Simulado' };
    }, []);

    // Dados simulados complementares (em produção, viriam de API)
    const mockData = {
        date: new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
        current: {
            speed_m_s: 0.59,
            direction_deg: 308,
            relative_angle_deg: 7,
            direction_text: 'NW'
        },
        wind: {
            speed_m_s: 5.2,
            speed_kmh: 18.7,
            direction_deg: 220,
            direction_text: 'SW',
            relative_angle_deg: 80,
            gusts_kmh: 24
        },
        condition: {
            rating: 'favorable' as const,
            label: 'Favorável',
            color: 'green',
            description: 'Condições ideais para remo - vento/corrente a favor'
        },
        water: {
            surface: 'ripple' as 'mirror' | 'ripple' | 'chaotic',
            chop_index: 38,
            description: 'Ondulação leve a moderada'
        },
        pace: {
            delta: -14.5,
            percentage: -18.3,
            description: 'Ganho de 14.5s/500m'
        },
        tides: tideData, // Usar dados reais
        sun: {
            sunrise: '05:18',
            sunset: '17:45'
        },
        coefficient: 72,
        moonPhase: {
            name: 'Lua Minguante',
            emoji: '🌘',
            illumination: 35,
            description: 'Marés reduzindo gradualmente. Aproximando-se da lua nova. Correntes moderadas.'
        },
        forecast: [
            { time: '06:00', temp: 24, condition: 'Parcialmente Nublado', wind: 12, rain: 5 },
            { time: '09:00', temp: 27, condition: 'Ensolarado', wind: 15, rain: 0 },
            { time: '12:00', temp: 32, condition: 'Ensolarado', wind: 18, rain: 0 },
            { time: '15:00', temp: 31, condition: 'Parcialmente Nublado', wind: 22, rain: 10 },
            { time: '18:00', temp: 27, condition: 'Nublado', wind: 16, rain: 20 },
            { time: '21:00', temp: 25, condition: 'Nublado', wind: 14, rain: 15 }
        ]
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Header - Banner Estático (não sticky para não conflitar com header do site) */}
            <div className="bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Waves className="w-6 h-6 text-blue-400" />
                            <div>
                                <h1 className="text-xl font-bold text-white">Tábua de Marés - Detalhes</h1>
                                <p className="text-xs text-white/60">Rio Potengi - Natal/RN</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Data */}
                <div className="flex items-center gap-2 text-blue-400">
                    <Calendar className="w-4 h-4" />
                    <span className="font-bold capitalize">{mockData.date}</span>
                </div>

                {/* Marés do Dia - TOPO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Waves className="w-5 h-5 text-blue-400" />
                        Marés do Dia
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Marés Altas */}
                        <div>
                            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Maré Alta
                            </h3>
                            <div className="space-y-2">
                                {mockData.tides.high.map((tide, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-blue-500/20 border border-blue-400/30">
                                        <span className="text-2xl font-bold text-white">{tide.time}</span>
                                        <span className="text-2xl font-bold text-blue-400">{tide.height}m</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Marés Baixas */}
                        <div>
                            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <TrendingDown className="w-4 h-4" />
                                Maré Baixa
                            </h3>
                            <div className="space-y-2">
                                {mockData.tides.low.map((tide, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-orange-500/20 border border-orange-400/30">
                                        <span className="text-2xl font-bold text-white">{tide.time}</span>
                                        <span className="text-2xl font-bold text-orange-400">{tide.height}m</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Previsão do Tempo por Horários */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Previsão do Tempo - Horários do Dia
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {mockData.forecast.map((hour, i) => (
                            <div key={i} className="rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 p-4 text-center">
                                <p className="text-sm font-bold text-blue-300 mb-2">{hour.time}</p>
                                {/* Ícone de condição colorido */}
                                <div className="mb-2">
                                    {hour.condition === 'Ensolarado' && <Sun className="w-8 h-8 text-yellow-400 mx-auto" />}
                                    {hour.condition === 'Parcialmente Nublado' && <CloudSun className="w-8 h-8 text-amber-300 mx-auto" />}
                                    {hour.condition === 'Nublado' && <Cloud className="w-8 h-8 text-slate-400 mx-auto" />}
                                    {hour.condition === 'Chuvoso' && <CloudRain className="w-8 h-8 text-blue-400 mx-auto" />}
                                </div>
                                <p className="text-2xl font-bold text-white mb-1">{hour.temp}°C</p>
                                <p className="text-xs text-white/60 mb-2">{hour.condition}</p>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center gap-1 text-xs text-white/50">
                                        <Wind className="w-3 h-3" />
                                        <span>{hour.wind}km/h</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-1 text-xs text-white/50">
                                        <Droplets className="w-3 h-3" />
                                        <span>{hour.rain}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Resumo de Condições */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Condições Atuais para Remo
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Classificação Geral */}
                        <div className={cn(
                            "rounded-xl p-6 border-2",
                            mockData.condition.color === 'green' && "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50",
                            mockData.condition.color === 'yellow' && "bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400/50",
                            mockData.condition.color === 'red' && "bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-400/50"
                        )}>
                            <div className="flex items-center gap-3 mb-3">
                                {mockData.condition.color === 'green' && <CheckCircle className="w-8 h-8 text-green-300" />}
                                {mockData.condition.color === 'yellow' && <AlertTriangle className="w-8 h-8 text-yellow-300" />}
                                {mockData.condition.color === 'red' && <XCircle className="w-8 h-8 text-red-300" />}
                                <div>
                                    <p className="text-sm text-white/60 uppercase tracking-wider">Classificação</p>
                                    <p className={cn(
                                        "text-2xl font-bold uppercase",
                                        mockData.condition.color === 'green' && "text-green-300",
                                        mockData.condition.color === 'yellow' && "text-yellow-300",
                                        mockData.condition.color === 'red' && "text-red-300"
                                    )}>
                                        {mockData.condition.label}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70">{mockData.condition.description}</p>
                        </div>

                        {/* Impacto no Pace */}
                        <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Gauge className="w-8 h-8 text-purple-300" />
                                <div>
                                    <p className="text-sm text-white/60 uppercase tracking-wider">Impacto no Pace</p>
                                    <p className={cn(
                                        "text-3xl font-bold",
                                        mockData.pace.delta < 0 ? "text-green-300" : "text-red-300"
                                    )}>
                                        {mockData.pace.delta > 0 && '+'}{mockData.pace.delta}s
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70 mb-2">{mockData.pace.description}</p>
                            <p className="text-xs text-white/50">
                                {mockData.pace.percentage > 0 && '+'}
                                {mockData.pace.percentage}% por 500m
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Fase da Lua Atual */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Moon className="w-5 h-5 text-slate-300" />
                        Fase da Lua Atual
                    </h2>

                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-5xl shadow-lg">
                            {mockData.moonPhase.emoji}
                        </div>
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-white mb-1">{mockData.moonPhase.name}</p>
                            <p className="text-sm text-white/60 mb-3">Iluminação: {mockData.moonPhase.illumination}%</p>
                            <p className="text-sm text-white/70">{mockData.moonPhase.description}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Detalhes Técnicos */}
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Correnteza */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Navigation className="w-6 h-6 text-cyan-300" />
                            <h3 className="text-lg font-bold text-white">Correnteza</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-white/60 mb-1">Velocidade</p>
                                <p className="text-2xl font-bold text-white">{mockData.current.speed_m_s} <span className="text-sm">m/s</span></p>
                            </div>
                            <div>
                                <p className="text-xs text-white/60 mb-1">Direção</p>
                                <p className="text-xl font-bold text-cyan-300">{mockData.current.direction_text} ({mockData.current.direction_deg}°)</p>
                            </div>
                            <div>
                                <p className="text-xs text-white/60 mb-1">Ângulo Relativo ao Percurso</p>
                                <p className="text-xl font-bold text-cyan-300">{mockData.current.relative_angle_deg}°</p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-black/20">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-white/70">
                                    A correnteza é calculada com base no ciclo de marés. Valores mais altos ocorrem durante a mudança de maré (enchente/vazante).
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Vento */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Wind className="w-6 h-6 text-blue-300" />
                            <h3 className="text-lg font-bold text-white">Vento</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-white/60 mb-1">Velocidade</p>
                                <p className="text-2xl font-bold text-white">{mockData.wind.speed_kmh.toFixed(1)} <span className="text-sm">km/h</span></p>
                                <p className="text-xs text-white/50">({mockData.wind.speed_m_s.toFixed(2)} m/s)</p>
                            </div>
                            <div>
                                <p className="text-xs text-white/60 mb-1">Direção</p>
                                <p className="text-xl font-bold text-blue-300">{mockData.wind.direction_text} ({mockData.wind.direction_deg}°)</p>
                            </div>
                            <div>
                                <p className="text-xs text-white/60 mb-1">Rajadas</p>
                                <p className="text-lg font-bold text-blue-300">{mockData.wind.gusts_kmh} km/h</p>
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-black/20">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-white/70">
                                    O vento afeta principalmente a condição da superfície da água e pode criar chop lateral que dificulta a remada.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Condição da Água */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Droplets className="w-6 h-6 text-indigo-300" />
                            <h3 className="text-lg font-bold text-white">Condição da Água</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-white/60 mb-1">Superfície</p>
                                <p className="text-xl font-bold text-white">
                                    {mockData.water.surface === 'mirror' && '🪞 Espelho'}
                                    {mockData.water.surface === 'ripple' && '〰️ Ondulação'}
                                    {mockData.water.surface === 'chaotic' && '🌊 Lago Caótico'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-white/60 mb-2">Índice de Chop Lateral</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-4 bg-black/30 rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                'h-full rounded-full transition-all',
                                                mockData.water.chop_index < 30 && 'bg-green-400',
                                                mockData.water.chop_index >= 30 && mockData.water.chop_index < 60 && 'bg-yellow-400',
                                                mockData.water.chop_index >= 60 && 'bg-red-400'
                                            )}
                                            style={{ width: `${mockData.water.chop_index}%` }}
                                        />
                                    </div>
                                    <span className="text-lg font-bold text-indigo-300">{mockData.water.chop_index}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-black/20">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-indigo-300 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-white/70">
                                    {mockData.water.description}. O chop lateral é mais intenso quando o vento está perpendicular ao percurso.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Informações Adicionais */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 p-4">
                        <p className="text-xs text-white/60 mb-2">Coeficiente de Marés</p>
                        <p className="text-3xl font-bold text-purple-300">{mockData.coefficient}</p>
                        <div className="mt-3 p-2 rounded bg-black/20">
                            <p className="text-[10px] text-white/60">
                                Indica a amplitude da maré. Valores acima de 70 indicam marés mais intensas.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-400/30 p-4">
                        <div className="flex items-center gap-3">
                            <Sunrise className="w-8 h-8 text-yellow-400" />
                            <div>
                                <p className="text-xs text-white/60">Nascer do Sol</p>
                                <p className="text-2xl font-bold text-white">{mockData.sun.sunrise}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-400/30 p-4">
                        <div className="flex items-center gap-3">
                            <Sunset className="w-8 h-8 text-orange-400" />
                            <div>
                                <p className="text-xs text-white/60">Pôr do Sol</p>
                                <p className="text-2xl font-bold text-white">{mockData.sun.sunset}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fases da Lua e Impacto nas Marés */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Moon className="w-5 h-5 text-slate-300" />
                        Fases da Lua e Impacto nas Marés
                    </h2>

                    <p className="text-sm text-white/70 mb-6">
                        A fase da lua influencia diretamente a amplitude das marés. Durante a Lua Nova e Lua Cheia,
                        ocorrem as <strong className="text-blue-300">marés de sizígia</strong> (maiores amplitudes).
                        No Quarto Crescente e Minguante, temos as <strong className="text-slate-300">marés de quadratura</strong> (menores amplitudes).
                    </p>

                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                        {/* Lua Nova */}
                        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-600/30 p-4 text-center">
                            <div className="text-4xl mb-2">🌑</div>
                            <p className="text-sm font-bold text-white">Lua Nova</p>
                            <p className="text-xs text-slate-400 mt-1">0% iluminação</p>
                            <div className="mt-2 px-2 py-1 rounded bg-blue-500/20 border border-blue-400/30">
                                <p className="text-[10px] text-blue-300 font-bold">SIZÍGIA</p>
                            </div>
                        </div>

                        {/* Quarto Crescente */}
                        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-500/30 p-4 text-center">
                            <div className="text-4xl mb-2">🌓</div>
                            <p className="text-sm font-bold text-white">Quarto Crescente</p>
                            <p className="text-xs text-slate-400 mt-1">50% iluminação</p>
                            <div className="mt-2 px-2 py-1 rounded bg-slate-500/20 border border-slate-400/30">
                                <p className="text-[10px] text-slate-300 font-bold">QUADRATURA</p>
                            </div>
                        </div>

                        {/* Lua Cheia */}
                        <div className="rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-400/30 p-4 text-center">
                            <div className="text-4xl mb-2">🌕</div>
                            <p className="text-sm font-bold text-white">Lua Cheia</p>
                            <p className="text-xs text-slate-400 mt-1">100% iluminação</p>
                            <div className="mt-2 px-2 py-1 rounded bg-blue-500/20 border border-blue-400/30">
                                <p className="text-[10px] text-blue-300 font-bold">SIZÍGIA</p>
                            </div>
                        </div>

                        {/* Quarto Minguante */}
                        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-500/30 p-4 text-center">
                            <div className="text-4xl mb-2">🌗</div>
                            <p className="text-sm font-bold text-white">Quarto Minguante</p>
                            <p className="text-xs text-slate-400 mt-1">50% iluminação</p>
                            <div className="mt-2 px-2 py-1 rounded bg-slate-500/20 border border-slate-400/30">
                                <p className="text-[10px] text-slate-300 font-bold">QUADRATURA</p>
                            </div>
                        </div>
                    </div>

                    {/* Explicações detalhadas */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                            <h4 className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Marés de Sizígia (Lua Nova/Cheia)
                            </h4>
                            <ul className="text-xs text-white/70 space-y-1">
                                <li>• Amplitude máxima de marés</li>
                                <li>• Correntes mais fortes durante enchente/vazante</li>
                                <li>• Maior diferença entre maré alta e baixa</li>
                                <li>• Ideal para treinos de força e adaptação</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-400/20">
                            <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                                <TrendingDown className="w-4 h-4" />
                                Marés de Quadratura (Quartos)
                            </h4>
                            <ul className="text-xs text-white/70 space-y-1">
                                <li>• Amplitude mínima de marés</li>
                                <li>• Correntes mais fracas</li>
                                <li>• Menor variação no nível d'água</li>
                                <li>• Ideal para treinos técnicos e iniciantes</li>
                            </ul>
                        </div>
                    </div>

                    {/* Todas as 8 fases */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-xs text-white/50 mb-3">Ciclo Lunar Completo (29.5 dias)</p>
                        <div className="flex justify-between items-center px-4">
                            <div className="text-center">
                                <span className="text-2xl">🌑</span>
                                <p className="text-[9px] text-white/40 mt-1">Nova</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl">🌒</span>
                                <p className="text-[9px] text-white/40 mt-1">Crescente</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl">🌓</span>
                                <p className="text-[9px] text-white/40 mt-1">Quarto C.</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl">🌔</span>
                                <p className="text-[9px] text-white/40 mt-1">Gibosa C.</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl">🌕</span>
                                <p className="text-[9px] text-white/40 mt-1">Cheia</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl">🌖</span>
                                <p className="text-[9px] text-white/40 mt-1">Gibosa M.</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl">🌗</span>
                                <p className="text-[9px] text-white/40 mt-1">Quarto M.</p>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl">🌘</span>
                                <p className="text-[9px] text-white/40 mt-1">Minguante</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Horários de Treino - NOVO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Análise para Horários de Treino
                    </h2>

                    <p className="text-sm text-white/70 mb-6">
                        As condições de remo são avaliadas considerando os horários habituais de treino do clube,
                        analisando o impacto da maré, vento e correnteza em cada período.
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-blue-300" />
                                <h3 className="text-sm font-bold text-blue-300">Manhã (5h - 9h30)</h3>
                            </div>
                            <p className="text-sm text-white/70 mb-2">
                                Condições geralmente favoráveis com águas mais calmas. Ideal para treinos técnicos e de resistência.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                <Info className="w-3 h-3" />
                                <span>Vento tipicamente mais fraco, melhor visibilidade</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-400/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-orange-300" />
                                <h3 className="text-sm font-bold text-orange-300">Tarde (15h - 18h30)</h3>
                            </div>
                            <p className="text-sm text-white/70 mb-2">
                                Ventos podem ser mais intensos. Bom para treinos de força e adaptação a condições variadas.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                <Info className="w-3 h-3" />
                                <span>Possível aumento de chop lateral, requer mais técnica</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-400/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-green-300" />
                                <h3 className="text-sm font-bold text-green-300">Sábados (8h - 18h)</h3>
                            </div>
                            <p className="text-sm text-white/70 mb-2">
                                Horário estendido permite aproveitar diferentes condições de maré e vento ao longo do dia.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                <Info className="w-3 h-3" />
                                <span>Oportunidade para treinos longos e variados</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Glossário */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        Entendendo os Dados
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-black/20">
                            <p className="text-sm font-bold text-blue-300 mb-1">Ângulo Relativo</p>
                            <p className="text-xs text-white/70">
                                Diferença entre a direção do vento/corrente e o eixo do percurso (315° NW).
                                Quanto menor o ângulo, mais favorável a condição.
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/20">
                            <p className="text-sm font-bold text-green-300 mb-1">Condição Favorável</p>
                            <p className="text-xs text-white/70">
                                Ângulo ≤ 30°. Vento/corrente a favor ou quase a favor. Melhor momento para treinos de velocidade.
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/20">
                            <p className="text-sm font-bold text-yellow-300 mb-1">Condição Técnica</p>
                            <p className="text-xs text-white/70">
                                Ângulo entre 30° e 110°. Vento/corrente lateral. Requer técnica apurada e atenção à direção.
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/20">
                            <p className="text-sm font-bold text-red-300 mb-1">Condição Ingrata</p>
                            <p className="text-xs text-white/70">
                                Ângulo {'>'} 110°. Vento/corrente contrários. Treino de força, pace mais lento.
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/20">
                            <p className="text-sm font-bold text-indigo-300 mb-1">Chop Lateral</p>
                            <p className="text-xs text-white/70">
                                Ondulação perpendicular ao barco. Valores acima de 60% dificultam significativamente a remada.
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-black/20">
                            <p className="text-sm font-bold text-purple-300 mb-1">Impacto no Pace</p>
                            <p className="text-xs text-white/70">
                                Estimativa de ganho (negativo) ou perda (positivo) de tempo por 500m devido às condições.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Fonte */}
                <div className="text-center text-xs text-white/40 space-y-1">
                    <p>Dados de maré: Marinha do Brasil - DHN</p>
                    <p>Cálculos de correnteza e condições: Sport Club do Recife e Natal</p>
                    <p className="text-[10px]">Atualizado automaticamente a cada hora</p>
                </div>
            </div>
        </div>
    );
}
