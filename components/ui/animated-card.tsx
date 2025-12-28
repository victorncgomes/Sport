'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { scaleIn } from '@/lib/framer-variants';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'default' | 'glass' | 'gradient' | 'solid' | 'metal' | 'carbon';
    hover?: boolean | 'lift' | 'glow';
}

export function AnimatedCard({
    children,
    className = '',
    onClick,
    variant = 'default',
    hover = true,
}: AnimatedCardProps) {
    const baseStyles = 'p-6 transition-all duration-300';

    const variantStyles = {
        default: 'bg-club-black-50 border border-white/10',
        glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
        gradient: 'bg-gradient-to-br from-club-red/20 to-club-black border border-club-red/20',
        solid: 'bg-club-black-100 border border-white/5',
        metal: 'bg-[#1a1a1a] border border-white/10 shadow-inner relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none',
        carbon: 'bg-[#0a0a0a] border border-white/5 shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(45deg,#111_25%,transparent_25%,transparent_50%,#111_50%,#111_75%,transparent_75%,transparent)] before:bg-[length:4px_4px] before:opacity-20 before:pointer-events-none',
    };

    const hoverStyles = hover === 'lift'
        ? 'hover:-translate-y-2 hover:shadow-2xl hover:border-white/20'
        : hover === 'glow' || hover === true
            ? 'hover:bg-white/10 hover:border-club-red/30 hover:shadow-glow-red hover:scale-[1.02]'
            : '';
    const cursorStyles = onClick ? 'cursor-pointer' : '';

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={scaleIn}
            whileHover={hover && onClick ? 'hover' : undefined}
            onClick={onClick}
            className={cn(baseStyles, variantStyles[variant], hoverStyles, cursorStyles, className)}
        >
            {children}
        </motion.div>
    );
}

interface GlowCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: 'red' | 'gold' | 'white';
}

export function GlowCard({ children, className = '', glowColor = 'red' }: GlowCardProps) {
    const glowColors = {
        red: 'hover:shadow-glow-red',
        gold: 'hover:shadow-glow-gold',
        white: 'hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]',
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className={cn(
                'p-6 bg-club-black-50 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-club-red/30',
                glowColors[glowColor],
                className
            )}
        >
            {children}
        </motion.div>
    );
}

interface StatCardProps {
    value: string;
    label: string;
    icon?: ReactNode;
    className?: string;
}

export function StatCard({ value, label, icon, className = '' }: StatCardProps) {
    return (
        <div className={cn(
            'glass-card p-6 text-center',
            className
        )}>
            {icon && (
                <div className="w-12 h-12 mx-auto bg-club-red/20 flex items-center justify-center mb-3">
                    {icon}
                </div>
            )}
            <div className="text-3xl sm:text-4xl font-bold text-club-gold mb-1">
                {value}
            </div>
            <p className="text-sm text-white/50">{label}</p>
        </div>
    );
}
