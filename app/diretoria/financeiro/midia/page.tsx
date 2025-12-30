'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Newspaper,
    ExternalLink,
    Calendar,
    Play,
    Mic,
    Camera,
    Radio,
    Tv,
    Globe,
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

// Aparições na mídia
const aparicoesMidia = [
    {
        id: '1',
        titulo: 'Sport Club de Natal revive tradição centenária do remo',
        veiculo: 'Tribuna do Norte',
        tipo: 'JORNAL',
        data: '2024-12-28',
        link: 'https://tribunadonorte.com.br/esportes',
        destaque: true,
    },
    {
        id: '2',
        titulo: 'Regata de Verão 2025 promete reunir atletas de todo o Nordeste',
        veiculo: 'G1 RN',
        tipo: 'PORTAL',
        data: '2024-12-22',
        link: 'https://g1.globo.com/rn',
        destaque: true,
    },
    {
        id: '3',
        titulo: 'Entrevista com presidente do SCN sobre revitalização do clube',
        veiculo: 'Band Natal',
        tipo: 'TV',
        data: '2024-12-15',
        link: '#',
        destaque: false,
    },
    {
        id: '4',
        titulo: 'Podcast Esportes do RN - Episódio especial sobre remo',
        veiculo: 'Spotify',
        tipo: 'PODCAST',
        data: '2024-12-10',
        link: 'https://open.spotify.com',
        destaque: false,
    },
    {
        id: '5',
        titulo: 'Campeonato Estadual de Remo: SCN conquista 3 medalhas',
        veiculo: 'Novo Jornal',
        tipo: 'JORNAL',
        data: '2024-11-25',
        link: '#',
        destaque: false,
    },
    {
        id: '6',
        titulo: 'Projeto social do SCN leva remo para escolas públicas',
        veiculo: 'Diário de Natal',
        tipo: 'JORNAL',
        data: '2024-11-18',
        link: '#',
        destaque: false,
    },
    {
        id: '7',
        titulo: 'Entrevista na Rádio 96 FM sobre história do clube',
        veiculo: '96 FM',
        tipo: 'RÁDIO',
        data: '2024-11-10',
        link: '#',
        destaque: false,
    },
    {
        id: '8',
        titulo: 'Matéria sobre infraestrutura do Sport Club de Natal',
        veiculo: 'Inter TV Cabugi',
        tipo: 'TV',
        data: '2024-10-28',
        link: '#',
        destaque: false,
    },
];

const tipoConfig = {
    JORNAL: { icon: Newspaper, color: 'bg-blue-500/20 text-blue-400' },
    PORTAL: { icon: Globe, color: 'bg-emerald-500/20 text-emerald-400' },
    TV: { icon: Tv, color: 'bg-purple-500/20 text-purple-400' },
    RÁDIO: { icon: Radio, color: 'bg-amber-500/20 text-amber-400' },
    PODCAST: { icon: Mic, color: 'bg-pink-500/20 text-pink-400' },
};

export default function MidiaPage() {
    const stats = {
        total: aparicoesMidia.length,
        porTipo: Object.entries(
            aparicoesMidia.reduce((acc, a) => {
                acc[a.tipo] = (acc[a.tipo] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        ),
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
                                <Camera className="w-8 h-8 text-pink-400" />
                                SCN na Mídia
                            </h1>
                            <p className="text-white/50">Clipping e aparições do clube na imprensa</p>
                        </div>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Adicionar Clipping
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <AnimatedCard variant="gradient" className="p-4 text-center col-span-2 md:col-span-1">
                        <p className="text-3xl font-bold text-white">{stats.total}</p>
                        <p className="text-xs text-white/50">Total Aparições</p>
                    </AnimatedCard>
                    {stats.porTipo.map(([tipo, qtd]) => {
                        const config = tipoConfig[tipo as keyof typeof tipoConfig];
                        const IconComp = config?.icon || Newspaper;
                        return (
                            <AnimatedCard key={tipo} variant="glass" className="p-4 text-center">
                                <IconComp className={`w-5 h-5 mx-auto mb-1 ${config?.color.split(' ')[1]}`} />
                                <p className="text-xl font-bold text-white">{qtd}</p>
                                <p className="text-xs text-white/50">{tipo}</p>
                            </AnimatedCard>
                        );
                    })}
                </div>

                {/* Destaques */}
                <h3 className="text-lg font-bold text-white mb-4">Destaques Recentes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {aparicoesMidia.filter(a => a.destaque).map((ap, i) => {
                        const config = tipoConfig[ap.tipo as keyof typeof tipoConfig];
                        const IconComp = config?.icon || Newspaper;
                        return (
                            <motion.div
                                key={ap.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <AnimatedCard variant="gradient" className="p-6 h-full">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${config?.color.split(' ')[0]} flex items-center justify-center shrink-0`}>
                                            <IconComp className={`w-6 h-6 ${config?.color.split(' ')[1]}`} />
                                        </div>
                                        <div className="flex-1">
                                            <Badge className="bg-club-gold/20 text-club-gold border-0 mb-2">DESTAQUE</Badge>
                                            <h4 className="font-bold text-white mb-2">{ap.titulo}</h4>
                                            <div className="flex items-center gap-2 text-sm text-white/50 mb-3">
                                                <span>{ap.veiculo}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(ap.data).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <Button size="sm" variant="outline" className="gap-1 border-white/20">
                                                <ExternalLink className="w-3 h-3" /> Ver matéria
                                            </Button>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Todas aparições */}
                <h3 className="text-lg font-bold text-white mb-4">Todas as Aparições</h3>
                <div className="space-y-3">
                    {aparicoesMidia.map((ap, i) => {
                        const config = tipoConfig[ap.tipo as keyof typeof tipoConfig];
                        const IconComp = config?.icon || Newspaper;
                        return (
                            <motion.div
                                key={ap.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl ${config?.color.split(' ')[0]} flex items-center justify-center`}>
                                                <IconComp className={`w-5 h-5 ${config?.color.split(' ')[1]}`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{ap.titulo}</p>
                                                <p className="text-xs text-white/40 flex items-center gap-2">
                                                    <span>{ap.veiculo}</span>
                                                    <span>•</span>
                                                    <span>{new Date(ap.data).toLocaleDateString('pt-BR')}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={`${config?.color} border-0`}>
                                                {ap.tipo}
                                            </Badge>
                                            <a href={ap.link} target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
