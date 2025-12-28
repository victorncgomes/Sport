'use client';

import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import Link from 'next/link';
import {
    Users, ShoppingBag, FileText, CalendarCheck, Settings,
    Megaphone, Share2, Target, Box, BarChart3, PlusCircle,
    LayoutDashboard, History, PiggyBank, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
    const adminCards = [
        { href: '/admin/users', icon: Users, title: 'Associados', desc: 'Gestão de fichas, mensalidades e filiações', color: 'text-club-red' },
        { href: '/admin/notices', icon: Megaphone, title: 'Mural de Avisos', desc: 'Publicar comunicados no mural oficial', color: 'text-club-gold' },
        { href: '/admin/tasks', icon: CalendarCheck, title: 'Tarefas', desc: 'Gestão de atividades e delegação (ex-Kanban)', color: 'text-blue-500' },
        { href: '/admin/inventory', icon: Box, title: 'Acervo do Clube', desc: 'Tombamento, fotos e patrimônio histórico', color: 'text-emerald-500' },
        { href: '/admin/marketing', icon: Share2, title: 'Redes Sociais', desc: 'Campanhas, marketing e analytics', color: 'text-pink-500' },
        { href: '/admin/projects', icon: Target, title: 'Projetos e Metas', desc: 'Planejamento estratégico e objetivos', color: 'text-purple-500' },
        { href: '/admin/stats', icon: BarChart3, title: 'Estatísticas', desc: 'Número de sócios, valor patrimonial e financeiro', color: 'text-club-gold' },
        { href: '/admin/products', icon: ShoppingBag, title: 'Loja & Produtos', desc: 'Gestão de estoque e vendas', color: 'text-club-red' },
        { href: '/admin/media', icon: Settings, title: 'Mídia e Galeria', desc: 'Gerenciar fotos e vídeos do clube', color: 'text-white/40' },
    ];

    const statsSummary = [
        { label: 'Total de Sócios', value: '254', icon: Users, trend: '+5 este mês' },
        { label: 'Receita Mensal', value: 'R$ 38.500', icon: PiggyBank, trend: '+12% vs mês ant.' },
        { label: 'Patrimônio Estimado', value: 'R$ 2.4M', icon: Briefcase, trend: 'Avaliação 2024' },
    ];

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Painel da Diretoria"
                subtitle="Gestão do Clube"
                description="Controle estratégico, financeiro e operacional do Sport Club de Natal."
                compact
            />

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                {/* Quick Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {statsSummary.map((stat, i) => (
                        <AnimatedCard key={i} variant="glass" className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    <stat.icon className="w-5 h-5 text-club-gold" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-club-red tracking-widest">{stat.trend}</span>
                            </div>
                            <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</h4>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                        </AnimatedCard>
                    ))}
                </div>

                {/* Main Menu Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminCards.map((card, i) => (
                        <Link key={i} href={card.href}>
                            <AnimatedCard variant="glass" className="group p-8 hover:border-club-red/30 transition-all border-white/5 h-full">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors ${card.color}`}>
                                        <card.icon className="w-8 h-8" />
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-white/20 group-hover:text-white group-hover:bg-white/5">
                                        <PlusCircle className="w-5 h-5" />
                                    </Button>
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-club-red transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-white/40 leading-relaxed">
                                    {card.desc}
                                </p>
                            </AnimatedCard>
                        </Link>
                    ))}
                </div>

                {/* Recent Activities Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-club-gold" />
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Últimas Ações da Gestão</h2>
                        </div>
                        <Button variant="outline" className="text-xs uppercase font-black tracking-widest border-white/10 hover:bg-white/5">
                            Ver Log Completo
                        </Button>
                    </div>

                    <div className="glass-card overflow-hidden">
                        {[
                            { action: 'Novo Aviso publicado no mural', user: 'Carlos Melo (Pres.)', time: '2h atrás', icon: Megaphone },
                            { action: 'Aprovação de novos 3 associados', user: 'Secretaria', time: '5h atrás', icon: Users },
                            { action: 'Relatório financeiro de Maio gerado', user: 'Marcos (Fin.)', time: '1 dia atrás', icon: BarChart3 },
                        ].map((log, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                    <log.icon className="w-4 h-4 text-white/30" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-medium">{log.action}</p>
                                    <p className="text-[10px] text-white/30">{log.user}</p>
                                </div>
                                <span className="text-[10px] text-white/20 font-bold uppercase">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
