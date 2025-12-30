'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import {
    ArrowLeft,
    FileText,
    Download,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    BarChart3,
    PieChart,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

// Dados mensais (Mock Fallback)
const mockDadosMensais = [
    { mes: 'Jul/24', receitas: 22680, despesas: 14910, saldo: 7770, socios: 140 },
    { mes: 'Ago/24', receitas: 23950, despesas: 21650, saldo: 2300, socios: 143 },
    { mes: 'Set/24', receitas: 23460, despesas: 15290, saldo: 8170, socios: 146 },
    { mes: 'Out/24', receitas: 50200, despesas: 22420, saldo: 27780, socios: 148 },
    { mes: 'Nov/24', receitas: 28590, despesas: 13570, saldo: 15020, socios: 145 },
    { mes: 'Dez/24', receitas: 32590, despesas: 11950, saldo: 20640, socios: 150 },
];

const relatoriosTipos = [
    { id: 'mensal', nome: 'Relatório Mensal', descricao: 'Resumo financeiro do mês', icon: Calendar },
    { id: 'trimestral', nome: 'Relatório Trimestral', descricao: 'Análise dos últimos 3 meses', icon: BarChart3 },
    { id: 'semestral', nome: 'Relatório Semestral', descricao: 'Visão geral dos últimos 6 meses', icon: PieChart },
    { id: 'anual', nome: 'Relatório Anual', descricao: 'Balanço completo do ano', icon: FileText },
];

export default function RelatoriosPage() {
    const [dbStats, setDbStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [periodoSelecionado, setPeriodoSelecionado] = useState<string>('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/diretoria/financeiro/stats');
                if (response.ok) {
                    const data = await response.json();
                    setDbStats(data);
                    if (data.length > 0) {
                        setPeriodoSelecionado(data[data.length - 1].mes);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const dadosMensais = dbStats.length > 0 ? dbStats : mockDadosMensais;

    // Fallback inicial se o fetch ainda estiver carregando localmente o estado final
    useEffect(() => {
        if (!periodoSelecionado && dadosMensais.length > 0) {
            setPeriodoSelecionado(dadosMensais[dadosMensais.length - 1].mes);
        }
    }, [dadosMensais, periodoSelecionado]);

    const totais = {
        receitas: dadosMensais.reduce((acc, d) => acc + (d.receitas || 0), 0),
        despesas: dadosMensais.reduce((acc, d) => acc + (d.despesas || 0), 0),
        saldo: dadosMensais.reduce((acc, d) => acc + (d.saldo || 0), 0),
        mediaSocios: Math.round(dadosMensais.reduce((acc, d) => acc + (d.socios || 150), 0) / dadosMensais.length),
    };

    const dadosAtual = dadosMensais.find(d => d.mes === periodoSelecionado) || dadosMensais[dadosMensais.length - 1] || { mes: '---', receitas: 0, despesas: 0, saldo: 0, socios: 0 };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/diretoria/financeiro" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4 font-bold italic">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Financeiro
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-400" />
                                Relatórios Financeiros
                            </h1>
                            <p className="text-white/50">Análises e relatórios consolidados do clube</p>
                        </div>
                        <Button variant="outline" className="gap-2 border-white/10 font-bold italic">
                            <Download className="w-4 h-4" />
                            Exportar PDF
                        </Button>
                    </div>
                </div>

                {loading && dbStats.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 text-club-red animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Resumo do Semestre */}
                        <AnimatedCard variant="gradient" className="p-6 mb-8 border-white/5 shadow-2xl">
                            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-club-gold" />
                                Resumo do Último Semestre
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 mb-2">
                                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                                        Total Receitas
                                    </p>
                                    <p className="text-2xl font-bold text-emerald-400 font-saira-condensed">
                                        R$ {totais.receitas.toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 mb-2">
                                        <TrendingDown className="w-3 h-3 text-red-500" />
                                        Total Despesas
                                    </p>
                                    <p className="text-2xl font-bold text-red-500 font-saira-condensed">
                                        R$ {totais.despesas.toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 mb-2">
                                        <DollarSign className="w-3 h-3 text-club-gold" />
                                        Saldo Total
                                    </p>
                                    <p className="text-2xl font-bold text-club-gold font-saira-condensed">
                                        R$ {totais.saldo.toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 mb-2">
                                        <Users className="w-3 h-3 text-blue-400" />
                                        Média Sócios
                                    </p>
                                    <p className="text-2xl font-bold text-white font-saira-condensed">
                                        {totais.mediaSocios}
                                    </p>
                                </div>
                            </div>
                        </AnimatedCard>

                        {/* Seletor de Período */}
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                            {dadosMensais.map(d => (
                                <button
                                    key={d.mes}
                                    onClick={() => setPeriodoSelecionado(d.mes)}
                                    className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold italic transition-all border ${periodoSelecionado === d.mes
                                            ? 'bg-club-red text-white border-club-red shadow-lg shadow-club-red/20'
                                            : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:border-white/20'
                                        }`}
                                >
                                    {d.mes}
                                </button>
                            ))}
                        </div>

                        {/* Dados do Período */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <motion.div
                                key={periodoSelecionado}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <AnimatedCard variant="glass" className="p-6 border-white/5 h-full">
                                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                        Detalhes de {dadosAtual.mes}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                                            <span className="text-white/50 text-sm font-medium">Entradas (Receitas)</span>
                                            <span className="text-xl font-bold text-emerald-400 font-saira-condensed">
                                                +R$ {dadosAtual.receitas.toLocaleString('pt-BR')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                                            <span className="text-white/50 text-sm font-medium">Saídas (Despesas)</span>
                                            <span className="text-xl font-bold text-red-500 font-saira-condensed">
                                                -R$ {dadosAtual.despesas.toLocaleString('pt-BR')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                                            <span className="text-white/50 text-sm font-medium">Resultado Líquido</span>
                                            <span className={`text-xl font-bold font-saira-condensed ${dadosAtual.saldo >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                                R$ {dadosAtual.saldo.toLocaleString('pt-BR')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-4">
                                            <span className="text-white/50 text-sm font-medium">Quadro Social</span>
                                            <span className="text-xl font-bold text-white">
                                                {dadosAtual.socios || totais.mediaSocios} sócios
                                            </span>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>

                            <AnimatedCard variant="glass" className="p-6 border-white/5 h-full bg-black/40">
                                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                                    Fluxo de Caixa Mensal
                                </h3>
                                <div className="h-56 flex items-end justify-between gap-3 px-2">
                                    {dadosMensais.map((d) => {
                                        const maxVal = Math.max(...dadosMensais.map(m => Math.max(m.receitas, m.despesas)));
                                        const hReceita = (d.receitas / maxVal) * 100;
                                        const hDespesa = (d.despesas / maxVal) * 100;

                                        return (
                                            <div key={d.mes} className="flex-1 flex flex-col items-center gap-1 group">
                                                <div className="relative w-full h-full flex items-end gap-1">
                                                    <div
                                                        className={`flex-1 rounded-t-sm transition-all duration-300 ${d.mes === periodoSelecionado ? 'bg-emerald-400' : 'bg-emerald-500/30'}`}
                                                        style={{ height: `${hReceita}%` }}
                                                    />
                                                    <div
                                                        className={`flex-1 rounded-t-sm transition-all duration-300 ${d.mes === periodoSelecionado ? 'bg-red-500' : 'bg-red-500/30'}`}
                                                        style={{ height: `${hDespesa}%` }}
                                                    />
                                                </div>
                                                <span className={`text-[9px] font-bold mt-2 ${d.mes === periodoSelecionado ? 'text-white' : 'text-white/30'}`}>
                                                    {d.mes.split('/')[0]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6 flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest italic">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                        <span className="text-white/50">Receitas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        <span className="text-white/50">Despesas</span>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </div>

                        {/* Tipos de Relatórios */}
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest italic flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-blue-400" />
                            Gerar Exportações Customizadas
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatoriosTipos.map((rel) => {
                                const IconComp = rel.icon;
                                return (
                                    <AnimatedCard key={rel.id} variant="glass" className="p-5 cursor-pointer hover:border-club-red/50 transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <IconComp className="w-16 h-16" />
                                        </div>
                                        <IconComp className="w-8 h-8 text-blue-400 mb-4" />
                                        <h4 className="font-bold text-white group-hover:text-club-red transition-colors">{rel.nome}</h4>
                                        <p className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-tighter">{rel.descricao}</p>
                                        <Button size="sm" variant="outline" className="mt-4 w-full border-white/5 bg-white/5 hover:bg-club-red hover:text-white hover:border-club-red font-bold italic text-xs gap-2 transition-all">
                                            <Download className="w-3 h-3" /> Gerar Arquivo
                                        </Button>
                                    </AnimatedCard>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
