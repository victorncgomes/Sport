'use client';

import { motion } from 'framer-motion';
import { Star, Zap } from 'lucide-react';
import { getGamificationData, formatXP } from '@/lib/utils/xp-system';

interface XPBarProps {
    xp: number;
    showDetails?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function XPBar({ xp, showDetails = true, size = 'md', className = '' }: XPBarProps) {
    const data = getGamificationData(xp);

    const sizeClasses = {
        sm: { bar: 'h-2', text: 'text-xs', icon: 'w-4 h-4' },
        md: { bar: 'h-3', text: 'text-sm', icon: 'w-5 h-5' },
        lg: { bar: 'h-4', text: 'text-base', icon: 'w-6 h-6' }
    };

    const sizes = sizeClasses[size];

    return (
        <div className={`w-full ${className}`}>
            {showDetails && (
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                            <Star className="w-4 h-4 text-white fill-white" />
                        </div>
                        <div>
                            <span className="text-white font-bold">Nível {data.level}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Zap className={sizes.icon} />
                        <span className={`font-bold ${sizes.text}`}>{data.formattedXP} XP</span>
                    </div>
                </div>
            )}

            {/* Barra de progresso */}
            <div className={`relative w-full ${sizes.bar} bg-white/10 rounded-full overflow-hidden`}>
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />

                {/* Brilho animado */}
                <motion.div
                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '500%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
            </div>

            {showDetails && (
                <div className="flex justify-between mt-1">
                    <span className={`text-white/40 ${sizes.text}`}>
                        {data.xpInLevel} / {data.xpNeededForLevel} XP
                    </span>
                    <span className={`text-white/40 ${sizes.text}`}>
                        Nível {data.level + 1}
                    </span>
                </div>
            )}
        </div>
    );
}

// Componente mini para usar em headers
export function XPBadge({ xp, onClick }: { xp: number; onClick?: () => void }) {
    const data = getGamificationData(xp);

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:border-yellow-500/50 transition-all"
        >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Star className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-yellow-400 font-bold text-sm">Lv.{data.level}</span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </button>
    );
}
