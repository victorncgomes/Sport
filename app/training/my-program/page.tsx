'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Calendar, Target, Clock, ChevronRight, ChevronLeft, Play,
    CheckCircle, Circle, TrendingUp, Award, Flame, History
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface MyProgramSession {
    id: string;
    dayOfWeek: number;
    type: 'REMO' | 'CORRIDA' | 'BIKE' | 'MUSCULACAO' | 'RECUPERACAO';
    title: string;
    description: string;
    duration: number;
    intensity: 'LEVE' | 'MODERADO' | 'INTENSO';
    completed: boolean;
    completedAt?: string;
}

interface MyProgram {
    id: string;
    name: string;
    description: string;
    level: string;
    currentWeek: number;
    totalWeeks: number;
    sessions: MyProgramSession[];
    completedSessions: number;
    totalSessions: number;
}

const typeIcons: Record<string, string> = {
    REMO: '🚣',
    CORRIDA: '🏃',
    BIKE: '🚴',
    MUSCULACAO: '🏋️',
    RECUPERACAO: '🧘'
};

const typeRoutes: Record<string, string> = {
    REMO: '/training/start?sport=ROWING',
    CORRIDA: '/training/start?sport=RUNNING',
    BIKE: '/training/start?sport=CYCLING',
    MUSCULACAO: '/training/start?sport=GYM',
    RECUPERACAO: '/training/warmup'
};

const intensityColors = {
    LEVE: 'text-green-400',
    MODERADO: 'text-yellow-400',
    INTENSO: 'text-red-400'
};

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function MyProgramPage() {
    const router = useRouter();
    const today = new Date().getDay();
    const [selectedWeekOffset, setSelectedWeekOffset] = useState(0); // 0 = current week, -1 = last week, 1 = next week

    // Programa mock atribuído ao atleta
    const [program] = useState<MyProgram>({
        id: 'my-program-1',
        name: 'Preparação Base',
        description: 'Programa de condicionamento e técnica de 8 semanas',
        level: 'INTERMEDIARIO',
        currentWeek: 3,
        totalWeeks: 8,
        completedSessions: 8,
        totalSessions: 24,
        sessions: [
            {
                id: '1',
                dayOfWeek: 1, // Segunda
                type: 'REMO',
                title: 'Técnica & Base',
                description: 'Foco em técnica de remada e resistência aeróbica base',
                duration: 60,
                intensity: 'MODERADO',
                completed: true,
                completedAt: '2025-12-28'
            },
            {
                id: '2',
                dayOfWeek: 2, // Terça
                type: 'MUSCULACAO',
                title: 'Força Superior',
                description: 'Trabalho de força para membros superiores e core',
                duration: 45,
                intensity: 'INTENSO',
                completed: false
            },
            {
                id: '3',
                dayOfWeek: 3, // Quarta
                type: 'REMO',
                title: 'Intervalado',
                description: '6x500m com descanso de 90 segundos',
                duration: 60,
                intensity: 'INTENSO',
                completed: false
            },
            {
                id: '4',
                dayOfWeek: 4, // Quinta
                type: 'RECUPERACAO',
                title: 'Recuperação Ativa',
                description: 'Alongamento e mobilidade',
                duration: 30,
                intensity: 'LEVE',
                completed: false
            },
            {
                id: '5',
                dayOfWeek: 5, // Sexta
                type: 'REMO',
                title: 'Long Steady State',
                description: 'Remada contínua de longa duração em pace confortável',
                duration: 90,
                intensity: 'MODERADO',
                completed: false
            }
        ]
    });

    const todaySession = program.sessions.find(s => s.dayOfWeek === today);
    const nextSession = program.sessions.find(s => s.dayOfWeek > today && !s.completed)
        || program.sessions.find(s => !s.completed);

    const progressPercent = Math.round((program.completedSessions / program.totalSessions) * 100);

    const startSession = (session: MyProgramSession) => {
        router.push(typeRoutes[session.type]);
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Meu Programa"
                subtitle={program.name}
                backgroundImage="/images/rowing-pattern.jpg"
                compact
            />

            <div className="px-4 py-6 space-y-6">
                {/* Progresso Geral */}
                <AnimatedCard variant="gradient" className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="font-bold text-white">Semana {program.currentWeek} de {program.totalWeeks}</h2>
                            <p className="text-sm text-white/50">{program.description}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">{progressPercent}%</div>
                            <div className="text-xs text-white/50">Concluído</div>
                        </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-club-red to-orange-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-white/40">
                        <span>{program.completedSessions} sessões concluídas</span>
                        <span>{program.totalSessions - program.completedSessions} restantes</span>
                    </div>
                </AnimatedCard>

                {/* Treino de Hoje */}
                {todaySession && (
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-400" />
                            Treino de Hoje
                        </h3>
                        <AnimatedCard
                            variant={todaySession.completed ? 'glass' : 'gradient'}
                            className="p-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">{typeIcons[todaySession.type]}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-white">{todaySession.title}</h4>
                                        {todaySession.completed && (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-white/60 mb-2">{todaySession.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-white/40">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {todaySession.duration} min
                                        </span>
                                        <span className={intensityColors[todaySession.intensity]}>
                                            ● {todaySession.intensity}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!todaySession.completed && (
                                <Button
                                    onClick={() => startSession(todaySession)}
                                    className="w-full mt-4 bg-club-red hover:bg-club-red/90 gap-2"
                                >
                                    <Play className="w-5 h-5 fill-white" />
                                    Iniciar Treino
                                </Button>
                            )}
                        </AnimatedCard>
                    </div>
                )}

                {/* Calendário da Semana */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={() => setSelectedWeekOffset(prev => prev - 1)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            {selectedWeekOffset === 0 ? 'Esta Semana' :
                                selectedWeekOffset === -1 ? 'Semana Passada' :
                                    selectedWeekOffset === 1 ? 'Próxima Semana' :
                                        selectedWeekOffset < 0 ? `${Math.abs(selectedWeekOffset)} semanas atrás` :
                                            `Daqui a ${selectedWeekOffset} semanas`}
                        </h3>
                        <button
                            onClick={() => setSelectedWeekOffset(prev => prev + 1)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    {selectedWeekOffset !== 0 && (
                        <button
                            onClick={() => setSelectedWeekOffset(0)}
                            className="w-full mb-3 text-center text-sm text-club-gold hover:underline"
                        >
                            Voltar para esta semana
                        </button>
                    )}
                    <div className="grid grid-cols-7 gap-1">
                        {[0, 1, 2, 3, 4, 5, 6].map(day => {
                            const session = program.sessions.find(s => s.dayOfWeek === day);
                            const isToday = day === today;
                            const isPast = day < today;

                            return (
                                <div
                                    key={day}
                                    className={`
                                        text-center p-2 rounded-lg transition-colors
                                        ${isToday ? 'bg-club-red/30 ring-2 ring-club-red' : 'bg-white/5'}
                                        ${session?.completed ? 'bg-green-500/20' : ''}
                                    `}
                                >
                                    <div className={`text-[10px] ${isToday ? 'text-club-red' : 'text-white/40'}`}>
                                        {dayNames[day]}
                                    </div>
                                    {session ? (
                                        <>
                                            <div className="text-lg">{typeIcons[session.type]}</div>
                                            {session.completed ? (
                                                <CheckCircle className="w-3 h-3 text-green-400 mx-auto mt-1" />
                                            ) : (
                                                <Circle className="w-3 h-3 text-white/20 mx-auto mt-1" />
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-lg text-white/20">-</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Lista de Sessões */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            Todas as Sessões
                        </h3>
                        <Link href="/training/history">
                            <Button variant="ghost" size="sm" className="text-xs text-club-gold gap-1">
                                Ver Histórico <ChevronRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {program.sessions.map((session, index) => {
                            const isPast = session.dayOfWeek < today;
                            return (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <AnimatedCard
                                        variant="glass"
                                        className={`p-3 ${session.completed ? 'border-green-500/30' : isPast && !session.completed ? 'border-orange-500/30' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center
                                            ${session.completed ? 'bg-green-500/20' : isPast ? 'bg-orange-500/20' : 'bg-white/10'}
                                        `}>
                                                {session.completed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <span className="text-xl">{typeIcons[session.type]}</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-white/40">{dayNames[session.dayOfWeek]}</span>
                                                    <h4 className="font-bold text-white text-sm">{session.title}</h4>
                                                    {isPast && !session.completed && (
                                                        <Badge className="text-[8px] bg-orange-500/20 text-orange-400 border-0">Pendente</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-white/40">
                                                    <span>{session.duration} min</span>
                                                    <span className={intensityColors[session.intensity]}>
                                                        {session.intensity}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Botão sempre visível para permitir iniciar ou repetir treino */}
                                            <Button
                                                size="sm"
                                                variant={session.completed ? "outline" : "default"}
                                                onClick={() => startSession(session)}
                                                className={`gap-1 ${!session.completed ? 'bg-club-red hover:bg-club-red/90' : ''}`}
                                            >
                                                <Play className="w-4 h-4" />
                                                {session.completed ? 'Repetir' : isPast ? 'Fazer' : 'Iniciar'}
                                            </Button>
                                        </div>
                                    </AnimatedCard>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Estatísticas */}
                <AnimatedCard variant="glass" className="p-4">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Seu Desempenho
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400">92%</div>
                            <div className="text-[10px] text-white/50">Adesão</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">3</div>
                            <div className="text-[10px] text-white/50">Dias Seguidos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">+120</div>
                            <div className="text-[10px] text-white/50">XP Esta Semana</div>
                        </div>
                    </div>
                </AnimatedCard>
            </div>
        </div>
    );
}
