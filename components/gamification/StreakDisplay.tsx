'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Star, Zap, Target } from 'lucide-react';

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    trainedToday: boolean;
    nextMilestone: number | null;
    daysToNextMilestone: number | null;
    achievements: { name: string; days: number; xp: number }[];
}

interface StreakDisplayProps {
    variant?: 'compact' | 'full';
    className?: string;
}

export function StreakDisplay({ variant = 'compact', className = '' }: StreakDisplayProps) {
    const [data, setData] = useState<StreakData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStreak() {
            try {
                const res = await fetch('/api/gamification/streak');
                if (res.ok) {
                    const streakData = await res.json();
                    setData(streakData);
                }
            } catch (error) {
                console.error('Error fetching streak:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStreak();
    }, []);

    if (loading) {
        return (
            <div className={`animate-pulse bg-white/5 rounded-xl h-16 ${className}`} />
        );
    }

    if (!data) return null;

    if (variant === 'compact') {
        return (
            <motion.div
                className={`flex items-center gap-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl px-4 py-3 ${className}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <motion.div
                    animate={data.currentStreak > 0 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                    <Flame className={`w-6 h-6 ${data.currentStreak > 0 ? 'text-orange-400' : 'text-white/30'}`} />
                </motion.div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-white">{data.currentStreak}</span>
                        <span className="text-xs text-white/60 uppercase font-bold">dias</span>
                    </div>
                    {data.nextMilestone && (
                        <div className="text-[10px] text-white/40">
                            Faltam {data.daysToNextMilestone} para {data.nextMilestone} dias!
                        </div>
                    )}
                </div>
                {data.trainedToday && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                    >
                        <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full">
                            ✓ HOJE
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    }

    // Full variant
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Streak principal */}
            <motion.div
                className="bg-gradient-to-br from-orange-600/30 to-red-600/30 border border-orange-500/30 rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    animate={data.currentStreak > 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="mb-4"
                >
                    <Flame className={`w-12 h-12 mx-auto ${data.currentStreak > 0 ? 'text-orange-400' : 'text-white/30'}`} />
                </motion.div>
                <div className="text-5xl font-black text-white mb-1">{data.currentStreak}</div>
                <div className="text-sm text-white/60 uppercase font-bold tracking-wider">Dias Consecutivos</div>

                {/* Progress para próximo milestone */}
                {data.nextMilestone && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-white/40 mb-1">
                            <span>{data.currentStreak} dias</span>
                            <span>{data.nextMilestone} dias</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${(data.currentStreak / data.nextMilestone) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <div className="text-xs text-white/60 mt-2">
                            <Zap className="w-3 h-3 inline mr-1" />
                            Faltam <strong>{data.daysToNextMilestone}</strong> dias para próximo bônus!
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{data.longestStreak}</div>
                    <div className="text-[10px] text-white/40 uppercase">Maior Streak</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                    <Star className="w-5 h-5 text-club-gold mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{data.achievements.length}</div>
                    <div className="text-[10px] text-white/40 uppercase">Conquistas</div>
                </div>
            </div>

            {/* Conquistas */}
            {data.achievements.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-xs text-white/60 uppercase font-bold">Conquistas de Streak</h4>
                    {data.achievements.map((ach, i) => (
                        <motion.div
                            key={ach.days}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-white font-medium">{ach.name}</span>
                                <span className="text-xs text-white/40">({ach.days} dias)</span>
                            </div>
                            <div className="text-xs text-emerald-400 font-bold">+{ach.xp} XP</div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StreakDisplay;
