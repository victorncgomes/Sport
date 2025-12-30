'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Target,
    TrendingUp,
    Calendar,
    Users,
    CheckCircle2,
    AlertCircle,
    Plus,
    Edit2,
    Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GoalData {
    id: string;
    title: string;
    description: string;
    type: 'TEAM' | 'INDIVIDUAL' | 'COMPETITION';
    targetDate: string;
    currentProgress: number;
    targetValue: number;
    unit: string;
    assignedTo?: string;
    status: 'ON_TRACK' | 'AT_RISK' | 'COMPLETED' | 'OVERDUE';
}

const mockGoals: GoalData[] = [
    {
        id: '1',
        title: 'Melhorar tempo médio do 2000m',
        description: 'Reduzir o tempo médio da equipe júnior em 15 segundos',
        type: 'TEAM',
        targetDate: '2025-03-15',
        currentProgress: 8,
        targetValue: 15,
        unit: 'segundos',
        status: 'ON_TRACK'
    },
    {
        id: '2',
        title: 'Campeonato Estadual',
        description: 'Conquistar pelo menos 3 medalhas no Estadual de Remo',
        type: 'COMPETITION',
        targetDate: '2025-07-20',
        currentProgress: 0,
        targetValue: 3,
        unit: 'medalhas',
        status: 'ON_TRACK'
    },
    {
        id: '3',
        title: 'Frequência de Treino - Ana Silva',
        description: 'Manter 90% de frequência nos treinos semanais',
        type: 'INDIVIDUAL',
        targetDate: '2025-06-30',
        currentProgress: 85,
        targetValue: 90,
        unit: '%',
        assignedTo: 'Ana Silva',
        status: 'AT_RISK'
    },
    {
        id: '4',
        title: 'Melhorar Voga Média',
        description: 'Aumentar voga média da equipe para 32 SPM',
        type: 'TEAM',
        targetDate: '2025-02-28',
        currentProgress: 30,
        targetValue: 32,
        unit: 'SPM',
        status: 'ON_TRACK'
    },
    {
        id: '5',
        title: 'Certificação Remador Nível 2',
        description: 'Bruno Santos deve completar certificação',
        type: 'INDIVIDUAL',
        targetDate: '2025-01-30',
        currentProgress: 100,
        targetValue: 100,
        unit: '%',
        assignedTo: 'Bruno Santos',
        status: 'COMPLETED'
    }
];

const typeConfig = {
    TEAM: { label: 'Equipe', color: 'bg-blue-500/20 text-blue-400' },
    INDIVIDUAL: { label: 'Individual', color: 'bg-purple-500/20 text-purple-400' },
    COMPETITION: { label: 'Competição', color: 'bg-club-gold/20 text-club-gold' },
};

const statusConfig = {
    ON_TRACK: { label: 'No Prazo', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
    AT_RISK: { label: 'Em Risco', color: 'bg-amber-500/20 text-amber-400', icon: AlertCircle },
    COMPLETED: { label: 'Concluído', color: 'bg-emerald-600/20 text-emerald-500', icon: CheckCircle2 },
    OVERDUE: { label: 'Atrasado', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
};

export default function CoachMetasPage() {
    const [goals] = useState<GoalData[]>(mockGoals);
    const [filter, setFilter] = useState<'ALL' | 'TEAM' | 'INDIVIDUAL' | 'COMPETITION'>('ALL');

    const filteredGoals = filter === 'ALL'
        ? goals
        : goals.filter(g => g.type === filter);

    const stats = {
        total: goals.length,
        completed: goals.filter(g => g.status === 'COMPLETED').length,
        atRisk: goals.filter(g => g.status === 'AT_RISK').length,
        avgProgress: Math.round(goals.reduce((acc, g) => acc + (g.currentProgress / g.targetValue * 100), 0) / goals.length)
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/coach/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Target className="w-8 h-8 text-club-red" />
                                Metas e Objetivos
                            </h1>
                            <p className="text-white/50">Gerencie metas de equipe, individuais e competições</p>
                        </div>
                        <Button className="gap-2 bg-club-red hover:bg-club-red/90">
                            <Plus className="w-4 h-4" />
                            Nova Meta
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-3xl font-black text-white">{stats.total}</div>
                        <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Total de Metas</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-3xl font-black text-emerald-400">{stats.completed}</div>
                        <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Concluídas</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-3xl font-black text-amber-400">{stats.atRisk}</div>
                        <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Em Risco</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <div className="text-3xl font-black text-club-red">{stats.avgProgress}%</div>
                        <div className="text-xs text-white/40 uppercase font-bold tracking-widest">Progresso Médio</div>
                    </AnimatedCard>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['ALL', 'TEAM', 'INDIVIDUAL', 'COMPETITION'] as const).map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? 'default' : 'outline'}
                            onClick={() => setFilter(f)}
                            className={`text-xs font-bold uppercase tracking-widest ${filter === f
                                    ? 'bg-club-red hover:bg-club-red/90'
                                    : 'border-white/20 text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f === 'ALL' ? 'Todas' : typeConfig[f].label}
                        </Button>
                    ))}
                </div>

                {/* Goals List */}
                <div className="space-y-4">
                    {filteredGoals.map((goal, i) => {
                        const StatusIcon = statusConfig[goal.status].icon;
                        const progress = (goal.currentProgress / goal.targetValue) * 100;

                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" hover className="p-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <Badge className={`${typeConfig[goal.type].color} border-0`}>
                                                    {typeConfig[goal.type].label}
                                                </Badge>
                                                <Badge className={`${statusConfig[goal.status].color} border-0 flex items-center gap-1`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusConfig[goal.status].label}
                                                </Badge>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-1">{goal.title}</h3>
                                            <p className="text-sm text-white/50 mb-3">{goal.description}</p>

                                            {goal.assignedTo && (
                                                <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                                                    <Users className="w-3 h-3" />
                                                    {goal.assignedTo}
                                                </div>
                                            )}

                                            {/* Progress Bar */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-white/60">
                                                        {goal.currentProgress} / {goal.targetValue} {goal.unit}
                                                    </span>
                                                    <span className="text-club-red font-bold">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${goal.status === 'COMPLETED'
                                                                ? 'bg-emerald-500'
                                                                : goal.status === 'AT_RISK'
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-club-red'
                                                            }`}
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-between">
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-xs text-white/40">
                                                    <Calendar className="w-3 h-3" />
                                                    Prazo: {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="gap-1 text-white/50 hover:text-white">
                                                <Edit2 className="w-4 h-4" />
                                                Editar
                                            </Button>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
