'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    TrendingDown,
    Plus,
    Search,
    Calendar,
    Building2,
    Wrench,
    Zap,
    Droplets,
    Users,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

// Simular 6 meses de despesas (Mock Fallback)
const despesas = [
    { id: '1', descricao: 'Conta de Luz - Dezembro', categoria: 'UTILITIES', valor: 850.00, data: '2024-12-15', status: 'PAID' },
    { id: '2', descricao: 'Conta de Água - Dezembro', categoria: 'UTILITIES', valor: 320.00, data: '2024-12-18', status: 'PAID' },
    { id: '3', descricao: 'Manutenção do Quad Potengi', categoria: 'MAINTENANCE', valor: 1500.00, data: '2024-12-10', status: 'PAID' },
    { id: '4', descricao: 'Salário Treinador', categoria: 'PAYROLL', valor: 4500.00, data: '2024-12-05', status: 'PAID' },
];

const categoriaConfig: any = {
    UTILITIES: { label: 'Utilidades', color: 'bg-blue-500/20 text-blue-400', icon: Zap },
    MAINTENANCE: { label: 'Manutenção', color: 'bg-amber-500/20 text-amber-400', icon: Wrench },
    PAYROLL: { label: 'Folha', color: 'bg-purple-500/20 text-purple-400', icon: Users },
    EQUIPMENT: { label: 'Equipamentos', color: 'bg-emerald-500/20 text-emerald-400', icon: Building2 },
    INSURANCE: { label: 'Seguros', color: 'bg-pink-500/20 text-pink-400', icon: Building2 },
    EVENTS: { label: 'Eventos', color: 'bg-club-gold/20 text-club-gold', icon: Calendar },
    SUPPLIES: { label: 'Suprimentos', color: 'bg-cyan-500/20 text-cyan-400', icon: Droplets },
};

export default function DespesasPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoria, setFilterCategoria] = useState<string | null>(null);
    const [dbTransactions, setDbTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/diretoria/financeiro/transactions?type=EXPENSE');
                if (response.ok) {
                    const data = await response.json();
                    setDbTransactions(data);
                }
            } catch (error) {
                console.error("Erro ao buscar despesas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const displayData = dbTransactions.length > 0 ? dbTransactions.map(t => ({
        id: t.id,
        descricao: t.description,
        categoria: t.category,
        valor: t.amount,
        data: t.date,
        status: t.status
    })) : despesas;

    const filteredDespesas = displayData.filter(d => {
        const matchesSearch = d.descricao.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategoria = !filterCategoria || d.categoria === filterCategoria;
        return matchesSearch && matchesCategoria;
    });

    const totalDespesas = filteredDespesas.reduce((acc, d) => acc + d.valor, 0);
    const porCategoria = Object.entries(
        filteredDespesas.reduce((acc, d) => {
            acc[d.categoria] = (acc[d.categoria] || 0) + d.valor;
            return acc;
        }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1]);

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
                                <TrendingDown className="w-8 h-8 text-red-400" />
                                Despesas
                            </h1>
                            <p className="text-white/50">Controle de gastos e despesas do clube</p>
                        </div>
                        <Button className="gap-2 font-bold italic">
                            <Plus className="w-4 h-4" />
                            Nova Despesa
                        </Button>
                    </div>
                </div>

                {loading && dbTransactions.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-club-red animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <AnimatedCard variant="gradient" className="p-6">
                                <p className="text-white/50 text-sm mb-1">Total de Despesas</p>
                                <p className="text-3xl font-bold text-white">R$ {totalDespesas.toLocaleString('pt-BR')}</p>
                                <p className="text-xs text-white/40 mt-1">{filteredDespesas.length} lançamentos</p>
                            </AnimatedCard>
                            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {porCategoria.slice(0, 4).map(([cat, valor]) => {
                                    const config = categoriaConfig[cat];
                                    const CatIcon = config?.icon || Building2;
                                    return (
                                        <AnimatedCard key={cat} variant="glass" className="p-3 text-center">
                                            <CatIcon className={`w-5 h-5 mx-auto mb-1 ${config?.color.split(' ')[1]}`} />
                                            <p className="text-xs text-white/40">{config?.label}</p>
                                            <p className="text-sm font-bold text-white">R$ {valor.toLocaleString('pt-BR')}</p>
                                        </AnimatedCard>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Buscar despesa..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-club-red/50"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                <button
                                    onClick={() => setFilterCategoria(null)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold italic transition-all ${filterCategoria === null ? 'bg-club-red text-white' : 'bg-white/5 text-white/50'
                                        }`}
                                >
                                    Todas
                                </button>
                                {Object.entries(categoriaConfig).map(([key, config]: [string, any]) => (
                                    <button
                                        key={key}
                                        onClick={() => setFilterCategoria(key)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold italic transition-all ${filterCategoria === key ? 'bg-club-red text-white' : 'bg-white/5 text-white/50'
                                            }`}
                                    >
                                        {config.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-3">
                            {filteredDespesas.map((d, i) => {
                                const config = categoriaConfig[d.categoria];
                                const CatIcon = config?.icon || Building2;
                                return (
                                    <motion.div
                                        key={d.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                    >
                                        <AnimatedCard variant="glass" className="p-4 border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl ${config?.color.split(' ')[0]} flex items-center justify-center`}>
                                                        <CatIcon className={`w-5 h-5 ${config?.color.split(' ')[1]}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{d.descricao}</p>
                                                        <p className="text-xs text-white/40 flex items-center gap-1 font-medium">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(d.data).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge className={`${config?.color} border-0 font-bold italic text-[10px]`}>
                                                        {config?.label}
                                                    </Badge>
                                                    <p className="font-bold text-red-400 font-saira-condensed text-lg">-R$ {d.valor.toLocaleString('pt-BR')}</p>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    </motion.div>
                                );
                            })}
                            {filteredDespesas.length === 0 && (
                                <div className="text-center py-12 text-white/20 italic font-medium">Nenhuma despesa encontrada.</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
