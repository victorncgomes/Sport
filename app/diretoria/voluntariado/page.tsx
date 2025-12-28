'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Heart,
    Users,
    Calendar,
    Award,
    Clock,
    Target,
    Plus,
    Mail,
    Phone,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const volunteers = [
    {
        id: '1',
        name: 'Maria Helena Costa',
        role: 'Coordenadora de Eventos',
        since: '2022',
        hoursTotal: 245,
        avatar: 'MH',
        status: 'active',
        skills: ['Organização', 'Comunicação'],
    },
    {
        id: '2',
        name: 'Pedro Santos',
        role: 'Apoio Técnico',
        since: '2023',
        hoursTotal: 120,
        avatar: 'PS',
        status: 'active',
        skills: ['Manutenção', 'Barcos'],
    },
    {
        id: '3',
        name: 'Ana Beatriz Lima',
        role: 'Social Media',
        since: '2024',
        hoursTotal: 85,
        avatar: 'AB',
        status: 'active',
        skills: ['Marketing', 'Design'],
    },
    {
        id: '4',
        name: 'Carlos Eduardo',
        role: 'Fotógrafo',
        since: '2021',
        hoursTotal: 380,
        avatar: 'CE',
        status: 'active',
        skills: ['Fotografia', 'Vídeo'],
    },
];

const programs = [
    {
        id: '1',
        title: 'Remo para Todos',
        description: 'Aulas gratuitas de remo para jovens de escolas públicas',
        status: 'ACTIVE',
        volunteersNeeded: 5,
        volunteersActive: 3,
        nextEvent: '2025-01-25',
    },
    {
        id: '2',
        title: 'Manutenção Coletiva',
        description: 'Mutirões para cuidar dos equipamentos e da sede',
        status: 'ACTIVE',
        volunteersNeeded: 8,
        volunteersActive: 6,
        nextEvent: '2025-02-01',
    },
    {
        id: '3',
        title: 'Evento Beneficente Anual',
        description: 'Organização do jantar beneficente do clube',
        status: 'PLANNING',
        volunteersNeeded: 15,
        volunteersActive: 4,
        nextEvent: '2025-06-15',
    },
];

const statusColors = {
    active: 'bg-emerald-500/20 text-emerald-400',
    inactive: 'bg-white/10 text-white/60',
};

const programStatusConfig = {
    ACTIVE: { label: 'Ativo', color: 'bg-emerald-500/20 text-emerald-400' },
    PLANNING: { label: 'Planejamento', color: 'bg-amber-500/20 text-amber-400' },
    COMPLETED: { label: 'Concluído', color: 'bg-blue-500/20 text-blue-400' },
};

export default function VoluntariadoPage() {
    const [view, setView] = useState<'list' | 'calendar'>('list');

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/diretoria" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Diretoria
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Voluntariado</h1>
                            <p className="text-white/50">Gestão de programas e voluntários</p>
                        </div>
                        <div className="flex gap-4">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Novo Programa
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Heart className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{volunteers.length}</div>
                        <div className="text-xs text-white/40">Voluntários Ativos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{programs.length}</div>
                        <div className="text-xs text-white/40">Programas Ativos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Clock className="w-6 h-6 text-club-gold mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">
                            {volunteers.reduce((acc, v) => acc + v.hoursTotal, 0)}
                        </div>
                        <div className="text-xs text-white/40">Horas Totais</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Award className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-xs text-white/40">Eventos Realizados</div>
                    </AnimatedCard>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-8 whitespace-nowrap overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => setView('list')}
                        className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${view === 'list' ? 'border-club-red text-white' : 'border-transparent text-white/40 hover:text-white'
                            }`}
                    >
                        Programas & Voluntários
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${view === 'calendar' ? 'border-club-red text-white' : 'border-transparent text-white/40 hover:text-white'
                            }`}
                    >
                        Calendário de Escalas
                    </button>
                </div>

                {view === 'calendar' ? (
                    <section className="mb-12">
                        <AnimatedCard variant="glass" className="p-0 overflow-hidden">
                            <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-club-gold" />
                                    Escala de Janeiro 2025
                                </h2>
                                <div className="flex gap-2 text-xs">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmado</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Pendente</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-7 gap-1">
                                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                                        <div key={d} className="text-center py-2 text-[10px] font-black text-white/20 uppercase">{d}</div>
                                    ))}
                                    {Array.from({ length: 31 }).map((_, i) => {
                                        const day = i + 1;
                                        const hasEvent = [15, 20, 25].includes(day);
                                        return (
                                            <div
                                                key={i}
                                                className={`aspect-square border border-white/5 p-1 flex flex-col justify-between hover:bg-white/5 transition-colors cursor-pointer ${day === 27 ? 'bg-club-red/20 border-club-red/50' : ''
                                                    }`}
                                            >
                                                <span className={`text-[10px] font-bold ${day === 27 ? 'text-club-red' : 'text-white/40'}`}>{day}</span>
                                                {hasEvent && (
                                                    <div className="w-full h-1 bg-emerald-500 rounded-full mb-1" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-8 space-y-4">
                                    <div className="p-4 rounded-xl bg-white/5 border-l-4 border-emerald-500">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-white">Remo para Todos</h4>
                                                <p className="text-xs text-white/50">Escola de Remo • 08:00 - 10:00</p>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-400">25/01</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border-l-4 border-amber-500">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-white">Mutirão de Limpeza</h4>
                                                <p className="text-xs text-white/50">Sede Social • 14:00 - 17:00</p>
                                            </div>
                                            <span className="text-[10px] font-black text-amber-400">01/02</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>
                    </section>
                ) : (
                    <>
                        {/* Programs Section */}
                        <section className="mb-12">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-club-gold" />
                                Programas de Voluntariado
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {programs.map((program, i) => (
                                    <motion.div
                                        key={program.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <AnimatedCard variant="glass" hover className="h-full">
                                            <div className="flex flex-col h-full">
                                                <div className="flex items-start justify-between mb-4">
                                                    <Badge className={`${programStatusConfig[program.status as keyof typeof programStatusConfig].color} border-0`}>
                                                        {programStatusConfig[program.status as keyof typeof programStatusConfig].label}
                                                    </Badge>
                                                </div>

                                                <h3 className="text-lg font-bold text-white mb-2">{program.title}</h3>
                                                <p className="text-sm text-white/50 mb-4 flex-1">{program.description}</p>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-white/40">Voluntários</span>
                                                        <span className="text-white font-bold">
                                                            {program.volunteersActive}/{program.volunteersNeeded}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-club-red"
                                                            style={{ width: `${(program.volunteersActive / program.volunteersNeeded) * 100}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-white/40 pt-2">
                                                        <Calendar className="w-3 h-3" />
                                                        Próximo: {new Date(program.nextEvent).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Volunteers Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-white/50" />
                                    Voluntários
                                </h2>
                                <Button variant="outline" className="gap-2 border-white/10 text-white/70">
                                    <Plus className="w-4 h-4" />
                                    Cadastrar
                                </Button>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                {volunteers.map((volunteer, i) => (
                                    <motion.div
                                        key={volunteer.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <AnimatedCard variant="glass" hover>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-club-red/20 border border-club-red/30 flex items-center justify-center font-bold text-club-red">
                                                    {volunteer.avatar}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium text-white truncate">{volunteer.name}</h3>
                                                        {volunteer.hoursTotal > 200 && (
                                                            <Star className="w-4 h-4 text-club-gold flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-white/40">{volunteer.role}</p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {volunteer.skills.map((skill) => (
                                                            <span
                                                                key={skill}
                                                                className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-white/50"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-white">{volunteer.hoursTotal}h</div>
                                                    <div className="text-xs text-white/40">Desde {volunteer.since}</div>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
