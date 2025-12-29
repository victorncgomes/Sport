'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Gift, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    oldLevel: number;
    newLevel: number;
    rewards: string[];
}

export function LevelUpModal({ isOpen, onClose, oldLevel, newLevel, rewards }: LevelUpModalProps) {
    const hasPlayedConfetti = useRef(false);

    useEffect(() => {
        if (isOpen && !hasPlayedConfetti.current) {
            hasPlayedConfetti.current = true;

            // Explosão de confete
            const duration = 3000;
            const end = Date.now() + duration;

            const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        }

        if (!isOpen) {
            hasPlayedConfetti.current = false;
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative bg-gradient-to-b from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full text-center overflow-hidden"
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{ type: 'spring', damping: 15 }}
                    >
                        {/* Raios de luz */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent, rgba(251, 191, 36, 0.1), transparent, rgba(251, 191, 36, 0.1), transparent)'
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            />
                        </div>

                        {/* Conteúdo */}
                        <div className="relative">
                            {/* Ícone de estrela */}
                            <motion.div
                                className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                            >
                                <Star className="w-10 h-10 text-white fill-white" />
                            </motion.div>

                            {/* Título */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                    <h2 className="text-2xl font-bold text-yellow-400">LEVEL UP!</h2>
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                </div>
                            </motion.div>

                            {/* Transição de nível */}
                            <motion.div
                                className="flex items-center justify-center gap-4 my-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className="text-4xl font-bold text-white/50">{oldLevel}</span>
                                <motion.div
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                    <span className="text-2xl text-yellow-400">→</span>
                                </motion.div>
                                <motion.span
                                    className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                >
                                    {newLevel}
                                </motion.span>
                            </motion.div>

                            {/* Recompensas */}
                            {rewards.length > 0 && (
                                <motion.div
                                    className="bg-white/5 rounded-xl p-4 mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-3 text-yellow-400">
                                        <Gift className="w-5 h-5" />
                                        <span className="font-bold">Recompensas Desbloqueadas!</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {rewards.map((reward, index) => (
                                            <motion.li
                                                key={index}
                                                className="flex items-center gap-2 text-white/80 text-sm"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 1 + index * 0.1 }}
                                            >
                                                <Trophy className="w-4 h-4 text-yellow-500" />
                                                {reward}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Botão */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                            >
                                <Button
                                    onClick={onClose}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                                >
                                    Continuar
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
