'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { XPBar, LevelUpModal, useXPGain } from '@/components/gamification';
import {
    Trophy, Clock, MapPin, TrendingUp, Activity, Zap,
    Star, ChevronRight, Share2, Camera, SaveAll
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface WorkoutSummary {
    duration: number;
    distance: number;
    avgPace: string;
    calories: number;
    xpEarned: number;
    personalRecords: string[];
}

function CooldownContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const { data: session } = useSession();

    const [summary, setSummary] = useState<WorkoutSummary | null>(null);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [levelUpInfo, setLevelUpInfo] = useState({ oldLevel: 1, newLevel: 2, rewards: [] as string[] });
    const [stretching, setStretching] = useState(false);

    const { showXPGain, XPGainComponent } = useXPGain();

    useEffect(() => {
        async function fetchSummary() {
            if (!sessionId) {
                // Dados demo se não houver sessão
                setSummary({
                    duration: 2700, // 45 min
                    distance: 8500, // 8.5km
                    avgPace: '2:38',
                    calories: 420,
                    xpEarned: 25,
                    personalRecords: []
                });
                return;
            }

            try {
                const res = await fetch(`/api/workouts/${sessionId}/summary`);
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data);

                    // Verificar level up
                    if (data.leveledUp) {
                        setTimeout(() => {
                            setLevelUpInfo({
                                oldLevel: data.oldLevel,
                                newLevel: data.newLevel,
                                rewards: data.rewards || []
                            });
                            setShowLevelUp(true);
                        }, 1500);
                    }

                    // Mostrar XP ganho
                    setTimeout(() => showXPGain(data.xpEarned || 25), 500);
                }
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        }

        fetchSummary();
    }, [sessionId, showXPGain]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
            return `${hrs}h ${mins}min`;
        }
        return `${mins}min ${secs}s`;
    };

    const handleFinish = () => {
        router.push('/training');
    };

    const handleShare = () => {
        if (navigator.share && summary) {
            navigator.share({
                title: 'Treino Concluído! 🚣',
                text: `Remei ${(summary.distance / 1000).toFixed(1)}km em ${formatTime(summary.duration)} com pace médio de ${summary.avgPace}/500m. #SportClub #Remo`,
                url: window.location.href
            });
        }
    };

    if (!summary) {
        return (
            <div className="min-h-screen bg-club-black flex items-center justify-center">
                <motion.div
                    className="w-16 h-16 border-4 border-club-red border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <XPGainComponent />
            <LevelUpModal
                isOpen={showLevelUp}
                onClose={() => setShowLevelUp(false)}
                {...levelUpInfo}
            />

            {/* Hero de sucesso */}
            <div className="bg-gradient-to-b from-emerald-600/30 to-transparent p-8 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                >
                    <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                </motion.div>
                <motion.h1
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Treino Concluído!
                </motion.h1>
                <motion.p
                    className="text-white/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Excelente trabalho! Descanse e hidrate-se.
                </motion.p>
            </div>

            <div className="container mx-auto px-4 py-6 space-y-4">
                {/* XP ganho */}
                <AnimatedCard variant="gradient" className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 font-bold">+{summary.xpEarned} XP</span>
                        </div>
                        <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <XPBar xp={(session?.user as any)?.points || 0} size="sm" />
                </AnimatedCard>

                {/* Métricas do treino */}
                <div className="grid grid-cols-2 gap-3">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{formatTime(summary.duration)}</div>
                        <div className="text-xs text-white/60">Duração</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{(summary.distance / 1000).toFixed(2)} km</div>
                        <div className="text-xs text-white/60">Distância</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{summary.avgPace}</div>
                        <div className="text-xs text-white/60">Pace Médio /500m</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Activity className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{summary.calories}</div>
                        <div className="text-xs text-white/60">Calorias</div>
                    </AnimatedCard>
                </div>

                {/* Records pessoais */}
                {summary.personalRecords.length > 0 && (
                    <AnimatedCard variant="gradient" className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="text-yellow-400 font-bold">Novos Records!</span>
                        </div>
                        <ul className="space-y-2">
                            {summary.personalRecords.map((record, i) => (
                                <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    {record}
                                </li>
                            ))}
                        </ul>
                    </AnimatedCard>
                )}

                {/* Alongamento sugerido */}
                <AnimatedCard variant="glass" className="p-4">
                    <h3 className="text-white font-bold mb-2">Alongamento Recomendado</h3>
                    <p className="text-white/60 text-sm mb-3">
                        5-10 minutos de alongamento para recuperação muscular.
                    </p>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push('/training/stretching')}
                    >
                        Iniciar Alongamento
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </AnimatedCard>

                {/* Ações */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleShare}
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                    </Button>
                    <Button
                        className="flex-1 bg-club-red hover:bg-club-red/90"
                        onClick={handleFinish}
                    >
                        Finalizar
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function CooldownPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-club-black flex items-center justify-center">
                <motion.div
                    className="w-16 h-16 border-4 border-club-red border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        }>
            <CooldownContent />
        </Suspense>
    );
}
