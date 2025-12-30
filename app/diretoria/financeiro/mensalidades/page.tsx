'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    CreditCard,
    Search,
    Filter,
    CheckCircle,
    AlertCircle,
    XCircle,
    Clock,
    Download,
    Send,
    Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

// Simular 30 sócios com 6 meses de mensalidades
const generateMensalidades = () => {
    const socios = [
        'João Paulo Silva', 'Maria Clara Costa', 'Carlos Eduardo Melo', 'Ana Beatriz Lima', 'Roberto Ferreira',
        'Fernanda Santos', 'Lucas Oliveira', 'Juliana Pereira', 'Marcos Almeida', 'Patrícia Souza',
        'Ricardo Nascimento', 'Camila Rodrigues', 'Bruno Carvalho', 'Amanda Martins', 'Diego Barbosa',
        'Larissa Gomes', 'Felipe Ribeiro', 'Natália Araújo', 'Gustavo Lima', 'Beatriz Fernandes',
        'Pedro Henrique', 'Isabela Cruz', 'Rafael Moreira', 'Carolina Dias', 'Thiago Nunes',
        'Letícia Cardoso', 'André Teixeira', 'Mariana Rocha', 'Vinícius Castro', 'Gabriela Lopes'
    ];

    const meses = ['Julho 2024', 'Agosto 2024', 'Setembro 2024', 'Outubro 2024', 'Novembro 2024', 'Dezembro 2024'];
    const mensalidades: any[] = [];

    socios.forEach((socio, socioIndex) => {
        meses.forEach((mes, mesIndex) => {
            const status = Math.random() > 0.15 ? 'PAID' : Math.random() > 0.5 ? 'PENDING' : 'OVERDUE';
            mensalidades.push({
                id: `${socioIndex}-${mesIndex}`,
                socio,
                mes,
                valor: 150.00,
                status,
                dataPagamento: status === 'PAID' ? new Date(2024, 6 + mesIndex, Math.floor(Math.random() * 10) + 1) : null,
                vencimento: new Date(2024, 6 + mesIndex, 10),
            });
        });
    });

    return mensalidades;
};

const mensalidades = generateMensalidades();

const statusConfig = {
    PAID: { label: 'Pago', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
    PENDING: { label: 'Pendente', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
    OVERDUE: { label: 'Atrasado', color: 'bg-red-500/20 text-red-400', icon: XCircle },
};

export default function MensalidadesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMes, setFilterMes] = useState('Todos');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [dbPayments, setDbPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const meses = ['Todos', 'Janeiro 2025', 'Dezembro 2024', 'Novembro 2024', 'Outubro 2024', 'Setembro 2024', 'Agosto 2024', 'Julho 2024'];

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/diretoria/financeiro/payments');
                if (response.ok) {
                    const data = await response.json();
                    setDbPayments(data);
                }
            } catch (error) {
                console.error("Erro ao buscar pagamentos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Se houver dados no banco, usamos eles. Caso contrário, usamos os simulados para manter a UI preenchida.
    const displayData = dbPayments.length > 0 ? dbPayments.map(p => ({
        id: p.id,
        socio: p.user?.name || 'Usuário Desconhecido',
        mes: p.description, // Assume que a descrição contém o mês ou identificador
        valor: p.amount,
        status: p.status,
        dataPagamento: p.paidAt,
        vencimento: p.dueDate,
    })) : mensalidades;

    const filteredMensalidades = displayData.filter(m => {
        const matchesSearch = m.socio.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMes = filterMes === 'Todos' || m.mes.toLowerCase().includes(filterMes.toLowerCase());
        const matchesStatus = !filterStatus || m.status === filterStatus;
        return matchesSearch && matchesMes && matchesStatus;
    });

    const stats = {
        total: filteredMensalidades.length,
        pagas: filteredMensalidades.filter(m => m.status === 'PAID').length,
        pendentes: filteredMensalidades.filter(m => m.status === 'PENDING').length,
        atrasadas: filteredMensalidades.filter(m => m.status === 'OVERDUE').length,
        valorRecebido: filteredMensalidades.filter(m => m.status === 'PAID').reduce((acc, m) => acc + m.valor, 0),
        valorPendente: filteredMensalidades.filter(m => m.status !== 'PAID').reduce((acc, m) => acc + m.valor, 0),
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/diretoria/financeiro" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Financeiro
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <CreditCard className="w-8 h-8 text-emerald-400" />
                                Mensalidades
                            </h1>
                            <p className="text-white/50">Controle de pagamentos dos sócios</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2 border-white/10">
                                <Download className="w-4 h-4" />
                                Exportar
                            </Button>
                            <Button className="gap-2">
                                <Send className="w-4 h-4" />
                                Enviar Cobranças
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center border-emerald-500/20">
                        <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-emerald-400">{stats.pagas}</div>
                        <div className="text-xs text-white/40">Pagas</div>
                        <div className="text-sm text-emerald-400 font-bold mt-1">R$ {stats.valorRecebido.toLocaleString('pt-BR')}</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-amber-500/20">
                        <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-400">{stats.pendentes}</div>
                        <div className="text-xs text-white/40">Pendentes</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-red-500/20">
                        <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-400">{stats.atrasadas}</div>
                        <div className="text-xs text-white/40">Atrasadas</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <CreditCard className="w-6 h-6 text-white/40 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">R$ {stats.valorPendente.toLocaleString('pt-BR')}</div>
                        <div className="text-xs text-white/40">A Receber</div>
                    </AnimatedCard>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {meses.map(mes => (
                            <button
                                key={mes}
                                onClick={() => setFilterMes(mes)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${filterMes === mes ? 'bg-club-red text-white' : 'bg-white/5 text-white/50 hover:text-white'
                                    }`}
                            >
                                {mes}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Filter */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={filterStatus === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus(null)}
                        className="border-white/10"
                    >
                        Todos
                    </Button>
                    <Button
                        variant={filterStatus === 'PAID' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus('PAID')}
                        className="border-white/10"
                    >
                        <CheckCircle className="w-3 h-3 mr-1" /> Pagos
                    </Button>
                    <Button
                        variant={filterStatus === 'PENDING' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus('PENDING')}
                        className="border-white/10"
                    >
                        <Clock className="w-3 h-3 mr-1" /> Pendentes
                    </Button>
                    <Button
                        variant={filterStatus === 'OVERDUE' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus('OVERDUE')}
                        className="border-white/10"
                    >
                        <XCircle className="w-3 h-3 mr-1" /> Atrasados
                    </Button>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {filteredMensalidades.slice(0, 30).map((m, i) => {
                        const StatusIcon = statusConfig[m.status as keyof typeof statusConfig].icon;
                        return (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-club-red/20 flex items-center justify-center text-club-red font-bold text-sm">
                                                {m.socio.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{m.socio}</p>
                                                <p className="text-xs text-white/40">{m.mes}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-white">R$ {m.valor.toFixed(2)}</p>
                                                {m.dataPagamento && (
                                                    <p className="text-xs text-white/40">
                                                        Pago em {new Date(m.dataPagamento).toLocaleDateString('pt-BR')}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge className={`${statusConfig[m.status as keyof typeof statusConfig].color} border-0 gap-1`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusConfig[m.status as keyof typeof statusConfig].label}
                                            </Badge>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredMensalidades.length > 30 && (
                    <div className="text-center mt-6">
                        <p className="text-white/50 text-sm">Mostrando 30 de {filteredMensalidades.length} registros</p>
                    </div>
                )}
            </div>
        </div>
    );
}
