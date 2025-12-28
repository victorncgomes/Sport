'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    ShoppingBag,
    CreditCard,
    BarChart3,
    PieChart,
    Calendar,
    ArrowRight,
    Megaphone,
    Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

// Dados simulados
const financialData = {
    balance: 45680.50,
    income: 12500.00,
    expenses: 8750.00,
    pendingFees: 3200.00,
    activeMembers: 127,
    storeSales: 4850.00,
};

const recentTransactions = [
    { id: '1', description: 'Mensalidade - João Silva', amount: 250, type: 'income', date: '2025-01-15' },
    { id: '2', description: 'Manutenção Barco Quad', amount: -1200, type: 'expense', date: '2025-01-14' },
    { id: '3', description: 'Venda Loja - Camiseta', amount: 89.90, type: 'income', date: '2025-01-14' },
    { id: '4', description: 'Conta de Luz', amount: -650, type: 'expense', date: '2025-01-10' },
    { id: '5', description: 'Mensalidade - Maria Costa', amount: 250, type: 'income', date: '2025-01-10' },
];

const menuItems = [
    { href: '/diretoria/financeiro/mensalidades', icon: CreditCard, title: 'Mensalidades', color: 'text-emerald-400' },
    { href: '/diretoria/financeiro/despesas', icon: TrendingDown, title: 'Despesas', color: 'text-red-400' },
    { href: '/diretoria/financeiro/receitas', icon: TrendingUp, title: 'Receitas', color: 'text-blue-400' },
    { href: '/diretoria/financeiro/loja', icon: ShoppingBag, title: 'CRM Loja', color: 'text-amber-400' },
    { href: '/diretoria/financeiro/relatorios', icon: BarChart3, title: 'Relatórios', color: 'text-purple-400' },
    { href: '/diretoria/financeiro/marketing', icon: Megaphone, title: 'Marketing', color: 'text-pink-400' },
    { href: '/diretoria/financeiro/midia', icon: Globe, title: 'SCN na Mídia', color: 'text-cyan-400' },
];

export default function FinanceiroPage() {
    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/diretoria" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Diretoria
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Controle Financeiro</h1>
                    <p className="text-white/50">Gestão completa das finanças do clube</p>
                </div>

                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <AnimatedCard variant="gradient" className="mb-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-white/50 text-sm">Saldo Atual</p>
                                <p className="text-3xl sm:text-4xl font-bold text-white">
                                    R$ {financialData.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="flex items-center gap-1 text-emerald-400">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="font-bold">R$ {financialData.income.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <p className="text-xs text-white/40">Receitas (mês)</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-1 text-red-400">
                                        <TrendingDown className="w-4 h-4" />
                                        <span className="font-bold">R$ {financialData.expenses.toLocaleString('pt-BR')}</span>
                                    </div>
                                    <p className="text-xs text-white/40">Despesas (mês)</p>
                                </div>
                            </div>
                        </div>
                    </AnimatedCard>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                >
                    <div className="glass-card p-4 text-center">
                        <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{financialData.activeMembers}</div>
                        <div className="text-xs text-white/40">Sócios Ativos</div>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <CreditCard className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">R$ {financialData.pendingFees.toLocaleString('pt-BR')}</div>
                        <div className="text-xs text-white/40">Mensalidades Pendentes</div>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <ShoppingBag className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">R$ {financialData.storeSales.toLocaleString('pt-BR')}</div>
                        <div className="text-xs text-white/40">Vendas Loja (mês)</div>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <PieChart className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-emerald-400">+30%</div>
                        <div className="text-xs text-white/40">Crescimento</div>
                    </div>
                </motion.div>

                {/* Menu Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
                >
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <AnimatedCard variant="glass" hover className="h-full">
                                <div className="text-center py-2">
                                    <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
                                    <p className="font-medium text-white text-sm">{item.title}</p>
                                </div>
                            </AnimatedCard>
                        </Link>
                    ))}
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Transações Recentes</h2>
                        <Button variant="ghost" size="sm" className="text-white/50">
                            Ver todas
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {recentTransactions.map((transaction, i) => (
                            <AnimatedCard key={transaction.id} variant="glass">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === 'income'
                                            ? 'bg-emerald-500/20'
                                            : 'bg-red-500/20'
                                        }`}>
                                        {transaction.type === 'income' ? (
                                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5 text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-white truncate">{transaction.description}</p>
                                        <p className="text-xs text-white/40">
                                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <span className={`font-bold ${transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                        {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
