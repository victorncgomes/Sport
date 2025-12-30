'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Shield,
    Search,
    Filter,
    Calendar,
    User,
    FileEdit,
    Eye,
    LogIn,
    CreditCard,
    Vote,
    MessageSquare,
    Heart,
    Newspaper,
    Settings,
    Download,
    AlertTriangle,
    CheckCircle,
    Clock,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Logs de auditoria simulados
const auditLogs = [
    { id: '1', acao: 'LOGIN', usuario: 'João Paulo Silva', detalhes: 'Login realizado com sucesso', ip: '189.45.123.45', data: '2025-01-30T09:15:00', status: 'success' },
    { id: '2', acao: 'PAGAMENTO', usuario: 'Maria Clara Costa', detalhes: 'Mensalidade Janeiro/2025 - R$ 150,00 via PIX', ip: '200.18.45.67', data: '2025-01-30T09:10:00', status: 'success' },
    { id: '3', acao: 'EDIÇÃO', usuario: 'Carlos Eduardo (Admin)', detalhes: 'Editou notícia "Regata de Verão 2025"', ip: '177.92.33.21', data: '2025-01-30T08:45:00', status: 'success' },
    { id: '4', acao: 'VOTAÇÃO', usuario: 'Ana Beatriz Lima', detalhes: 'Votou na eleição "Calendário 2025"', ip: '201.45.89.12', data: '2025-01-29T17:30:00', status: 'success' },
    { id: '5', acao: 'LIKE', usuario: 'Roberto Ferreira', detalhes: 'Curtiu notícia "Campeonato Estadual"', ip: '189.90.45.78', data: '2025-01-29T16:20:00', status: 'success' },
    { id: '6', acao: 'COMENTÁRIO', usuario: 'Fernanda Santos', detalhes: 'Comentou no fórum "Técnicas de Remada"', ip: '200.150.33.44', data: '2025-01-29T15:10:00', status: 'success' },
    { id: '7', acao: 'TREINO', usuario: 'Lucas Oliveira', detalhes: 'Completou treino de ergômetro - 30min', ip: '177.45.67.89', data: '2025-01-29T14:00:00', status: 'success' },
    { id: '8', acao: 'RESERVA', usuario: 'Juliana Pereira', detalhes: 'Reservou barco "Potengi I" para 30/01', ip: '201.88.45.12', data: '2025-01-29T12:30:00', status: 'success' },
    { id: '9', acao: 'LOGIN_FALHA', usuario: 'desconhecido@email.com', detalhes: 'Tentativa de login falhou - senha incorreta', ip: '45.33.12.89', data: '2025-01-29T11:45:00', status: 'warning' },
    { id: '10', acao: 'CONFIGURAÇÃO', usuario: 'Carlos Eduardo (Admin)', detalhes: 'Alterou configurações de notificação do sistema', ip: '177.92.33.21', data: '2025-01-29T10:15:00', status: 'success' },
    { id: '11', acao: 'MEMBRO_NOVO', usuario: 'Sistema', detalhes: 'Novo sócio cadastrado: Pedro Henrique', ip: 'sistema', data: '2025-01-28T16:00:00', status: 'success' },
    { id: '12', acao: 'PAGAMENTO', usuario: 'Thiago Nunes', detalhes: 'Mensalidade Dezembro/2024 - R$ 150,00 via Cartão', ip: '189.77.22.11', data: '2025-01-28T14:30:00', status: 'success' },
    { id: '13', acao: 'PUBLICAÇÃO', usuario: 'Carlos Eduardo (Admin)', detalhes: 'Publicou notícia "Resultados Regata Estadual"', ip: '177.92.33.21', data: '2025-01-28T11:00:00', status: 'success' },
    { id: '14', acao: 'ACESSO_NEGADO', usuario: 'visitante@teste.com', detalhes: 'Tentativa de acesso à área restrita negada', ip: '88.45.12.33', data: '2025-01-27T22:15:00', status: 'error' },
    { id: '15', acao: 'PROGRAMA', usuario: 'Coach Roberto', detalhes: 'Atualizou programa de treino do atleta João Paulo', ip: '200.18.90.45', data: '2025-01-27T10:30:00', status: 'success' },
];

const acaoConfig: Record<string, { icon: any; label: string; color: string }> = {
    LOGIN: { icon: LogIn, label: 'Login', color: 'bg-blue-500/20 text-blue-400' },
    LOGIN_FALHA: { icon: LogIn, label: 'Login Falho', color: 'bg-amber-500/20 text-amber-400' },
    PAGAMENTO: { icon: CreditCard, label: 'Pagamento', color: 'bg-emerald-500/20 text-emerald-400' },
    EDIÇÃO: { icon: FileEdit, label: 'Edição', color: 'bg-purple-500/20 text-purple-400' },
    VOTAÇÃO: { icon: Vote, label: 'Votação', color: 'bg-pink-500/20 text-pink-400' },
    LIKE: { icon: Heart, label: 'Curtida', color: 'bg-red-500/20 text-red-400' },
    COMENTÁRIO: { icon: MessageSquare, label: 'Comentário', color: 'bg-cyan-500/20 text-cyan-400' },
    TREINO: { icon: Activity, label: 'Treino', color: 'bg-club-gold/20 text-club-gold' },
    RESERVA: { icon: Calendar, label: 'Reserva', color: 'bg-indigo-500/20 text-indigo-400' },
    CONFIGURAÇÃO: { icon: Settings, label: 'Config', color: 'bg-white/10 text-white/60' },
    MEMBRO_NOVO: { icon: User, label: 'Novo Membro', color: 'bg-emerald-500/20 text-emerald-400' },
    PUBLICAÇÃO: { icon: Newspaper, label: 'Publicação', color: 'bg-orange-500/20 text-orange-400' },
    ACESSO_NEGADO: { icon: Shield, label: 'Acesso Negado', color: 'bg-red-500/20 text-red-400' },
    PROGRAMA: { icon: FileEdit, label: 'Programa', color: 'bg-blue-500/20 text-blue-400' },
};

const statusIcons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: Shield,
};

const statusColors = {
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
};

export default function AuditoriaPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAcao, setFilterAcao] = useState<string | null>(null);

    const acoes = ['Todos', 'LOGIN', 'PAGAMENTO', 'EDIÇÃO', 'VOTAÇÃO', 'COMENTÁRIO', 'TREINO', 'RESERVA'];

    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch = log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.detalhes.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAcao = !filterAcao || filterAcao === 'Todos' || log.acao === filterAcao || log.acao.startsWith(filterAcao);
        return matchesSearch && matchesAcao;
    });

    const stats = {
        total: auditLogs.length,
        sucesso: auditLogs.filter(l => l.status === 'success').length,
        alertas: auditLogs.filter(l => l.status === 'warning').length,
        erros: auditLogs.filter(l => l.status === 'error').length,
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
                                <Shield className="w-8 h-8 text-emerald-400" />
                                Auditoria & Compliance
                            </h1>
                            <p className="text-white/50">Registro de atividades e conformidade do sistema</p>
                        </div>
                        <Button variant="outline" className="gap-2 border-white/10">
                            <Download className="w-4 h-4" />
                            Exportar Logs
                        </Button>
                    </div>
                </div>

                {/* Orientações de Compliance */}
                <AnimatedCard variant="gradient" className="p-6 mb-8 border-l-4 border-emerald-500">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        Orientações de Compliance
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>Todas as ações no sistema são registradas automaticamente</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>Logs são mantidos por 5 anos conforme legislação</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>Votações e eleições são 100% transparentes e auditáveis</span>
                            </li>
                        </ul>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>Dados pessoais protegidos conforme LGPD</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>Pagamentos processados com criptografia de ponta</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>Acesso restrito apenas a membros autorizados</span>
                            </li>
                        </ul>
                    </div>
                </AnimatedCard>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Activity className="w-6 h-6 text-white/40 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-xs text-white/40">Total Eventos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-emerald-500/20">
                        <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-emerald-400">{stats.sucesso}</div>
                        <div className="text-xs text-white/40">Sucesso</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-amber-500/20">
                        <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-400">{stats.alertas}</div>
                        <div className="text-xs text-white/40">Alertas</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-red-500/20">
                        <Shield className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-400">{stats.erros}</div>
                        <div className="text-xs text-white/40">Bloqueados</div>
                    </AnimatedCard>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Buscar por usuário ou ação..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {acoes.map(acao => (
                            <button
                                key={acao}
                                onClick={() => setFilterAcao(acao === 'Todos' ? null : acao)}
                                className={cn(
                                    "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    (filterAcao === acao || (!filterAcao && acao === 'Todos'))
                                        ? 'bg-club-red text-white'
                                        : 'bg-white/5 text-white/50 hover:text-white'
                                )}
                            >
                                {acaoConfig[acao]?.label || acao}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logs List */}
                <div className="space-y-3">
                    {filteredLogs.map((log, i) => {
                        const config = acaoConfig[log.acao] || { icon: Activity, label: log.acao, color: 'bg-white/10 text-white/60' };
                        const IconAcao = config.icon;
                        const StatusIcon = statusIcons[log.status as keyof typeof statusIcons] || CheckCircle;

                        return (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.color.split(' ')[0])}>
                                                <IconAcao className={cn("w-5 h-5", config.color.split(' ')[1])} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-white">{log.usuario}</p>
                                                    <Badge className={cn("border-0 text-[10px]", config.color)}>
                                                        {config.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-white/40">{log.detalhes}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs text-white/40 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(log.data).toLocaleString('pt-BR')}
                                                </p>
                                                <p className="text-[10px] text-white/20">IP: {log.ip}</p>
                                            </div>
                                            <StatusIcon className={cn("w-5 h-5", statusColors[log.status as keyof typeof statusColors])} />
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredLogs.length === 0 && (
                    <div className="text-center py-20">
                        <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/50">Nenhum log encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
