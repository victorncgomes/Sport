'use client';

import React from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { regatas, Competition } from '@/lib/data/competitions';
import { Trophy, Calendar, MapPin, Users, ArrowRight, Medal, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CompetitionsPage() {
    const statusLabels = {
        upcoming: { label: 'Em Breve', class: 'bg-white/5 text-white/40' },
        open: { label: 'Inscrições Abertas', class: 'bg-emerald-500/20 text-emerald-400' },
        ongoing: { label: 'Em Andamento', class: 'bg-blue-500/20 text-blue-400' },
        finished: { label: 'Finalizada', class: 'bg-club-red/20 text-club-red' },
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Competições & Regatas"
                subtitle="Desafio & Glória"
                description="O calendário oficial de competições onde o Sport Club de Natal mostra sua força nas águas."
                compact
            />

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Highlight */}
                    <div className="lg:col-span-1 space-y-6">
                        <AnimatedCard variant="gradient" className="p-8">
                            <Trophy className="w-12 h-12 text-club-gold mb-6" />
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Tradição Vencedora</h2>
                            <p className="text-sm text-white/60 leading-relaxed mb-8">
                                Participar de uma regata pelo SCN é honrar um legado centenário. Nossos atletas competem com brio em todos os níveis, desde provas internas até campeonatos nacionais.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <Medal className="w-8 h-8 text-club-gold" />
                                    <div>
                                        <p className="text-white font-bold">110 Anos</p>
                                        <p className="text-[10px] text-white/30 uppercase font-black">De História Náutica</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <Flag className="w-8 h-8 text-club-red" />
                                    <div>
                                        <p className="text-white font-bold">Heptacampeão</p>
                                        <p className="text-[10px] text-white/30 uppercase font-black">Estadual Invicto</p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Right Column: Regatas List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-club-red" /> Calendário 2024/2025
                            </h3>
                        </div>

                        {regatas.map((regata) => (
                            <AnimatedCard key={regata.id} variant="glass" className="p-6 group hover:border-white/20 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest", statusLabels[regata.status].class)}>
                                                {statusLabels[regata.status].label}
                                            </span>
                                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                                                {regata.type}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-club-red transition-colors">
                                            {regata.title}
                                        </h4>
                                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                                            <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                                <Calendar className="w-3 h-3 text-club-gold" /> {new Date(regata.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                                <MapPin className="w-3 h-3 text-club-red" /> {regata.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                                <Users className="w-3 h-3 text-blue-500" /> {regata.participants} Estimados
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-3">
                                        {regata.status === 'open' ? (
                                            <Button className="bg-club-red hover:bg-club-red-700 text-[10px] font-black uppercase tracking-widest h-11 px-8 shadow-glow-red">
                                                Inscrever Minha Equipe
                                            </Button>
                                        ) : (
                                            <Button variant="outline" className="border-white/10 text-[10px] font-black uppercase tracking-widest h-11 px-8 hover:bg-white/5">
                                                Ver Detalhes
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
