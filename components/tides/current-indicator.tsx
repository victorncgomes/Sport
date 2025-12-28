'use client';

import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurrentIndicatorProps {
    speed_m_s: number;
    direction_deg: number;
    directionText: string;
    className?: string;
}

export function CurrentIndicator({
    speed_m_s,
    direction_deg,
    directionText,
    className
}: CurrentIndicatorProps) {
    // Determinar cor baseada na velocidade
    const getSpeedColor = () => {
        if (speed_m_s < 0.3) return 'text-blue-300';
        if (speed_m_s < 0.7) return 'text-cyan-400';
        if (speed_m_s < 1.0) return 'text-yellow-400';
        return 'text-orange-400';
    };

    const getSpeedLabel = () => {
        if (speed_m_s < 0.3) return 'Fraca';
        if (speed_m_s < 0.7) return 'Moderada';
        if (speed_m_s < 1.0) return 'Forte';
        return 'Muito Forte';
    };

    return (
        <div className={cn('relative', className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Indicador de direção animado */}
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center',
                            'bg-gradient-to-br from-cyan-500/30 to-blue-500/30',
                            'border-2 border-cyan-400/50'
                        )}
                        style={{ transform: `rotate(${direction_deg}deg)` }}
                    >
                        <Navigation className={cn('w-6 h-6', getSpeedColor())} />
                    </motion.div>

                    <div>
                        <p className="text-xs text-white/60 uppercase tracking-wider">
                            Correnteza
                        </p>
                        <p className="text-2xl font-bold text-white">
                            {speed_m_s.toFixed(2)} <span className="text-sm">m/s</span>
                        </p>
                        <p className="text-xs text-white/50">
                            {getSpeedLabel()}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xs text-white/60 uppercase">Direção</p>
                    <p className="text-2xl font-bold text-cyan-300">
                        {directionText}
                    </p>
                    <p className="text-xs text-white/50">
                        {direction_deg}°
                    </p>
                </div>
            </div>
        </div>
    );
}
