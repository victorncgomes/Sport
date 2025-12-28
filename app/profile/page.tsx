'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-context';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    User, Settings, CreditCard, FileText, Heart, Bell,
    LogOut, ChevronRight, QrCode, Camera, Trophy,
    Calendar, Users, DollarSign, LayoutDashboard,
    TrendingUp, Medal, Flame, Star, Zap
} from 'lucide-react';
import { getMemberDashboardData } from '@/lib/actions/member';
import { getCoachDashboardData } from '@/lib/actions/coach';
import { XPIcon, LevelBadgeIcon, StreakIcon, TrophyIcon } from '@/components/icons/gamification-icons';

export default function UnifiedProfilePage() {
    const { role, logout, isLoaded } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [coachData, setCoachData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoaded) return;

        async function fetchData() {
            try {
                if (role === 'visitante') {
                    window.location.href = '/login';
                    return;
                }

                // Carrega dados base do membro (comum a todos)
                const memberData = await getMemberDashboardData(
                    role === 'treinador' ? 'treinador@scnatal.com.br' :
                        role === 'diretoria' ? 'admin@scnatal.com.br' : 'socio1@email.com'
                );
                setUserData(memberData);

                // Carrega dados específicos se for treinador
                if (role === 'treinador') {
                    const cData = await getCoachDashboardData('treinador@scnatal.com.br');
                    setCoachData(cData);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [role, isLoaded]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-club-black flex items-center justify-center">
                <div className="text-white/50 animate-pulse font-black uppercase tracking-widest">Carregando Hub de Perfil...</div>
            </div>
        );
    }

    const menuItems = [
        { href: '/profile/data', icon: User, title: 'Dados Pessoais', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
        { href: '/profile/anamnese', icon: FileText, title: 'Anamnese', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
        { href: '/profile/payments', icon: CreditCard, title: 'Pagamentos', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
        { href: '/profile/settings', icon: Settings, title: 'Segurança', color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
    ];

    const diretoriaActions = [
        { href: '/diretoria/financeiro', icon: DollarSign, title: 'Financeiro', color: 'text-emerald-500', bgColor: 'bg-emerald-500/20' },
        { href: '/diretoria/reunioes', icon: Calendar, title: 'Reuniões', color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
        { href: '/diretoria/socios', icon: Users, title: 'Gestão Sócios', color: 'text-cyan-500', bgColor: 'bg-cyan-500/20' },
        { href: '/diretoria', icon: LayoutDashboard, title: 'Painel Geral', color: 'text-club-red', bgColor: 'bg-club-red/20' },
    ];

    return (
        <div className="min-h-screen bg-club-black pb-24 pt-4">
            <HeroSection
                title="Meu Perfil"
                subtitle={role.toUpperCase()}
                description="Gestão de conta, dados pessoais e painel administrativo."
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Coluna Esquerda: Perfil & Gamificação */}
                    <div className="space-y-6">
                        <AnimatedCard variant="gradient" className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="w-24 h-24 rounded-2xl bg-club-red/20 flex items-center justify-center ring-4 ring-club-gold/30">
                                        <User className="w-12 h-12 text-white/70" />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-club-gold flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                        <Camera className="w-4 h-4 text-club-black" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1">{userData?.name}</h2>
                                <p className="text-white/40 text-xs mb-4">{userData?.email}</p>
                                <div className="flex gap-2 mb-4">
                                    <Badge className="bg-club-gold/20 text-club-gold border-0">{role}</Badge>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Ativo</Badge>
                                </div>
                                <div className="w-full pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase font-black">Nível</p>
                                        <p className="text-lg font-black text-club-gold">Lv.{userData?.level || 1}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase font-black">XP</p>
                                        <p className="text-lg font-black text-club-gold">{userData?.points || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedCard>

                        <div className="grid grid-cols-2 gap-3">
                            {menuItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <AnimatedCard variant="glass" className="p-4 hover:border-club-red/30 transition-all h-full">
                                        <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
                                        <p className="text-xs font-bold text-white">{item.title}</p>
                                    </AnimatedCard>
                                </Link>
                            ))}
                        </div>

                        <Button
                            onClick={() => logout()}
                            className="w-full bg-club-red hover:bg-red-700 text-white h-14 text-sm font-black uppercase tracking-widest gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all"
                        >
                            <LogOut className="w-5 h-5" /> Sair da Conta
                        </Button>
                    </div>

                    {/* Coluna Central/Direita: Painel de Gestão Dinâmico */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Se for DIRETORIA */}
                        {role === 'diretoria' && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-2xl bg-club-red/20 text-club-red">
                                        <LayoutDashboard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Área da Diretoria</h2>
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Ações Administrativas</p>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {diretoriaActions.map((item) => (
                                        <Link key={item.href} href={item.href}>
                                            <AnimatedCard variant="glass" className="p-6 group hover:border-white/20 transition-all h-full">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center shrink-0`}>
                                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-white font-bold group-hover:text-club-gold transition-colors">{item.title}</h3>
                                                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Gerenciar</p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-club-red transition-all" />
                                                </div>
                                            </AnimatedCard>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Se for TREINADOR */}
                        {role === 'treinador' && coachData && (
                            <section className="space-y-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Portal do Treinador</h2>
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Status dos Atletas & Treinos</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                    {[
                                        { label: 'Treinos', value: coachData.stats.totalTrainings, icon: Calendar, color: 'text-blue-400' },
                                        { label: 'Alunos', value: coachData.stats.totalStudents, icon: Users, color: 'text-emerald-400' },
                                        { label: 'Aproveitamento', value: coachData.stats.attendanceRate + '%', icon: TrendingUp, color: 'text-club-gold' },
                                        { label: 'Ranking', value: coachData.stats.competingAthletes, icon: Trophy, color: 'text-club-red' },
                                    ].map((stat, i) => (
                                        <AnimatedCard key={i} variant="glass" className="p-4 text-center border-white/5">
                                            <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-2`} />
                                            <div className="text-xl font-black text-white">{stat.value}</div>
                                            <p className="text-[10px] text-white/30 uppercase font-black">{stat.label}</p>
                                        </AnimatedCard>
                                    ))}
                                </div>

                                <Link href="/coach/painel">
                                    <Button className="w-full bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-600 text-white h-14 text-xs font-black uppercase tracking-widest gap-2">
                                        Acessar Painel Completo do Treinador <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </section>
                        )}

                        {/* Se for SÓCIO / ATLETA (Padrão) */}
                        {role === 'socio' && (
                            <section className="space-y-6">
                                <AnimatedCard variant="glass" className="border-emerald-500/20 bg-emerald-500/5 p-8">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 mb-1">Situação Financeira</div>
                                                <h3 className="text-lg font-bold text-white">Mensalidade em Dia</h3>
                                                <p className="text-xs text-white/40 italic">Próximo vencimento: 10/01/2025</p>
                                            </div>
                                        </div>
                                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 font-black uppercase tracking-widest text-[10px]">
                                            Ver Boletos
                                        </Button>
                                    </div>
                                </AnimatedCard>

                                <div className="grid gap-4">
                                    <h3 className="text-sm font-black text-white/30 uppercase tracking-widest">Notificações Recentes</h3>
                                    {[
                                        { title: 'Novo Treino Disponível', date: 'Hoje, 08:30', icon: Zap, color: 'text-blue-400' },
                                        { title: 'Aviso de Eleição', date: 'Ontem, 14:20', icon: Bell, color: 'text-club-gold' },
                                    ].map((note, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                            <note.icon className={`w-5 h-5 ${note.color}`} />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-white">{note.title}</p>
                                                <p className="text-[10px] text-white/30 font-bold">{note.date}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-white/10" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
