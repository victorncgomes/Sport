'use client';

import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { XPGain, useXPGain } from '@/components/gamification';
import {
    Play, Pause, Square, Dumbbell, Plus, Minus, Timer,
    ChevronRight, Check, RotateCcw, Flame, Trophy, Maximize2, Minimize2
} from 'lucide-react';

interface Exercise {
    id: string;
    name: string;
    sets: ExerciseSet[];
    muscleGroup: string;
}

interface ExerciseSet {
    reps: number;
    weight: number;
    completed: boolean;
    restTime?: number;
}

// Exercícios pré-definidos por grupo muscular
const exerciseLibrary: Record<string, string[]> = {
    'Peito': ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Flexão', 'Supino Declinado'],
    'Costas': ['Puxada Frontal', 'Remada Curvada', 'Remada Unilateral', 'Pulldown', 'Barra Fixa'],
    'Ombros': ['Desenvolvimento', 'Elevação Lateral', 'Elevação Frontal', 'Remada Alta', 'Face Pull'],
    'Bíceps': ['Rosca Direta', 'Rosca Martelo', 'Rosca Concentrada', 'Rosca Scott'],
    'Tríceps': ['Tríceps Corda', 'Tríceps Testa', 'Tríceps Francês', 'Mergulho'],
    'Pernas': ['Agachamento', 'Leg Press', 'Extensora', 'Flexora', 'Panturrilha'],
    'Core': ['Abdominal', 'Prancha', 'Russian Twist', 'Elevação de Pernas']
};

function GymWorkoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const targetTime = searchParams.get('targetTime');

    const [isRunning, setIsRunning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [restTimer, setRestTimer] = useState<number | null>(null);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { showXPGain, XPGainComponent } = useXPGain();
    const containerRef = useRef<HTMLDivElement>(null);

    // Função para entrar em tela cheia
    const enterFullscreen = useCallback(async () => {
        try {
            if (containerRef.current && document.fullscreenEnabled) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            }
        } catch (error) {
            console.warn('Fullscreen não disponível:', error);
        }
    }, []);

    // Função para sair da tela cheia
    const exitFullscreen = useCallback(async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (error) {
            console.warn('Erro ao sair de fullscreen:', error);
        }
    }, []);

    // Toggle fullscreen
    const toggleFullscreen = useCallback(() => {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    }, [isFullscreen, enterFullscreen, exitFullscreen]);

    // Entrar em tela cheia automaticamente ao iniciar o treino
    useEffect(() => {
        const timer = setTimeout(() => {
            enterFullscreen();
        }, 500);

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
        };
    }, [enterFullscreen]);

    // Timer principal
    useEffect(() => {
        if (!isRunning || isPaused) return;

        const interval = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, isPaused]);

    // Timer de descanso
    useEffect(() => {
        if (restTimer === null || restTimer <= 0) return;

        const interval = setInterval(() => {
            setRestTimer(prev => {
                if (prev === null || prev <= 1) {
                    // Vibrar quando terminar
                    if ('vibrate' in navigator) {
                        navigator.vibrate([200, 100, 200]);
                    }
                    return null;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [restTimer]);

    const formatTime = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const addExercise = (name: string, group: string) => {
        const newExercise: Exercise = {
            id: Date.now().toString(),
            name,
            muscleGroup: group,
            sets: [{ reps: 12, weight: 0, completed: false }]
        };
        setExercises(prev => [...prev, newExercise]);
        setShowAddExercise(false);
        setSelectedGroup(null);
    };

    const addSet = (exerciseId: string) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id === exerciseId) {
                const lastSet = ex.sets[ex.sets.length - 1];
                return {
                    ...ex,
                    sets: [...ex.sets, { reps: lastSet?.reps || 12, weight: lastSet?.weight || 0, completed: false }]
                };
            }
            return ex;
        }));
    };

    const updateSet = (exerciseId: string, setIndex: number, updates: Partial<ExerciseSet>) => {
        setExercises(prev => prev.map(ex => {
            if (ex.id === exerciseId) {
                const newSets = [...ex.sets];
                newSets[setIndex] = { ...newSets[setIndex], ...updates };
                return { ...ex, sets: newSets };
            }
            return ex;
        }));
    };

    const completeSet = (exerciseId: string, setIndex: number) => {
        updateSet(exerciseId, setIndex, { completed: true });
        // Inicia timer de descanso
        setRestTimer(60);
    };

    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
    const totalVolume = exercises.reduce((acc, ex) =>
        acc + ex.sets.filter(s => s.completed).reduce((sum, s) => sum + (s.reps * s.weight), 0), 0
    );

    const handleFinish = () => {
        const xpEarned = Math.max(15, Math.round(completedSets * 5 + duration / 60));
        showXPGain(xpEarned);

        setTimeout(() => {
            router.push('/training/cooldown');
        }, 2000);
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white">
            {/* XP Gain Animation */}
            <XPGainComponent />

            {/* Header com Timer */}
            <div className="bg-gradient-to-b from-purple-600/30 to-transparent p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Dumbbell className="w-6 h-6 text-purple-400" />
                        <span className="text-white/60 text-sm">Musculação</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Fullscreen Toggle */}
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 text-white/60 hover:text-white transition-colors"
                            title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-5 h-5" />
                            ) : (
                                <Maximize2 className="w-5 h-5" />
                            )}
                        </button>
                        <div className="text-white/40 text-xs">
                            {isPaused ? '⏸ PAUSADO' : '● GRAVANDO'}
                        </div>
                    </div>
                </div>

                {/* Timer Grande */}
                <motion.div
                    className="text-center"
                    animate={isPaused ? { opacity: 0.5 } : { opacity: 1 }}
                >
                    <div className="text-5xl font-mono font-bold text-white">
                        {formatTime(duration)}
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center bg-white/10 rounded-lg p-3">
                        <div className="text-xl font-bold text-purple-400">{completedSets}/{totalSets}</div>
                        <div className="text-[10px] text-white/50">SÉRIES</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-lg p-3">
                        <div className="text-xl font-bold text-orange-400">{exercises.length}</div>
                        <div className="text-[10px] text-white/50">EXERCÍCIOS</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-lg p-3">
                        <div className="text-xl font-bold text-cyan-400">{totalVolume.toLocaleString()}</div>
                        <div className="text-[10px] text-white/50">VOLUME (KG)</div>
                    </div>
                </div>
            </div>

            {/* Timer de Descanso */}
            <AnimatePresence>
                {restTimer !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mx-4 mt-4"
                    >
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
                            <div className="text-sm text-yellow-400 mb-1">⏱️ DESCANSO</div>
                            <div className="text-4xl font-mono font-bold text-yellow-400">
                                {restTimer}s
                            </div>
                            <button
                                onClick={() => setRestTimer(null)}
                                className="mt-2 text-xs text-yellow-400/70 hover:text-yellow-400"
                            >
                                Pular descanso
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lista de Exercícios */}
            <div className="p-4 space-y-4">
                {exercises.map((exercise, exIndex) => (
                    <AnimatedCard key={exercise.id} variant="glass" className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-white">{exercise.name}</h3>
                                <span className="text-xs text-purple-400">{exercise.muscleGroup}</span>
                            </div>
                            <button
                                onClick={() => addSet(exercise.id)}
                                className="text-white/40 hover:text-white text-xs flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Série
                            </button>
                        </div>

                        <div className="space-y-2">
                            {exercise.sets.map((set, setIndex) => (
                                <div
                                    key={setIndex}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${set.completed ? 'bg-green-500/20' : 'bg-white/5'}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                                        {setIndex + 1}
                                    </div>

                                    {/* Reps */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => updateSet(exercise.id, setIndex, { reps: Math.max(1, set.reps - 1) })}
                                            className="w-6 h-6 rounded bg-white/10 flex items-center justify-center"
                                            disabled={set.completed}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <div className="w-12 text-center">
                                            <span className="font-bold">{set.reps}</span>
                                            <span className="text-[10px] text-white/50 block">reps</span>
                                        </div>
                                        <button
                                            onClick={() => updateSet(exercise.id, setIndex, { reps: set.reps + 1 })}
                                            className="w-6 h-6 rounded bg-white/10 flex items-center justify-center"
                                            disabled={set.completed}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Weight */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => updateSet(exercise.id, setIndex, { weight: Math.max(0, set.weight - 2.5) })}
                                            className="w-6 h-6 rounded bg-white/10 flex items-center justify-center"
                                            disabled={set.completed}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <div className="w-16 text-center">
                                            <span className="font-bold">{set.weight}</span>
                                            <span className="text-[10px] text-white/50 block">kg</span>
                                        </div>
                                        <button
                                            onClick={() => updateSet(exercise.id, setIndex, { weight: set.weight + 2.5 })}
                                            className="w-6 h-6 rounded bg-white/10 flex items-center justify-center"
                                            disabled={set.completed}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Complete Button */}
                                    <button
                                        onClick={() => completeSet(exercise.id, setIndex)}
                                        disabled={set.completed}
                                        className={`ml-auto w-10 h-10 rounded-full flex items-center justify-center transition-all ${set.completed
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/10 text-white/50 hover:bg-green-500/30 hover:text-green-400'
                                            }`}
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </AnimatedCard>
                ))}

                {/* Adicionar Exercício */}
                <button
                    onClick={() => setShowAddExercise(true)}
                    className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Adicionar Exercício
                </button>
            </div>

            {/* Modal Adicionar Exercício */}
            <AnimatePresence>
                {showAddExercise && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end"
                        onClick={() => { setShowAddExercise(false); setSelectedGroup(null); }}
                    >
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            className="w-full bg-gray-900 rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-4">
                                {selectedGroup ? `${selectedGroup} - Exercícios` : 'Grupo Muscular'}
                            </h3>

                            {!selectedGroup ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.keys(exerciseLibrary).map(group => (
                                        <button
                                            key={group}
                                            onClick={() => setSelectedGroup(group)}
                                            className="p-4 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                                        >
                                            {group}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedGroup(null)}
                                        className="text-sm text-white/50 mb-2 flex items-center gap-1"
                                    >
                                        ← Voltar
                                    </button>
                                    {exerciseLibrary[selectedGroup].map(exercise => (
                                        <button
                                            key={exercise}
                                            onClick={() => addExercise(exercise, selectedGroup)}
                                            className="w-full p-4 bg-white/10 rounded-xl text-white text-left hover:bg-white/20 transition-colors flex items-center justify-between"
                                        >
                                            {exercise}
                                            <Plus className="w-5 h-5 text-white/50" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controles Fixos */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="flex gap-3 max-w-md mx-auto">
                    <Button
                        onClick={() => setIsPaused(!isPaused)}
                        variant="outline"
                        className="flex-1 h-14 gap-2 border-white/20"
                    >
                        {isPaused ? (
                            <>
                                <Play className="w-5 h-5 fill-current" />
                                Retomar
                            </>
                        ) : (
                            <>
                                <Pause className="w-5 h-5" />
                                Pausar
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={() => setShowFinishConfirm(true)}
                        className="flex-1 h-14 gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                        <Square className="w-5 h-5" />
                        Finalizar
                    </Button>
                </div>
            </div>

            {/* Modal Confirmar Finalização */}
            <AnimatePresence>
                {showFinishConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowFinishConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm"
                            onClick={e => e.stopPropagation()}
                        >
                            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white text-center mb-2">
                                Finalizar Treino?
                            </h3>
                            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                <div className="bg-white/10 rounded-lg p-2">
                                    <div className="font-bold text-white">{formatTime(duration)}</div>
                                    <div className="text-[10px] text-white/50">Duração</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-2">
                                    <div className="font-bold text-white">{completedSets}</div>
                                    <div className="text-[10px] text-white/50">Séries</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-2">
                                    <div className="font-bold text-white">{totalVolume}</div>
                                    <div className="text-[10px] text-white/50">Volume</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFinishConfirm(false)}
                                    className="flex-1"
                                >
                                    Continuar
                                </Button>
                                <Button
                                    onClick={handleFinish}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                                >
                                    Finalizar
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function GymWorkoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <GymWorkoutContent />
        </Suspense>
    );
}
