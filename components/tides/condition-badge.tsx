'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConditionRating } from '@/types/rowing-conditions';

interface ConditionBadgeProps {
    rating: ConditionRating;
    label: string;
    description: string;
    relativeAngle: number;
    className?: string;
}

export function ConditionBadge({
    rating,
    label,
    description,
    relativeAngle,
    className
}: ConditionBadgeProps) {
    const getConfig = () => {
        switch (rating) {
            case 'favorable':
                return {
                    color: 'green',
                    bgClass: 'from-green-500/30 to-emerald-500/30',
                    borderClass: 'border-green-400/50',
                    textClass: 'text-green-300',
                    icon: CheckCircle,
                    emoji: '✓'
                };
            case 'technical':
                return {
                    color: 'yellow',
                    bgClass: 'from-yellow-500/30 to-amber-500/30',
                    borderClass: 'border-yellow-400/50',
                    textClass: 'text-yellow-300',
                    icon: AlertTriangle,
                    emoji: '⚠'
                };
            case 'difficult':
                return {
                    color: 'red',
                    bgClass: 'from-red-500/30 to-rose-500/30',
                    borderClass: 'border-red-400/50',
                    textClass: 'text-red-300',
                    icon: XCircle,
                    emoji: '✕'
                };
        }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={cn(
                'relative overflow-hidden rounded-xl p-4 border-2',
                `bg-gradient-to-br ${config.bgClass}`,
                config.borderClass,
                className
            )}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: rating === 'difficult' ? [0, -10, 10, 0] : 0
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Icon className={cn('w-6 h-6', config.textClass)} />
                    </motion.div>
                    <span className="text-xs text-white/60 uppercase tracking-wider">
                        Classificação
                    </span>
                </div>
                <span className="text-2xl">{config.emoji}</span>
            </div>

            <div className="space-y-1">
                <p className={cn('text-2xl font-bold uppercase', config.textClass)}>
                    {label}
                </p>
                <p className="text-sm text-white/70">
                    {description}
                </p>
                <p className="text-xs text-white/50">
                    Ângulo relativo: {relativeAngle}°
                </p>
            </div>

            {/* Barra de progresso visual */}
            <div className="mt-3 h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(relativeAngle / 180) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                        'h-full rounded-full',
                        rating === 'favorable' && 'bg-green-400',
                        rating === 'technical' && 'bg-yellow-400',
                        rating === 'difficult' && 'bg-red-400'
                    )}
                />
            </div>
        </motion.div>
    );
}
