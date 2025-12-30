'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Users,
    Waves,
    GraduationCap,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarEvent {
    id: string;
    title: string;
    type: 'training' | 'experimental' | 'competition' | 'evaluation';
    date: Date;
    startTime: string;
    endTime: string;
    participants?: string[];
    notes?: string;
}

// Dados simulados com 5 aulas experimentais
const generateMockEvents = (): CalendarEvent[] => {
    const today = new Date();
    return [
        // 5 Aulas Experimentais simuladas
        {
            id: 'exp1',
            title: 'Aula Experimental - Fernando Alves',
            type: 'experimental',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
            startTime: '06:00',
            endTime: '07:00',
            participants: ['Fernando Alves'],
            notes: 'Primeira experiência com remo, sem experiência prévia'
        },
        {
            id: 'exp2',
            title: 'Aula Experimental - Júlia Mendes',
            type: 'experimental',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
            startTime: '07:15',
            endTime: '08:15',
            participants: ['Júlia Mendes'],
            notes: 'Praticou canoagem, quer experimentar remo'
        },
        {
            id: 'exp3',
            title: 'Aula Experimental - Família Costa',
            type: 'experimental',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
            startTime: '08:30',
            endTime: '09:30',
            participants: ['Ricardo Costa', 'Amanda Costa'],
            notes: 'Pai e filha interessados em iniciar juntos'
        },
        {
            id: 'exp4',
            title: 'Aula Experimental - Patrícia Duarte',
            type: 'experimental',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
            startTime: '16:00',
            endTime: '17:00',
            participants: ['Patrícia Duarte'],
            notes: 'Indicação de sócia Maria Santos'
        },
        {
            id: 'exp5',
            title: 'Aula Experimental - Bruno Lima',
            type: 'experimental',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4),
            startTime: '17:15',
            endTime: '18:15',
            participants: ['Bruno Lima'],
            notes: 'Atleta de natação querendo cross-training'
        },
        // Treinos regulares
        {
            id: 'tr1',
            title: 'Treino Equipe Feminina',
            type: 'training',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            startTime: '06:00',
            endTime: '08:00',
            participants: ['Maria', 'Ana', 'Carla', 'Bia']
        },
        {
            id: 'tr2',
            title: 'Treino Júnior',
            type: 'training',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
            startTime: '15:30',
            endTime: '17:30',
            participants: ['João', 'Pedro', 'Lucas']
        },
        {
            id: 'tr3',
            title: 'Treino Master',
            type: 'training',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
            startTime: '05:30',
            endTime: '07:00',
            participants: ['Carlos', 'Roberto']
        },
        {
            id: 'ev1',
            title: 'Avaliação Física Mensal',
            type: 'evaluation',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
            startTime: '08:00',
            endTime: '12:00'
        }
    ];
};

export default function CoachCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events] = useState<CalendarEvent[]>(generateMockEvents());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'experimental': return { label: 'Aula Experimental', color: 'bg-green-500/20 text-green-400 border-green-500/50', icon: GraduationCap };
            case 'training': return { label: 'Treino', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', icon: Waves };
            case 'competition': return { label: 'Competição', color: 'bg-orange-500/20 text-orange-400 border-orange-500/50', icon: Activity };
            case 'evaluation': return { label: 'Avaliação', color: 'bg-purple-500/20 text-purple-400 border-purple-500/50', icon: Users };
            default: return { label: 'Evento', color: 'bg-white/20 text-white', icon: Calendar };
        }
    };

    // Gerar dias do mês
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: (Date | null)[] = [];

        // Preencher dias vazios no início
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Dias do mês
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const days = getDaysInMonth(currentDate);
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const getEventsForDate = (date: Date | null) => {
        if (!date) return [];
        return events.filter(e =>
            e.date.getDate() === date.getDate() &&
            e.date.getMonth() === date.getMonth() &&
            e.date.getFullYear() === date.getFullYear()
        );
    };

    const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];
    const experimentalCount = events.filter(e => e.type === 'experimental').length;

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/coach/painel" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Painel
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-club-gold" />
                                Calendário do Coach
                            </h1>
                            <p className="text-white/50">Treinos, aulas experimentais e eventos</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2">
                            <GraduationCap className="w-4 h-4 mr-1" />
                            {experimentalCount} Experimentais
                        </Badge>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Calendário */}
                    <div className="lg:col-span-2">
                        <AnimatedCard variant="glass" className="p-6">
                            {/* Navegação do mês */}
                            <div className="flex items-center justify-between mb-6">
                                <Button variant="ghost" size="sm" onClick={prevMonth}>
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <h2 className="text-xl font-bold text-white">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h2>
                                <Button variant="ghost" size="sm" onClick={nextMonth}>
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Dias da semana */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                                    <div key={day} className="text-center text-xs text-white/40 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Dias do mês */}
                            <div className="grid grid-cols-7 gap-1">
                                {days.map((day, i) => {
                                    if (!day) return <div key={i} className="h-20" />;

                                    const dayEvents = getEventsForDate(day);
                                    const isToday = day.toDateString() === new Date().toDateString();
                                    const isSelected = selectedDate?.toDateString() === day.toDateString();

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(day)}
                                            className={`h-20 p-1 rounded-lg border transition-all text-left ${isSelected ? 'bg-club-red/20 border-club-red' :
                                                    isToday ? 'bg-club-gold/10 border-club-gold/50' :
                                                        'border-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <span className={`text-xs font-bold ${isToday ? 'text-club-gold' : 'text-white/80'}`}>
                                                {day.getDate()}
                                            </span>
                                            <div className="mt-1 space-y-0.5">
                                                {dayEvents.slice(0, 2).map(event => {
                                                    const config = getTypeConfig(event.type);
                                                    return (
                                                        <div
                                                            key={event.id}
                                                            className={`text-[8px] px-1 py-0.5 rounded truncate ${config.color}`}
                                                        >
                                                            {event.startTime}
                                                        </div>
                                                    );
                                                })}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-[8px] text-white/40">
                                                        +{dayEvents.length - 2} mais
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Eventos do Dia */}
                    <div>
                        <AnimatedCard variant="glass" className="p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-club-gold" />
                                {selectedDate?.toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })}
                            </h3>

                            {selectedEvents.length === 0 ? (
                                <div className="text-center py-8 text-white/40">
                                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p>Nenhum evento neste dia</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedEvents.map((event, i) => {
                                        const config = getTypeConfig(event.type);
                                        const Icon = config.icon;
                                        return (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <div className={`p-4 rounded-xl border ${config.color}`}>
                                                    <div className="flex items-start gap-3">
                                                        <Icon className="w-5 h-5 mt-0.5" />
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-white text-sm">{event.title}</h4>
                                                            <div className="text-xs text-white/60 mt-1">
                                                                {event.startTime} - {event.endTime}
                                                            </div>
                                                            {event.participants && (
                                                                <div className="flex items-center gap-1 mt-2 text-xs text-white/50">
                                                                    <User className="w-3 h-3" />
                                                                    {event.participants.join(', ')}
                                                                </div>
                                                            )}
                                                            {event.notes && (
                                                                <p className="text-xs text-white/40 mt-2 italic">
                                                                    "{event.notes}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatedCard>

                        {/* Legenda */}
                        <AnimatedCard variant="glass" className="p-4 mt-4">
                            <h4 className="text-xs text-white/40 mb-3 uppercase font-bold">Legenda</h4>
                            <div className="space-y-2">
                                {['experimental', 'training', 'evaluation'].map(type => {
                                    const config = getTypeConfig(type);
                                    const Icon = config.icon;
                                    return (
                                        <div key={type} className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded ${config.color.split(' ')[0]}`} />
                                            <Icon className="w-4 h-4 text-white/50" />
                                            <span className="text-sm text-white/70">{config.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </AnimatedCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
