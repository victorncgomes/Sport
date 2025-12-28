'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Users,
    DollarSign,
    Calendar,
    Vote,
    ClipboardList,
    Heart,
    FileText,
    ArrowRight,
    Ship,
    Archive
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
    {
        href: '/diretoria/financeiro',
        icon: DollarSign,
        title: 'Financeiro',
        description: 'Rendas, despesas, mensalidades e CRM',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/20',
    },
    {
        href: '/diretoria/garagem',
        icon: Ship,
        title: 'Garagem',
        description: 'Manutenção, agendamentos e estatísticas de barcos',
        color: 'text-sky-500',
        bgColor: 'bg-sky-500/20',
    },
    {
        href: '/diretoria/reunioes',
        icon: Calendar,
        title: 'Reuniões',
        description: 'Atas, convocações e assembleias',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/20',
    },
    {
        href: '/diretoria/eleicoes',
        icon: Vote,
        title: 'Eleições',
        description: 'Votações e resultados',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/20',
    },
    {
        href: '/diretoria/tarefas',
        icon: ClipboardList,
        title: 'Tarefas',
        description: 'Gestão de tarefas e projetos',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/20',
    },
    {
        href: '/diretoria/voluntariado',
        icon: Heart,
        title: 'Voluntariado',
        description: 'Programas e voluntários',
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/20',
    },
    {
        href: '/diretoria/socios',
        icon: Users,
        title: 'Sócios',
        description: 'Gestão de membros e atletas',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-500/20',
    },
    {
        href: '/diretoria/documentos',
        icon: FileText,
        title: 'Documentos',
        description: 'Estatuto, atas e regulamentos',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/20',
    },
    {
        href: '/diretoria/acervo',
        icon: Archive,
        title: 'Acervo',
        description: 'Patrimônio, tombamento e inventário do clube',
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/20',
    },
];

export default function DiretoriaPage() {
    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-club-red/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-club-gold/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-club-red/20 flex items-center justify-center">
                        <LayoutDashboard className="w-10 h-10 text-club-red" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        Painel da <span className="text-club-red">Diretoria</span>
                    </h1>
                    <p className="text-white/50">
                        Gestão Completa do Sport Club de Natal
                    </p>
                </motion.div>

                {/* Menu Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {menuItems.map((item, i) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={item.href}>
                                <div className={`relative overflow-hidden rounded-2xl p-6 h-full group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-l-4 ${item.color.replace('text-', 'border-')} bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border-t border-r border-b border-white/10 hover:border-white/20`}>
                                    {/* Colored glow effect */}
                                    <div className={`absolute top-0 left-0 w-32 h-32 ${item.bgColor} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity`} />

                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 rounded-xl ${item.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <item.icon className={`w-7 h-7 ${item.color}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-club-gold transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-white/60 leading-relaxed">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                                            <span className="text-xs text-white/40 uppercase tracking-wider font-bold">Acessar</span>
                                            <ArrowRight className={`w-4 h-4 ${item.color} group-hover:translate-x-2 transition-transform`} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 max-w-5xl mx-auto"
                >
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Resumo Rápido</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Sócios Ativos', value: '127', color: 'text-emerald-500' },
                                { label: 'Mensalidades Pendentes', value: '12', color: 'text-amber-500' },
                                { label: 'Tarefas Abertas', value: '8', color: 'text-blue-500' },
                                { label: 'Reuniões este Mês', value: '3', color: 'text-purple-500' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center p-3 rounded-xl bg-white/5">
                                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                                    <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-8"
                >
                    <Link href="/" className="text-sm text-white/40 hover:text-white transition-colors">
                        ← Voltar para o início
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
