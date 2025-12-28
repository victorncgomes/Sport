'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Plus,
    Calendar,
    Clock,
    MapPin,
    Users,
    FileText,
    ChevronRight,
    Video,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const meetings = [
    {
        id: '1',
        title: 'Assembleia Geral Ordinária',
        type: 'ORDINARY',
        date: '2025-03-15',
        time: '19:00',
        location: 'Sede do Clube',
        status: 'SCHEDULED',
        agenda: 'Prestação de contas 2024, Plano de metas 2025, Eleição do Conselho Fiscal',
        attendeesCount: 0,
    },
    {
        id: '2',
        title: 'Reunião de Diretoria - Janeiro',
        type: 'BOARD',
        date: '2025-01-20',
        time: '19:30',
        location: 'Sede do Clube',
        status: 'SCHEDULED',
        agenda: 'Calendário de competições, Manutenção da frota',
        attendeesCount: 5,
    },
    {
        id: '3',
        title: 'Reunião de Diretoria - Dezembro',
        type: 'BOARD',
        date: '2024-12-18',
        time: '19:30',
        location: 'Sede do Clube',
        status: 'COMPLETED',
        hasMinutes: true,
        attendeesCount: 6,
    },
    {
        id: '4',
        title: 'Assembleia Extraordinária - Reforma',
        type: 'EXTRAORDINARY',
        date: '2024-11-10',
        time: '18:00',
        location: 'Sede do Clube',
        status: 'COMPLETED',
        hasMinutes: true,
        attendeesCount: 42,
    },
];

const typeConfig = {
    ORDINARY: { label: 'Ordinária', color: 'bg-blue-500/20 text-blue-400' },
    EXTRAORDINARY: { label: 'Extraordinária', color: 'bg-amber-500/20 text-amber-400' },
    BOARD: { label: 'Diretoria', color: 'bg-purple-500/20 text-purple-400' },
};

const statusConfig = {
    SCHEDULED: { label: 'Agendada', color: 'bg-emerald-500/20 text-emerald-400' },
    COMPLETED: { label: 'Realizada', color: 'bg-white/10 text-white/60' },
    CANCELLED: { label: 'Cancelada', color: 'bg-red-500/20 text-red-400' },
};

export default function ReunioesPage() {
    const upcomingMeetings = meetings.filter(m => m.status === 'SCHEDULED');
    const pastMeetings = meetings.filter(m => m.status === 'COMPLETED');

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
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Reuniões</h1>
                            <p className="text-white/50">Assembleias, atas e convocações</p>
                        </div>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nova Reunião
                        </Button>
                    </div>
                </div>

                {/* Próximas Reuniões */}
                <section className="mb-12">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-club-gold" />
                        Próximas Reuniões
                    </h2>

                    {upcomingMeetings.length === 0 ? (
                        <p className="text-white/50 text-center py-8">Nenhuma reunião agendada.</p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingMeetings.map((meeting, i) => (
                                <motion.div
                                    key={meeting.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <AnimatedCard variant="gradient" hover className="border border-club-gold/20">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Date box */}
                                            <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-club-red flex flex-col items-center justify-center text-white">
                                                <span className="text-2xl font-bold">
                                                    {new Date(meeting.date).getDate()}
                                                </span>
                                                <span className="text-xs uppercase">
                                                    {new Date(meeting.date).toLocaleDateString('pt-BR', { month: 'short' })}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <Badge className={`${typeConfig[meeting.type as keyof typeof typeConfig].color} border-0`}>
                                                        {typeConfig[meeting.type as keyof typeof typeConfig].label}
                                                    </Badge>
                                                    <Badge className={`${statusConfig[meeting.status as keyof typeof statusConfig].color} border-0`}>
                                                        {statusConfig[meeting.status as keyof typeof statusConfig].label}
                                                    </Badge>
                                                </div>

                                                <h3 className="font-bold text-white mb-2">{meeting.title}</h3>

                                                <div className="flex flex-wrap gap-4 text-sm text-white/50">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {meeting.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {meeting.location}
                                                    </span>
                                                </div>

                                                {meeting.agenda && (
                                                    <p className="mt-3 text-sm text-white/40 line-clamp-2">
                                                        <span className="text-white/60 font-medium">Pauta:</span> {meeting.agenda}
                                                    </p>
                                                )}
                                            </div>

                                            <ChevronRight className="w-5 h-5 text-white/30 hidden sm:block" />
                                        </div>
                                    </AnimatedCard>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Reuniões Anteriores */}
                <section>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-white/50" />
                        Reuniões Anteriores
                    </h2>

                    <div className="space-y-3">
                        {pastMeetings.map((meeting, i) => (
                            <motion.div
                                key={meeting.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" hover>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center text-white/50">
                                            <span className="text-sm font-bold">
                                                {new Date(meeting.date).getDate()}
                                            </span>
                                            <span className="text-[10px] uppercase">
                                                {new Date(meeting.date).toLocaleDateString('pt-BR', { month: 'short' })}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-white truncate">{meeting.title}</h3>
                                            <div className="flex items-center gap-2 text-xs text-white/40">
                                                <Badge className={`${typeConfig[meeting.type as keyof typeof typeConfig].color} border-0 text-xs`}>
                                                    {typeConfig[meeting.type as keyof typeof typeConfig].label}
                                                </Badge>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {meeting.attendeesCount} participantes
                                                </span>
                                            </div>
                                        </div>

                                        {meeting.hasMinutes && (
                                            <Button variant="ghost" size="sm" className="gap-1 text-club-gold">
                                                <FileText className="w-4 h-4" />
                                                Ata
                                            </Button>
                                        )}
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
