'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Archive,
    Ship,
    PackageCheck,
    AlertTriangle,
    Search,
    Plus,
    Filter,
    Calendar,
    MapPin,
    Tag,
    History,
    CheckCircle2,
    Clock,
    Wrench
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Dados simulados do acervo/patrimônio
const patrimonioItems = [
    { id: 'B001', nome: 'Potengi I', categoria: 'Barco', tipo: 'Single (1x)', status: 'ativo', tombamento: '2015-003', localizacao: 'Garagem A', ultimaVistoria: '2025-01-15', valor: 45000 },
    { id: 'B002', nome: 'Natal', categoria: 'Barco', tipo: 'Quadruple (4-)', status: 'ativo', tombamento: '2018-007', localizacao: 'Garagem A', ultimaVistoria: '2025-01-10', valor: 120000 },
    { id: 'B003', nome: 'SCN Master', categoria: 'Barco', tipo: 'Oito (8+)', status: 'manutencao', tombamento: '2020-012', localizacao: 'Oficina', ultimaVistoria: '2024-12-28', valor: 250000 },
    { id: 'R001', nome: 'Conjunto Remos Concept2', categoria: 'Remo', tipo: 'Competição', status: 'ativo', tombamento: '2022-045', localizacao: 'Armário 1', ultimaVistoria: '2025-01-20', valor: 8500 },
    { id: 'R002', nome: 'Remos Treino Júnior', categoria: 'Remo', tipo: 'Treino', status: 'ativo', tombamento: '2023-018', localizacao: 'Armário 2', ultimaVistoria: '2025-01-18', valor: 3200 },
    { id: 'A001', nome: 'Armário Vestiário M-01', categoria: 'Mobiliário', tipo: 'Armário', status: 'ativo', tombamento: '2019-089', localizacao: 'Vestiário Masculino', ultimaVistoria: '2024-11-15', valor: 1500 },
    { id: 'C001', nome: 'Talheres Inox Completo', categoria: 'Cutelaria', tipo: 'Conjunto', status: 'ativo', tombamento: '2021-156', localizacao: 'Cozinha', ultimaVistoria: '2024-10-01', valor: 2800 },
    { id: 'E001', nome: 'Ergômetro Concept2 RowErg', categoria: 'Equipamento', tipo: 'Treino', status: 'ativo', tombamento: '2024-001', localizacao: 'Sala de Ergômetros', ultimaVistoria: '2025-01-22', valor: 12000 },
];

const categorias = ['Todos', 'Barco', 'Remo', 'Equipamento', 'Mobiliário', 'Cutelaria'];

const statusColors = {
    ativo: 'bg-emerald-500/20 text-emerald-400',
    manutencao: 'bg-amber-500/20 text-amber-400',
    inativo: 'bg-red-500/20 text-red-400',
    emprestado: 'bg-blue-500/20 text-blue-400',
};

const statusLabels = {
    ativo: 'Ativo',
    manutencao: 'Manutenção',
    inativo: 'Inativo',
    emprestado: 'Emprestado',
};

export default function AcervoPage() {
    const [selectedCategoria, setSelectedCategoria] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = patrimonioItems.filter(item => {
        const matchesCategoria = selectedCategoria === 'Todos' || item.categoria === selectedCategoria;
        const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tombamento.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategoria && matchesSearch;
    });

    const totalValor = patrimonioItems.reduce((sum, item) => sum + item.valor, 0);
    const totalAtivo = patrimonioItems.filter(i => i.status === 'ativo').length;
    const totalManutencao = patrimonioItems.filter(i => i.status === 'manutencao').length;

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
                                <Archive className="w-8 h-8 text-rose-500" />
                                Acervo do Clube
                            </h1>
                            <p className="text-white/50">Patrimônio, tombamento e inventário geral</p>
                        </div>
                        <Button className="gap-2 bg-rose-600 hover:bg-rose-700">
                            <Plus className="w-4 h-4" />
                            Novo Item
                        </Button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Archive className="w-6 h-6 text-white/40 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{patrimonioItems.length}</div>
                        <p className="text-xs text-white/50">Total Itens</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-emerald-500/20 bg-emerald-500/5">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-emerald-400">{totalAtivo}</div>
                        <p className="text-xs text-emerald-400/70">Ativos</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-amber-500/20 bg-amber-500/5">
                        <Wrench className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-400">{totalManutencao}</div>
                        <p className="text-xs text-amber-400/70">Em Manutenção</p>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-rose-500/20 bg-rose-500/5">
                        <Tag className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-rose-400">R$ {(totalValor / 1000).toFixed(0)}k</div>
                        <p className="text-xs text-rose-400/70">Valor Total</p>
                    </AnimatedCard>
                </div>

                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou tombamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <Filter className="w-4 h-4 text-white/50 mr-2 flex-shrink-0" />
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategoria(cat)}
                                className={cn(
                                    "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                                    selectedCategoria === cat
                                        ? "bg-rose-500/20 border-rose-500 text-rose-400"
                                        : "bg-transparent border-white/10 text-white/60 hover:border-white/30"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de Itens */}
                <div className="grid gap-4">
                    {filteredItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <AnimatedCard variant="glass" className="p-4 hover:border-rose-500/20 transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                                            {item.categoria === 'Barco' ? <Ship className="w-6 h-6 text-rose-400" /> :
                                                item.categoria === 'Remo' ? <Archive className="w-6 h-6 text-rose-400" /> :
                                                    <PackageCheck className="w-6 h-6 text-rose-400" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-white font-bold">{item.nome}</h3>
                                                <Badge className={cn("border-0 text-[10px]", statusColors[item.status as keyof typeof statusColors])}>
                                                    {statusLabels[item.status as keyof typeof statusLabels]}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                                                <span className="flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> {item.tombamento}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {item.localizacao}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Vistoria: {new Date(item.ultimaVistoria).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] text-white/30 uppercase font-bold">Valor</p>
                                            <p className="text-white font-bold">R$ {item.valor.toLocaleString('pt-BR')}</p>
                                        </div>
                                        <Badge className="bg-white/5 text-white/70 border-white/10">{item.tipo}</Badge>
                                        <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
                                            <History className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <Archive className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/50">Nenhum item encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
