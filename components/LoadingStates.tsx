'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Waves } from 'lucide-react';

// Spinner with carbon fiber effect
export const CarbonSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <motion.div
                className={`${sizeClasses[size]} rounded-full border-4 border-gray-800`}
                style={{
                    borderTopColor: '#DC2626',
                    borderRightColor: '#FFD700',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <Waves className="w-4 h-4 text-red-600" />
            </div>
        </div>
    );
};

// Wave loader for nautical theme
export const WaveLoader: React.FC = () => {
    return (
        <div className="flex items-end justify-center gap-2 h-12">
            {[0, 1, 2, 3, 4].map((index) => (
                <motion.div
                    key={index}
                    className="w-2 bg-gradient-to-t from-red-600 to-gold-600 rounded-full"
                    animate={{
                        height: ['20%', '100%', '20%'],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: index * 0.15,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};

// Progress bar with shine effect
export const ProgressBar: React.FC<{
    progress: number;
    label?: string;
}> = ({ progress, label }) => {
    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{label}</span>
                    <span className="text-white font-mono">{Math.round(progress)}%</span>
                </div>
            )}
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-gold-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

// Skeleton screen for cards
export const SkeletonCard: React.FC = () => {
    return (
        <div className="rounded-2xl bg-gray-900 p-6 border border-gray-800">
            <div className="animate-pulse space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-800 rounded w-1/3" />
                        <div className="h-3 bg-gray-800 rounded w-1/2" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-800 rounded" />
                    <div className="h-3 bg-gray-800 rounded w-5/6" />
                    <div className="h-3 bg-gray-800 rounded w-4/6" />
                </div>

                {/* Footer */}
                <div className="flex gap-2">
                    <div className="h-8 bg-gray-800 rounded flex-1" />
                    <div className="h-8 bg-gray-800 rounded w-20" />
                </div>
            </div>
        </div>
    );
};

// Full page loader
export const PageLoader: React.FC<{ message?: string }> = ({
    message = 'Carregando...'
}) => {
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
                <CarbonSpinner size="lg" />
                <motion.p
                    className="mt-4 text-gray-400 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {message}
                </motion.p>
            </div>
        </div>
    );
};

// Button loading state
export const ButtonLoader: React.FC = () => {
    return (
        <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processando...</span>
        </motion.div>
    );
};

// Gaming-style loading screen
export const GamingLoader: React.FC<{ title?: string }> = ({
    title = 'Sport Club de Natal'
}) => {
    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            {/* Carbon fiber background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
            linear-gradient(27deg, #151515 5px, transparent 5px) 0 5px,
            linear-gradient(207deg, #151515 5px, transparent 5px) 10px 0px,
            linear-gradient(27deg, #222 5px, transparent 5px) 0px 10px,
            linear-gradient(207deg, #222 5px, transparent 5px) 10px 5px,
            linear-gradient(90deg, #1b1b1b 10px, transparent 10px),
            linear-gradient(#1d1d1d 25%, #1a1a1a 25%, #1a1a1a 50%, transparent 50%, transparent 75%, #242424 75%, #242424)
          `,
                    backgroundSize: '20px 20px',
                }}
            />

            <div className="relative z-10 text-center">
                {/* Logo */}
                <motion.div
                    className="inline-block mb-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-600 to-gold-600 rounded-2xl blur-2xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-black flex items-center justify-center border-2 border-red-500/50">
                            <span className="font-display text-5xl font-bold text-white">S</span>
                        </div>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="font-display text-4xl font-bold mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="bg-gradient-to-r from-red-600 via-red-500 to-gold-600 bg-clip-text text-transparent">
                        {title}
                    </span>
                </motion.h1>

                {/* Progress */}
                <motion.div
                    className="w-64 mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <ProgressBar progress={75} />
                </motion.div>
            </div>
        </div>
    );
};
