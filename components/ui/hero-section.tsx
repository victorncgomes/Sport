'use client';

import React, { ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Waves } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { fadeInUp, slideInRight } from '@/lib/framer-variants';

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    description?: string;
    children?: ReactNode;
    backgroundImage?: string;
    showLogo?: boolean;
    compact?: boolean;
    className?: string;
}

export function HeroSection({
    title,
    subtitle,
    description,
    children,
    backgroundImage,
    showLogo = true,
    compact = false,
    className = '',
}: HeroSectionProps) {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, -50]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);

    // Enhanced title logic for coloring
    const formatTitle = (text: string) => {
        const words = text.split(' ');
        if (words.length <= 1) return text;
        return (
            <>
                <span className="text-club-red">
                    {words[0]} {words[1]}
                </span>
                <br />
                <span className="text-white">
                    {words.slice(2).join(' ')}
                </span>
            </>
        );
    };

    return (
        <section
            className={`relative ${compact ? 'min-h-[50vh]' : 'min-h-[85vh]'} flex items-center justify-center overflow-hidden bg-club-black ${className}`}
        >
            {/* Background Layer - Full Edge to Edge */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-club-black/80 via-club-black/60 to-club-black z-10" />
                {backgroundImage ? (
                    <Image
                        src={backgroundImage}
                        alt="Hero background"
                        fill
                        className="object-cover opacity-50 scale-105"
                        quality={90}
                        priority
                    />
                ) : (
                    <div
                        className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
                        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
                    />
                )}
            </div>

            {/* Carbon Fiber Texture Layer */}
            <div
                className="absolute inset-0 z-5 opacity-20"
                style={{
                    backgroundImage: "url('/textures/carbon-fiber.svg')",
                    backgroundSize: '400px 400px',
                    backgroundRepeat: 'repeat'
                }}
            />

            {/* Parallax & Pattern Layer */}
            {!compact && (
                <motion.div
                    style={{ y: y1, opacity }}
                    className="absolute inset-0 z-1"
                >
                    <div
                        className="absolute inset-0 opacity-[0.03]"
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
                </motion.div>
            )}

            {/* Red accent glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-club-red/20 blur-[120px] z-10" />

            {/* Content */}
            <div className="container relative z-20 px-6 py-20 text-center md:text-left">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="max-w-4xl"
                >
                    {/* Logo/Badge */}
                    {showLogo && (
                        <div className="mb-8 flex md:justify-start justify-center">
                            {compact ? (
                                <motion.div
                                    variants={slideInRight}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-club-red/10 backdrop-blur-sm border border-club-red/20"
                                >
                                    <Waves className="w-4 h-4 text-club-red" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                                        {subtitle || 'Desde 1915'}
                                    </span>
                                </motion.div>
                            ) : (
                                <div className="relative w-24 h-24 md:w-32 md:h-32">
                                    <Image
                                        src="/SCN.svg"
                                        alt="Sport Club de Natal"
                                        width={128}
                                        height={128}
                                        style={{ width: 'auto', height: 'auto' }}
                                        className="drop-shadow-glow-red"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {!compact && subtitle && (
                        <motion.div
                            variants={slideInRight}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-club-red/20 backdrop-blur-sm border border-club-red/30 mb-6"
                        >
                            <span className="w-2 h-2 bg-club-red animate-pulse" />
                            <span className="text-sm font-semibold text-white uppercase tracking-widest">
                                {subtitle}
                            </span>
                        </motion.div>
                    )}

                    <motion.h1
                        variants={fadeInUp}
                        className={cn(
                            "font-black mb-6 uppercase tracking-tighter",
                            compact ? "text-4xl md:text-6xl" : "text-5xl md:text-8xl"
                        )}
                    >
                        {formatTitle(title)}
                    </motion.h1>

                    {description && (
                        <motion.p
                            variants={fadeInUp}
                            className="text-lg md:text-xl text-white/50 mb-8 max-w-2xl leading-relaxed italic"
                        >
                            "{description}"
                        </motion.p>
                    )}

                    {children && (
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center"
                        >
                            {children}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
