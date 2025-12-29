'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Waves, Dumbbell, Play, Timer, Loader2, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function StartWorkoutPage() {
    const router = useRouter();
    const [selectedMode, setSelectedMode] = useState<'OUTDOOR' | 'INDOOR_TANK' | 'INDOOR_GENERAL' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStart = async () => {
        if (!selectedMode) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/workouts/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: selectedMode })
            });

            if (response.ok) {
                const data = await response.json();
                router.push(`/training/live?sessionId=${data.sessionId || data.session?.id}&type=${selectedMode}`);
            } else {
                // Fallback: ir direto para a página live sem sessão
                console.warn('API retornou erro, usando fallback');
                router.push(`/training/live?type=${selectedMode.toLowerCase()}`);
            }
        } catch (error) {
            console.error('Error starting workout:', error);
            // Fallback: ir direto para a página live
            router.push(`/training/live?type=${selectedMode.toLowerCase()}`);
        }
    };

    const modes = [
        {
            id: 'OUTDOOR' as const,
            title: 'Treino no Rio',
            description: 'Remo na água com GPS tracking',
            icon: Waves,
            color: 'from-blue-600 to-cyan-600',
            duration: '45-90 min'
        },
        {
            id: 'INDOOR_TANK' as const,
            title: 'Tanque de Remo',
            description: 'Treino no tanque indoor do clube',
            icon: Timer,
            color: 'from-purple-600 to-pink-600',
            duration: '30-60 min'
        },
        {
            id: 'INDOOR_GENERAL' as const,
            title: 'Musculação / Ergômetro',
            description: 'Remoergômetro ou treino físico',
            icon: Dumbbell,
            color: 'from-orange-600 to-red-600',
            duration: '45-60 min'
        }
    ];

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Iniciar Treino"
                subtitle="Escolha o tipo"
                description="Selecione onde você vai treinar hoje"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                <div className="space-y-4 mb-8">
                    {modes.map((mode, index) => {
                        const Icon = mode.icon;
                        const isSelected = selectedMode === mode.id;

                        return (
                            <motion.button
                                key={mode.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedMode(mode.id)}
                                className="w-full text-left"
                            >
                                <AnimatedCard
                                    variant={isSelected ? 'gradient' : 'glass'}
                                    className={`p-6 transition-all ${isSelected ? 'ring-2 ring-club-red' : ''}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                {mode.title}
                                            </h3>
                                            <p className="text-sm text-white/60 mb-2">
                                                {mode.description}
                                            </p>
                                            <span className="text-xs text-white/40 flex items-center gap-1">
                                                <Timer className="w-3 h-3" /> {mode.duration}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-8 h-8 rounded-full bg-club-red flex items-center justify-center"
                                            >
                                                <Play className="w-4 h-4 text-white fill-white" />
                                            </motion.div>
                                        )}
                                    </div>
                                </AnimatedCard>
                            </motion.button>
                        );
                    })}
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <Button
                    onClick={handleStart}
                    disabled={!selectedMode || isLoading}
                    className="w-full bg-club-red hover:bg-club-red/90 h-14 gap-2 text-lg font-bold"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Preparando...
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 fill-white" />
                            Começar Treino
                        </>
                    )}
                </Button>

                <p className="text-center text-white/40 text-xs mt-4">
                    Certifique-se de estar aquecido antes de iniciar o treino
                </p>
            </div>
        </div>
    );
}
