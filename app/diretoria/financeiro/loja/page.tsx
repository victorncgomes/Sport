'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    ShoppingBag,
    Search,
    Package,
    TrendingUp,
    Users,
    Star,
    Eye,
    MoreVertical,
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

// Produtos da loja
const produtos = [
    { id: '1', nome: 'Camiseta Oficial SCN', categoria: 'VESTUÁRIO', preco: 89.90, estoque: 45, vendidos: 156, avaliacao: 4.8, imagem: '👕' },
    { id: '2', nome: 'Boné SCN Preto', categoria: 'VESTUÁRIO', preco: 49.90, estoque: 32, vendidos: 89, avaliacao: 4.6, imagem: '🧢' },
    { id: '3', nome: 'Regata Treino Sport', categoria: 'VESTUÁRIO', preco: 69.90, estoque: 28, vendidos: 67, avaliacao: 4.7, imagem: '🎽' },
    { id: '4', nome: 'Bermuda Dry-Fit SCN', categoria: 'VESTUÁRIO', preco: 79.90, estoque: 18, vendidos: 45, avaliacao: 4.5, imagem: '🩳' },
    { id: '5', nome: 'Garrafa Térmica SCN', categoria: 'ACESSÓRIOS', preco: 59.90, estoque: 50, vendidos: 112, avaliacao: 4.9, imagem: '🍶' },
    { id: '6', nome: 'Toalha de Treino', categoria: 'ACESSÓRIOS', preco: 34.90, estoque: 40, vendidos: 78, avaliacao: 4.4, imagem: '🧻' },
    { id: '7', nome: 'Mochila Esportiva SCN', categoria: 'ACESSÓRIOS', preco: 129.90, estoque: 15, vendidos: 34, avaliacao: 4.8, imagem: '🎒' },
    { id: '8', nome: 'Chaveiro Oficial', categoria: 'MEMORABILIA', preco: 19.90, estoque: 100, vendidos: 234, avaliacao: 4.3, imagem: '🔑' },
    { id: '9', nome: 'Caneca Porcelana SCN', categoria: 'MEMORABILIA', preco: 39.90, estoque: 60, vendidos: 89, avaliacao: 4.6, imagem: '☕' },
    { id: '10', nome: 'Adesivo Kit (5 un)', categoria: 'MEMORABILIA', preco: 14.90, estoque: 200, vendidos: 312, avaliacao: 4.2, imagem: '🏷️' },
    { id: '11', nome: 'Luva de Remo P/M', categoria: 'EQUIPAMENTOS', preco: 89.90, estoque: 12, vendidos: 28, avaliacao: 4.7, imagem: '🧤' },
    { id: '12', nome: 'Luva de Remo G/GG', categoria: 'EQUIPAMENTOS', preco: 89.90, estoque: 8, vendidos: 22, avaliacao: 4.7, imagem: '🧤' },
];

// Vendas recentes
const vendasRecentes = [
    { id: '1', cliente: 'João Silva', produto: 'Camiseta Oficial SCN', valor: 89.90, data: '2024-12-29', status: 'ENTREGUE' },
    { id: '2', cliente: 'Maria Costa', produto: 'Garrafa Térmica SCN', valor: 59.90, data: '2024-12-28', status: 'ENTREGUE' },
    { id: '3', cliente: 'Carlos Melo', produto: 'Boné SCN Preto', valor: 49.90, data: '2024-12-28', status: 'ENVIADO' },
    { id: '4', cliente: 'Ana Lima', produto: 'Mochila Esportiva SCN', valor: 129.90, data: '2024-12-27', status: 'PROCESSANDO' },
    { id: '5', cliente: 'Roberto Ferreira', produto: 'Regata Treino Sport', valor: 69.90, data: '2024-12-27', status: 'ENTREGUE' },
];

const statusConfig = {
    ENTREGUE: { color: 'bg-emerald-500/20 text-emerald-400' },
    ENVIADO: { color: 'bg-blue-500/20 text-blue-400' },
    PROCESSANDO: { color: 'bg-amber-500/20 text-amber-400' },
};

export default function LojaPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoria, setFilterCategoria] = useState<string | null>(null);
    const [view, setView] = useState<'produtos' | 'vendas'>('produtos');

    const categorias = ['VESTUÁRIO', 'ACESSÓRIOS', 'MEMORABILIA', 'EQUIPAMENTOS'];

    const filteredProdutos = produtos.filter(p => {
        const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategoria = !filterCategoria || p.categoria === filterCategoria;
        return matchesSearch && matchesCategoria;
    });

    const stats = {
        totalProdutos: produtos.length,
        totalVendidos: produtos.reduce((acc, p) => acc + p.vendidos, 0),
        faturamento: produtos.reduce((acc, p) => acc + (p.vendidos * p.preco), 0),
        estoqueTotal: produtos.reduce((acc, p) => acc + p.estoque, 0),
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
                                <ShoppingBag className="w-8 h-8 text-amber-400" />
                                CRM Loja
                            </h1>
                            <p className="text-white/50">Gestão de produtos e vendas da loja do clube</p>
                        </div>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Novo Produto
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Package className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.totalProdutos}</div>
                        <div className="text-xs text-white/40">Produtos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-emerald-400">{stats.totalVendidos}</div>
                        <div className="text-xs text-white/40">Vendidos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">R$ {stats.faturamento.toLocaleString('pt-BR')}</div>
                        <div className="text-xs text-white/40">Faturamento Total</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Package className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.estoqueTotal}</div>
                        <div className="text-xs text-white/40">Em Estoque</div>
                    </AnimatedCard>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={view === 'produtos' ? 'default' : 'outline'}
                        onClick={() => setView('produtos')}
                        className="border-white/10"
                    >
                        <Package className="w-4 h-4 mr-2" /> Produtos
                    </Button>
                    <Button
                        variant={view === 'vendas' ? 'default' : 'outline'}
                        onClick={() => setView('vendas')}
                        className="border-white/10"
                    >
                        <ShoppingBag className="w-4 h-4 mr-2" /> Vendas Recentes
                    </Button>
                </div>

                {view === 'produtos' ? (
                    <>
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Buscar produto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <button
                                    onClick={() => setFilterCategoria(null)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${filterCategoria === null ? 'bg-club-red text-white' : 'bg-white/5 text-white/50'
                                        }`}
                                >
                                    Todos
                                </button>
                                {categorias.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterCategoria(cat)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${filterCategoria === cat ? 'bg-club-red text-white' : 'bg-white/5 text-white/50'
                                            }`}
                                    >
                                        {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProdutos.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                >
                                    <AnimatedCard variant="glass" className="p-4 h-full">
                                        <div className="text-4xl mb-3">{p.imagem}</div>
                                        <h3 className="font-bold text-white mb-1">{p.nome}</h3>
                                        <Badge className="bg-white/10 text-white/60 border-0 mb-3">
                                            {p.categoria}
                                        </Badge>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xl font-bold text-emerald-400">
                                                R$ {p.preco.toFixed(2)}
                                            </span>
                                            <span className="flex items-center text-amber-400 text-sm">
                                                <Star className="w-4 h-4 mr-1 fill-current" />
                                                {p.avaliacao}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-white/40">
                                            <span>Estoque: {p.estoque}</span>
                                            <span>Vendidos: {p.vendidos}</span>
                                        </div>
                                    </AnimatedCard>
                                </motion.div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Vendas Recentes */
                    <div className="space-y-3">
                        {vendasRecentes.map((v, i) => (
                            <motion.div
                                key={v.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-club-red/20 flex items-center justify-center text-club-red font-bold text-sm">
                                                {v.cliente.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{v.cliente}</p>
                                                <p className="text-xs text-white/40">{v.produto}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-bold text-white">R$ {v.valor.toFixed(2)}</p>
                                                <p className="text-xs text-white/40">{new Date(v.data).toLocaleDateString('pt-BR')}</p>
                                            </div>
                                            <Badge className={`${statusConfig[v.status as keyof typeof statusConfig].color} border-0`}>
                                                {v.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
