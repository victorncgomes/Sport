
'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import {
    ShoppingBag,
    TrendingUp,
    AlertTriangle,
    Package,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    RefreshCw,
    Download
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

// Mock data for initial display while backend syncs
const salesData = [
    { name: 'Seg', sales: 4000 },
    { name: 'Ter', sales: 3000 },
    { name: 'Qua', sales: 2000 },
    { name: 'Qui', sales: 2780 },
    { name: 'Sex', sales: 1890 },
    { name: 'Sab', sales: 2390 },
    { name: 'Dom', sales: 3490 },
];

export default function StoreAdminPage() {
    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Fiscalização da Loja"
                subtitle="Administração & Estoque"
                description="Painel de controle de vendas, movimentação financeira e gestão de inventário comercial."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <AnimatedCard variant="glass" className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-club-red/10 text-club-red">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="flex items-center text-[10px] font-black text-emerald-500 uppercase">
                                +12.5% <ArrowUpRight className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Receita Mensal</p>
                        <h3 className="text-2xl font-black text-white">R$ 14.250,00</h3>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <span className="flex items-center text-[10px] font-black text-emerald-500 uppercase">
                                +5.2% <ArrowUpRight className="w-3 h-3 ml-1" />
                            </span>
                        </div>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Total de Pedidos</p>
                        <h3 className="text-2xl font-black text-white">128</h3>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-club-gold/10 text-club-gold">
                                <Package className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Itens em Estoque</p>
                        <h3 className="text-2xl font-black text-white">452</h3>
                    </AnimatedCard>

                    <AnimatedCard variant="glass" className="p-6 border-club-red/20 shadow-glow-red/10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-club-red/10 text-club-red">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <span className="bg-club-red text-white text-[10px] font-black px-2 py-0.5 rounded">Ação Necessária</span>
                        </div>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-1">Estoque Crítico</p>
                        <h3 className="text-2xl font-black text-white">8 Itens</h3>
                    </AnimatedCard>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Analytics Chart */}
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatedCard variant="carbon" className="p-8 h-[450px]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Fluxo de Vendas Diário</h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-8 text-[8px] border-white/10">7 Dias</Button>
                                    <Button variant="outline" size="sm" className="h-8 text-[8px] bg-white/5 border-white/20">30 Dias</Button>
                                </div>
                            </div>
                            <div className="w-full h-full pb-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                            itemStyle={{ color: '#DC2626', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="sales" fill="url(#salesGradient)" radius={[6, 6, 0, 0]} />
                                        <defs>
                                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#DC2626" stopOpacity={0.8} />
                                                <stop offset="100%" stopColor="#DC2626" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </AnimatedCard>

                        {/* Recent Transactions */}
                        <AnimatedCard variant="glass" className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Últimos Pedidos</h3>
                                <Button variant="ghost" className="text-[10px] font-black text-club-gold tracking-widest uppercase">Ver Relatório Completo</Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-y-4">
                                    <thead>
                                        <tr className="text-[10px] uppercase font-black text-white/30 tracking-widest">
                                            <th className="text-left px-4">Pedido</th>
                                            <th className="text-left px-4">Cliente</th>
                                            <th className="text-left px-4">Data</th>
                                            <th className="text-left px-4">Status</th>
                                            <th className="text-right px-4">Total</th>
                                            <th className="text-center px-4">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { id: '#8429', customer: 'Ricardo Santos', date: '20 Jan, 14:15', status: 'PAID', total: 'R$ 189,90' },
                                            { id: '#8428', customer: 'Ana Melo', date: '20 Jan, 12:40', status: 'PENDING', total: 'R$ 89,90' },
                                            { id: '#8427', customer: 'João Ferreira', date: '19 Jan, 18:22', status: 'PAID', total: 'R$ 329,50' },
                                            { id: '#8426', customer: 'Maria Silva', date: '19 Jan, 16:05', status: 'CANCELLED', total: 'R$ 55,00' },
                                        ].map((order, i) => (
                                            <tr key={i} className="bg-white/[0.02] hover:bg-white/5 transition-colors group">
                                                <td className="px-4 py-4 rounded-l-2xl border-y border-l border-white/5 group-hover:border-white/10">
                                                    <span className="text-xs font-bold text-white/80">{order.id}</span>
                                                </td>
                                                <td className="px-4 py-4 border-y border-white/5 group-hover:border-white/10">
                                                    <span className="text-xs font-bold text-white">{order.customer}</span>
                                                </td>
                                                <td className="px-4 py-4 border-y border-white/5 group-hover:border-white/10">
                                                    <span className="text-[10px] text-white/40">{order.date}</span>
                                                </td>
                                                <td className="px-4 py-4 border-y border-white/5 group-hover:border-white/10">
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' :
                                                            order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/10 text-white/40'
                                                        }`}>
                                                        {order.status === 'PAID' ? 'Pago' : order.status === 'PENDING' ? 'Pendente' : 'Cancelado'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 border-y border-white/5 group-hover:border-white/10 text-right">
                                                    <span className="text-xs font-black text-club-gold">{order.total}</span>
                                                </td>
                                                <td className="px-4 py-4 rounded-r-2xl border-y border-r border-white/5 group-hover:border-white/10 text-center">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/30 hover:text-white"><Eye className="w-4 h-4" /></Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </AnimatedCard>
                    </div>

                    {/* Stock sidebar */}
                    <div className="space-y-8">
                        <AnimatedCard variant="metal" className="p-8">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 text-club-gold" /> Ajuste de Estoque
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-white/40 uppercase font-bold mb-2">Produto Selecionado</p>
                                    <select className="w-full bg-club-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none">
                                        <option>Camisa Oficial 2025</option>
                                        <option>Boné Tático SCN</option>
                                        <option>Unisuit Elite Pro</option>
                                    </select>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-white/40 uppercase font-bold mb-2">Quantidade Atual: 12</p>
                                    <div className="flex gap-2">
                                        <input type="number" className="flex-1 bg-club-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none" placeholder="Nova qtd..." />
                                        <Button className="bg-club-red text-white text-[10px] font-black uppercase tracking-widest h-9">Salvar</Button>
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard variant="carbon" className="p-8">
                            <h3 className="text-sm font-black text-club-red uppercase tracking-widest mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Estoque Crítico
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Squeeze Térmico', stock: 2, limit: 10 },
                                    { name: 'Viseira Gold', stock: 3, limit: 15 },
                                    { name: 'Toalha Microfibra', stock: 1, limit: 20 },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                        <div>
                                            <p className="text-xs font-bold text-white">{item.name}</p>
                                            <p className="text-[10px] text-white/30">Mínimo: {item.limit}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black text-club-red">{item.stock}</span>
                                            <p className="text-[8px] uppercase font-black text-club-red/50">Restante</p>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full border-white/10 text-[10px] font-black uppercase tracking-widest h-10 gap-2 mt-4">
                                    <Download className="w-3 h-3" /> Gerar Lista de Compras
                                </Button>
                            </div>
                        </AnimatedCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
