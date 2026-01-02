'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    ArrowLeft,
    Vote,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    Award,
    Plus,
    X,
    ThumbsUp,
    ThumbsDown,
    MinusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VotingOption {
    id: string;
    label: string;
    votes: number;
}

interface Voting {
    id: string;
    title: string;
    description: string;
    status: 'UPCOMING' | 'ACTIVE' | 'CLOSED';
    startDate: string;
    endDate: string;
    type: 'YES_NO' | 'MULTIPLE_CHOICE';
    options: VotingOption[];
    totalVoters: number;
    votedCount: number;
    result?: string;
}

const votings: Voting[] = [
    {
        id: '1',
        title: 'Aprovação do Orçamento 2025',
        description: 'Votação para aprovar o orçamento proposto pela tesouraria para o ano de 2025.',
        status: 'ACTIVE',
        startDate: '2025-01-20',
        endDate: '2025-01-27',
        type: 'YES_NO',
        options: [
            { id: 'sim', label: 'Aprovar', votes: 8 },
            { id: 'nao', label: 'Reprovar', votes: 2 },
            { id: 'abster', label: 'Abstenção', votes: 1 },
        ],
        totalVoters: 15,
        votedCount: 11,
    },
    {
        id: '2',
        title: 'Escolha do Local para Evento de Aniversário',
        description: 'Onde realizar o evento comemorativo de 110 anos do clube?',
        status: 'UPCOMING',
        startDate: '2025-02-01',
        endDate: '2025-02-10',
        type: 'MULTIPLE_CHOICE',
        options: [
            { id: 'sede', label: 'Sede do Clube', votes: 0 },
            { id: 'hotel', label: 'Hotel na Praia', votes: 0 },
            { id: 'restaurante', label: 'Restaurante Parceiro', votes: 0 },
        ],
        totalVoters: 15,
        votedCount: 0,
    },
];

const pastVotings: Voting[] = [
    {
        id: '3',
        title: 'Compra de Novo Barco 8+',
        description: 'Aprovação para aquisição de barco de competição.',
        status: 'CLOSED',
        startDate: '2024-12-01',
        endDate: '2024-12-08',
        type: 'YES_NO',
        options: [
            { id: 'sim', label: 'Aprovar', votes: 12 },
            { id: 'nao', label: 'Reprovar', votes: 3 },
        ],
        totalVoters: 15,
        votedCount: 15,
        result: 'Aprovado (80%)',
    },
    {
        id: '4',
        title: 'Aumento de Mensalidade 2025',
        description: 'Proposta de reajuste de 8% nas mensalidades.',
        status: 'CLOSED',
        startDate: '2024-11-15',
        endDate: '2024-11-22',
        type: 'YES_NO',
        options: [
            { id: 'sim', label: 'Aprovar', votes: 9 },
            { id: 'nao', label: 'Reprovar', votes: 6 },
        ],
        totalVoters: 15,
        votedCount: 15,
        result: 'Aprovado (60%)',
    },
];

const statusConfig = {
    UPCOMING: { label: 'Aguardando', color: 'bg-amber-500/20 text-amber-400' },
    ACTIVE: { label: 'Em Votação', color: 'bg-emerald-500/20 text-emerald-400' },
    CLOSED: { label: 'Encerrada', color: 'bg-white/10 text-white/60' },
};

export default function VotacoesPage() {
    const [showNewVotingModal, setShowNewVotingModal] = useState(false);
    const [newVoting, setNewVoting] = useState({
        title: '',
        description: '',
        type: 'YES_NO' as 'YES_NO' | 'MULTIPLE_CHOICE',
        options: [''],
        startDate: '',
        endDate: '',
    });

    const handleCreateVoting = () => {
        console.log('Nova votação:', newVoting);
        setShowNewVotingModal(false);
        setNewVoting({ title: '', description: '', type: 'YES_NO', options: [''], startDate: '', endDate: '' });
    };

    const addOption = () => {
        setNewVoting(prev => ({ ...prev, options: [...prev.options, ''] }));
    };

    const updateOption = (index: number, value: string) => {
        const updated = [...newVoting.options];
        updated[index] = value;
        setNewVoting(prev => ({ ...prev, options: updated }));
    };

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
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Vote className="w-8 h-8 text-club-gold" />
                                Sistema de Votações
                            </h1>
                            <p className="text-white/50">Decisões colegiadas da diretoria</p>
                        </div>
                        <Button onClick={() => setShowNewVotingModal(true)} className="gap-2 bg-club-red hover:bg-club-red/90">
                            <Plus className="w-4 h-4" />
                            Nova Votação
                        </Button>
                    </div>
                </div>

                {/* Votações Ativas */}
                <section className="mb-12">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Votações em Andamento
                    </h2>

                    <div className="grid gap-6">
                        {votings.filter(v => v.status === 'ACTIVE' || v.status === 'UPCOMING').map((voting, i) => (
                            <motion.div
                                key={voting.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="gradient" className="p-6 border border-white/10">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge className={`${statusConfig[voting.status].color} border-0`}>
                                                    {statusConfig[voting.status].label}
                                                </Badge>
                                                <Badge className="bg-white/10 text-white/60 border-0">
                                                    {voting.type === 'YES_NO' ? 'Sim/Não' : 'Múltipla Escolha'}
                                                </Badge>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2">{voting.title}</h3>
                                            <p className="text-white/50 text-sm mb-4">{voting.description}</p>

                                            <div className="flex gap-4 text-xs text-white/40 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(voting.startDate).toLocaleDateString('pt-BR')} - {new Date(voting.endDate).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3" />
                                                    {voting.votedCount}/{voting.totalVoters} votos
                                                </span>
                                            </div>

                                            {/* Opções de Voto */}
                                            <div className="space-y-2">
                                                {voting.options.map(option => {
                                                    const percentage = voting.votedCount > 0 ? Math.round((option.votes / voting.votedCount) * 100) : 0;
                                                    return (
                                                        <div key={option.id} className="relative">
                                                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                                                <span className="flex items-center gap-2 text-white">
                                                                    {option.id === 'sim' && <ThumbsUp className="w-4 h-4 text-emerald-400" />}
                                                                    {option.id === 'nao' && <ThumbsDown className="w-4 h-4 text-red-400" />}
                                                                    {option.id === 'abster' && <MinusCircle className="w-4 h-4 text-gray-400" />}
                                                                    {option.label}
                                                                </span>
                                                                <span className="text-white/60 text-sm">{option.votes} ({percentage}%)</span>
                                                            </div>
                                                            <div
                                                                className="absolute bottom-0 left-0 h-1 bg-club-gold/50 rounded-b-lg transition-all"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="lg:w-32 flex lg:flex-col items-center justify-center gap-4">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-club-gold">
                                                    {Math.round((voting.votedCount / voting.totalVoters) * 100)}%
                                                </div>
                                                <div className="text-xs text-white/40">participação</div>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Votações Encerradas */}
                <section>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-white/50" />
                        Votações Anteriores
                    </h2>

                    <div className="space-y-3">
                        {pastVotings.map((voting, i) => (
                            <motion.div
                                key={voting.id}
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
                                            <h3 className="font-medium text-white truncate">{voting.title}</h3>
                                            <div className="flex items-center gap-4 text-xs text-white/40">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(voting.endDate).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span>{voting.votedCount} votos</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-white/40">Resultado</p>
                                            <p className="text-sm font-bold text-club-gold">{voting.result}</p>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Modal Nova Votação */}
            <AnimatePresence>
                {showNewVotingModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowNewVotingModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-club-black border border-white/10 rounded-2xl p-6 w-full max-w-lg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Nova Votação</h2>
                                <button onClick={() => setShowNewVotingModal(false)} className="text-white/40 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-white/60 mb-1 block">Título</label>
                                    <Input
                                        value={newVoting.title}
                                        onChange={e => setNewVoting(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Ex: Aprovação do Orçamento 2025"
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-1 block">Descrição</label>
                                    <textarea
                                        value={newVoting.description}
                                        onChange={e => setNewVoting(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Descreva o que está sendo votado..."
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Tipo</label>
                                        <select
                                            value={newVoting.type}
                                            onChange={e => setNewVoting(prev => ({ ...prev, type: e.target.value as 'YES_NO' | 'MULTIPLE_CHOICE' }))}
                                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                                        >
                                            <option value="YES_NO">Sim/Não/Abstenção</option>
                                            <option value="MULTIPLE_CHOICE">Múltipla Escolha</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Período</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="date"
                                                value={newVoting.startDate}
                                                onChange={e => setNewVoting(prev => ({ ...prev, startDate: e.target.value }))}
                                                className="bg-white/5 border-white/10 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {newVoting.type === 'MULTIPLE_CHOICE' && (
                                    <div>
                                        <label className="text-sm text-white/60 mb-1 block">Opções</label>
                                        <div className="space-y-2">
                                            {newVoting.options.map((opt, i) => (
                                                <Input
                                                    key={i}
                                                    value={opt}
                                                    onChange={e => updateOption(i, e.target.value)}
                                                    placeholder={`Opção ${i + 1}`}
                                                    className="bg-white/5 border-white/10"
                                                />
                                            ))}
                                            <Button variant="outline" size="sm" onClick={addOption} className="w-full border-dashed">
                                                <Plus className="w-4 h-4 mr-2" /> Adicionar Opção
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button variant="outline" className="flex-1" onClick={() => setShowNewVotingModal(false)}>
                                    Cancelar
                                </Button>
                                <Button className="flex-1 bg-club-red hover:bg-club-red/90" onClick={handleCreateVoting}>
                                    Criar Votação
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
