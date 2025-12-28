'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Exercise {
    id: string;
    name: string;
    duration: number;
    description: string;
    focusAreas: string[];
}

const COOLDOWN_EXERCISES: Exercise[] = [
    {
        id: '1',
        name: 'Alongamento de Ombros',
        duration: 30,
        description: 'Cruze o braço na frente do corpo e puxe com o outro braço. Mantenha 30s cada lado.',
        focusAreas: ['Ombros', 'Deltoides']
    },
    {
        id: '2',
        name: 'Alongamento de Costas',
        duration: 45,
        description: 'Sentado, gire o tronco para um lado segurando o joelho oposto. 30s cada lado.',
        focusAreas: ['Lombar', 'Oblíquos']
    },
    {
        id: '3',
        name: 'Alongamento de Quadríceps',
        duration: 30,
        description: 'Em pé, segure o pé atrás e puxe em direção ao glúteo. 30s cada perna.',
        focusAreas: ['Quadríceps', 'Flexores do Quadril']
    },
    {
        id: '4',
        name: 'Alongamento de Posterior',
        duration: 45,
        description: 'Sentado com pernas estendidas, alcance os pés mantendo as costas retas.',
        focusAreas: ['Isquiotibiais', 'Lombar']
    },
    {
        id: '5',
        name: 'Alongamento de Braços',
        duration: 30,
        description: 'Estenda o braço à frente e puxe os dedos para baixo. 30s cada braço.',
        focusAreas: ['Antebraços', 'Punhos']
    },
    {
        id: '6',
        name: 'Respiração Profunda',
        duration: 60,
        description: 'Inspire profundamente pelo nariz (4s), segure (4s), expire pela boca (6s). Repita 5x.',
        focusAreas: ['Recuperação', 'Relaxamento']
    }
];

export default function CooldownPage() {
    const [currentExercise, setCurrentExercise] = useState(0);
    const [timeLeft, setTimeLeft] = useState(COOLDOWN_EXERCISES[0].duration);
    const [isRunning, setIsRunning] = useState(false);
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        // Auto-avançar
                        if (currentExercise < COOLDOWN_EXERCISES.length - 1) {
                            setTimeout(() => {
                                handleNext();
                            }, 1000);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, currentExercise]);

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);

    const handleComplete = () => {
        const newCompleted = new Set(completed);
        newCompleted.add(COOLDOWN_EXERCISES[currentExercise].id);
        setCompleted(newCompleted);
        setIsRunning(false);
    };

    const handleNext = () => {
        if (currentExercise < COOLDOWN_EXERCISES.length - 1) {
            setCurrentExercise(prev => prev + 1);
            setTimeLeft(COOLDOWN_EXERCISES[currentExercise + 1].duration);
            setIsRunning(false);
        }
    };

    const handlePrevious = () => {
        if (currentExercise > 0) {
            setCurrentExercise(prev => prev - 1);
            setTimeLeft(COOLDOWN_EXERCISES[currentExercise - 1].duration);
            setIsRunning(false);
        }
    };

    const exercise = COOLDOWN_EXERCISES[currentExercise];
    const progress = ((currentExercise + 1) / COOLDOWN_EXERCISES.length) * 100;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Alongamento"
                subtitle="Cool Down"
                description="Recupere seus músculos após o treino"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/60">
                            Exercício {currentExercise + 1} de {COOLDOWN_EXERCISES.length}
                        </span>
                        <span className="text-sm text-white/60">
                            {Math.round(progress)}% completo
                        </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Exercício Atual */}
                <AnimatedCard variant="gradient" className="p-6 mb-6">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {exercise.name}
                        </h2>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            {exercise.focusAreas.map(area => (
                                <Badge key={area} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                    {area}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="text-center mb-6">
                        <div className="text-6xl font-bold text-white mb-2">
                            {timeLeft}s
                        </div>
                    </div>

                    {/* Descrição */}
                    <p className="text-white/80 text-center mb-6">
                        {exercise.description}
                    </p>

                    {/* Controles */}
                    <div className="flex gap-3">
                        {!isRunning ? (
                            <Button
                                onClick={handleStart}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12"
                            >
                                <Clock className="w-5 h-5 mr-2" />
                                Iniciar
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePause}
                                variant="outline"
                                className="flex-1 h-12"
                            >
                                Pausar
                            </Button>
                        )}
                        <Button
                            onClick={handleComplete}
                            variant="outline"
                            className="flex-1 h-12"
                        >
                            <Check className="w-5 h-5 mr-2" />
                            Concluir
                        </Button>
                    </div>
                </AnimatedCard>

                {/* Navegação */}
                <div className="flex gap-3 mb-6">
                    <Button
                        onClick={handlePrevious}
                        disabled={currentExercise === 0}
                        variant="outline"
                        className="flex-1"
                    >
                        Anterior
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={currentExercise === COOLDOWN_EXERCISES.length - 1}
                        variant="outline"
                        className="flex-1"
                    >
                        Próximo
                    </Button>
                </div>

                {/* Lista de Exercícios */}
                <div className="space-y-2">
                    {COOLDOWN_EXERCISES.map((ex, i) => (
                        <button
                            key={ex.id}
                            onClick={() => {
                                setCurrentExercise(i);
                                setTimeLeft(ex.duration);
                                setIsRunning(false);
                            }}
                            className="w-full text-left"
                        >
                            <AnimatedCard
                                variant="glass"
                                className={`p-3 transition-all ${i === currentExercise ? 'ring-2 ring-emerald-500' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed.has(ex.id)
                                                ? 'bg-emerald-500'
                                                : 'bg-white/10'
                                            }`}>
                                            {completed.has(ex.id) ? (
                                                <Check className="w-5 h-5 text-white" />
                                            ) : (
                                                <span className="text-white text-sm">{i + 1}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{ex.name}</p>
                                            <p className="text-white/40 text-xs">{ex.duration}s</p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
