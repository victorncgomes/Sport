'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Waves, Dumbbell, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StartWorkoutPage() {
    const router = useRouter();
    const [selectedMode, setSelectedMode] = useState<'OUTDOOR' | 'INDOOR_TANK' | 'INDOOR_GENERAL' | null>(null);

    const handleStart = async () => {
        if (!selectedMode) return;

        try {
            const response = await fetch('/api/workouts/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: selectedMode })
            });

            if (response.ok) {
                const { session } = await response.json();
                router.push(`/training/live?sessionId=${session.id}`);
            }
        } catch (error) {
            console.error('Error starting workout:', error);
        }
    };

    const modes = [
        {
            id: 'OUTDOOR' as const,
            title: 'Treino Outdoor',
            description: 'Remo no Rio Potengi com GPS tracking',
            icon: Waves,
            color: 'from-blue-600 to-cyan-600'
        },
        {
            id: 'INDOOR_TANK' as const,
            title: 'Tanque de Remo',
            description: 'Treino no tanque indoor do clube',
            icon: Dumbbell,
            color: 'from-purple-600 to-pink-600'
        },
        {
            id: 'INDOOR_GENERAL' as const,
            title: 'Treino Indoor Geral',
            description: 'Remoergômetro ou treino físico',
            icon: Dumbbell,
            color: 'from-orange-600 to-red-600'
        }
    ];

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Iniciar Treino"
                subtitle="Escolha o tipo de treino"
                description="Selecione onde você vai treinar hoje"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                <div className="space-y-4 mb-8">
                    {modes.map((mode) => {
                        const Icon = mode.icon;
                        const isSelected = selectedMode === mode.id;

                        return (
                            <button
                                key={mode.id}
                                onClick={() => setSelectedMode(mode.id)}
                                className="w-full text-left"
                            >
                                <AnimatedCard
                                    variant={isSelected ? 'gradient' : 'glass'}
                                    className={`p-6 transition-all ${isSelected ? 'ring-2 ring-club-red' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                {mode.title}
                                            </h3>
                                            <p className="text-sm text-white/60">
                                                {mode.description}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full bg-club-red flex items-center justify-center">
                                                <Play className="w-3 h-3 text-white fill-white" />
                                            </div>
                                        )}
                                    </div>
                                </AnimatedCard>
                            </button>
                        );
                    })}
                </div>

                <Button
                    onClick={handleStart}
                    disabled={!selectedMode}
                    className="w-full bg-club-red hover:bg-club-red/90 h-12 gap-2"
                >
                    <Play className="w-5 h-5 fill-white" />
                    Começar Treino
                </Button>
            </div>
        </div>
    );
}
