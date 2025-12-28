'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    ArrowLeft,
    Users,
    Search,
    Plus,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    CheckCircle,
    AlertCircle,
    XCircle,
    ChevronRight,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';

const members = [
    {
        id: '1',
        name: 'João Paulo Silva',
        email: 'joaopaulo@email.com',
        phone: '(84) 99999-1234',
        category: 'Remador',
        status: 'ACTIVE',
        memberSince: '2020-03-15',
        lastPayment: '2025-01-05',
        paymentStatus: 'PAID',
        avatar: 'JP',
    },
    {
        id: '2',
        name: 'Maria Clara Costa',
        email: 'mariaclara@email.com',
        phone: '(84) 99888-5678',
        category: 'Remadora',
        status: 'ACTIVE',
        memberSince: '2021-06-20',
        lastPayment: '2025-01-10',
        paymentStatus: 'PAID',
        avatar: 'MC',
    },
    {
        id: '3',
        name: 'Carlos Eduardo Melo',
        email: 'carloseduardo@email.com',
        phone: '(84) 99777-9012',
        category: 'Contribuinte',
        status: 'ACTIVE',
        memberSince: '2019-01-10',
        lastPayment: '2024-12-15',
        paymentStatus: 'PENDING',
        avatar: 'CE',
    },
    {
        id: '4',
        name: 'Ana Beatriz Lima',
        email: 'anabeatriz@email.com',
        phone: '(84) 99666-3456',
        category: 'Remadora',
        status: 'INACTIVE',
        memberSince: '2022-08-01',
        lastPayment: '2024-08-20',
        paymentStatus: 'OVERDUE',
        avatar: 'AB',
    },
    {
        id: '5',
        name: 'Roberto Ferreira',
        email: 'roberto@email.com',
        phone: '(84) 99555-7890',
        category: 'Benemérito',
        status: 'ACTIVE',
        memberSince: '2010-05-22',
        lastPayment: null,
        paymentStatus: 'EXEMPT',
        avatar: 'RF',
    },
];

const categoryColors: Record<string, string> = {
    'Remador': 'bg-blue-500/20 text-blue-400',
    'Remadora': 'bg-pink-500/20 text-pink-400',
    'Contribuinte': 'bg-emerald-500/20 text-emerald-400',
    'Benemérito': 'bg-club-gold/20 text-club-gold',
    'Honorário': 'bg-purple-500/20 text-purple-400',
};

const statusConfig = {
    ACTIVE: { label: 'Ativo', color: 'text-emerald-400', icon: CheckCircle },
    INACTIVE: { label: 'Inativo', color: 'text-white/40', icon: XCircle },
    SUSPENDED: { label: 'Suspenso', color: 'text-red-400', icon: AlertCircle },
};

const paymentStatusConfig = {
    PAID: { label: 'Em dia', color: 'bg-emerald-500/20 text-emerald-400' },
    PENDING: { label: 'Pendente', color: 'bg-amber-500/20 text-amber-400' },
    OVERDUE: { label: 'Atrasado', color: 'bg-red-500/20 text-red-400' },
    EXEMPT: { label: 'Isento', color: 'bg-purple-500/20 text-purple-400' },
};

export default function SociosPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = !filterStatus || member.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: members.length,
        active: members.filter(m => m.status === 'ACTIVE').length,
        pending: members.filter(m => m.paymentStatus === 'PENDING').length,
        overdue: members.filter(m => m.paymentStatus === 'OVERDUE').length,
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
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Gestão de Sócios</h1>
                            <p className="text-white/50">Cadastro, mensalidades e filiações</p>
                        </div>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Novo Sócio
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-xs text-white/40">Total de Sócios</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.active}</div>
                        <div className="text-xs text-white/40">Ativos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.pending}</div>
                        <div className="text-xs text-white/40">Pendentes</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.overdue}</div>
                        <div className="text-xs text-white/40">Em Atraso</div>
                    </AnimatedCard>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                            placeholder="Buscar por nome ou email..."
                            className="pl-10 bg-white/5 border-white/10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={filterStatus === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterStatus(null)}
                            className="border-white/10"
                        >
                            Todos
                        </Button>
                        <Button
                            variant={filterStatus === 'ACTIVE' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterStatus('ACTIVE')}
                            className="border-white/10"
                        >
                            Ativos
                        </Button>
                        <Button
                            variant={filterStatus === 'INACTIVE' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterStatus('INACTIVE')}
                            className="border-white/10"
                        >
                            Inativos
                        </Button>
                    </div>
                </div>

                {/* Members List */}
                <div className="space-y-3">
                    {filteredMembers.map((member, i) => {
                        const StatusIcon = statusConfig[member.status as keyof typeof statusConfig].icon;
                        return (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <AnimatedCard variant="glass" hover className="group">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Avatar and Basic Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 rounded-full bg-club-red/20 border border-club-red/30 flex items-center justify-center font-bold text-club-red">
                                                {member.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-medium text-white truncate group-hover:text-club-gold transition-colors">
                                                        {member.name}
                                                    </h3>
                                                    <StatusIcon className={`w-4 h-4 flex-shrink-0 ${statusConfig[member.status as keyof typeof statusConfig].color}`} />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {member.email}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {member.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category and Payment */}
                                        <div className="flex items-center gap-3">
                                            <Badge className={`${categoryColors[member.category] || 'bg-white/10 text-white/60'} border-0`}>
                                                {member.category}
                                            </Badge>
                                            <Badge className={`${paymentStatusConfig[member.paymentStatus as keyof typeof paymentStatusConfig].color} border-0`}>
                                                {paymentStatusConfig[member.paymentStatus as keyof typeof paymentStatusConfig].label}
                                            </Badge>
                                        </div>

                                        {/* Member Since */}
                                        <div className="hidden md:flex items-center gap-2 text-xs text-white/40 w-32">
                                            <Calendar className="w-3 h-3" />
                                            <span>Desde {new Date(member.memberSince).getFullYear()}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="text-white/30 hover:text-white">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredMembers.length === 0 && (
                    <div className="text-center py-12">
                        <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">Nenhum sócio encontrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}
