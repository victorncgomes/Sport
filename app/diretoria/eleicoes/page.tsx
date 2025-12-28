'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Vote,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const currentElection = {
    title: 'Eleição Conselho Fiscal 2025',
    description: 'Eleição dos membros do Conselho Fiscal para o biênio 2025-2027',
    startDate: '2025-03-01',
    endDate: '2025-03-15',
    status: 'UPCOMING',
    totalVoters: 127,
    votedCount: 0,
    candidates: [
        { id: '1', name: 'Roberto Machado', role: 'Titular 1', votes: 0 },
        { id: '2', name: 'Fernanda Costa', role: 'Titular 2', votes: 0 },
        { id: '3', name: 'Lucas Ribeiro', role: 'Suplente', votes: 0 },
    ],
};

const pastElections = [
    {
        id: '1',
        title: 'Eleição Diretoria Executiva 2023-2025',
        date: '2023-01-20',
        totalVotes: 98,
        winner: 'Carlos Melo (Presidente)',
    },
    {
        id: '2',
        title: 'Conselho Fiscal 2023',
        date: '2023-03-10',
        totalVotes: 74,
        winner: 'Ana Paula Ferreira',
    },
    {
        id: '3',
        title: 'Diretoria Executiva 2021-2023',
        date: '2021-01-15',
        totalVotes: 85,
        winner: 'Marco Antônio Silva',
    },
];

const statusConfig = {
    UPCOMING: { label: 'Em Breve', color: 'bg-amber-500/20 text-amber-400' },
    ACTIVE: { label: 'Em Andamento', color: 'bg-emerald-500/20 text-emerald-400' },
    CLOSED: { label: 'Encerrada', color: 'bg-white/10 text-white/60' },
};

export default function EleicoesPage() {
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

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
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Eleições</h1>
                            <p className="text-white/50">Votações e resultados oficiais</p>
                        </div>
                    </div>
                </div>

                {/* Current Election */}
                <section className="mb-12">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Vote className="w-5 h-5 text-club-gold" />
                        Próxima Eleição
                    </h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AnimatedCard variant="gradient" className="p-8 border border-club-gold/20">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        <Badge className={`${statusConfig[currentElection.status as keyof typeof statusConfig].color} border-0`}>
                                            {statusConfig[currentElection.status as keyof typeof statusConfig].label}
                                        </Badge>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">{currentElection.title}</h3>
                                    <p className="text-white/50 mb-4">{currentElection.description}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-white/50 mb-6">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(currentElection.startDate).toLocaleDateString('pt-BR')} - {new Date(currentElection.endDate).toLocaleDateString('pt-BR')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {currentElection.totalVoters} eleitores aptos
                                        </span>
                                    </div>

                                    <div className="glass-card p-4">
                                        <h4 className="text-sm font-bold text-white mb-3">Candidatos</h4>
                                        <div className="space-y-2">
                                            {currentElection.candidates.map((candidate) => (
                                                <div
                                                    key={candidate.id}
                                                    className={`p-3 rounded-xl border transition-all cursor-pointer ${selectedCandidate === candidate.id
                                                            ? 'bg-club-red/20 border-club-red'
                                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                                        }`}
                                                    onClick={() => setSelectedCandidate(candidate.id)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-white">{candidate.name}</p>
                                                            <p className="text-xs text-white/40">{candidate.role}</p>
                                                        </div>
                                                        {selectedCandidate === candidate.id && (
                                                            <CheckCircle2 className="w-5 h-5 text-club-red" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="md:w-48 space-y-4">
                                    <div className="glass-card p-4 text-center">
                                        <Clock className="w-6 h-6 text-club-gold mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white">
                                            {Math.max(0, Math.ceil((new Date(currentElection.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                                        </div>
                                        <div className="text-xs text-white/40">dias para início</div>
                                    </div>
                                    <div className="glass-card p-4 text-center">
                                        <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white">
                                            {currentElection.votedCount}/{currentElection.totalVoters}
                                        </div>
                                        <div className="text-xs text-white/40">votos computados</div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>
                    </motion.div>
                </section>

                {/* Past Elections */}
                <section>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-white/50" />
                        Eleições Anteriores
                    </h2>

                    <div className="space-y-3">
                        {pastElections.map((election, i) => (
                            <motion.div
                                key={election.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" hover>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                            <Vote className="w-6 h-6 text-white/30" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-white truncate">{election.title}</h3>
                                            <div className="flex items-center gap-4 text-xs text-white/40">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(election.date).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span>{election.totalVotes} votos</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-white/40">Vencedor</p>
                                            <p className="text-sm font-bold text-club-gold">{election.winner}</p>
                                        </div>
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
