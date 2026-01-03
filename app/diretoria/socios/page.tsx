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
    User,
    Activity,
    Heart,
    Clock,
    FileText,
    Trophy,
    X,
    Send,
    UserPlus,
    Shield,
    GraduationCap,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const members = [
    { id: '1', name: 'João Paulo Silva', email: 'joaopaulo@email.com', phone: '(84) 99999-1234', category: 'Remador', status: 'ACTIVE', memberSince: '2020-03-15', lastPayment: '2025-01-05', paymentStatus: 'PAID', avatar: 'JP' },
    { id: '2', name: 'Maria Clara Costa', email: 'mariaclara@email.com', phone: '(84) 99888-5678', category: 'Remadora', status: 'ACTIVE', memberSince: '2021-06-20', lastPayment: '2025-01-10', paymentStatus: 'PAID', avatar: 'MC' },
    { id: '3', name: 'Carlos Eduardo Melo', email: 'carloseduardo@email.com', phone: '(84) 99777-9012', category: 'Contribuinte', status: 'ACTIVE', memberSince: '2019-01-10', lastPayment: '2024-12-15', paymentStatus: 'PENDING', avatar: 'CE' },
    { id: '4', name: 'Ana Beatriz Lima', email: 'anabeatriz@email.com', phone: '(84) 99666-3456', category: 'Remadora', status: 'INACTIVE', memberSince: '2022-08-01', lastPayment: '2024-08-20', paymentStatus: 'OVERDUE', avatar: 'AB' },
    { id: '5', name: 'Roberto Ferreira', email: 'roberto@email.com', phone: '(84) 99555-7890', category: 'Benemérito', status: 'ACTIVE', memberSince: '2010-05-22', lastPayment: null, paymentStatus: 'EXEMPT', avatar: 'RF' },
    { id: '6', name: 'Fernanda Santos', email: 'fernanda.santos@email.com', phone: '(84) 99444-1111', category: 'Remadora', status: 'ACTIVE', memberSince: '2023-02-14', lastPayment: '2025-01-08', paymentStatus: 'PAID', avatar: 'FS' },
    { id: '7', name: 'Lucas Oliveira', email: 'lucas.oliveira@email.com', phone: '(84) 99333-2222', category: 'Remador', status: 'ACTIVE', memberSince: '2022-11-30', lastPayment: '2025-01-03', paymentStatus: 'PAID', avatar: 'LO' },
    { id: '8', name: 'Juliana Pereira', email: 'juliana.pereira@email.com', phone: '(84) 99222-3333', category: 'Remadora', status: 'ACTIVE', memberSince: '2021-09-18', lastPayment: '2024-12-28', paymentStatus: 'PAID', avatar: 'JP' },
    { id: '9', name: 'Marcos Almeida', email: 'marcos.almeida@email.com', phone: '(84) 99111-4444', category: 'Contribuinte', status: 'ACTIVE', memberSince: '2020-07-25', lastPayment: '2024-12-20', paymentStatus: 'PENDING', avatar: 'MA' },
    { id: '10', name: 'Patrícia Souza', email: 'patricia.souza@email.com', phone: '(84) 99000-5555', category: 'Remadora', status: 'ACTIVE', memberSince: '2023-04-10', lastPayment: '2025-01-12', paymentStatus: 'PAID', avatar: 'PS' },
    { id: '11', name: 'Ricardo Nascimento', email: 'ricardo.nasc@email.com', phone: '(84) 98888-6666', category: 'Remador', status: 'ACTIVE', memberSince: '2019-12-05', lastPayment: '2025-01-02', paymentStatus: 'PAID', avatar: 'RN' },
    { id: '12', name: 'Camila Rodrigues', email: 'camila.rod@email.com', phone: '(84) 98777-7777', category: 'Remadora', status: 'INACTIVE', memberSince: '2022-03-22', lastPayment: '2024-09-15', paymentStatus: 'OVERDUE', avatar: 'CR' },
    { id: '13', name: 'Bruno Carvalho', email: 'bruno.carv@email.com', phone: '(84) 98666-8888', category: 'Remador', status: 'ACTIVE', memberSince: '2021-01-08', lastPayment: '2025-01-06', paymentStatus: 'PAID', avatar: 'BC' },
    { id: '14', name: 'Amanda Martins', email: 'amanda.mart@email.com', phone: '(84) 98555-9999', category: 'Contribuinte', status: 'ACTIVE', memberSince: '2023-07-14', lastPayment: '2024-12-30', paymentStatus: 'PAID', avatar: 'AM' },
    { id: '15', name: 'Diego Barbosa', email: 'diego.barb@email.com', phone: '(84) 98444-0000', category: 'Remador', status: 'ACTIVE', memberSince: '2020-10-20', lastPayment: '2024-12-18', paymentStatus: 'PENDING', avatar: 'DB' },
    { id: '16', name: 'Larissa Gomes', email: 'larissa.gom@email.com', phone: '(84) 98333-1111', category: 'Remadora', status: 'ACTIVE', memberSince: '2022-06-08', lastPayment: '2025-01-09', paymentStatus: 'PAID', avatar: 'LG' },
    { id: '17', name: 'Felipe Ribeiro', email: 'felipe.rib@email.com', phone: '(84) 98222-2222', category: 'Remador', status: 'ACTIVE', memberSince: '2021-04-16', lastPayment: '2025-01-04', paymentStatus: 'PAID', avatar: 'FR' },
    { id: '18', name: 'Natália Araújo', email: 'natalia.ara@email.com', phone: '(84) 98111-3333', category: 'Remadora', status: 'ACTIVE', memberSince: '2023-01-25', lastPayment: '2024-12-22', paymentStatus: 'PAID', avatar: 'NA' },
    { id: '19', name: 'Gustavo Lima', email: 'gustavo.lim@email.com', phone: '(84) 98000-4444', category: 'Contribuinte', status: 'ACTIVE', memberSince: '2019-08-30', lastPayment: '2025-01-07', paymentStatus: 'PAID', avatar: 'GL' },
    { id: '20', name: 'Beatriz Fernandes', email: 'beatriz.fer@email.com', phone: '(84) 97999-5555', category: 'Remadora', status: 'INACTIVE', memberSince: '2022-12-12', lastPayment: '2024-07-10', paymentStatus: 'OVERDUE', avatar: 'BF' },
    { id: '21', name: 'Pedro Henrique', email: 'pedro.hen@email.com', phone: '(84) 97888-6666', category: 'Remador', status: 'ACTIVE', memberSince: '2020-05-18', lastPayment: '2024-12-29', paymentStatus: 'PAID', avatar: 'PH' },
    { id: '22', name: 'Isabela Cruz', email: 'isabela.cruz@email.com', phone: '(84) 97777-7777', category: 'Remadora', status: 'ACTIVE', memberSince: '2023-03-05', lastPayment: '2025-01-11', paymentStatus: 'PAID', avatar: 'IC' },
    { id: '23', name: 'Rafael Moreira', email: 'rafael.mor@email.com', phone: '(84) 97666-8888', category: 'Remador', status: 'ACTIVE', memberSince: '2021-08-22', lastPayment: '2024-12-25', paymentStatus: 'PENDING', avatar: 'RM' },
    { id: '24', name: 'Carolina Dias', email: 'carolina.dias@email.com', phone: '(84) 97555-9999', category: 'Contribuinte', status: 'ACTIVE', memberSince: '2022-02-28', lastPayment: '2025-01-01', paymentStatus: 'PAID', avatar: 'CD' },
    { id: '25', name: 'Thiago Nunes', email: 'thiago.nunes@email.com', phone: '(84) 97444-0000', category: 'Remador', status: 'ACTIVE', memberSince: '2020-09-10', lastPayment: '2024-12-27', paymentStatus: 'PAID', avatar: 'TN' },
    { id: '26', name: 'Letícia Cardoso', email: 'leticia.card@email.com', phone: '(84) 97333-1111', category: 'Remadora', status: 'ACTIVE', memberSince: '2023-05-20', lastPayment: '2025-01-10', paymentStatus: 'PAID', avatar: 'LC' },
    { id: '27', name: 'André Teixeira', email: 'andre.teix@email.com', phone: '(84) 97222-2222', category: 'Benemérito', status: 'ACTIVE', memberSince: '2015-04-01', lastPayment: null, paymentStatus: 'EXEMPT', avatar: 'AT' },
    { id: '28', name: 'Mariana Rocha', email: 'mariana.rocha@email.com', phone: '(84) 97111-3333', category: 'Remadora', status: 'ACTIVE', memberSince: '2021-11-15', lastPayment: '2024-12-26', paymentStatus: 'PAID', avatar: 'MR' },
    { id: '29', name: 'Vinícius Castro', email: 'vinicius.cast@email.com', phone: '(84) 97000-4444', category: 'Remador', status: 'ACTIVE', memberSince: '2022-07-08', lastPayment: '2024-12-31', paymentStatus: 'PAID', avatar: 'VC' },
    { id: '30', name: 'Gabriela Lopes', email: 'gabriela.lop@email.com', phone: '(84) 96999-5555', category: 'Honorário', status: 'ACTIVE', memberSince: '2018-12-01', lastPayment: null, paymentStatus: 'EXEMPT', avatar: 'GL' },
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
    const [showNovoSocioModal, setShowNovoSocioModal] = useState(false);
    const [novoSocioTab, setNovoSocioTab] = useState<'convite' | 'manual'>('convite');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteSending, setInviteSending] = useState(false);
    const [manualForm, setManualForm] = useState({ name: '', email: '', phone: '', category: 'Remador' });
    const [activeRoleMenu, setActiveRoleMenu] = useState<string | null>(null);

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = !filterStatus || member.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleSendInvite = async () => {
        if (!inviteEmail) return;
        setInviteSending(true);
        // Simular envio
        await new Promise(r => setTimeout(r, 1500));
        setInviteSending(false);
        setInviteEmail('');
        setShowNovoSocioModal(false);
        alert('Convite enviado para ' + inviteEmail);
    };

    const handleManualRegister = async () => {
        if (!manualForm.name || !manualForm.email) return;
        // Simular registro
        await new Promise(r => setTimeout(r, 500));
        setManualForm({ name: '', email: '', phone: '', category: 'Remador' });
        setShowNovoSocioModal(false);
        alert('Sócio ' + manualForm.name + ' cadastrado!');
    };

    const handlePromoteRole = (memberId: string, newRole: 'Treinador' | 'Diretoria') => {
        alert(`Membro ${memberId} promovido para ${newRole}!`);
        setActiveRoleMenu(null);
    };

    const stats = {
        total: members.length,
        active: members.filter(m => m.status === 'ACTIVE').length,
        pending: members.filter(m => m.paymentStatus === 'PENDING').length,
        overdue: members.filter(m => m.paymentStatus === 'OVERDUE').length,
        // Gênero (simulado baseado em categoria)
        male: members.filter(m => m.category === 'Remador' || m.category === 'Contribuinte' || m.category === 'Benemérito').length,
        female: members.filter(m => m.category === 'Remadora' || m.category === 'Honorário').length,
        // Faixa etária (simulado)
        young: Math.floor(members.length * 0.4),
        master: Math.floor(members.length * 0.35),
        // Voluntariado (simulado)
        volunteers: Math.floor(members.length * 0.3),
        notVolunteers: Math.floor(members.length * 0.7),
        // Acesso (simulado)
        recentAccess: Math.floor(members.filter(m => m.status === 'ACTIVE').length * 0.8),
        noAccess: Math.floor(members.filter(m => m.status === 'ACTIVE').length * 0.2),
        // Saúde (simulado)
        anamneseOk: Math.floor(members.length * 0.7),
        anamnesePending: Math.floor(members.length * 0.3),
        awayOver40: members.filter(m => m.status === 'INACTIVE').length,
        // Atletas competidores
        athletes: Math.floor(members.filter(m => m.category.includes('Remador')).length * 0.5),
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
                        <Button className="gap-2" onClick={() => setShowNovoSocioModal(true)}>
                            <Plus className="w-4 h-4" />
                            Novo Sócio
                        </Button>
                    </div>
                </div>

                {/* Stats Avançadas */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-club-gold" />
                        Visão Geral dos Sócios
                    </h2>

                    {/* Métricas Principais */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

                    {/* Métricas Detalhadas */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {/* Gênero */}
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <span className="text-sm">♂</span>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.male}</div>
                                    <div className="text-[10px] text-white/40">Masculino</div>
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                                    <span className="text-sm">♀</span>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.female}</div>
                                    <div className="text-[10px] text-white/40">Feminino</div>
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Faixa Etária */}
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <span className="text-xs">18-35</span>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.young}</div>
                                    <div className="text-[10px] text-white/40">Jovens</div>
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <span className="text-xs">40+</span>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.master}</div>
                                    <div className="text-[10px] text-white/40">Masters</div>
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Voluntariado */}
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <Heart className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.volunteers}</div>
                                    <div className="text-[10px] text-white/40">Voluntários</div>
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <Heart className="w-4 h-4 text-white/40" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.notVolunteers}</div>
                                    <div className="text-[10px] text-white/40">Não Voluntários</div>
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Acesso e Saúde */}
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.recentAccess}</div>
                                    <div className="text-[10px] text-white/40">Acesso Recente</div>
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-red-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.noAccess}</div>
                                    <div className="text-[10px] text-white/40">Sem Acesso 30d</div>
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.anamneseOk}</div>
                                    <div className="text-[10px] text-white/40">Anamnese OK</div>
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-orange-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.anamnesePending}</div>
                                    <div className="text-[10px] text-white/40">Anamnese Pend.</div>
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.awayOver40}</div>
                                    <div className="text-[10px] text-white/40">Afastados +40d</div>
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard variant="glass" className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-club-gold/20 flex items-center justify-center">
                                    <Trophy className="w-4 h-4 text-club-gold" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white">{stats.athletes}</div>
                                    <div className="text-[10px] text-white/40">Atletas Comp.</div>
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>
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
                                <Link href={`/diretoria/socios/${member.id}`}>
                                    <AnimatedCard variant="glass" hover className="group cursor-pointer">
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
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-white/30 hover:text-white"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveRoleMenu(member.id); }}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                </Link>
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

            {/* Modal Novo Sócio */}
            <AnimatePresence>
                {showNovoSocioModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowNovoSocioModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-emerald-400" />
                                    Novo Sócio
                                </h2>
                                <button
                                    onClick={() => setShowNovoSocioModal(false)}
                                    className="text-white/40 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-white/10">
                                <button
                                    onClick={() => setNovoSocioTab('convite')}
                                    className={`flex-1 py-3 text-sm font-medium transition-colors ${novoSocioTab === 'convite' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-white/50'}`}
                                >
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Enviar Convite
                                </button>
                                <button
                                    onClick={() => setNovoSocioTab('manual')}
                                    className={`flex-1 py-3 text-sm font-medium transition-colors ${novoSocioTab === 'manual' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-white/50'}`}
                                >
                                    <UserPlus className="w-4 h-4 inline mr-2" />
                                    Cadastro Manual
                                </button>
                            </div>

                            <div className="p-4">
                                {novoSocioTab === 'convite' ? (
                                    <div className="space-y-4">
                                        <p className="text-white/60 text-sm">
                                            Envie um link de cadastro para o email do futuro sócio.
                                            Ele receberá instruções para completar o cadastro.
                                        </p>
                                        <div>
                                            <label className="text-white/70 text-sm mb-1 block">Email do convidado</label>
                                            <Input
                                                type="email"
                                                placeholder="email@exemplo.com"
                                                value={inviteEmail}
                                                onChange={e => setInviteEmail(e.target.value)}
                                                className="bg-white/5 border-white/10"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSendInvite}
                                            disabled={!inviteEmail || inviteSending}
                                            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            {inviteSending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                            {inviteSending ? 'Enviando...' : 'Enviar Convite'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-white/60 text-sm">
                                            Cadastre manualmente um novo sócio. Um email de boas-vindas
                                            será enviado automaticamente.
                                        </p>
                                        <div>
                                            <label className="text-white/70 text-sm mb-1 block">Nome completo *</label>
                                            <Input
                                                placeholder="Nome do sócio"
                                                value={manualForm.name}
                                                onChange={e => setManualForm(f => ({ ...f, name: e.target.value }))}
                                                className="bg-white/5 border-white/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-white/70 text-sm mb-1 block">Email *</label>
                                            <Input
                                                type="email"
                                                placeholder="email@exemplo.com"
                                                value={manualForm.email}
                                                onChange={e => setManualForm(f => ({ ...f, email: e.target.value }))}
                                                className="bg-white/5 border-white/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-white/70 text-sm mb-1 block">Telefone</label>
                                            <Input
                                                placeholder="(84) 99999-9999"
                                                value={manualForm.phone}
                                                onChange={e => setManualForm(f => ({ ...f, phone: e.target.value }))}
                                                className="bg-white/5 border-white/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-white/70 text-sm mb-1 block">Categoria</label>
                                            <select
                                                value={manualForm.category}
                                                onChange={e => setManualForm(f => ({ ...f, category: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                                            >
                                                <option value="Remador">Remador</option>
                                                <option value="Remadora">Remadora</option>
                                                <option value="Contribuinte">Contribuinte</option>
                                            </select>
                                        </div>
                                        <Button
                                            onClick={handleManualRegister}
                                            disabled={!manualForm.name || !manualForm.email}
                                            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Cadastrar Sócio
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Menu de Promoção de Cargo (aparece ao clicar em MoreVertical) */}
            <AnimatePresence>
                {activeRoleMenu && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveRoleMenu(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 rounded-xl p-2 min-w-[200px]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-xs text-white/40 px-3 py-2">Promover para:</div>
                            <button
                                onClick={() => handlePromoteRole(activeRoleMenu, 'Treinador')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <GraduationCap className="w-4 h-4 text-blue-400" />
                                Treinador
                            </button>
                            <button
                                onClick={() => handlePromoteRole(activeRoleMenu, 'Diretoria')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Shield className="w-4 h-4 text-amber-400" />
                                Diretoria
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
