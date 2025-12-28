
'use client';

import React from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { clubEvents } from '@/lib/data/club-assets';
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    ArrowRight,
    Sparkles,
    PartyPopper,
    Gavel,
    Ship,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { getClubEvents } from '@/lib/actions/events';
import { useState, useEffect } from 'react';

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getClubEvents();
            setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    const displayEvents = events.length > 0 ? events : clubEvents; // Fallback to mock if empty

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Agenda do Clube"
                subtitle="Eventos e Assembleias"
                description="Fique por dentro das confraternizações, reuniões e eventos oficiais."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                {/* Featured Event */}
                <div className="mb-12">
                    <AnimatedCard variant="metal" className="p-0 overflow-hidden group">
                        <div className="grid md:grid-cols-2">
                            <div className="h-64 md:h-full bg-gradient-to-br from-club-red to-black relative">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-club-gold text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-glow-gold">
                                        Destaque
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-2 mb-4">
                                    <PartyPopper className="w-5 h-5 text-club-gold" />
                                    <span className="text-club-gold text-xs font-black uppercase tracking-widest">Social</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Feijoada do Centenário</h3>
                                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                                    O evento mais esperado do ano! Uma tarde de confraternização com música ao vivo, homenagens aos atletas veteranos e o tradicional clima rubro-negro.
                                </p>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-club-red" />
                                        <div>
                                            <p className="text-white font-bold text-sm">19 Jan, 2025</p>
                                            <p className="text-white/30 text-[10px] uppercase font-bold">Data</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-club-red" />
                                        <div>
                                            <p className="text-white font-bold text-sm">Sede Social</p>
                                            <p className="text-white/30 text-[10px] uppercase font-bold">Local</p>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full md:w-auto px-10 h-14 bg-club-red hover:bg-club-red-700 text-xs font-black uppercase tracking-[0.2em] shadow-glow-red">
                                    Garantir Ingresso <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </AnimatedCard>
                </div>

                {/* Event Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayEvents.map((event) => {
                        const Icon = event.type === 'social' ? PartyPopper :
                            event.type === 'assembly' ? Gavel : Ship;

                        return (
                            <AnimatedCard key={event.id} variant="carbon" hover="lift" className="flex flex-col h-full">
                                <div className="p-1 mb-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                                        event.type === 'social' ? "bg-club-gold/20 text-club-gold shadow-glow-gold/20" :
                                            event.type === 'assembly' ? "bg-blue-500/20 text-blue-400 shadow-glow-blue/20" :
                                                "bg-club-red/20 text-club-red shadow-glow-red/20"
                                    )}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                            {event.type === 'social' ? 'Evento Social' :
                                                event.type === 'assembly' ? 'AGO / Assembleia' : 'Cerimônia'}
                                        </span>
                                        {event.isConfirmed && (
                                            <span className="flex items-center gap-1 text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                                                <CheckCircle2 className="w-2 h-2" /> Confirmado
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-4 line-clamp-2">
                                        {event.title}
                                    </h4>
                                    <p className="text-white/40 text-xs mb-6 line-clamp-3 leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-white/5 mt-auto">
                                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-2 text-white/50">
                                            <Calendar className="w-3 h-3" /> {event.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/50">
                                            <Clock className="w-3 h-3" /> {event.time}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/50 uppercase">
                                            <Users className="w-3 h-3" /> {event.rsvps} Confirmados
                                        </div>
                                        <Button variant="ghost" className="h-8 text-[10px] font-black text-club-red hover:bg-club-red/5 px-0.5">
                                            RSVP <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </AnimatedCard>
                        );
                    })}

                    {/* Quick Suggestion Card */}
                    <AnimatedCard variant="glass" className="flex flex-col items-center justify-center p-8 text-center border-dashed">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-white/20" />
                        </div>
                        <h4 className="text-white font-black uppercase tracking-tighter mb-2">Sugira um Evento</h4>
                        <p className="text-white/40 text-xs mb-6 px-4">Tem uma ideia para integrar os sócios? Envie para a diretoria social.</p>
                        <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5 px-8">
                            Enviar Ideia
                        </Button>
                    </AnimatedCard>
                </div>
            </div>
        </div>
    );
}
