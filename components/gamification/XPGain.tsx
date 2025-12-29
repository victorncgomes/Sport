'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { getXPAnimationIntensity } from '@/lib/utils/xp-system';

interface XPGainProps {
    amount: number;
    isVisible: boolean;
    onComplete?: () => void;
}

export function XPGain({ amount, isVisible, onComplete }: XPGainProps) {
    const intensity = getXPAnimationIntensity(amount);

    const intensityStyles = {
        small: {
            fontSize: 'text-lg',
            icon: 'w-4 h-4',
            duration: 1.5,
            distance: -50,
        },
        medium: {
            fontSize: 'text-2xl',
            icon: 'w-5 h-5',
            duration: 2,
            distance: -80,
        },
        large: {
            fontSize: 'text-4xl',
            icon: 'w-8 h-8',
            duration: 2.5,
            distance: -120,
        },
    };

    const style = intensityStyles[intensity];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`flex items-center gap-2 ${style.fontSize} font-bold text-yellow-400`}
                        initial={{
                            opacity: 0,
                            scale: intensity === 'large' ? 1.5 : 1,
                            y: 0
                        }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [intensity === 'large' ? 1.5 : 1, 1, 1, 0.8],
                            y: [0, style.distance / 2, style.distance, style.distance - 20]
                        }}
                        transition={{
                            duration: style.duration,
                            times: [0, 0.2, 0.8, 1]
                        }}
                        onAnimationComplete={onComplete}
                    >
                        <Zap className={`${style.icon} fill-yellow-400`} />
                        <span className="drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                            +{amount} XP
                        </span>
                    </motion.div>

                    {/* Partículas para animação grande */}
                    {intensity === 'large' && (
                        <>
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                    initial={{
                                        opacity: 0,
                                        x: 0,
                                        y: 0,
                                        scale: 0
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        x: Math.cos((i / 8) * Math.PI * 2) * 100,
                                        y: Math.sin((i / 8) * Math.PI * 2) * 100 - 50,
                                        scale: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.2,
                                        ease: 'easeOut'
                                    }}
                                />
                            ))}
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Hook para usar o XPGain
import { useState, useCallback } from 'react';

export function useXPGain() {
    const [xpGain, setXPGain] = useState<{ amount: number; visible: boolean }>({
        amount: 0,
        visible: false
    });

    const showXPGain = useCallback((amount: number) => {
        setXPGain({ amount, visible: true });
    }, []);

    const hideXPGain = useCallback(() => {
        setXPGain(prev => ({ ...prev, visible: false }));
    }, []);

    const XPGainComponent = () => (
        <XPGain
            amount={xpGain.amount}
            isVisible={xpGain.visible}
            onComplete={hideXPGain}
        />
    );

    return { showXPGain, XPGainComponent };
}
