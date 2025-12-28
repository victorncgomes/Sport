'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Clock,
    Target,
    Flame,
    Droplets,
    Activity,
    ChevronLeft,
    ChevronRight,
    Check,
    Play,
    Pause,
    RotateCcw,
    Edit3,
    MessageSquare,
    TrendingUp,
    Zap,
    Timer,
    Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Detailed training plan data
const weeklyPlan = {
    weekNumber: 4,
    cycle: 'Base Aeróbica',
    phase: 'Construção',
    totalDistance: 45000, // meters
    sessions: [
        {
            day: 'Segunda',
            date: '20/01',
            type: 'Água',
            title: 'Técnica de Remada',
            duration: 90,
            intensity: 'Baixa',
            status: 'completed',
            warmup: { description: '10min mobilidade + 5min remo leve', duration: 15 },
            main: [
                { set: '4x500m', pace: '2:10-2:15/500m', rest: '1min', focus: 'Catch e compressão' },
                { set: '3x1000m', pace: '2:05-2:10/500m', rest: '2min', focus: 'Ritmo constante' },
            ],
            cooldown: { description: '10min remo regenerativo + alongamento', duration: 15 },
            notes: 'Foco na entrada da pá na água. Manter cotovelos altos.',
            heartRateZone: 'Z2',
            targetDistance: 6000,
            actualDistance: 6200,
            feedback: 'Excelente execução técnica. Melhorar postura no catch.'
        },
        {
            day: 'Terça',
            date: '21/01',
            type: 'Ergômetro',
            title: 'Intervalado VO2max',
            duration: 60,
            intensity: 'Muito Alta',
            status: 'completed',
            warmup: { description: '15min progressivo no erg', duration: 15 },
            main: [
                { set: '8x500m', pace: '1:45-1:50/500m', rest: '2min ativo', focus: 'Potência máxima sustentada' },
            ],
            cooldown: { description: '10min erg leve + mobilidade', duration: 15 },
            notes: 'Manter cadência entre 28-32 SPM.',
            heartRateZone: 'Z5',
            targetDistance: 8000,
            actualDistance: 8000,
            feedback: 'Todos os intervalos dentro do pace. Ótimo desempenho.'
        },
        {
            day: 'Quarta',
            date: '22/01',
            type: 'Força',
            title: 'Academia - Legs & Core',
            duration: 75,
            intensity: 'Alta',
            status: 'completed',
            warmup: { description: 'Ativação glúteos + mobilidade quadril', duration: 10 },
            main: [
                { set: 'Agachamento 4x8', pace: '75% 1RM', rest: '90s', focus: 'Profundidade e controle' },
                { set: 'Leg Press 3x12', pace: '70% 1RM', rest: '60s', focus: 'Amplitude completa' },
                { set: 'Stiff 3x10', pace: '65% 1RM', rest: '60s', focus: 'Isquiotibiais' },
                { set: 'Prancha 4x45s', pace: '-', rest: '30s', focus: 'Core estabilização' },
            ],
            cooldown: { description: 'Alongamento estático 10min', duration: 10 },
            notes: 'Registrar cargas utilizadas.',
            heartRateZone: 'N/A',
            feedback: 'Aumentar carga no agachamento próxima semana.'
        },
        {
            day: 'Quinta',
            date: '23/01',
            type: 'Água',
            title: 'Volume Base',
            duration: 120,
            intensity: 'Moderada',
            status: 'today',
            warmup: { description: '15min técnica com exercícios', duration: 15 },
            main: [
                { set: '2x3000m', pace: '2:00-2:05/500m', rest: '3min', focus: 'Ritmo e resistência' },
                { set: '6x250m', pace: '1:55/500m', rest: '45s', focus: 'Velocidade controlada' },
            ],
            cooldown: { description: '15min regenerativo + alongamento na água', duration: 15 },
            notes: 'Treino principal da semana. Hidratação importante!',
            heartRateZone: 'Z3-Z4',
            targetDistance: 10000,
        },
        {
            day: 'Sexta',
            date: '24/01',
            type: 'Ergômetro',
            title: 'Steady State',
            duration: 50,
            intensity: 'Baixa',
            status: 'pending',
            warmup: { description: '5min mobilidade', duration: 5 },
            main: [
                { set: '40min contínuo', pace: '2:05-2:10/500m', rest: '-', focus: 'Economia de remada' },
            ],
            cooldown: { description: 'Alongamento 10min', duration: 10 },
            notes: 'Recuperação ativa. Não ultrapassar Z2.',
            heartRateZone: 'Z2',
            targetDistance: 8000,
        },
        {
            day: 'Sábado',
            date: '25/01',
            type: 'Água',
            title: 'Treino Longo',
            duration: 150,
            intensity: 'Moderada',
            status: 'pending',
            warmup: { description: '20min progressivo', duration: 20 },
            main: [
                { set: '3x5000m', pace: '2:02-2:08/500m', rest: '5min', focus: 'Resistência aeróbica' },
            ],
            cooldown: { description: '15min leve + alongamento completo', duration: 20 },
            notes: 'Hidratação durante o treino. Avisar se fadiga excessiva.',
            heartRateZone: 'Z3',
            targetDistance: 15000,
        },
        {
            day: 'Domingo',
            date: '26/01',
            type: 'Descanso',
            title: 'Recuperação Ativa',
            duration: 30,
            intensity: 'Muito Baixa',
            status: 'pending',
            warmup: { description: '-', duration: 0 },
            main: [
                { set: 'Mobilidade geral', pace: '-', rest: '-', focus: 'Recuperação' },
                { set: 'Rolo de espuma', pace: '10min', rest: '-', focus: 'Liberação miofascial' },
            ],
            cooldown: { description: 'Meditação/respiração', duration: 10 },
            notes: 'Dia de descanso. Sono e alimentação são prioridade.',
            heartRateZone: 'Z1',
        },
    ]
};

const intensityColors: Record<string, string> = {
    'Muito Baixa': 'bg-slate-500/20 text-slate-400',
    'Baixa': 'bg-emerald-500/20 text-emerald-400',
    'Moderada': 'bg-blue-500/20 text-blue-400',
    'Alta': 'bg-orange-500/20 text-orange-400',
    'Muito Alta': 'bg-club-red/20 text-club-red',
};

const typeColors: Record<string, string> = {
    'Água': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Ergômetro': 'bg-club-red/10 text-club-red border-club-red/20',
    'Força': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Descanso': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function TrainingPlanPage() {
    const [selectedSession, setSelectedSession] = useState<number | null>(null);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);

    const session = selectedSession !== null ? weeklyPlan.sessions[selectedSession] : null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const completedDistance = weeklyPlan.sessions
        .filter(s => s.status === 'completed')
        .reduce((acc, s) => acc + (s.actualDistance || 0), 0);

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Planilha de Treino"
                subtitle={`Semana ${weeklyPlan.weekNumber} • ${weeklyPlan.cycle}`}
                description="Planejamento detalhado com exercícios, paces e zonas de frequência cardíaca."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                {/* Week Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-club-red/10 flex items-center justify-center">
                            <Target className="w-6 h-6 text-club-red" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Meta Semanal</p>
                            <p className="text-xl font-black text-white">{(weeklyPlan.totalDistance / 1000).toFixed(0)}km</p>
                        </div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Realizado</p>
                            <p className="text-xl font-black text-emerald-400">{(completedDistance / 1000).toFixed(1)}km</p>
                        </div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-club-gold/10 flex items-center justify-center">
                            <Flame className="w-6 h-6 text-club-gold" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Fase</p>
                            <p className="text-lg font-black text-club-gold">{weeklyPlan.phase}</p>
                        </div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Droplets className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Sessões</p>
                            <p className="text-xl font-black text-white">
                                {weeklyPlan.sessions.filter(s => s.status === 'completed').length}/{weeklyPlan.sessions.length}
                            </p>
                        </div>
                    </AnimatedCard>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sessions List */}
                    <div className="lg:col-span-1 space-y-3">
                        <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4 px-2">
                            Sessões da Semana
                        </h3>
                        {weeklyPlan.sessions.map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedSession(idx)}
                                className={cn(
                                    "w-full p-4 rounded-2xl text-left transition-all border",
                                    selectedSession === idx
                                        ? "bg-club-red/10 border-club-red/30"
                                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-white/30 uppercase">{s.day}</span>
                                        <span className="text-[10px] text-white/20">{s.date}</span>
                                    </div>
                                    <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full uppercase",
                                        s.status === 'completed' ? "bg-emerald-500/20 text-emerald-400" :
                                            s.status === 'today' ? "bg-club-gold/20 text-club-gold" : "bg-white/5 text-white/30"
                                    )}>
                                        {s.status === 'completed' ? '✓ Feito' : s.status === 'today' ? 'Hoje' : 'Pendente'}
                                    </span>
                                </div>
                                <h4 className="text-white font-bold mb-2">{s.title}</h4>
                                <div className="flex items-center gap-3 text-[10px]">
                                    <span className={cn("px-2 py-0.5 rounded border", typeColors[s.type])}>{s.type}</span>
                                    <span className="text-white/40 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {s.duration}min
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Session Detail */}
                    <div className="lg:col-span-2">
                        {session ? (
                            <AnimatedCard variant="carbon" className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase border", typeColors[session.type])}>
                                                {session.type}
                                            </span>
                                            <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase", intensityColors[session.intensity])}>
                                                {session.intensity}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{session.title}</h2>
                                        <p className="text-white/40 text-sm">{session.day}, {session.date} • {session.duration} minutos</p>
                                    </div>
                                    {session.heartRateZone !== 'N/A' && (
                                        <div className="text-center p-4 bg-club-red/10 rounded-2xl">
                                            <Heart className="w-6 h-6 text-club-red mx-auto mb-1" />
                                            <span className="text-lg font-black text-club-red">{session.heartRateZone}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Timer */}
                                <div className="bg-white/5 rounded-2xl p-6 mb-8 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Cronômetro de Treino</p>
                                        <p className="text-4xl font-black text-white font-mono">{formatTime(timerSeconds)}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => setTimerSeconds(0)}
                                            className="border-white/10"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            onClick={() => setTimerRunning(!timerRunning)}
                                            className="bg-club-red hover:bg-club-red-700"
                                        >
                                            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </div>

                                {/* Warmup */}
                                {session.warmup.duration > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-[10px] font-black text-club-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Zap className="w-4 h-4" /> Aquecimento ({session.warmup.duration}min)
                                        </h4>
                                        <p className="text-white/60 text-sm bg-white/5 rounded-xl p-4">{session.warmup.description}</p>
                                    </div>
                                )}

                                {/* Main Workout */}
                                <div className="mb-6">
                                    <h4 className="text-[10px] font-black text-club-red uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Flame className="w-4 h-4" /> Treino Principal
                                    </h4>
                                    <div className="space-y-3">
                                        {session.main.map((exercise, i) => (
                                            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white font-black">{exercise.set}</span>
                                                    {exercise.rest !== '-' && (
                                                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                                                            <Timer className="w-3 h-3" /> Desc: {exercise.rest}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-white/40 text-[10px] uppercase">Pace/Carga</span>
                                                        <p className="text-club-gold font-bold">{exercise.pace}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-white/40 text-[10px] uppercase">Foco</span>
                                                        <p className="text-white/70">{exercise.focus}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cooldown */}
                                {session.cooldown.duration > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Droplets className="w-4 h-4" /> Volta à Calma ({session.cooldown.duration}min)
                                        </h4>
                                        <p className="text-white/60 text-sm bg-white/5 rounded-xl p-4">{session.cooldown.description}</p>
                                    </div>
                                )}

                                {/* Notes */}
                                {session.notes && (
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                                        <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Observações do Treinador</h4>
                                        <p className="text-white/70 text-sm">{session.notes}</p>
                                    </div>
                                )}

                                {/* Feedback */}
                                {session.feedback ? (
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Check className="w-4 h-4" /> Feedback Registrado
                                        </h4>
                                        <p className="text-white/70 text-sm">{session.feedback}</p>
                                    </div>
                                ) : (
                                    <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white gap-2">
                                        <MessageSquare className="w-4 h-4" /> Registrar Feedback do Treino
                                    </Button>
                                )}
                            </AnimatedCard>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <Activity className="w-16 h-16 text-white/10 mx-auto mb-4" />
                                    <p className="text-white/40">Selecione uma sessão para ver os detalhes</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
