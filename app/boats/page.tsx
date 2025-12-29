'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BoatCard } from '@/components/boats';
import { XPBar } from '@/components/gamification';
import {
    BOAT_HIERARCHY,
    getBoatUnlockProgress,
    checkBoatUnlockCriteria,
    getNextBoatToUnlock
} from '@/lib/utils/boat-progression';
import { Anchor, Ship, Trophy, Target } from 'lucide-react';

export default function BoatsPage() {
    const { data: session } = useSession();
    const [unlockedBoats, setUnlockedBoats] = useState<string[]>(['TANQUE']);
    const [userStats, setUserStats] = useState({
        totalHours: 0,
        tankWorkouts: 0,
        bestPace: null as string | null,
        competitions: 0,
        podiums: 0,
        coachApproved: false,
        unlockedBoats: ['TANQUE']
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/boats/my-boats');
                if (res.ok) {
                    const data = await res.json();
                    setUnlockedBoats(data.unlockedBoats || ['TANQUE']);
                    setUserStats(prev => ({ ...prev, ...data.stats, unlockedBoats: data.unlockedBoats || ['TANQUE'] }));
                }
            } catch (error) {
                console.error('Error fetching boats:', error);
            } finally {
                setLoading(false);
            }
        }

        if (session?.user) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [session]);

    const nextBoat = getNextBoatToUnlock(unlockedBoats);
    const totalUnlocked = unlockedBoats.length;
    const totalBoats = BOAT_HIERARCHY.length;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Galeria de Barcos"
                subtitle="Progressão"
                description="Desbloqueie novos barcos conforme evolui"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Ship className="w-6 h-6 text-club-red mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{totalUnlocked}</div>
                        <div className="text-xs text-white/60">Desbloqueados</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Anchor className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{totalBoats - totalUnlocked}</div>
                        <div className="text-xs text-white/60">Restantes</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{userStats.totalHours}h</div>
                        <div className="text-xs text-white/60">Horas Remadas</div>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Target className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{userStats.bestPace || '--:--'}</div>
                        <div className="text-xs text-white/60">Melhor Pace</div>
                    </AnimatedCard>
                </div>

                {/* XP Bar */}
                <AnimatedCard variant="glass" className="p-4">
                    <XPBar xp={session?.user?.points || 0} />
                </AnimatedCard>

                {/* Próximo Barco */}
                {nextBoat && (
                    <AnimatedCard variant="gradient" className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Target className="w-5 h-5 text-yellow-400" />
                            <span className="text-white font-bold">Próximo Objetivo</span>
                        </div>
                        <p className="text-white/80 text-sm mb-2">
                            Desbloquear: <span className="text-yellow-400 font-bold">{nextBoat.displayName}</span>
                        </p>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                                style={{ width: `${getBoatUnlockProgress(nextBoat.id, userStats)}%` }}
                            />
                        </div>
                        <p className="text-white/40 text-xs mt-1">
                            {getBoatUnlockProgress(nextBoat.id, userStats)}% completo
                        </p>
                    </AnimatedCard>
                )}

                {/* Separador por nível */}
                {['INICIANTE', 'INTERMEDIARIO', 'AVANCADO', 'ELITE'].map(level => {
                    const boatsInLevel = BOAT_HIERARCHY.filter(b => b.level === level);
                    const levelLabels: Record<string, string> = {
                        INICIANTE: '🌊 Iniciante',
                        INTERMEDIARIO: '💪 Intermediário',
                        AVANCADO: '🔥 Avançado',
                        ELITE: '👑 Elite'
                    };

                    return (
                        <div key={level}>
                            <h2 className="text-lg font-bold text-white mb-4">{levelLabels[level]}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {boatsInLevel.map(boat => {
                                    const isUnlocked = unlockedBoats.includes(boat.id) || boat.id === 'TANQUE';
                                    const { missingCriteria } = checkBoatUnlockCriteria(boat.id, userStats);
                                    const progress = getBoatUnlockProgress(boat.id, userStats);

                                    return (
                                        <BoatCard
                                            key={boat.id}
                                            boat={boat}
                                            isUnlocked={isUnlocked}
                                            progress={progress}
                                            missingCriteria={missingCriteria}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
