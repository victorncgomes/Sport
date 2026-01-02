'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Waves,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    ExternalLink,
    Cloud,
    CloudRain,
    Sun,
    CloudSun,
    Wind,
    Droplets,
    Sunrise,
    Sunset,
    Navigation,
    Thermometer,
    Activity,
    Gauge,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTidesForDate, isHighTide, debugTideData } from '@/lib/data/tide-data-official';
import { generateCurrentData } from '@/lib/api/current-service';
import {
    calculateRelativeAngle,
    classifyCondition,
    calculateWaterSurface,
    calculatePaceImpact,
    degreesToCardinal,
    msToKmh
} from '@/lib/utils/rowing-calculations';
import { CONVERSIONS } from '@/lib/config/rowing-config';
import { CurrentIndicator } from '@/components/tides/current-indicator';
import { ConditionBadge } from '@/components/tides/condition-badge';
import { SlotsTable } from '@/components/tides/SlotsTable';
import { TimeSlotSelector } from '@/components/tides/TimeSlotSelector';
import { ConditionsDisplay } from '@/components/tides/ConditionsDisplay';
import type { RowingConditionsData } from '@/types/rowing-conditions';
import { analyzeRowingConditions, findCurrentSlot, analyzeSlot } from '@/lib/utils/rowing-conditions-analyzer';

// Função para obter dados do dia (usando dados oficiais da Marinha)
const getFullData = (dayOffset: number) => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + dayOffset);

    const day = baseDate.getDate();
    const month = baseDate.getMonth() + 1;
    const year = baseDate.getFullYear();

    // Debug: Log data request
    if (dayOffset === 0) {
        debugTideData(baseDate);
    }

    // Buscar dados oficiais
    let dayData = null;
    let dataSource = 'Dados simulados';
    // Tenta obter dados oficiais para a data solicitada
    const officialDay = getTidesForDate(baseDate);
    if (officialDay) {
        dayData = officialDay;
        dataSource = 'Marinha do Brasil';
    }

    // Log se não encontrou dados oficiais
    if (!dayData && dayOffset === 0) {
        console.warn('⚠️ [Tide Widget] Dados oficiais não encontrados para:', {
            day,
            month,
            year,
            usando: 'fallback simulado'
        });
    }

    // Separar marés altas e baixas
    const preiaMar: { hour: string; height: number }[] = [];
    const baixaMar: { hour: string; height: number }[] = [];

    if (dayData) {
        dayData.tides.forEach(tide => {
            if (isHighTide(tide.height)) {
                preiaMar.push({ hour: tide.time, height: tide.height });
            } else {
                baixaMar.push({ hour: tide.time, height: tide.height });
            }
        });
    } else {
        // Fallback para dados simulados se não houver dados oficiais
        preiaMar.push({ hour: '06:00', height: 2.3 }, { hour: '18:30', height: 2.4 });
        baixaMar.push({ hour: '00:15', height: 0.4 }, { hour: '12:15', height: 0.3 });
    }

    // Dados meteorológicos complementares (simulados)
    const weatherOptions = [
        { condition: 'Ensolarado', icon: Sun, temp: 32, clouds: 10, rain: 0 },
        { condition: 'Parcialmente Nublado', icon: CloudSun, temp: 30, clouds: 35, rain: 5 },
        { condition: 'Nublado', icon: Cloud, temp: 28, clouds: 60, rain: 20 },
    ];

    const weatherIdx = Math.abs(dayOffset) % weatherOptions.length;

    // Dados de vento (simulados com variação determinística baseada na data)
    const seed = day * 100 + month * 10 + Math.abs(dayOffset);
    const pseudoRandom = Math.abs(Math.sin(seed));
    const windSpeed = 15 + (pseudoRandom * 10); // 15-25 km/h
    const windDirection = 45 + (dayOffset * 15) % 360; // Varia com o dia
    const windSpeedMs = CONVERSIONS.kmh_to_ms(windSpeed);

    // Calcular próxima maré para determinar direção da corrente
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Encontrar próxima maré
    const allTides = [...preiaMar, ...baixaMar].sort((a, b) => {
        const [aH, aM] = a.hour.split(':').map(Number);
        const [bH, bM] = b.hour.split(':').map(Number);
        return (aH * 60 + aM) - (bH * 60 + bM);
    });

    const nextTide = allTides[0] || preiaMar[0];
    const nextTideType = preiaMar.some(t => t.hour === nextTide.hour) ? 'HIGH' : 'LOW';

    // Gerar dados de correnteza
    const coeficiente = 72; // Coeficiente médio (pode ser calibrado futuramente)
    const currentData = generateCurrentData(
        nextTide.height,
        coeficiente,
        currentTime,
        nextTide.hour,
        nextTideType as 'HIGH' | 'LOW'
    );

    // Calcular direção relativa do vento
    const windRelativeAngle = calculateRelativeAngle(windDirection);

    // Classificar condições baseado na corrente (mais importante que vento)
    const conditionClassification = classifyCondition(currentData.relative_angle_deg);

    // Calcular condição da água
    const waterCondition = calculateWaterSurface(windSpeedMs, windRelativeAngle);

    // Calcular impacto no pace
    const paceImpact = calculatePaceImpact(currentData.speed_m_s, currentData.relative_angle_deg);

    // Dados de condições de remo completos
    const rowingConditions: RowingConditionsData = {
        current: currentData,
        wind: {
            speed_m_s: windSpeedMs,
            direction_deg: windDirection,
            relative_angle_deg: windRelativeAngle,
            gusts_m_s: windSpeedMs * 1.3
        },
        condition_rating: conditionClassification.rating,
        condition_classification: conditionClassification,
        water_condition: waterCondition,
        pace_impact: paceImpact,
        timestamp: baseDate
    };

    // Calcular fase da lua (simplificado - baseado no dia do mês)
    const lunarCycle = 29.5; // dias
    const knownNewMoon = new Date(2025, 11, 1); // 1 de dezembro de 2025 (aprox lua nova)
    const daysSinceNewMoon = Math.floor((baseDate.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)) % lunarCycle;

    let moonPhase: { name: string; emoji: string; illumination: number; description: string };
    if (daysSinceNewMoon < 1) {
        moonPhase = { name: 'Lua Nova', emoji: '🌑', illumination: 0, description: 'Marés de amplitude mínima (maré morta). Correntes mais fracas.' };
    } else if (daysSinceNewMoon < 7) {
        moonPhase = { name: 'Lua Crescente', emoji: '🌒', illumination: Math.round((daysSinceNewMoon / 7) * 50), description: 'Marés aumentando gradualmente. Bom para treinos técnicos.' };
    } else if (daysSinceNewMoon < 8) {
        moonPhase = { name: 'Quarto Crescente', emoji: '🌓', illumination: 50, description: 'Marés de amplitude média. Correntes moderadas.' };
    } else if (daysSinceNewMoon < 14) {
        moonPhase = { name: 'Gibosa Crescente', emoji: '🌔', illumination: 50 + Math.round(((daysSinceNewMoon - 7) / 7) * 50), description: 'Marés aumentando. Prepare-se para correntes mais fortes.' };
    } else if (daysSinceNewMoon < 16) {
        moonPhase = { name: 'Lua Cheia', emoji: '🌕', illumination: 100, description: 'Marés de sizígia (amplitude máxima). Correntes fortes!' };
    } else if (daysSinceNewMoon < 22) {
        moonPhase = { name: 'Gibosa Minguante', emoji: '🌖', illumination: 100 - Math.round(((daysSinceNewMoon - 15) / 7) * 50), description: 'Marés diminuindo gradualmente.' };
    } else if (daysSinceNewMoon < 23) {
        moonPhase = { name: 'Quarto Minguante', emoji: '🌗', illumination: 50, description: 'Marés de amplitude média. Correntes moderadas.' };
    } else {
        moonPhase = { name: 'Lua Minguante', emoji: '🌘', illumination: Math.round((1 - (daysSinceNewMoon - 22) / 7) * 50), description: 'Marés reduzindo. Aproximando-se da lua nova.' };
    }

    return {
        date: baseDate,
        preiaMar,
        baixaMar,
        coeficiente,
        sunrise: '05:18',
        sunset: '17:45',
        weather: weatherOptions[weatherIdx],
        wind: {
            speed: Math.round(windSpeed),
            direction: degreesToCardinal(windDirection),
            gusts: Math.round(windSpeed * 1.3)
        },
        humidity: 75,
        source: dataSource,
        rowingConditions,
        moonPhase
    };
};

const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    return date.toLocaleDateString('pt-BR', options);
};

const getDateLabel = (offset: number): string => {
    if (offset === 0) return 'Hoje';
    if (offset === 1) return 'Amanhã';
    if (offset === -1) return 'Ontem';
    return '';
};

// Mapear condição climática para o tipo esperado
function mapWeatherCondition(condition: string): 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'heavy-rain' | 'thunderstorm' {
    const lower = condition.toLowerCase();
    if (lower.includes('ensolarado') || lower.includes('limpo')) return 'clear';
    if (lower.includes('parcial') || lower.includes('poucas nuvens')) return 'partly-cloudy';
    if (lower.includes('nublado')) return 'cloudy';
    if (lower.includes('tempestade') || lower.includes('trovoada')) return 'thunderstorm';
    if (lower.includes('chuva forte')) return 'heavy-rain';
    if (lower.includes('chuva')) return 'rain';
    return 'clear';
}


export function TideWidget({ className }: { className?: string }) {
    const [dayOffset, setDayOffset] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string>('07:00');

    const data = getFullData(dayOffset);
    const dateLabel = getDateLabel(dayOffset);
    const WeatherIcon = data.weather.icon;

    // IMPORTANTE: Usar a mesma classificação que é exibida nos detalhes para garantir consistência
    const conditionRating = data.rowingConditions.condition_rating;
    const isGoodForRowing = conditionRating === 'favorable';
    const isModerateForRowing = conditionRating === 'technical';

    // NOVO: Análise completa de horários viáveis
    const nextHighTide = data.preiaMar[0];
    const nextLowTide = data.baixaMar[0];

    // Criar datas completas para as marés
    const [highH, highM] = nextHighTide.hour.split(':').map(Number);
    const [lowH, lowM] = nextLowTide.hour.split(':').map(Number);

    const highTideDate = new Date(data.date);
    highTideDate.setHours(highH, highM, 0, 0);

    const lowTideDate = new Date(data.date);
    lowTideDate.setHours(lowH, lowM, 0, 0);

    // Calcular amplitude (diferença entre preamar e baixamar)
    const amplitude = (nextHighTide.height - nextLowTide.height) * 100; // converter para cm

    const rowingAnalysis = analyzeRowingConditions({
        currentDate: data.date,
        tideData: {
            nextHighTide: highTideDate,
            nextLowTide: lowTideDate,
            amplitude: amplitude
        },
        weatherData: {
            windSpeed: data.wind.speed,
            windDirection: data.rowingConditions.wind.direction_deg,
            waveHeight: 0.3,
            precipitation: 0,
            condition: mapWeatherCondition(data.weather.condition)
        }
    });

    const currentTime = new Date();
    const currentSlot = dayOffset === 0 ? findCurrentSlot(currentTime, rowingAnalysis) : null;

    // Análise do horário selecionado (para seção Detalhes)
    const selectedPeriod = (selectedTime >= '05:00' && selectedTime <= '09:00') ? 'morning' as const : 'afternoon' as const;
    const selectedSlotAnalysis = analyzeSlot(selectedTime, selectedPeriod, {
        currentDate: data.date,
        tideData: {
            nextHighTide: highTideDate,
            nextLowTide: lowTideDate,
            amplitude: amplitude
        },
        weatherData: {
            windSpeed: data.wind.speed,
            windDirection: data.rowingConditions.wind.direction_deg,
            waveHeight: 0.3,
            precipitation: 0,
            condition: mapWeatherCondition(data.weather.condition)
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn('relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10', className)}
        >
            {/* Animated Wave Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent" />
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-32"
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <svg viewBox="0 0 1200 120" className="w-full h-full">
                        <path
                            d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z"
                            fill="rgba(59, 130, 246, 0.3)"
                        />
                    </svg>
                </motion.div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Waves className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                            Condições Náuticas
                        </span>
                        <p className="text-[10px] text-white/40">Rio Potengi - Natal/RN</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Data Source Badge */}
                    <div className={cn(
                        "px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider",
                        data.source === 'Marinha do Brasil'
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    )}>
                        {data.source === 'Marinha do Brasil' ? '✓ Oficial' : '⚠ Simulado'}
                    </div>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-3 py-1.5 text-[10px] text-white font-bold uppercase tracking-wider bg-club-red/80 hover:bg-club-red rounded-lg transition-all hover:scale-105"
                    >
                        {showDetails ? 'Resumo' : 'Detalhes'}
                    </button>
                </div>
            </div>

            {/* Date Navigation */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-sm border-b border-white/5">
                <button
                    onClick={() => setDayOffset(prev => Math.max(prev - 1, -4))}
                    disabled={dayOffset <= -4}
                    className={cn(
                        "p-2 rounded-lg transition-all",
                        dayOffset <= -4
                            ? "text-white/20 cursor-not-allowed"
                            : "text-white/60 hover:bg-white/10 hover:text-white hover:scale-110"
                    )}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center">
                    {dateLabel && (
                        <span className="block text-xs font-bold text-club-red uppercase tracking-wider">
                            {dateLabel}
                        </span>
                    )}
                    <span className="text-sm font-semibold text-white capitalize">
                        {formatDate(data.date)}
                    </span>
                </div>

                <button
                    onClick={() => setDayOffset(prev => Math.min(prev + 1, 4))}
                    disabled={dayOffset >= 4}
                    className={cn(
                        "p-2 rounded-lg transition-all",
                        dayOffset >= 4
                            ? "text-white/20 cursor-not-allowed"
                            : "text-white/60 hover:bg-white/10 hover:text-white hover:scale-110"
                    )}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Coordenadas do Sport Club */}
            <div className="relative z-10 px-4 py-2 bg-black/20 border-b border-white/10">
                <p className="text-[10px] text-white/50 text-center leading-relaxed">
                    Sport Club de Natal: Latitude 5°46&apos;31 S • Longitude 35°12&apos;22 W • Fuso UTC -03:00h
                </p>
            </div>

            {/* Main Content */}
            <div className="relative z-10 p-4">
                <AnimatePresence mode="wait">
                    {!showDetails ? (
                        /* RESUMO */
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {/* Clima Atual */}
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            <WeatherIcon className="w-12 h-12 text-yellow-400" />
                                        </motion.div>
                                        <div>
                                            <p className="text-xl font-bold text-white">{data.weather.temp}°C</p>
                                            <p className="text-xs text-white/60">{data.weather.condition}</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Droplets className="w-4 h-4 text-blue-300" />
                                            <span className="text-sm text-white">{data.humidity}%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Cloud className="w-4 h-4 text-gray-300" />
                                            <span className="text-sm text-white">{data.weather.clouds}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ventos */}
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-4 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-12 h-12 rounded-full bg-cyan-500/30 flex items-center justify-center"
                                        >
                                            <Wind className="w-6 h-6 text-cyan-300" />
                                        </motion.div>
                                        <div>
                                            <p className="text-xs text-white/60 uppercase">Vento</p>
                                            <p className="text-2xl font-bold text-white">{data.wind.speed} <span className="text-sm">km/h</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Navigation className="w-4 h-4 text-cyan-300" />
                                            <span className="text-lg font-bold text-white">{data.wind.direction}</span>
                                        </div>
                                        <p className="text-xs text-white/50">Rajadas {data.wind.gusts}km/h</p>
                                    </div>
                                </div>
                            </div>

                            {/* Todas as Marés do Dia - Grid */}
                            <div className="space-y-3">
                                {/* Marés Cheias */}
                                <div>
                                    <p className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                                        <ArrowUp className="w-4 h-4" />
                                        Maré Cheia
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {data.preiaMar.map((t, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                className="rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 p-3 border border-blue-400/30"
                                            >
                                                <p className="text-xl font-bold text-white">{t.hour}</p>
                                                <p className="text-sm text-blue-300">{t.height.toFixed(1)}m</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Marés Baixas */}
                                <div>
                                    <p className="text-[10px] text-orange-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-2">
                                        <ArrowDown className="w-4 h-4" />
                                        Maré Baixa
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {data.baixaMar.map((t, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                className="rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/30 p-3 border border-orange-400/30"
                                            >
                                                <p className="text-xl font-bold text-white">{t.hour}</p>
                                                <p className="text-sm text-orange-300">{t.height.toFixed(1)}m</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* NOVO: Condições para Remo por Horários Viáveis */}
                            <div className="space-y-3">
                                {/* Melhor Horário */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/40"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">⭐</span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                                            Melhor Horário Hoje
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">🕐</span>
                                            <span className="text-xl font-bold text-white">
                                                {rowingAnalysis.bestTime.slot.startTime} - {rowingAnalysis.bestTime.slot.endTime}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "text-xs font-bold uppercase px-3 py-1 rounded-lg border",
                                            rowingAnalysis.bestTime.slot.classification === 'EXCELENTE' && "bg-green-500/30 text-green-300 border-green-500/50",
                                            rowingAnalysis.bestTime.slot.classification === 'BOA' && "bg-blue-500/30 text-blue-300 border-blue-500/50",
                                            rowingAnalysis.bestTime.slot.classification === 'MODERADA' && "bg-yellow-500/30 text-yellow-300 border-yellow-500/50",
                                            rowingAnalysis.bestTime.slot.classification === 'DIFÍCIL' && "bg-orange-500/30 text-orange-300 border-orange-500/50",
                                            rowingAnalysis.bestTime.slot.classification === 'PERIGOSA' && "bg-red-500/30 text-red-300 border-red-500/50"
                                        )}>
                                            {rowingAnalysis.bestTime.slot.classification}
                                        </span>
                                    </div>
                                    <ul className="text-[10px] text-white/70 space-y-1 ml-6">
                                        <li>• {rowingAnalysis.bestTime.slot.tideFactors.departurePhase}</li>
                                        <li>• {rowingAnalysis.bestTime.reason}</li>
                                        <li>• Término: {rowingAnalysis.bestTime.slot.endTime} ({rowingAnalysis.bestTime.slot.environmentFactors.sunIntensity} intensidade solar)</li>
                                    </ul>
                                </motion.div>

                                {/* Condição Atual (se aplicável) */}
                                {currentSlot && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xl">🕐</span>
                                            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                                                Agora ({currentTime.getHours().toString().padStart(2, '0')}:{currentTime.getMinutes().toString().padStart(2, '0')})
                                            </span>
                                            <span className={cn(
                                                "text-xs font-bold uppercase px-2 py-1 rounded border ml-auto",
                                                currentSlot.classification === 'EXCELENTE' && "bg-green-500/30 text-green-300 border-green-500/50",
                                                currentSlot.classification === 'BOA' && "bg-blue-500/30 text-blue-300 border-blue-500/50",
                                                currentSlot.classification === 'MODERADA' && "bg-yellow-500/30 text-yellow-300 border-yellow-500/50",
                                                currentSlot.classification === 'DIFÍCIL' && "bg-orange-500/30 text-orange-300 border-orange-500/50",
                                                currentSlot.classification === 'PERIGOSA' && "bg-red-500/30 text-red-300 border-red-500/50"
                                            )}>
                                                {currentSlot.classification}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-white/60">
                                            {currentSlot.recommendation}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        /* DETALHES - SELETOR DE HORÁRIO DINÂMICO */
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            {/* Seletor de Horário */}
                            <TimeSlotSelector
                                selectedTime={selectedTime}
                                onTimeChange={setSelectedTime}
                            />

                            {/* Condições do Horário Selecionado */}
                            <ConditionsDisplay slot={selectedSlotAnalysis} />

                            {/* Botão Mais Informações - Abre Nova Página */}
                            <Link
                                href={`/tides-weather?day=${dayOffset}&time=${selectedTime}`}
                                className="w-full px-4 py-3 text-sm font-bold uppercase tracking-wider bg-club-red/80 hover:bg-club-red text-white rounded-lg border border-club-red/50 transition-all flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Mais Informações
                            </Link>

                            {/* Seção Mais Informações (Tabela + Dados Extras) */}
                            {showMoreInfo && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4"
                                >
                                    {/* Tabela de Todos os Horários */}
                                    <SlotsTable
                                        morning={rowingAnalysis.morningSlots}
                                        afternoon={rowingAnalysis.afternoonSlots}
                                    />

                                    {/* Informações Extras */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Lua */}
                                        <div className="rounded-xl bg-purple-500/20 p-3 border border-purple-400/30">
                                            <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-2">Fase da Lua</p>
                                            <p className="text-2xl">{data.moonPhase.emoji}</p>
                                            <p className="text-sm text-white/70">{data.moonPhase.name}</p>
                                        </div>

                                        {/* Sol */}
                                        <div className="rounded-xl bg-yellow-500/20 p-3 border border-yellow-400/30">
                                            <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-2">Sol</p>
                                            <p className="text-sm text-white/70">☀️ {data.sunrise}</p>
                                            <p className="text-sm text-white/70">🌙 {data.sunset}</p>
                                        </div>

                                        {/* Coeficiente */}
                                        <div className="rounded-xl bg-blue-500/20 p-3 border border-blue-400/30 col-span-2">
                                            <p className="text-xs text-white/60 uppercase tracking-wider font-bold mb-2">Coeficiente de Maré</p>
                                            <p className="text-xl font-bold text-white">{data.coeficiente}</p>
                                            <p className="text-xs text-white/50">Amplitude: {amplitude.toFixed(0)}cm ({rowingAnalysis.tideInfo.tideType})</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navegação de Dias */}
                <div className="flex items-center justify-between gap-2 mt-4">
                    <button
                        onClick={() => setDayOffset(dayOffset - 1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                    </button>
                    <button
                        onClick={() => setDayOffset(dayOffset + 1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-all"
                    >
                        Próximo
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Fonte */}
                <p className="text-[9px] text-white/30 text-center mt-4 leading-relaxed">
                    Fonte: {data.source}
                </p>
            </div>
        </motion.div>
    );
}
