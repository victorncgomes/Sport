'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Megaphone,
    Instagram,
    Facebook,
    Mail,
    MessageSquare,
    Users,
    TrendingUp,
    Eye,
    Heart,
    Share2,
    Plus,
    Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

// Campanhas de marketing
const campanhas = [
    {
        id: '1',
        nome: 'Regata de Verão 2025',
        tipo: 'EVENTO',
        status: 'ATIVA',
        inicio: '2024-12-15',
        fim: '2025-01-20',
        alcance: 15420,
        engajamento: 3.8,
        conversoes: 45,
    },
    {
        id: '2',
        nome: 'Promoção Loja - Natal',
        tipo: 'PROMOCIONAL',
        status: 'CONCLUÍDA',
        inicio: '2024-12-01',
        fim: '2024-12-25',
        alcance: 8930,
        engajamento: 4.2,
        conversoes: 67,
    },
    {
        id: '3',
        nome: 'Matrícula 2025',
        tipo: 'AQUISIÇÃO',
        status: 'ATIVA',
        inicio: '2024-12-01',
        fim: '2025-03-31',
        alcance: 22100,
        engajamento: 2.9,
        conversoes: 12,
    },
    {
        id: '4',
        nome: 'Campanha Dia do Remador',
        tipo: 'INSTITUCIONAL',
        status: 'AGENDADA',
        inicio: '2025-03-15',
        fim: '2025-03-22',
        alcance: 0,
        engajamento: 0,
        conversoes: 0,
    },
];

// Métricas das redes sociais
const redesSociais = [
    { rede: 'Instagram', icon: Instagram, seguidores: 4850, crescimento: 12.5, posts: 45, engajamento: 4.2, cor: 'bg-pink-500' },
    { rede: 'Facebook', icon: Facebook, seguidores: 2340, crescimento: 3.2, posts: 32, engajamento: 2.1, cor: 'bg-blue-600' },
    { rede: 'WhatsApp', icon: MessageSquare, seguidores: 890, crescimento: 8.7, posts: 0, engajamento: 0, cor: 'bg-green-500' },
    { rede: 'Email', icon: Mail, seguidores: 1250, crescimento: 5.4, posts: 12, engajamento: 28.5, cor: 'bg-amber-500' },
];

const statusConfig = {
    ATIVA: { color: 'bg-emerald-500/20 text-emerald-400' },
    CONCLUÍDA: { color: 'bg-blue-500/20 text-blue-400' },
    AGENDADA: { color: 'bg-amber-500/20 text-amber-400' },
    PAUSADA: { color: 'bg-white/10 text-white/40' },
};

export default function MarketingPage() {
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
                                <Megaphone className="w-8 h-8 text-purple-400" />
                                Marketing
                            </h1>
                            <p className="text-white/50">Campanhas, redes sociais e engajamento</p>
                        </div>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nova Campanha
                        </Button>
                    </div>
                </div>

                {/* Redes Sociais */}
                <h3 className="text-lg font-bold text-white mb-4">Redes Sociais</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {redesSociais.map((rede, i) => {
                        const IconComp = rede.icon;
                        return (
                            <motion.div
                                key={rede.rede}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-xl ${rede.cor} flex items-center justify-center`}>
                                            <IconComp className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-bold text-white">{rede.rede}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4 text-white/40" />
                                            <span className="text-xl font-bold text-white">{rede.seguidores.toLocaleString()}</span>
                                        </div>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                                            +{rede.crescimento}%
                                        </Badge>
                                    </div>
                                    {rede.engajamento > 0 && (
                                        <div className="text-xs text-white/40">
                                            Engajamento: {rede.engajamento}%
                                        </div>
                                    )}
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Campanhas */}
                <h3 className="text-lg font-bold text-white mb-4">Campanhas</h3>
                <div className="space-y-4">
                    {campanhas.map((camp, i) => (
                        <motion.div
                            key={camp.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <AnimatedCard variant="glass" className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold text-white text-lg">{camp.nome}</h4>
                                            <Badge className={`${statusConfig[camp.status as keyof typeof statusConfig].color} border-0`}>
                                                {camp.status}
                                            </Badge>
                                            <Badge className="bg-white/10 text-white/60 border-0">
                                                {camp.tipo}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-white/40 flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(camp.inicio).toLocaleDateString('pt-BR')} - {new Date(camp.fim).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                                                <Eye className="w-3 h-3" /> Alcance
                                            </div>
                                            <p className="text-lg font-bold text-white">{camp.alcance.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                                                <Heart className="w-3 h-3" /> Engaj.
                                            </div>
                                            <p className="text-lg font-bold text-white">{camp.engajamento}%</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 text-white/40 text-xs mb-1">
                                                <TrendingUp className="w-3 h-3" /> Conv.
                                            </div>
                                            <p className="text-lg font-bold text-emerald-400">{camp.conversoes}</p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
