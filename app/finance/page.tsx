
'use client';

import React from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { memberFinanceData } from '@/lib/data/finance-data';
import {
    Wallet,
    CreditCard,
    ArrowUpRight,
    History,
    FileText,
    Download,
    CheckCircle2,
    Clock,
    QrCode,
    Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FinancePage() {
    const data = memberFinanceData;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Financeiro"
                subtitle="Central do Sócio"
                description="Gestão de mensalidades, faturas e histórico de pagamentos."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Summary and Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatedCard variant="metal" className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1">Status da Conta</p>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Regularizado</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Próximo Vencimento</p>
                                    <p className="text-xl font-black text-white">{data.nextDueDate}</p>
                                </div>
                            </AnimatedCard>

                            <AnimatedCard variant="carbon" className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1">Saldo Devedor</p>
                                        <h3 className="text-3xl font-black text-white">R$ {data.balance.toFixed(2)}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-club-red/20 flex items-center justify-center">
                                        <Wallet className="w-6 h-6 text-club-red" />
                                    </div>
                                </div>
                                <Button className="w-full bg-club-red hover:bg-club-red-700 text-xs font-black uppercase tracking-widest py-6 shadow-glow-red">
                                    Antecipar Pagamento
                                </Button>
                            </AnimatedCard>
                        </div>

                        {/* Invoices List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between ml-2">
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Faturas Recentes</h3>
                                <Button variant="ghost" className="text-xs font-black text-club-gold uppercase tracking-widest hover:bg-club-gold/5 flex items-center gap-2">
                                    <History className="w-4 h-4" /> Ver Tudo
                                </Button>
                            </div>

                            {data.invoices.map((inv) => (
                                <AnimatedCard key={inv.id} variant="glass" className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center",
                                                inv.status === 'paid' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                                            )}>
                                                {inv.status === 'paid' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold">{inv.description}</h4>
                                                <p className="text-white/40 text-xs font-medium">Vencimento: {inv.dueDate}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-8">
                                            <div className="text-right">
                                                <p className="text-white font-black text-xl">R$ {inv.amount.toFixed(2)}</p>
                                                <p className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    inv.status === 'paid' ? "text-emerald-500" : "text-amber-500"
                                                )}>
                                                    {inv.status === 'paid' ? 'Pago' : 'Pendente'}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                {inv.status === 'pending' && (
                                                    <Button size="icon" variant="outline" className="h-10 w-10 border-white/10 hover:bg-white/5">
                                                        <QrCode className="w-4 h-4 text-white" />
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="outline" className="h-10 w-10 border-white/10 hover:bg-white/5">
                                                    <Download className="w-4 h-4 text-white/50" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Cards and Quick Actions */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em] ml-2">Métodos de Pagamento</h3>
                            <AnimatedCard variant="carbon" className="p-6 border-club-gold/30 bg-gradient-to-br from-club-gold/10 to-transparent">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-8 bg-white/10 rounded-md" />
                                    <CreditCard className="w-6 h-6 text-club-gold" />
                                </div>
                                <p className="text-white font-mono tracking-widest text-lg mb-1">•••• •••• •••• 4421</p>
                                <div className="flex justify-between items-end">
                                    <p className="text-white/40 text-[10px] uppercase font-black">Exp: 08/29</p>
                                    <p className="text-white font-bold text-xs uppercase">Visa Platinum</p>
                                </div>
                            </AnimatedCard>

                            <Button variant="outline" className="w-full h-14 border-dashed border-white/10 text-white/40 hover:text-white hover:bg-white/5 gap-2 font-black uppercase text-[10px] tracking-widest">
                                Adicionar Novo Cartão
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.2em] ml-2">Ações Rápidas</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-club-red/10 text-club-red">
                                            <Receipt className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-white/80 group-hover:text-white">Emitir Declaração de Quitação</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-white/20" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-club-gold/10 text-club-gold">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-white/80 group-hover:text-white">Alterar Plano de Associado</span>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-white/20" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
