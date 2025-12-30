'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Play, Clock, Flame, Zap, Trophy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Tipos de exercícios
interface Exercise {
    id: string;
    name: string;
    description: string;
    duration: number; // segundos
    reps?: number;
    sets?: number;
    restBetweenSets?: number;
    tips: string[];
    muscleGroups: string[];
}

interface WarmupLevel {
    id: 'beginner' | 'intermediate' | 'advanced';
    title: string;
    subtitle: string;
    description: string;
    duration: number; // minutos totais
    color: string;
    icon: typeof Flame;
    exercises: Exercise[];
}

// Programas de aquecimento baseados em pesquisa científica para remadores
const warmupLevels: WarmupLevel[] = [
    {
        id: 'beginner',
        title: 'Iniciante',
        subtitle: 'Fundamentos do Core',
        description: 'Exercícios básicos para quem está começando. Foco em postura e ativação muscular.',
        duration: 10,
        color: 'from-green-600 to-emerald-600',
        icon: Flame,
        exercises: [
            {
                id: 'plank-basic',
                name: 'Prancha Básica',
                description: 'Mantenha o corpo reto dos calcanhares à cabeça, cotovelos sob os ombros.',
                duration: 30,
                sets: 3,
                restBetweenSets: 15,
                tips: [
                    'Mantenha o abdômen contraído',
                    'Não deixe o quadril subir ou descer',
                    'Respire normalmente'
                ],
                muscleGroups: ['Core', 'Ombros', 'Glúteos']
            },
            {
                id: 'glute-bridge',
                name: 'Ponte de Glúteos',
                description: 'Deitado de costas, joelhos dobrados, eleve o quadril contraindo os glúteos.',
                duration: 45,
                reps: 15,
                sets: 2,
                restBetweenSets: 15,
                tips: [
                    'Aperte os glúteos no topo do movimento',
                    'Mantenha os pés apoiados no chão',
                    'Não arqueie excessivamente a lombar'
                ],
                muscleGroups: ['Glúteos', 'Isquiotibiais', 'Lombar']
            },
            {
                id: 'dead-bug',
                name: 'Dead Bug',
                description: 'Deitado, braços estendidos para cima, joelhos a 90°. Baixe braço e perna opostos alternadamente.',
                duration: 60,
                reps: 10,
                sets: 2,
                restBetweenSets: 15,
                tips: [
                    'Mantenha a lombar pressionada no chão',
                    'Movimento lento e controlado',
                    'Expire ao estender'
                ],
                muscleGroups: ['Core', 'Flexores do Quadril']
            },
            {
                id: 'side-plank-basic',
                name: 'Prancha Lateral',
                description: 'Apoie-se no antebraço e no pé, corpo em linha reta. Troque de lado.',
                duration: 20,
                sets: 2,
                restBetweenSets: 10,
                tips: [
                    'Quadril elevado e alinhado',
                    'Ombro diretamente sobre o cotovelo',
                    'Olhe para frente'
                ],
                muscleGroups: ['Oblíquos', 'Core', 'Ombros']
            },
            {
                id: 'cat-cow',
                name: 'Gato-Vaca',
                description: 'Em quatro apoios, alterne entre arquear e arredondar a coluna.',
                duration: 60,
                reps: 10,
                sets: 1,
                tips: [
                    'Sincronize com a respiração',
                    'Movimento fluido e controlado',
                    'Ative o core durante todo o exercício'
                ],
                muscleGroups: ['Coluna', 'Core', 'Ombros']
            }
        ]
    },
    {
        id: 'intermediate',
        title: 'Intermediário',
        subtitle: 'Força & Estabilidade',
        description: 'Exercícios mais desafiadores para quem já tem base. Inclui variações e instabilidade.',
        duration: 15,
        color: 'from-yellow-600 to-amber-600',
        icon: Zap,
        exercises: [
            {
                id: 'plank-leg-lift',
                name: 'Prancha com Elevação de Perna',
                description: 'Na posição de prancha, alterne elevando cada perna mantendo o quadril estável.',
                duration: 45,
                reps: 10,
                sets: 3,
                restBetweenSets: 15,
                tips: [
                    'Não rotacione o quadril',
                    'Mantenha o core ativado',
                    'Movimento controlado'
                ],
                muscleGroups: ['Core', 'Glúteos', 'Lombar']
            },
            {
                id: 'russian-twist',
                name: 'Rotação Russa',
                description: 'Sentado, pés elevados, rotacione o tronco de lado a lado tocando o chão.',
                duration: 60,
                reps: 20,
                sets: 3,
                restBetweenSets: 20,
                tips: [
                    'Mantenha a coluna ereta',
                    'Rotação vem do core, não dos braços',
                    'Pés podem tocar o chão se necessário'
                ],
                muscleGroups: ['Oblíquos', 'Core', 'Flexores']
            },
            {
                id: 'single-leg-bridge',
                name: 'Ponte Unilateral',
                description: 'Ponte de glúteos com uma perna estendida. Alterne os lados.',
                duration: 60,
                reps: 12,
                sets: 2,
                restBetweenSets: 15,
                tips: [
                    'Mantenha o quadril nivelado',
                    'Perna estendida alinhada com o corpo',
                    'Contraia forte o glúteo'
                ],
                muscleGroups: ['Glúteos', 'Isquiotibiais', 'Core']
            },
            {
                id: 'bird-dog',
                name: 'Bird Dog',
                description: 'Em quatro apoios, estenda braço e perna opostos simultaneamente.',
                duration: 60,
                reps: 10,
                sets: 3,
                restBetweenSets: 15,
                tips: [
                    'Mantenha a coluna neutra',
                    'Não deixe o quadril rotacionar',
                    'Movimento lento e controlado'
                ],
                muscleGroups: ['Core', 'Glúteos', 'Eretores']
            },
            {
                id: 'side-plank-hip-dip',
                name: 'Prancha Lateral com Toque',
                description: 'Na prancha lateral, baixe e eleve o quadril ritmicamente.',
                duration: 45,
                reps: 12,
                sets: 2,
                restBetweenSets: 15,
                tips: [
                    'Não deixe o quadril ir muito baixo',
                    'Mantenha o alinhamento do corpo',
                    'Controle o movimento'
                ],
                muscleGroups: ['Oblíquos', 'Core', 'Quadril']
            },
            {
                id: 'seated-rockback',
                name: 'Rockback Sentado',
                description: 'Sentado na borda de um banco, incline-se para trás mantendo o tronco reto.',
                duration: 60,
                reps: 15,
                sets: 3,
                restBetweenSets: 20,
                tips: [
                    'Específico para remadores',
                    'Expire ao inclinar para trás',
                    'Mantenha os pés no chão'
                ],
                muscleGroups: ['Abdominais', 'Flexores', 'Core']
            }
        ]
    },
    {
        id: 'advanced',
        title: 'Avançado',
        subtitle: 'Alta Performance',
        description: 'Exercícios complexos para atletas experientes. Máxima ativação do core.',
        duration: 20,
        color: 'from-red-600 to-rose-600',
        icon: Trophy,
        exercises: [
            {
                id: 'single-arm-plank',
                name: 'Prancha de Um Braço',
                description: 'Prancha com apenas um braço apoiado, alternando os lados.',
                duration: 30,
                sets: 3,
                restBetweenSets: 20,
                tips: [
                    'Pés mais afastados para equilíbrio',
                    'Mantenha o quadril estável',
                    'Core super ativado'
                ],
                muscleGroups: ['Core', 'Ombros', 'Oblíquos']
            },
            {
                id: 'v-sit',
                name: 'V-Sit',
                description: 'Sentado, eleve pernas e tronco formando um V. Mantenha a posição.',
                duration: 30,
                sets: 4,
                restBetweenSets: 20,
                tips: [
                    'Mantenha as pernas esticadas',
                    'Braços paralelos ao chão',
                    'Respire normalmente'
                ],
                muscleGroups: ['Abdominais', 'Flexores', 'Core']
            },
            {
                id: 'weighted-russian-twist',
                name: 'Rotação Russa com Peso',
                description: 'Rotação russa segurando um peso (2-5kg) ou medicine ball.',
                duration: 60,
                reps: 20,
                sets: 3,
                restBetweenSets: 20,
                tips: [
                    'Controle o peso',
                    'Rotação completa do tronco',
                    'Pés elevados do chão'
                ],
                muscleGroups: ['Oblíquos', 'Core', 'Ombros']
            },
            {
                id: 'leg-raises',
                name: 'Elevação de Pernas 90°',
                description: 'Deitado, eleve as pernas retas até 90° e baixe sem tocar o chão.',
                duration: 60,
                reps: 15,
                sets: 3,
                restBetweenSets: 20,
                tips: [
                    'Lombar pressionada no chão',
                    'Movimento lento na descida',
                    'Não deixe as pernas tocar o chão'
                ],
                muscleGroups: ['Abdominais inferiores', 'Flexores', 'Core']
            },
            {
                id: 'hollow-body-hold',
                name: 'Hollow Body Hold',
                description: 'Deitado, braços e pernas estendidos, eleve ligeiramente formando uma "banana".',
                duration: 30,
                sets: 4,
                restBetweenSets: 15,
                tips: [
                    'Lombar colada no chão',
                    'Queixo no peito',
                    'Tensão total do core'
                ],
                muscleGroups: ['Core completo', 'Flexores']
            },
            {
                id: 'rockback-overhead',
                name: 'Rockback com Braços Elevados',
                description: 'Rockback sentado com braços esticados acima da cabeça para maior dificuldade.',
                duration: 60,
                reps: 12,
                sets: 3,
                restBetweenSets: 20,
                tips: [
                    'Exercício específico para remadores',
                    'Mantenha os braços retos',
                    'Controle total do movimento'
                ],
                muscleGroups: ['Abdominais', 'Ombros', 'Core']
            },
            {
                id: 'plank-to-pike',
                name: 'Prancha para Pike',
                description: 'Da prancha, eleve o quadril formando um V invertido, depois retorne.',
                duration: 60,
                reps: 12,
                sets: 3,
                restBetweenSets: 20,
                tips: [
                    'Pernas esticadas',
                    'Core ativado o tempo todo',
                    'Movimento fluido'
                ],
                muscleGroups: ['Core', 'Ombros', 'Flexores']
            }
        ]
    }
];

export default function WarmupPage() {
    const [selectedLevel, setSelectedLevel] = useState<WarmupLevel | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isTraining, setIsTraining] = useState(false);
    const [completedExercises, setCompletedExercises] = useState<string[]>([]);

    const startTraining = (level: WarmupLevel) => {
        setSelectedLevel(level);
        setCurrentExerciseIndex(0);
        setCompletedExercises([]);
        setIsTraining(true);
    };

    const completeExercise = () => {
        if (!selectedLevel) return;

        const currentExercise = selectedLevel.exercises[currentExerciseIndex];
        setCompletedExercises(prev => [...prev, currentExercise.id]);

        if (currentExerciseIndex < selectedLevel.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            setIsTraining(false);
        }
    };

    const resetTraining = () => {
        setSelectedLevel(null);
        setCurrentExerciseIndex(0);
        setCompletedExercises([]);
        setIsTraining(false);
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <div className="h-8 md:h-10" />

            <HeroSection
                title="Aquecimento & Core"
                subtitle="Preparação para Remadores"
                description="Fortaleça seu core e prepare seu corpo antes do treino de remo."
                compact
            />

            <div className="container mx-auto px-4 py-8">
                <Link href="/trainings" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Voltar ao Painel
                </Link>

                <AnimatePresence mode="wait">
                    {!selectedLevel ? (
                        <motion.div
                            key="levels"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {warmupLevels.map((level) => {
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
                                        <p className="text-sm text-club-gold font-medium mb-2">{level.subtitle}</p>
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
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mx-auto mb-6 flex items-center justify-center">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Aquecimento Completo!</h2>
                            <p className="text-white/60 mb-6">
                                Você completou {completedExercises.length} exercícios do nível {selectedLevel.title}.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button variant="outline" onClick={resetTraining}>
                                    Voltar aos Níveis
                                </Button>
                                <Link href="/training/start?sport=rowing">
                                    <Button className="bg-club-red hover:bg-red-700">
                                        <Play className="w-4 h-4 mr-2 fill-white" />
                                        Iniciar Treino de Remo
                                    </Button>
                                </Link>
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
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {selectedLevel.exercises[currentExerciseIndex].name}
                                    </h2>
                                    <p className="text-white/60 mb-6">
                                        {selectedLevel.exercises[currentExerciseIndex].description}
                                    </p>

                                    {/* Metrics */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        {selectedLevel.exercises[currentExerciseIndex].duration && (
                                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-white/40 uppercase">Duração</p>
                                                <p className="text-xl font-bold text-white">
                                                    {selectedLevel.exercises[currentExerciseIndex].duration}s
                                                </p>
                                            </div>
                                        )}
                                        {selectedLevel.exercises[currentExerciseIndex].reps && (
                                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-white/40 uppercase">Repetições</p>
                                                <p className="text-xl font-bold text-white">
                                                    {selectedLevel.exercises[currentExerciseIndex].reps}x
                                                </p>
                                            </div>
                                        )}
                                        {selectedLevel.exercises[currentExerciseIndex].sets && (
                                            <div className="text-center p-3 bg-white/5 rounded-lg">
                                                <p className="text-xs text-white/40 uppercase">Séries</p>
                                                <p className="text-xl font-bold text-white">
                                                    {selectedLevel.exercises[currentExerciseIndex].sets}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tips */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-club-gold uppercase mb-2">Dicas</h3>
                                        <ul className="space-y-1">
                                            {selectedLevel.exercises[currentExerciseIndex].tips.map((tip, i) => (
                                                <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                                                    <span className="text-club-gold">•</span>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Muscle Groups */}
                                    <div className="flex flex-wrap gap-2 mb-6">
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
                                        <Button
                                            className={cn("flex-1 bg-gradient-to-r text-white font-bold", selectedLevel.color)}
                                            onClick={completeExercise}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            {currentExerciseIndex < selectedLevel.exercises.length - 1 ? 'Próximo' : 'Finalizar'}
                                        </Button>
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
