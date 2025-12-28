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
    reps?: number;
    description: string;
    focusAreas: string[];
}

const WARMUP_EXERCISES: Exercise[] = [
    {
        id: '1',
        name: 'Prancha',
        duration: 30,
        description: 'Mantenha o corpo reto, apoiado nos antebraços e pontas dos pés',
        focusAreas: ['Core', 'Ombros']
    },
    {
        id: '2',
        name: 'Bird Dog',
        reps: 10,
        duration: 60,
        description: 'Alterne braço direito + perna esquerda, depois braço esquerdo + perna direita',
        focusAreas: ['Core', 'Equilíbrio']
    },
    {
        id: '3',
        name: 'Dead Bug',
        reps: 10,
        duration: 60,
        description: 'Deitado, alterne braços e pernas opostos mantendo lombar no chão',
        focusAreas: ['Core', 'Coordenação']
    },
    {
        id: '4',
        name: 'Rotação de Tronco',
        reps: 10,
        duration: 45,
        description: 'Sentado, gire o tronco para cada lado mantendo quadril fixo',
        focusAreas: ['Core', 'Mobilidade']
    },
    {
        id: '5',
        name: 'Agachamento',
        reps: 15,
        duration: 60,
        description: 'Desça até 90 graus mantendo joelhos alinhados com os pés',
        focusAreas: ['Pernas', 'Glúteos']
    }
];

export default function WarmupPage() {
    const [currentExercise, setCurrentExercise] = useState(0);
    const [timeLeft, setTimeLeft] = useState(WARMUP_EXERCISES[0].duration);
    const [isRunning, setIsRunning] = useState(false);
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        // Auto-avançar para próximo exercício
                        if (currentExercise < WARMUP_EXERCISES.length - 1) {
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

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleComplete = () => {
        const newCompleted = new Set(completed);
        newCompleted.add(WARMUP_EXERCISES[currentExercise].id);
        setCompleted(newCompleted);
        setIsRunning(false);
    };

    const handleNext = () => {
        if (currentExercise < WARMUP_EXERCISES.length - 1) {
            setCurrentExercise(prev => prev + 1);
            setTimeLeft(WARMUP_EXERCISES[currentExercise + 1].duration);
            setIsRunning(false);
        }
    };

    const handlePrevious = () => {
        if (currentExercise > 0) {
            setCurrentExercise(prev => prev - 1);
            setTimeLeft(WARMUP_EXERCISES[currentExercise - 1].duration);
            setIsRunning(false);
        }
    };

    const exercise = WARMUP_EXERCISES[currentExercise];
    const progress = ((currentExercise + 1) / WARMUP_EXERCISES.length) * 100;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Aquecimento"
                subtitle="Core Activation"
                description="Prepare seu corpo para o treino"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/60">
                            Exercício {currentExercise + 1} de {WARMUP_EXERCISES.length}
                        </span>
                        <span className="text-sm text-white/60">
                            {Math.round(progress)}% completo
                        </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-club-red"
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
                                <Badge key={area} className="bg-white/10 text-white/80 border-white/20">
                                    {area}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="text-center mb-6">
                        <div className="text-6xl font-bold text-white mb-2">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </div>
                        {exercise.reps && (
                            <p className="text-white/60">
                                {exercise.reps} repetições
                            </p>
                        )}
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
                                className="flex-1 bg-club-red hover:bg-club-red/90 h-12"
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
                        disabled={currentExercise === WARMUP_EXERCISES.length - 1}
                        variant="outline"
                        className="flex-1"
                    >
                        Próximo
                    </Button>
                </div>

                {/* Lista de Exercícios */}
                <div className="space-y-2">
                    {WARMUP_EXERCISES.map((ex, i) => (
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
                                className={`p-3 transition-all ${i === currentExercise ? 'ring-2 ring-club-red' : ''
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
                                            <p className="text-white/40 text-xs">
                                                {ex.reps ? `${ex.reps} reps` : `${ex.duration}s`}
                                            </p>
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
