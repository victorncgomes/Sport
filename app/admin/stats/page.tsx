'use client';

import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import {
    Users, TrendingUp, PiggyBank, Briefcase,
    Ship, Target, MapPin, Calendar,
    ArrowUpRight, ArrowDownRight, PieChart, BarChart3, LineChart
} from 'lucide-react';

export default function AdminStatsPage() {
    const mainStats = [
        { label: 'Associados Ativos', value: '254', trend: '+12%', icon: Users, color: 'text-club-red' },
        { label: 'Receita Mensal', value: 'R$ 38.500', trend: '+8.5%', icon: PiggyBank, color: 'text-club-gold' },
        { label: 'Valor Patrimonial', value: 'R$ 2.45M', trend: '+2.1%', icon: Briefcase, color: 'text-emerald-500' },
        { label: 'Ocupação Barcos', value: '68%', trend: '-3.2%', icon: Ship, color: 'text-blue-500' },
    ];

    const distribution = [
        { label: 'Sócio Atleta', value: '45%', color: 'bg-club-red' },
        { label: 'Sócio Contribuinte', value: '30%', color: 'bg-club-gold' },
        { label: 'Sócio Master', value: '15%', color: 'bg-white/40' },
        { label: 'Sócio Júnior', value: '10%', color: 'bg-white/10' },
    ];

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Estatísticas do Clube"
                subtitle="Análise e Planejamento"
                description="Visão geral do crescimento, saúde financeira e metas estratégicas."
                compact
            />

            <div className="container mx-auto px-4 py-12">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {mainStats.map((stat, i) => (
                        <AnimatedCard key={i} variant="glass" className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-club-red'}`}>
                                    {stat.trend}
                                    {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                </div>
                            </div>
                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{stat.label}</h4>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                        </AnimatedCard>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Patrimônio e Financeiro */}
                    <div className="lg:col-span-2 space-y-8">
                        <AnimatedCard variant="glass" className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Fluxo de Caixa & Planejamento</h3>
                                    <p className="text-white/30 text-xs mt-1">Comparativo de receitas e despesas (12 meses)</p>
                                </div>
                                <BarChart3 className="w-6 h-6 text-club-gold" />
                            </div>

                            {/* Mock Chart Area */}
                            <div className="h-64 w-full bg-white/5 rounded-2xl border border-white/5 flex items-end justify-around p-6 gap-2">
                                {[30, 45, 60, 55, 75, 90, 85, 95, 110, 100, 120, 105].map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center">
                                        <div className="w-full bg-club-red/20 border-t-2 border-club-red rounded-t-sm" style={{ height: `${val / 1.5}px` }} />
                                        <span className="text-[8px] text-white/20 mt-2 rotate-45">{['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <AnimatedCard variant="glass" className="p-6">
                                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6">Metas 2024</h4>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center text-xs mb-2">
                                            <span className="text-white font-bold">Expansão Sede</span>
                                            <span className="text-club-gold">85%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-club-gold rounded-full" style={{ width: '85%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center text-xs mb-2">
                                            <span className="text-white font-bold">Novos Atletas</span>
                                            <span className="text-club-red">42/100</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-club-red rounded-full" style={{ width: '42%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center text-xs mb-2">
                                            <span className="text-white font-bold">Renovação de Frota</span>
                                            <span className="text-emerald-500">CONCLUÍDO</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-emerald-500/20 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>

                            <AnimatedCard variant="glass" className="p-6">
                                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6">Investimentos</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-club-red" />
                                        <span className="text-xs text-white/70 flex-1">Manutenção Galpão</span>
                                        <span className="text-xs font-bold text-white">R$ 12k</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-club-gold" />
                                        <span className="text-xs text-white/70 flex-1">Novos Unifomres</span>
                                        <span className="text-xs font-bold text-white">R$ 5k</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="text-xs text-white/70 flex-1">Marketing Digital</span>
                                        <span className="text-xs font-bold text-white">R$ 3k</span>
                                    </li>
                                </ul>
                            </AnimatedCard>
                        </div>
                    </div>

                    {/* Distribuição e Perfil */}
                    <div className="space-y-8">
                        <AnimatedCard variant="glass" className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <PieChart className="w-5 h-5 text-club-red" />
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Perfil dos Sócios</h3>
                            </div>

                            <div className="space-y-4">
                                {distribution.map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-bold text-white/70">
                                            <span>{item.label}</span>
                                            <span>{item.value}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        <AnimatedCard variant="gradient" className="p-8">
                            <Target className="w-10 h-10 text-white mb-6" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Patrimônio do Clube</h3>
                            <div className="space-y-4 border-t border-white/10 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-white/40 uppercase font-black tracking-widest">Sede Potengi</span>
                                    <span className="text-sm font-black text-white">R$ 1.8M</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-white/40 uppercase font-black tracking-widest">Frota Náutica</span>
                                    <span className="text-sm font-black text-white">R$ 450k</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-white/40 uppercase font-black tracking-widest">Maquinário Academia</span>
                                    <span className="text-sm font-black text-white">R$ 200k</span>
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
