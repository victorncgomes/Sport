'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    TrendingUp,
    Plus,
    Search,
    Calendar,
    CreditCard,
    ShoppingBag,
    Trophy,
    Gift,
    Users,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

// Simular 6 meses de receitas (Mock Fallback)
const receitas = [
    { id: '1', descricao: 'Mensalidades Dezembro', categoria: 'MENSALIDADES', valor: 22500.00, data: '2024-12-10', quantidade: 1 },
    { id: '2', descricao: 'Vendas Loja - Camisetas', categoria: 'LOJA', valor: 1890.00, data: '2024-12-15', quantidade: 1 },
    { id: '3', descricao: 'Inscrições Regata Verão', categoria: 'EVENTOS', valor: 3200.00, data: '2024-12-20', quantidade: 1 },
    { id: '4', descricao: 'Doação Empresa Parceira', categoria: 'DOAÇÕES', valor: 5000.00, data: '2024-12-22', quantidade: 1 },
    { id: '5', descricao: 'Mensalidades Novembro', categoria: 'MENSALIDADES', valor: 21750.00, data: '2024-11-10', quantidade: 1 },
    { id: '6', descricao: 'Vendas Loja - Diversos', categoria: 'LOJA', valor: 2340.00, data: '2024-11-18', quantidade: 1 },
    { id: '7', descricao: 'Aluguel Espaço para Evento', categoria: 'ALUGUEL', valor: 4500.00, data: '2024-11-25', quantidade: 1 },
    { id: '8', descricao: 'Mensalidades Outubro', categoria: 'MENSALIDADES', valor: 22200.00, data: '2024-10-10', quantidade: 1 },
];

const categoriaConfig: any = {
    MENSALIDADES: { label: 'Mensalidades', color: 'bg-emerald-500/20 text-emerald-400', icon: CreditCard },
    LOJA: { label: 'Loja', color: 'bg-amber-500/20 text-amber-400', icon: ShoppingBag },
    EVENTOS: { label: 'Eventos', color: 'bg-purple-500/20 text-purple-400', icon: Trophy },
    DOAÇÕES: { label: 'Doações', color: 'bg-pink-500/20 text-pink-400', icon: Gift },
    ALUGUEL: { label: 'Aluguel', color: 'bg-blue-500/20 text-blue-400', icon: Calendar },
    PATROCÍNIO: { label: 'Patrocínio', color: 'bg-club-gold/20 text-club-gold', icon: Trophy },
    FILIAÇÕES: { label: 'Filiações', color: 'bg-cyan-500/20 text-cyan-400', icon: Users },
};

export default function ReceitasPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoria, setFilterCategoria] = useState<string | null>(null);
    const [dbTransactions, setDbTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/diretoria/financeiro/transactions?type=REVENUE');
                if (response.ok) {
                    const data = await response.json();
                    setDbTransactions(data);
                }
            } catch (error) {
                console.error("Erro ao buscar receitas:", error);
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
        quantidade: 1
    })) : receitas;

    const filteredReceitas = displayData.filter(r => {
        const matchesSearch = r.descricao.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategoria = !filterCategoria || r.categoria === filterCategoria;
        return matchesSearch && matchesCategoria;
    });

    const totalReceitas = filteredReceitas.reduce((acc, r) => acc + r.valor, 0);
    const porCategoria = Object.entries(
        filteredReceitas.reduce((acc, r) => {
            acc[r.categoria] = (acc[r.categoria] || 0) + r.valor;
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
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                                Receitas
                            </h1>
                            <p className="text-white/50">Controle de entradas e receitas do clube</p>
                        </div>
                        <Button className="gap-2 font-bold italic">
                            <Plus className="w-4 h-4" />
                            Nova Receita
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
                                <p className="text-white/50 text-sm mb-1">Total de Receitas</p>
                                <p className="text-3xl font-bold text-emerald-400">R$ {totalReceitas.toLocaleString('pt-BR')}</p>
                                <p className="text-xs text-white/40 mt-1">{filteredReceitas.length} lançamentos</p>
                            </AnimatedCard>
                            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {porCategoria.slice(0, 4).map(([cat, valor]) => {
                                    const config = categoriaConfig[cat];
                                    const CatIcon = config?.icon || CreditCard;
                                    return (
                                        <AnimatedCard key={cat} variant="glass" className="p-3 text-center">
                                            <CatIcon className={`w-5 h-5 mx-auto mb-1 ${config?.color.split(' ')[1]}`} />
                                            <p className="text-xs text-white/40">{config?.label}</p>
                                            <p className="text-sm font-bold text-emerald-400">R$ {valor.toLocaleString('pt-BR')}</p>
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
                                    placeholder="Buscar receita..."
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
                            {filteredReceitas.map((r, i) => {
                                const config = categoriaConfig[r.categoria];
                                const CatIcon = config?.icon || CreditCard;
                                return (
                                    <motion.div
                                        key={r.id}
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
                                                        <p className="font-bold text-white">{r.descricao}</p>
                                                        <p className="text-xs text-white/40 flex items-center gap-2">
                                                            <span className="flex items-center gap-1 font-medium">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(r.data).toLocaleDateString('pt-BR')}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge className={`${config?.color} border-0 font-bold italic text-[10px]`}>
                                                        {config?.label}
                                                    </Badge>
                                                    <p className="font-bold text-emerald-400 font-saira-condensed text-lg">+R$ {r.valor.toLocaleString('pt-BR')}</p>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    </motion.div>
                                );
                            })}
                            {filteredReceitas.length === 0 && (
                                <div className="text-center py-12 text-white/20 italic font-medium">Nenhuma receita encontrada.</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
