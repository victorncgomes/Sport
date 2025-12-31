'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    Waves, Dumbbell, Play, Timer, Loader2, Trophy, MapPin, RotateCcw,
    Infinity, Clock, Target, Bike, PersonStanding, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos
type SportType = 'ROWING' | 'GYM' | 'OTHER' | 'WARMUP' | 'STRETCH';
type WorkoutLocation = 'OUTDOOR' | 'INDOOR_TANK' | 'INDOOR_GENERAL' | 'OUTDOOR_RUN' | 'TREADMILL' | 'OUTDOOR_BIKE' | 'SPINNING' | 'OTHER_LOCATION';
type WorkoutMode = 'FREE' | 'TIME' | 'DISTANCE' | 'INTERVAL';

interface WorkoutSettings {
    sport: SportType | null;
    location: WorkoutLocation | null;
    mode: WorkoutMode;
    targetTime?: number;
    targetDistance?: number;
    intervals?: {
        workDistance: number;
        restTime: number;
        rounds: number;
    };
}

// Dados dos esportes - Apenas opções ativas
const sports = [
    {
        id: 'ROWING' as const,
        title: 'Remo',
        description: 'Treino de remo no rio ou tanque',
        icon: Waves,
        color: 'from-blue-600 to-cyan-600',
        locations: ['OUTDOOR', 'INDOOR_TANK', 'INDOOR_GENERAL']
    },
    {
        id: 'GYM' as const,
        title: 'Musculação',
        description: 'Treino de força na academia',
        icon: Dumbbell,
        color: 'from-purple-600 to-pink-600',
        locations: ['INDOOR_GENERAL']
    },
    {
        id: 'OTHER' as const,
        title: 'Outras Atividades',
        description: 'Patinação, futebol, surfe, etc.',
        icon: Target,
        color: 'from-gray-600 to-slate-600',
        locations: ['OTHER_LOCATION']
    },
    {
        id: 'WARMUP' as const,
        title: 'Aquecimento',
        description: 'Preparação antes do treino',
        icon: Timer,
        color: 'from-orange-500 to-amber-500',
        locations: ['INDOOR_GENERAL']
    },
    {
        id: 'STRETCH' as const,
        title: 'Alongamento',
        description: 'Flexibilidade e recuperação',
        icon: PersonStanding,
        color: 'from-green-500 to-emerald-500',
        locations: ['INDOOR_GENERAL']
    }
];

// Localizações por esporte
const locationsByType: Record<string, { id: WorkoutLocation; title: string; description: string; icon: any; color: string }[]> = {
    ROWING: [
        { id: 'OUTDOOR', title: 'Treino no Rio', description: 'Remo na água com GPS', icon: Waves, color: 'from-blue-600 to-cyan-600' },
        { id: 'INDOOR_TANK', title: 'Tanque de Remo', description: 'Treino indoor no tanque', icon: Timer, color: 'from-purple-600 to-pink-600' },
        { id: 'INDOOR_GENERAL', title: 'Remoergômetro', description: 'Concept2 / Ergômetro', icon: Dumbbell, color: 'from-orange-600 to-red-600' }
    ],
    RUNNING: [
        { id: 'OUTDOOR_RUN', title: 'Corrida Outdoor', description: 'Na rua, parque ou trilha', icon: MapPin, color: 'from-green-600 to-emerald-600' },
        { id: 'TREADMILL', title: 'Esteira', description: 'Treino indoor na esteira', icon: Timer, color: 'from-gray-600 to-slate-600' }
    ],
    CYCLING: [
        { id: 'OUTDOOR_BIKE', title: 'Pedal Outdoor', description: 'Ciclismo na rua ou trilha', icon: Bike, color: 'from-orange-600 to-amber-600' },
        { id: 'SPINNING', title: 'Spinning', description: 'Bike indoor', icon: Timer, color: 'from-red-600 to-rose-600' }
    ],
    GYM: [
        { id: 'INDOOR_GENERAL', title: 'Academia', description: 'Treino de força', icon: Dumbbell, color: 'from-purple-600 to-pink-600' }
    ],
    OTHER: [
        { id: 'OTHER_LOCATION', title: 'Qualquer Local', description: 'Registre tempo e intensidade', icon: Target, color: 'from-gray-600 to-slate-600' }
    ],
    WARMUP: [
        { id: 'INDOOR_GENERAL', title: 'Área de Aquecimento', description: 'Preparação para o treino', icon: Timer, color: 'from-orange-500 to-amber-500' }
    ],
    STRETCH: [
        { id: 'INDOOR_GENERAL', title: 'Área de Alongamento', description: 'Flexibilidade e recuperação', icon: PersonStanding, color: 'from-green-500 to-emerald-500' }
    ]
};

// Modos de treino por esporte
const modesBySport: Record<SportType, { id: WorkoutMode; title: string; description: string; icon: any; requiresConfig: boolean }[]> = {
    ROWING: [
        { id: 'FREE', title: 'Treino Livre', description: 'Sem meta, reme quanto quiser', icon: Infinity, requiresConfig: false },
        { id: 'TIME', title: 'Por Tempo', description: 'Defina quanto tempo remar', icon: Clock, requiresConfig: true },
        { id: 'DISTANCE', title: 'Por Distância', description: 'Defina quantos metros remar', icon: Target, requiresConfig: true },
        { id: 'INTERVAL', title: 'Intervalado', description: 'Alternância trabalho/descanso', icon: RotateCcw, requiresConfig: true }
    ],
    GYM: [
        { id: 'FREE', title: 'Treino Livre', description: 'Registre exercícios manualmente', icon: Infinity, requiresConfig: false },
        { id: 'TIME', title: 'Por Tempo', description: 'Treino cronometrado', icon: Clock, requiresConfig: true }
    ],
    OTHER: [
        { id: 'FREE', title: 'Atividade Livre', description: 'Registre o tempo da atividade', icon: Infinity, requiresConfig: false },
        { id: 'TIME', title: 'Por Tempo', description: 'Defina a duração da atividade', icon: Clock, requiresConfig: true }
    ],
    WARMUP: [
        { id: 'FREE', title: 'Aquecimento Livre', description: 'Prepare-se no seu ritmo', icon: Infinity, requiresConfig: false },
        { id: 'TIME', title: 'Por Tempo', description: 'Aquecimento cronometrado', icon: Clock, requiresConfig: true }
    ],
    STRETCH: [
        { id: 'FREE', title: 'Alongamento Livre', description: 'Alongue-se no seu ritmo', icon: Infinity, requiresConfig: false },
        { id: 'TIME', title: 'Por Tempo', description: 'Alongamento cronometrado', icon: Clock, requiresConfig: true }
    ]
};

// Presets
const timePresets = [
    { label: '10 min', value: 600 },
    { label: '20 min', value: 1200 },
    { label: '30 min', value: 1800 },
    { label: '45 min', value: 2700 },
    { label: '60 min', value: 3600 }
];

const distancePresets: Record<SportType, { label: string; value: number }[]> = {
    ROWING: [
        { label: '500m', value: 500 },
        { label: '1000m', value: 1000 },
        { label: '2000m', value: 2000 },
        { label: '5000m', value: 5000 },
        { label: '10000m', value: 10000 }
    ],
    GYM: [],
    OTHER: [],
    WARMUP: [],
    STRETCH: []
};

const intervalPresets = [
    { label: '4x500m', work: 500, rest: 60, rounds: 4 },
    { label: '6x500m', work: 500, rest: 90, rounds: 6 },
    { label: '5x1000m', work: 1000, rest: 120, rounds: 5 },
    { label: '8x250m', work: 250, rest: 45, rounds: 8 }
];

function StartWorkoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlSport = searchParams.get('sport')?.toUpperCase() as SportType | null;

    const [settings, setSettings] = useState<WorkoutSettings>({
        sport: null,
        location: null,
        mode: 'FREE'
    });
    const [step, setStep] = useState<'sport' | 'location' | 'mode' | 'config'>('sport');
    const [isLoading, setIsLoading] = useState(false);

    // Se veio sport da URL, pular direto para location ou mode
    useEffect(() => {
        if (urlSport && sports.find(s => s.id === urlSport)) {
            const locs = locationsByType[urlSport];
            if (locs && locs.length === 1) {
                // Só tem uma localização, pula para mode
                setSettings({ sport: urlSport, location: locs[0].id, mode: 'FREE' });
                setStep('mode');
            } else {
                setSettings(prev => ({ ...prev, sport: urlSport }));
                setStep('location');
            }
        }
    }, [urlSport]);

    const handleStart = async () => {
        if (!settings.location || !settings.sport) return;

        setIsLoading(true);

        try {
            const response = await fetch('/api/workouts/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sport: settings.sport,
                    mode: settings.location,
                    workoutMode: settings.mode,
                    targetTime: settings.targetTime,
                    targetDistance: settings.targetDistance,
                    intervals: settings.intervals
                })
            });

            const params = new URLSearchParams({
                type: settings.location.toLowerCase(),
                sport: settings.sport.toLowerCase(),
                workoutMode: settings.mode,
                ...(settings.targetTime && { targetTime: settings.targetTime.toString() }),
                ...(settings.targetDistance && { targetDistance: settings.targetDistance.toString() })
            });

            if (response.ok) {
                const data = await response.json();
                params.set('sessionId', data.sessionId || data.session?.id || '');
            }

            // Redireciona para página específica do esporte
            const livePage = settings.sport === 'GYM' ? '/training/live/gym' : '/training/live';
            router.push(`${livePage}?${params.toString()}`);
        } catch (error) {
            console.error('Error starting workout:', error);
            router.push(`/training/live?type=${settings.location.toLowerCase()}&sport=${settings.sport?.toLowerCase()}`);
        }
    };

    const handleSportSelect = (sport: SportType) => {
        setSettings(prev => ({ ...prev, sport, location: null }));
        const sportData = sports.find(s => s.id === sport);
        // Se só tem uma localização, pula direto para mode
        if (sportData && locationsByType[sport].length === 1) {
            setSettings(prev => ({ ...prev, sport, location: locationsByType[sport][0].id }));
            setStep('mode');
        } else {
            setStep('location');
        }
    };

    const handleLocationSelect = (location: WorkoutLocation) => {
        setSettings(prev => ({ ...prev, location }));
        setStep('mode');
    };

    const handleModeSelect = (mode: WorkoutMode) => {
        setSettings(prev => ({ ...prev, mode }));
        const selectedMode = settings.sport ? modesBySport[settings.sport].find(m => m.id === mode) : null;
        if (selectedMode?.requiresConfig) {
            setStep('config');
        }
    };

    const canStart = () => {
        if (!settings.location || !settings.sport) return false;
        if (settings.mode === 'FREE') return true;
        if (settings.mode === 'TIME' && settings.targetTime) return true;
        if (settings.mode === 'DISTANCE' && settings.targetDistance) return true;
        if (settings.mode === 'INTERVAL' && settings.intervals) return true;
        return false;
    };

    const goBack = () => {
        if (step === 'config') setStep('mode');
        else if (step === 'mode') setStep('location');
        else if (step === 'location') setStep('sport');
        else router.push('/training');
    };

    const currentStepNumber = step === 'sport' ? 1 : step === 'location' ? 2 : step === 'mode' ? 3 : 4;
    const totalSteps = settings.sport === 'GYM' ? 3 : 4;

    return (
        <div className="min-h-screen bg-black pb-24">
            {/* Header */}
            <div className="bg-gradient-to-b from-red-600/20 to-transparent px-4 py-6">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={goBack} className="text-white/60 text-sm flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                    </button>
                    <div className="text-white/40 text-xs">
                        Passo {currentStepNumber}/{totalSteps}
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-white">Iniciar Treino</h1>
                <p className="text-white/60 text-sm mt-1">
                    {step === 'sport' && 'Escolha a modalidade'}
                    {step === 'location' && 'Onde você vai treinar?'}
                    {step === 'mode' && 'Qual tipo de treino?'}
                    {step === 'config' && 'Configure o treino'}
                </p>
            </div>

            <div className="px-4 py-6 space-y-6">
                <AnimatePresence mode="wait">
                    {/* Etapa 1: Esporte */}
                    {step === 'sport' && (
                        <motion.div
                            key="sport"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-2 gap-3"
                        >
                            {sports.map((sport, index) => {
                                const Icon = sport.icon;
                                return (
                                    <motion.button
                                        key={sport.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleSportSelect(sport.id)}
                                        className="w-full"
                                    >
                                        <div className={`bg-gradient-to-br ${sport.color} rounded-xl p-4 text-center flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform`}>
                                            <Icon className="w-8 h-8 text-white" />
                                            <div>
                                                <h3 className="text-sm font-bold text-white">{sport.title}</h3>
                                                <p className="text-[10px] text-white/70 line-clamp-1">{sport.description}</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Etapa 2: Localização */}
                    {step === 'location' && settings.sport && (
                        <motion.div
                            key="location"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-3"
                        >
                            {/* Esporte selecionado */}
                            <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
                                <span>{sports.find(s => s.id === settings.sport)?.title}</span>
                            </div>

                            {locationsByType[settings.sport].map((loc, index) => {
                                const Icon = loc.icon;
                                return (
                                    <motion.button
                                        key={loc.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleLocationSelect(loc.id)}
                                        className="w-full"
                                    >
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${loc.color} flex items-center justify-center`}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h3 className="text-lg font-bold text-white">{loc.title}</h3>
                                                <p className="text-sm text-white/50">{loc.description}</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-white/30" />
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Etapa 3: Modo de Treino */}
                    {step === 'mode' && settings.sport && (
                        <motion.div
                            key="mode"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-3"
                        >
                            {/* Info selecionada */}
                            <div className="flex items-center gap-2 text-white/40 text-sm mb-4 flex-wrap">
                                <span>{sports.find(s => s.id === settings.sport)?.title}</span>
                                <span>→</span>
                                <span>{locationsByType[settings.sport]?.find(l => l.id === settings.location)?.title}</span>
                            </div>

                            {modesBySport[settings.sport].map((mode, index) => {
                                const Icon = mode.icon;
                                const isSelected = settings.mode === mode.id;
                                return (
                                    <motion.button
                                        key={mode.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleModeSelect(mode.id)}
                                        className="w-full"
                                    >
                                        <div className={`bg-white/5 border rounded-xl p-4 flex items-center gap-4 transition-all ${isSelected ? 'border-red-500 bg-red-500/10' : 'border-white/10 hover:bg-white/10'}`}>
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-red-500' : 'bg-white/10'}`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h3 className="font-bold text-white">{mode.title}</h3>
                                                <p className="text-xs text-white/50">{mode.description}</p>
                                            </div>
                                            {isSelected && <Trophy className="w-5 h-5 text-red-400" />}
                                        </div>
                                    </motion.button>
                                );
                            })}

                            {/* Botão Iniciar para modo FREE */}
                            {settings.mode === 'FREE' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4">
                                    <Button
                                        onClick={handleStart}
                                        disabled={isLoading}
                                        className="w-full h-16 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xl font-bold gap-3"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <Play className="w-7 h-7 fill-white" />
                                                INICIAR TREINO
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Etapa 4: Configuração */}
                    {step === 'config' && settings.sport && (
                        <motion.div
                            key="config"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Info breadcrumb */}
                            <div className="flex items-center gap-2 text-white/40 text-sm flex-wrap">
                                <span>{sports.find(s => s.id === settings.sport)?.title}</span>
                                <span>→</span>
                                <span>{modesBySport[settings.sport]?.find(m => m.id === settings.mode)?.title}</span>
                            </div>

                            {/* Config por Tempo - Com entrada customizada */}
                            {settings.mode === 'TIME' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Duração do Treino</h3>

                                    {/* Presets Rápidos */}
                                    <div className="flex gap-2 flex-wrap">
                                        {timePresets.map(preset => {
                                            const isSelected = settings.targetTime === preset.value;
                                            return (
                                                <button
                                                    key={preset.value}
                                                    onClick={() => setSettings(prev => ({ ...prev, targetTime: preset.value }))}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSelected ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                                                >
                                                    {preset.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Input Customizado */}
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <label className="text-sm text-white/50 mb-2 block">Ou digite um tempo personalizado:</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                min="1"
                                                max="300"
                                                placeholder="Min"
                                                value={settings.targetTime ? Math.floor(settings.targetTime / 60) : ''}
                                                onChange={(e) => {
                                                    const mins = parseInt(e.target.value) || 0;
                                                    setSettings(prev => ({ ...prev, targetTime: mins * 60 }));
                                                }}
                                                className="w-24 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-center text-2xl font-bold text-white focus:border-red-500 focus:outline-none"
                                            />
                                            <span className="text-white/50 text-lg">minutos</span>
                                        </div>
                                    </div>

                                    {settings.targetTime && (
                                        <div className="text-center text-white/40 text-sm">
                                            Meta: <span className="text-white font-bold">{Math.floor(settings.targetTime / 60)}</span> minutos
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Config por Distância - Com entrada customizada */}
                            {settings.mode === 'DISTANCE' && settings.sport && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Distância Alvo</h3>

                                    {/* Presets Rápidos */}
                                    <div className="flex gap-2 flex-wrap">
                                        {distancePresets[settings.sport]?.map(preset => {
                                            const isSelected = settings.targetDistance === preset.value;
                                            return (
                                                <button
                                                    key={preset.value}
                                                    onClick={() => setSettings(prev => ({ ...prev, targetDistance: preset.value }))}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSelected ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                                                >
                                                    {preset.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Input Customizado */}
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <label className="text-sm text-white/50 mb-2 block">Ou digite uma distância personalizada:</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                min="100"
                                                max="100000"
                                                step="100"
                                                placeholder="Metros"
                                                value={settings.targetDistance || ''}
                                                onChange={(e) => {
                                                    const meters = parseInt(e.target.value) || 0;
                                                    setSettings(prev => ({ ...prev, targetDistance: meters }));
                                                }}
                                                className="w-28 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-center text-2xl font-bold text-white focus:border-red-500 focus:outline-none"
                                            />
                                            <span className="text-white/50 text-lg">metros</span>
                                        </div>
                                    </div>

                                    {settings.targetDistance && (
                                        <div className="text-center text-white/40 text-sm">
                                            Meta: <span className="text-white font-bold">
                                                {settings.targetDistance >= 1000
                                                    ? `${(settings.targetDistance / 1000).toFixed(1)} km`
                                                    : `${settings.targetDistance} m`
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Config Intervalado - Mais flexível */}
                            {settings.mode === 'INTERVAL' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-white">Treino Intervalado</h3>

                                    {/* Presets Rápidos */}
                                    <div className="flex gap-2 flex-wrap">
                                        {intervalPresets.map(preset => {
                                            const isSelected = settings.intervals?.workDistance === preset.work &&
                                                settings.intervals?.rounds === preset.rounds;
                                            return (
                                                <button
                                                    key={preset.label}
                                                    onClick={() => setSettings(prev => ({
                                                        ...prev,
                                                        intervals: {
                                                            workDistance: preset.work,
                                                            restTime: preset.rest,
                                                            rounds: preset.rounds
                                                        }
                                                    }))}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSelected ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                                                >
                                                    {preset.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Config Customizada */}
                                    <div className="bg-white/5 rounded-xl p-4 space-y-4">
                                        <label className="text-sm text-white/50 block">Ou configure manualmente:</label>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="text-[10px] text-white/40 block mb-1">ROUNDS</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    value={settings.intervals?.rounds || 4}
                                                    onChange={(e) => setSettings(prev => ({
                                                        ...prev,
                                                        intervals: {
                                                            ...prev.intervals,
                                                            workDistance: prev.intervals?.workDistance || 500,
                                                            restTime: prev.intervals?.restTime || 60,
                                                            rounds: parseInt(e.target.value) || 4
                                                        }
                                                    }))}
                                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center text-lg font-bold text-white focus:border-red-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-white/40 block mb-1">METROS</label>
                                                <input
                                                    type="number"
                                                    min="100"
                                                    max="5000"
                                                    step="50"
                                                    value={settings.intervals?.workDistance || 500}
                                                    onChange={(e) => setSettings(prev => ({
                                                        ...prev,
                                                        intervals: {
                                                            ...prev.intervals,
                                                            rounds: prev.intervals?.rounds || 4,
                                                            restTime: prev.intervals?.restTime || 60,
                                                            workDistance: parseInt(e.target.value) || 500
                                                        }
                                                    }))}
                                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center text-lg font-bold text-white focus:border-red-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-white/40 block mb-1">DESC (s)</label>
                                                <input
                                                    type="number"
                                                    min="10"
                                                    max="300"
                                                    step="5"
                                                    value={settings.intervals?.restTime || 60}
                                                    onChange={(e) => setSettings(prev => ({
                                                        ...prev,
                                                        intervals: {
                                                            ...prev.intervals,
                                                            rounds: prev.intervals?.rounds || 4,
                                                            workDistance: prev.intervals?.workDistance || 500,
                                                            restTime: parseInt(e.target.value) || 60
                                                        }
                                                    }))}
                                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-center text-lg font-bold text-white focus:border-red-500 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {settings.intervals && (
                                        <div className="text-center text-white/40 text-sm">
                                            <span className="text-white font-bold">{settings.intervals.rounds}x{settings.intervals.workDistance}m</span>
                                            <span className="mx-1">com</span>
                                            <span className="text-white font-bold">{settings.intervals.restTime}s</span>
                                            <span className="ml-1">descanso</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Botão Iniciar */}
                            <Button
                                onClick={handleStart}
                                disabled={!canStart() || isLoading}
                                className="w-full h-16 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-xl font-bold gap-3 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Play className="w-7 h-7 fill-white" />
                                        INICIAR TREINO
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function StartWorkoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <StartWorkoutContent />
        </Suspense>
    );
}
