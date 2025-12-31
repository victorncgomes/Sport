'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    FileText,
    Calendar,
    CheckCircle2,
    Clock,
    Award,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface VolunteerStatus {
    isVolunteer: boolean;
    termAcceptedAt?: string;
    totalHours: number;
    totalTasks: number;
    reputation: number;
    pendingTasks: number;
}

export default function VolunteerPage() {
    const [status, setStatus] = useState<VolunteerStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStatus();
    }, []);

    async function loadStatus() {
        try {
            const response = await fetch('/api/volunteer/status');
            if (response.ok) {
                const data = await response.json();
                setStatus(data);
            } else {
                // Usuário não é voluntário ainda
                setStatus({
                    isVolunteer: false,
                    totalHours: 0,
                    totalTasks: 0,
                    reputation: 0,
                    pendingTasks: 0
                });
            }
        } catch (error) {
            console.error('Error loading volunteer status:', error);
            setStatus({
                isVolunteer: false,
                totalHours: 0,
                totalTasks: 0,
                reputation: 0,
                pendingTasks: 0
            });
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-club-black pb-24 flex items-center justify-center">
                <p className="text-white/60">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Voluntariado"
                subtitle="Sport Club de Natal"
                description="Faça parte da nossa equipe de voluntários"
                compact
            />

            <div className="container mx-auto px-4 py-8 space-y-6">

                {/* Status do Voluntariado */}
                {!status?.isVolunteer ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AnimatedCard variant="gradient" className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-7 h-7 text-club-red" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white mb-2">
                                        Junte-se aos Voluntários!
                                    </h2>
                                    <p className="text-white/60 text-sm mb-4">
                                        Seja parte ativa do clube. Ajude nas atividades, eventos
                                        e manutenção. Ganhe pontos e reconhecimento!
                                    </p>
                                    <Link href="/volunteer/term">
                                        <Button className="bg-club-red hover:bg-club-red/90 gap-2">
                                            <FileText className="w-4 h-4" />
                                            Aceitar Termo de Voluntariado
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </AnimatedCard>
                    </motion.div>
                ) : (
                    <>
                        {/* Estatísticas do Voluntário */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AnimatedCard variant="gradient" className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                    <h2 className="text-lg font-bold text-white">Voluntário Ativo</h2>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                        Desde {new Date(status.termAcceptedAt || '').toLocaleDateString('pt-BR')}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-white">{status.totalHours}h</p>
                                        <p className="text-white/60 text-xs">Horas Contribuídas</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-white">{status.totalTasks}</p>
                                        <p className="text-white/60 text-xs">Tarefas Concluídas</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <Award className="w-6 h-6 text-club-gold mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-white">{status.reputation}%</p>
                                        <p className="text-white/60 text-xs">Reputação</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center">
                                        <AlertCircle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-white">{status.pendingTasks}</p>
                                        <p className="text-white/60 text-xs">Tarefas Pendentes</p>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </motion.div>

                        {/* Tarefas Pendentes */}
                        {status.pendingTasks > 0 && (
                            <Link href="/volunteer/tasks">
                                <AnimatedCard variant="glass" className="p-4 border-l-4 border-orange-500">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-orange-400" />
                                            <div>
                                                <p className="text-white font-medium">
                                                    {status.pendingTasks} tarefa(s) pendente(s)
                                                </p>
                                                <p className="text-white/60 text-sm">
                                                    Clique para ver detalhes
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/40" />
                                    </div>
                                </AnimatedCard>
                            </Link>
                        )}
                    </>
                )}

                {/* Menu de Opções */}
                <div className="space-y-3">
                    <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">
                        Opções
                    </h3>

                    <Link href="/volunteer/term">
                        <AnimatedCard variant="glass" className="p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Termo de Adesão</p>
                                        <p className="text-white/60 text-sm">
                                            {status?.isVolunteer ? 'Ver meu termo' : 'Aceitar termo de voluntariado'}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/40" />
                            </div>
                        </AnimatedCard>
                    </Link>

                    <Link href="/volunteer/calendar">
                        <AnimatedCard variant="glass" className="p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Disponibilidade</p>
                                        <p className="text-white/60 text-sm">Editar meus horários</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/40" />
                            </div>
                        </AnimatedCard>
                    </Link>

                    <Link href="/profile/panel">
                        <AnimatedCard variant="glass" className="p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Reputação e Badges</p>
                                        <p className="text-white/60 text-sm">Ver conquistas</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/40" />
                            </div>
                        </AnimatedCard>
                    </Link>
                </div>

                {/* Benefícios */}
                <AnimatedCard variant="glass" className="p-6">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-club-red" />
                        Benefícios do Voluntário
                    </h3>
                    <ul className="space-y-3 text-white/80 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">✓</span>
                            Ganhe pontos por cada tarefa concluída
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">✓</span>
                            Desbloqueie badges exclusivos
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">✓</span>
                            Prioridade em reservas de equipamentos
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">✓</span>
                            Reconhecimento no ranking do clube
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">✓</span>
                            Certificado de horas voluntárias
                        </li>
                    </ul>
                </AnimatedCard>
            </div>
        </div>
    );
}
