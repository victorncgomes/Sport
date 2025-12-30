'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Play, Clock, Heart, Leaf, Wind, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Exercise {
    id: string;
    name: string;
    description: string;
    duration: number;
    tips: string[];
    muscleGroups: string[];
}

interface StretchLevel {
    id: 'basic' | 'moderate' | 'deep';
    title: string;
    subtitle: string;
    description: string;
    duration: number;
    color: string;
    icon: typeof Heart;
    exercises: Exercise[];
}

// Programas de alongamento para remadores baseados em ciência do esporte
const stretchLevels: StretchLevel[] = [
    {
        id: 'basic',
        title: 'Básico',
        subtitle: 'Relaxamento Leve',
        description: 'Alongamentos suaves para recuperação rápida. Ideal após treinos leves.',
        duration: 5,
        color: 'from-teal-600 to-cyan-600',
        icon: Leaf,
        exercises: [
            {
                id: 'neck-stretch',
                name: 'Alongamento de Pescoço',
                description: 'Incline a cabeça suavemente para cada lado, mantendo os ombros relaxados.',
                duration: 30,
                tips: ['Não force o movimento', 'Respire profundamente', 'Mantenha 15s cada lado'],
                muscleGroups: ['Pescoço', 'Trapézio']
            },
            {
                id: 'shoulder-roll',
                name: 'Rotação de Ombros',
                description: 'Gire os ombros para frente e depois para trás em movimentos amplos.',
                duration: 30,
                tips: ['Movimentos lentos e controlados', '10 rotações para cada direção'],
                muscleGroups: ['Ombros', 'Trapézio Superior']
            },
            {
                id: 'wrist-circles',
                name: 'Círculos de Punho',
                description: 'Gire os punhos lentamente em ambas as direções.',
                duration: 30,
                tips: ['Importante para remadores', 'Faça 10 círculos cada direção'],
                muscleGroups: ['Antebraço', 'Punho']
            },
            {
                id: 'standing-quad',
                name: 'Quadríceps em Pé',
                description: 'Em pé, puxe um pé em direção ao glúteo, mantendo joelhos juntos.',
                duration: 40,
                tips: ['Use parede para equilíbrio', '20s cada perna'],
                muscleGroups: ['Quadríceps', 'Flexor do Quadril']
            },
            {
                id: 'calf-stretch',
                name: 'Alongamento de Panturrilha',
                description: 'Com as mãos na parede, estenda uma perna para trás mantendo o calcanhar no chão.',
                duration: 40,
                tips: ['Mantenha a perna de trás reta', '20s cada perna'],
                muscleGroups: ['Panturrilha', 'Tendão de Aquiles']
            }
        ]
    },
    {
        id: 'moderate',
        title: 'Moderado',
        subtitle: 'Recuperação Ativa',
        description: 'Alongamentos mais profundos para recuperação muscular completa.',
        duration: 10,
        color: 'from-emerald-600 to-green-600',
        icon: Wind,
        exercises: [
            {
                id: 'seated-forward',
                name: 'Flexão Sentado',
                description: 'Sentado com pernas estendidas, incline o tronco em direção aos pés.',
                duration: 45,
                tips: ['Mantenha a coluna alongada', 'Respire e relaxe gradualmente', 'Não force a posição'],
                muscleGroups: ['Isquiotibiais', 'Lombar']
            },
            {
                id: 'figure-four',
                name: 'Figura Quatro',
                description: 'Deitado, cruze um tornozelo sobre o joelho oposto e puxe em direção ao peito.',
                duration: 50,
                tips: ['Alonga piriforme profundamente', '25s cada lado'],
                muscleGroups: ['Piriforme', 'Glúteos', 'Quadril']
            },
            {
                id: 'lat-stretch',
                name: 'Alongamento Lateral',
                description: 'Com braço estendido sobre a cabeça, incline o tronco lateralmente.',
                duration: 40,
                tips: ['Essencial para remadores', 'Sinta o alongamento nas costas', '20s cada lado'],
                muscleGroups: ['Latíssimo', 'Oblíquos', 'Intercostais']
            },
            {
                id: 'hip-flexor',
                name: 'Flexor do Quadril',
                description: 'Em posição de afundo, afunde o quadril para frente sentindo o alongamento.',
                duration: 50,
                tips: ['Mantenha o tronco ereto', 'Contrabalança a posição sentada', '25s cada lado'],
                muscleGroups: ['Iliopsoas', 'Quadríceps', 'Quadril']
            },
            {
                id: 'thoracic-rotation',
                name: 'Rotação Torácica',
                description: 'Em quatro apoios, coloque uma mão na nuca e gire o tronco para cima.',
                duration: 45,
                tips: ['Fundamental para a remada', 'Olhe para cima ao girar'],
                muscleGroups: ['Coluna Torácica', 'Oblíquos']
            },
            {
                id: 'child-pose',
                name: 'Posição da Criança',
                description: 'Ajoelhado, sente nos calcanhares e estenda os braços à frente no chão.',
                duration: 60,
                tips: ['Relaxe completamente', 'Respire profundamente'],
                muscleGroups: ['Lombar', 'Latíssimo', 'Ombros']
            }
        ]
    },
    {
        id: 'deep',
        title: 'Profundo',
        subtitle: 'Recuperação Completa',
        description: 'Programa completo para alongamento profundo e prevenção de lesões.',
        duration: 15,
        color: 'from-purple-600 to-indigo-600',
        icon: Heart,
        exercises: [
            {
                id: 'world-greatest',
                name: 'O Maior Alongamento',
                description: 'Afundo com rotação torácica: uma das melhores mobilidades para remadores.',
                duration: 60,
                tips: ['Combina múltiplos alongamentos', 'Mantenha 30s cada lado', 'Respire profundamente'],
                muscleGroups: ['Quadril', 'Torácica', 'Isquiotibiais']
            },
            {
                id: 'pigeon-pose',
                name: 'Pomba',
                description: 'Uma perna dobrada à frente, outra estendida atrás, incline o tronco.',
                duration: 70,
                tips: ['Alongamento profundo de glúteos', 'Use apoio se necessário', '35s cada lado'],
                muscleGroups: ['Piriforme', 'Glúteos', 'Quadril']
            },
            {
                id: 'seated-twist',
                name: 'Torção Sentado',
                description: 'Sentado, cruze uma perna e gire o tronco na direção oposta.',
                duration: 50,
                tips: ['Mantém a coluna longa', 'Olhe por cima do ombro', '25s cada lado'],
                muscleGroups: ['Coluna', 'Oblíquos', 'Glúteos']
            },
            {
                id: 'supine-twist',
                name: 'Torção Supina',
                description: 'Deitado de costas, deixe os joelhos caírem para um lado com braços abertos.',
                duration: 60,
                tips: ['Relaxe completamente', 'Ombros no chão', '30s cada lado'],
                muscleGroups: ['Lombar', 'Oblíquos', 'Peito']
            },
            {
                id: 'frog-stretch',
                name: 'Sapo',
                description: 'Em quatro apoios, afaste os joelhos e sente para trás mantendo coluna neutra.',
                duration: 60,
                tips: ['Alongamento intenso de adutores', 'Vá devagar'],
                muscleGroups: ['Adutores', 'Quadril']
            },
            {
                id: 'happy-baby',
                name: 'Bebê Feliz',
                description: 'Deitado, segure os pés com as mãos mantendo joelhos dobrados e abertos.',
                duration: 50,
                tips: ['Relaxa a lombar e quadril', 'Balance suavemente'],
                muscleGroups: ['Quadril', 'Lombar', 'Adutores']
            },
            {
                id: 'reclined-butterfly',
                name: 'Borboleta Reclinada',
                description: 'Deitado, junte as solas dos pés e deixe os joelhos caírem para os lados.',
                duration: 60,
                tips: ['Use almofadas sob os joelhos', 'Fique pelo menos 1 minuto'],
                muscleGroups: ['Adutores', 'Quadril', 'Virilha']
            },
            {
                id: 'corpse-pose',
                name: 'Savasana',
                description: 'Deitado de costas, braços ao lado do corpo, relaxe completamente.',
                duration: 90,
                tips: ['Encerre com relaxamento total', 'Feche os olhos', 'Respire naturalmente'],
                muscleGroups: ['Corpo inteiro', 'Sistema Nervoso']
            }
        ]
    }
];

export default function StretchingPage() {
    const router = useRouter();
    const [selectedLevel, setSelectedLevel] = useState<StretchLevel | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isTraining, setIsTraining] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<string[]>([]);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Timer do exercício
    useEffect(() => {
        if (!isTimerRunning || !selectedLevel) return;

        const currentExercise = selectedLevel.exercises[currentExerciseIndex];
        if (timer >= currentExercise.duration) {
            // Vibrar ao terminar
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
            }
            setIsTimerRunning(false);
            return;
        }

        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning, timer, selectedLevel, currentExerciseIndex]);

    // Fullscreen
    const toggleFullscreen = useCallback(async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                setIsFullscreen(false);
            } else if (containerRef.current) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            }
        } catch (error) {
            console.warn('Fullscreen não suportado');
        }
    }, []);

    useEffect(() => {
        const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    const startTraining = (level: StretchLevel) => {
        setSelectedLevel(level);
        setCurrentExerciseIndex(0);
        setCompletedExercises([]);
        setIsTraining(true);
        setTimer(0);
        setIsTimerRunning(true);
    };

    const completeExercise = () => {
        if (!selectedLevel) return;

        const currentExercise = selectedLevel.exercises[currentExerciseIndex];
        setCompletedExercises(prev => [...prev, currentExercise.id]);

        if (currentExerciseIndex < selectedLevel.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setTimer(0);
            setIsTimerRunning(true);
        } else {
            setIsTraining(false);
            setIsTimerRunning(false);
        }
    };

    const skipTimer = () => {
        setIsTimerRunning(false);
        setTimer(selectedLevel?.exercises[currentExerciseIndex]?.duration || 0);
    };

    const resetTraining = () => {
        setSelectedLevel(null);
        setCurrentExerciseIndex(0);
        setCompletedExercises([]);
        setIsTraining(false);
        setTimer(0);
        setIsTimerRunning(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-club-black pb-24">
            <div className="h-8 md:h-10" />

            <HeroSection
                title="Alongamento & Recuperação"
                subtitle="Pós-Treino para Remadores"
                description="Relaxe seus músculos e acelere a recuperação após o treino de remo."
                compact
            />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/training" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Voltar ao Painel
                    </Link>
                    {isTraining && (
                        <button onClick={toggleFullscreen} className="p-2 text-white/60 hover:text-white">
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!selectedLevel ? (
                        <motion.div
                            key="levels"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {stretchLevels.map((level) => {
                                const Icon = level.icon;
                                return (
                                    <AnimatedCard
                                        key={level.id}
                                        variant="glass"
                                        className="p-6 cursor-pointer hover:border-white/20 transition-all group"
                                        onClick={() => setSelectedLevel(level)}
                                    >
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                            level.color
                                        )}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">{level.title}</h3>
                                        <p className="text-sm text-emerald-400 font-medium mb-2">{level.subtitle}</p>
                                        <p className="text-sm text-white/60 mb-4">{level.description}</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/40 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {level.duration} min
                                            </span>
                                            <span className="text-white/40">
                                                {level.exercises.length} exercícios
                                            </span>
                                        </div>
                                        <Button
                                            className={cn(
                                                "w-full mt-4 bg-gradient-to-r text-white font-bold",
                                                level.color
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startTraining(level);
                                            }}
                                        >
                                            <Play className="w-4 h-4 mr-2 fill-white" />
                                            Iniciar
                                        </Button>
                                    </AnimatedCard>
                                );
                            })}
                        </motion.div>
                    ) : !isTraining ? (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto mb-6 flex items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Alongamento Completo!</h2>
                            <p className="text-white/60 mb-6">
                                Você completou {completedExercises.length} exercícios do nível {selectedLevel.title}.
                                Seus músculos agradecem! 🧘‍♂️
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button variant="outline" onClick={resetTraining}>
                                    Voltar aos Níveis
                                </Button>
                                <Button
                                    className="bg-club-red hover:bg-red-700"
                                    onClick={() => router.push('/training')}
                                >
                                    Finalizar Sessão
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="training"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            {/* Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-white/60 mb-2">
                                    <span>Exercício {currentExerciseIndex + 1} de {selectedLevel.exercises.length}</span>
                                    <span>{selectedLevel.title}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full bg-gradient-to-r transition-all", selectedLevel.color)}
                                        style={{ width: `${((currentExerciseIndex + 1) / selectedLevel.exercises.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Current Exercise */}
                            {selectedLevel.exercises[currentExerciseIndex] && (
                                <AnimatedCard variant="carbon" className="p-8">
                                    {/* Timer Circular */}
                                    <div className="flex justify-center mb-6">
                                        <div className="relative w-32 h-32">
                                            <svg className="w-32 h-32 transform -rotate-90">
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="rgba(255,255,255,0.1)"
                                                    strokeWidth="8"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="56"
                                                    stroke="url(#gradient)"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(timer / selectedLevel.exercises[currentExerciseIndex].duration) * 352} 352`}
                                                />
                                                <defs>
                                                    <linearGradient id="gradient">
                                                        <stop offset="0%" stopColor="#10b981" />
                                                        <stop offset="100%" stopColor="#14b8a6" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-3xl font-mono font-bold text-white">
                                                    {formatTime(selectedLevel.exercises[currentExerciseIndex].duration - timer)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                                        {selectedLevel.exercises[currentExerciseIndex].name}
                                    </h2>
                                    <p className="text-white/60 text-center mb-6">
                                        {selectedLevel.exercises[currentExerciseIndex].description}
                                    </p>

                                    {/* Tips */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-emerald-400 uppercase mb-2">Dicas</h3>
                                        <ul className="space-y-1">
                                            {selectedLevel.exercises[currentExerciseIndex].tips.map((tip, i) => (
                                                <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                                                    <span className="text-emerald-400">•</span>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Muscle Groups */}
                                    <div className="flex flex-wrap gap-2 mb-6 justify-center">
                                        {selectedLevel.exercises[currentExerciseIndex].muscleGroups.map((muscle, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70">
                                                {muscle}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={resetTraining}
                                        >
                                            Cancelar
                                        </Button>
                                        {isTimerRunning ? (
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-emerald-500/50 text-emerald-400"
                                                onClick={skipTimer}
                                            >
                                                Pular Timer
                                            </Button>
                                        ) : (
                                            <Button
                                                className={cn("flex-1 bg-gradient-to-r text-white font-bold", selectedLevel.color)}
                                                onClick={completeExercise}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                {currentExerciseIndex < selectedLevel.exercises.length - 1 ? 'Próximo' : 'Finalizar'}
                                            </Button>
                                        )}
                                    </div>
                                </AnimatedCard>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
