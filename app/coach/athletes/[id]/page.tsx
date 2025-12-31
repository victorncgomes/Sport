'use client';

import { use } from 'react';
import Link from 'next/link';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    User,
    Trophy,
    Activity,
    TrendingUp,
    Calendar,
    Target,
    Dumbbell,
    Heart,
    Clock,
    Edit,
    MessageSquare,
    BarChart3
} from 'lucide-react';

// Dados simulados de atletas
const mockAthletes: Record<string, {
    id: string;
    name: string;
    category: string;
    performance: number;
    status: string;
    avatar: string;
    level: number;
    xp: number;
    email: string;
    phone: string;
    joinDate: string;
    trainings: number;
    attendance: number;
    personalBest: string;
    goals: string[];
    recentSessions: { date: string; type: string; duration: number; performance: number }[];
}> = {
    '1': {
        id: '1', name: 'Ana Silva', category: 'Feminino', performance: 98, status: 'active', avatar: 'AS', level: 12, xp: 2450,
        email: 'ana.silva@email.com', phone: '(84) 99999-1111', joinDate: '2023-03-15', trainings: 156, attendance: 95,
        personalBest: '7:32 (2km)', goals: ['Campeonato Estadual', 'Melhorar pace em 5%'],
        recentSessions: [
            { date: '2025-01-10', type: 'Resistência', duration: 90, performance: 98 },
            { date: '2025-01-08', type: 'Técnica', duration: 60, performance: 95 },
            { date: '2025-01-05', type: 'Intervalado', duration: 75, performance: 92 },
        ]
    },
    '2': {
        id: '2', name: 'Bruno Santos', category: 'Adulto', performance: 85, status: 'warning', avatar: 'BS', level: 8, xp: 1820,
        email: 'bruno.santos@email.com', phone: '(84) 99999-2222', joinDate: '2024-01-10', trainings: 78, attendance: 72,
        personalBest: '8:15 (2km)', goals: ['Regularidade nos treinos', 'Competição regional'],
        recentSessions: [
            { date: '2025-01-09', type: 'Força', duration: 60, performance: 85 },
            { date: '2025-01-06', type: 'Resistência', duration: 80, performance: 82 },
        ]
    },
    '3': {
        id: '3', name: 'Carla Melo', category: 'Master', performance: 92, status: 'active', avatar: 'CM', level: 15, xp: 3200,
        email: 'carla.melo@email.com', phone: '(84) 99999-3333', joinDate: '2022-06-20', trainings: 234, attendance: 88,
        personalBest: '7:48 (2km)', goals: ['Manter forma física', 'Competição Master Nacional'],
        recentSessions: [
            { date: '2025-01-10', type: 'Técnica', duration: 60, performance: 94 },
            { date: '2025-01-07', type: 'Resistência', duration: 90, performance: 91 },
        ]
    },
    '4': {
        id: '4', name: 'Diego Ferreira', category: 'Júnior', performance: 70, status: 'maintenance', avatar: 'DF', level: 5, xp: 950,
        email: 'diego.ferreira@email.com', phone: '(84) 99999-4444', joinDate: '2024-08-01', trainings: 35, attendance: 60,
        personalBest: '9:10 (2km)', goals: ['Desenvolver técnica básica', 'Aumentar frequência'],
        recentSessions: [
            { date: '2024-12-20', type: 'Técnica', duration: 45, performance: 68 },
        ]
    },
};

export default function AthleteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const athlete = mockAthletes[resolvedParams.id];

    if (!athlete) {
        return (
            <div className="min-h-screen bg-club-black pt-24 flex items-center justify-center">
                <div className="text-center">
                    <User className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Atleta não encontrado</h1>
                    <Link href="/coach/athletes">
                        <Button variant="outline">Voltar à lista</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/coach/athletes" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar à Lista
                    </Link>
                </div>

                {/* Profile Card */}
                <AnimatedCard variant="gradient" className="p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-club-red/20 border-2 border-club-red/40 flex items-center justify-center text-3xl font-black text-club-red">
                            {athlete.avatar}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{athlete.name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                                <Badge className="bg-white/10 text-white/80 border-0">{athlete.category}</Badge>
                                <Badge className={`border-0 ${athlete.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                        athlete.status === 'warning' ? 'bg-amber-500/20 text-amber-500' :
                                            'bg-club-red/20 text-club-red'
                                    }`}>
                                    {athlete.status === 'active' ? 'Em Dia' : athlete.status === 'warning' ? 'Atenção' : 'Afastado'}
                                </Badge>
                            </div>
                            <p className="text-white/40 text-sm mt-2">Membro desde {new Date(athlete.joinDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="border-white/20">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Mensagem
                            </Button>
                            <Button className="bg-club-red hover:bg-club-red/90">
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                        </div>
                    </div>
                </AnimatedCard>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Trophy className="w-6 h-6 text-club-gold mx-auto mb-2" />
                        <div className="text-2xl font-black text-white">Lv.{athlete.level}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">Nível</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Activity className="w-6 h-6 text-club-red mx-auto mb-2" />
                        <div className="text-2xl font-black text-white">{athlete.xp}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">XP Total</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-black text-white">{athlete.trainings}</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">Treinos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-black text-white">{athlete.attendance}%</div>
                        <div className="text-[10px] text-white/40 uppercase tracking-widest">Frequência</div>
                    </AnimatedCard>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Performance */}
                        <AnimatedCard variant="glass" className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-white uppercase tracking-tighter">Performance</h2>
                                <BarChart3 className="w-5 h-5 text-club-gold" />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white/60">Performance Geral</span>
                                        <span className="font-bold text-white">{athlete.performance}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-club-red to-club-gold rounded-full"
                                            style={{ width: `${athlete.performance}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Melhor Marca</div>
                                        <div className="text-lg font-bold text-club-gold">{athlete.personalBest}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Última Sessão</div>
                                        <div className="text-lg font-bold text-white">
                                            {athlete.recentSessions[0]?.date
                                                ? new Date(athlete.recentSessions[0].date).toLocaleDateString('pt-BR')
                                                : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Recent Sessions */}
                        <AnimatedCard variant="glass" className="p-6">
                            <h2 className="text-lg font-black text-white uppercase tracking-tighter mb-4">Sessões Recentes</h2>
                            <div className="space-y-3">
                                {athlete.recentSessions.map((session, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-club-red/10 flex items-center justify-center">
                                                <Dumbbell className="w-5 h-5 text-club-red" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{session.type}</div>
                                                <div className="text-xs text-white/40 flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    {session.duration} min
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-club-gold">{session.performance}%</div>
                                            <div className="text-[10px] text-white/40">
                                                {new Date(session.date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <AnimatedCard variant="glass" className="p-6">
                            <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4">Contato</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Email</div>
                                    <div className="text-white">{athlete.email}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Telefone</div>
                                    <div className="text-white">{athlete.phone}</div>
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Goals */}
                        <AnimatedCard variant="glass" className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-white/60 uppercase tracking-widest">Metas</h3>
                                <Target className="w-4 h-4 text-club-red" />
                            </div>
                            <div className="space-y-2">
                                {athlete.goals.map((goal, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                                        <div className="w-1.5 h-1.5 rounded-full bg-club-gold" />
                                        {goal}
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        {/* Actions */}
                        <AnimatedCard variant="glass" className="p-6">
                            <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4">Ações</h3>
                            <div className="space-y-2">
                                <Link href={`/coach/athletes/${athlete.id}/suggest-plan`}>
                                    <Button variant="outline" className="w-full justify-start border-white/10">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Sugerir Plano
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full justify-start border-white/10">
                                    <Heart className="w-4 h-4 mr-2" />
                                    Ver Anamnese
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-white/10">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Relatório Completo
                                </Button>
                            </div>
                        </AnimatedCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
