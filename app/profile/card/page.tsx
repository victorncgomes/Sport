
'use client';

import React from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    QrCode,
    Download,
    Share2,
    ShieldCheck,
    Calendar,
    Award,
    Zap,
    Trophy,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MemberCardPage() {
    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Carteira Digital"
                subtitle="Identidade Rubro-Negra"
                description="Seu cartão de acesso e identificação oficial do Sport Club de Natal."
                compact
            />

            <div className="container mx-auto px-4 -mt-12 relative z-20 flex flex-col items-center">

                {/* 3D-ish Card Effect */}
                <div className="w-full max-w-[400px] perspective-1000 mb-12">
                    <motion.div
                        initial={{ rotateY: -30, opacity: 0, y: 50 }}
                        animate={{ rotateY: 0, opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <AnimatedCard variant="metal" className="p-0 overflow-hidden shadow-2xl border-white/20 aspect-[1.6/1]">
                            {/* Card Header */}
                            <div className="p-6 pb-2 flex justify-between items-start bg-gradient-to-b from-white/5 to-transparent">
                                <div className="flex gap-3">
                                    <div className="relative w-10 h-10">
                                        <Image src="/SCN.svg" alt="SCN" fill sizes="40px" className="drop-shadow-glow" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-black text-sm uppercase tracking-tighter leading-none">Sport Club</h2>
                                        <h2 className="text-club-red font-black text-sm uppercase tracking-tighter leading-none">de Natal</h2>
                                    </div>
                                </div>
                                <ShieldCheck className="w-6 h-6 text-club-gold" />
                            </div>

                            {/* Card Content */}
                            <div className="p-8 pt-4">
                                <div className="flex gap-8 items-end justify-between">
                                    <div className="flex-1">
                                        <p className="text-white/30 text-[8px] uppercase font-black tracking-[0.2em] mb-1">Membro Titular</p>
                                        <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-4 leading-none">Victor Manoel</h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-white/20 text-[6px] uppercase font-bold tracking-widest">Matrícula</p>
                                                <p className="text-white font-bold text-xs">MT-2024-001</p>
                                            </div>
                                            <div>
                                                <p className="text-white/20 text-[6px] uppercase font-bold tracking-widest">Desde</p>
                                                <p className="text-white font-bold text-xs">JAN 2024</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Small avatar or placeholder */}
                                    <div className="w-20 h-24 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                                        <span className="text-white/20 font-black text-4xl">SCN</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-8 py-3 bg-club-red flex justify-between items-center">
                                <span className="text-white font-black text-[10px] uppercase tracking-widest">Sócio Diamante</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-white opacity-80" />
                                    <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Card Back Shadow / Glow */}
                        <div className="absolute -inset-1 bg-club-red/20 blur-2xl rounded-3xl -z-10" />
                    </motion.div>
                </div>

                {/* QR Code Action Card */}
                <AnimatedCard variant="glass" className="w-full max-w-[500px] p-8 text-center">
                    <div className="mb-8">
                        <div className="relative inline-block p-6 rounded-3xl bg-white flex items-center justify-center shadow-xl">
                            <QrCode className="w-40 h-40 text-black" />
                            <div className="absolute inset-0 border-4 border-black/5 rounded-3xl" />
                        </div>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mt-6">Aproxime para Check-in</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <Award className="w-5 h-5 text-club-gold mx-auto mb-2" />
                            <p className="text-white font-black text-sm">Diamante</p>
                            <p className="text-white/30 text-[8px] uppercase font-bold">Categoria</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <Zap className="w-5 h-5 text-club-red mx-auto mb-2" />
                            <p className="text-white font-black text-sm">Ativo</p>
                            <p className="text-white/30 text-[8px] uppercase font-bold">Status</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button className="flex-1 h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest gap-2">
                            <Download className="w-4 h-4" /> Baixar PDF
                        </Button>
                        <Button className="flex-1 h-14 bg-club-red hover:bg-club-red-700 text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-glow-red">
                            <Share2 className="w-4 h-4" /> Compartilhar
                        </Button>
                    </div>
                </AnimatedCard>

                {/* Benefits List */}
                <div className="w-full max-w-[500px] mt-12 space-y-4">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Vantagens de Sócio Diamante</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-club-gold/20 flex items-center justify-center text-club-gold">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm italic">Prioridade em Regatas</h4>
                                <p className="text-white/30 text-[10px] font-medium uppercase">Vagas garantidas em eventos oficiais</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm italic">Desconto na Store</h4>
                                <p className="text-white/30 text-[10px] font-medium uppercase">20% de desconto em todo catálogo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
