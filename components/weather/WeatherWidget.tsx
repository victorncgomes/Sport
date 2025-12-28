'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Sun, Cloud, CloudRain, Wind, Droplets, Eye, Gauge } from 'lucide-react';
import type { WeatherCurrent } from '@/types/tides';

interface WeatherWidgetProps {
    weather: WeatherCurrent;
}

// Weather icon mapper
const getWeatherIcon = (condition: string) => {
    switch (condition) {
        case 'clear': return <Sun className="h-16 w-16 text-yellow-400" />;
        case 'partly-cloudy': return <Cloud className="h-16 w-16 text-gray-300" />;
        case 'cloudy':
        case 'overcast': return <Cloud className="h-16 w-16 text-gray-400" />;
        case 'rain':
        case 'drizzle': return <CloudRain className="h-16 w-16 text-blue-400" />;
        default: return <Sun className="h-16 w-16 text-yellow-400" />;
    }
};

const MetricCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: string;
    color?: string;
}> = ({ icon: Icon, label, value, color = 'text-gray-400' }) => (
    <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/10">
            <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div className="flex-1">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-white font-semibold">{value}</p>
        </div>
    </div>
);

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
    return (
        <AnimatedCard variant="glass" hover="glow">
            {/* Header */}
            <div className="text-center mb-6">
                <motion.div
                    className="inline-block mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    {getWeatherIcon(weather.condition)}
                </motion.div>

                <motion.div
                    className="text-6xl font-display text-white mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {Math.round(weather.temperature)}°C
                </motion.div>

                <p className="text-gray-400 text-lg mb-1">{weather.conditionText}</p>
                <p className="text-sm text-gray-500">
                    Sensação de {Math.round(weather.feelsLike)}°C
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                <MetricCard
                    icon={Droplets}
                    label="Umidade"
                    value={`${weather.humidity}%`}
                    color="text-blue-400"
                />
                <MetricCard
                    icon={Wind}
                    label="Vento"
                    value={`${Math.round(weather.windSpeed)} km/h ${weather.windDirection}`}
                    color="text-cyan-400"
                />
                <MetricCard
                    icon={Eye}
                    label="Visibilidade"
                    value={`${(weather.visibility / 1000).toFixed(1)} km`}
                    color="text-purple-400"
                />
                <MetricCard
                    icon={Gauge}
                    label="Pressão"
                    value={`${weather.pressure} hPa`}
                    color="text-orange-400"
                />
            </div>

            {/* UV Index */}
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-yellow-400" />
                        <span className="text-sm text-white">Índice UV</span>
                    </div>
                    <span className="font-display text-2xl text-white">{weather.uvIndex}</span>
                </div>
                <p className="text-xs text-yellow-400 mt-1">
                    {weather.uvIndex <= 2 && 'Baixo'}
                    {weather.uvIndex > 2 && weather.uvIndex <= 5 && 'Moderado'}
                    {weather.uvIndex > 5 && weather.uvIndex <= 7 && 'Alto'}
                    {weather.uvIndex > 7 && weather.uvIndex <= 10 && 'Muito Alto'}
                    {weather.uvIndex > 10 && 'Extremo'}
                </p>
            </div>
        </AnimatedCard>
    );
};
