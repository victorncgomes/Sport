'use client';

import Link from 'next/link';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Megaphone,
    FileText,
    Calendar,
    ArrowRight,
    Pin,
    Bell,
    BookOpen,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';

// Comunicados oficiais do clube
const announcements = [
    {
        id: 1,
        title: 'Assembleia Geral Ordinária - Março 2025',
        content: 'Convocamos todos os sócios quites com suas obrigações para a Assembleia Geral Ordinária que será realizada no dia 15 de março de 2025, às 19h, na sede do clube.',
        date: '2025-01-10',
        type: 'assembleia',
        pinned: true,
    },
    {
        id: 2,
        title: 'Novos Horários de Treino',
        content: 'A partir de fevereiro, os horários de treino serão ajustados. Consulte a planilha atualizada no sistema.',
        date: '2025-01-08',
        type: 'aviso',
        pinned: true,
    },
    {
        id: 3,
        title: 'Campeonato Estadual de Remo 2025',
        content: 'Inscrições abertas para o Campeonato Estadual. Atletas interessados devem procurar a Diretoria Técnica até 28 de fevereiro.',
        date: '2025-01-05',
        type: 'competicao',
        pinned: false,
    },
    {
        id: 4,
        title: 'Reforma do Vestiário Concluída',
        content: 'Informamos que a reforma do vestiário masculino foi concluída. Agradecemos a compreensão de todos durante o período de obras.',
        date: '2024-12-20',
        type: 'infraestrutura',
        pinned: false,
    },
    {
        id: 5,
        title: 'Férias Coletivas - Janeiro',
        content: 'O clube funcionará em horário reduzido entre 23/12 e 05/01. Retorno às atividades normais em 06/01.',
        date: '2024-12-15',
        type: 'aviso',
        pinned: false,
    },
];

const typeColors: Record<string, { bg: string; text: string }> = {
    assembleia: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    aviso: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    competicao: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    infraestrutura: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
};

const typeLabels: Record<string, string> = {
    assembleia: 'Assembleia',
    aviso: 'Aviso',
    competicao: 'Competição',
    infraestrutura: 'Infraestrutura',
};

export default function MuralPage() {
    const pinnedAnnouncements = announcements.filter(a => a.pinned);
    const regularAnnouncements = announcements.filter(a => !a.pinned);

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Quadro de Avisos"
                subtitle="Comunicações Oficiais"
                description="Fique por dentro das novidades e comunicados do Sport Club de Natal"
                compact
            />

            <div className="container mx-auto px-4 py-12">
                {/* Avisos Fixados */}
                {pinnedAnnouncements.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Pin className="w-5 h-5 text-club-red" />
                            <h2 className="text-xl font-bold text-white">Avisos Importantes</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {pinnedAnnouncements.map((announcement, i) => (
                                <motion.div
                                    key={announcement.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <AnimatedCard variant="gradient" className="h-full border-club-red/30 border">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-club-red/20 flex items-center justify-center flex-shrink-0">
                                                <Bell className="w-5 h-5 text-club-red" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={`${typeColors[announcement.type]?.bg} ${typeColors[announcement.type]?.text} border-0`}>
                                                        {typeLabels[announcement.type]}
                                                    </Badge>
                                                    <span className="text-xs text-white/40">
                                                        {new Date(announcement.date).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-white mb-2">{announcement.title}</h3>
                                                <p className="text-sm text-white/60">{announcement.content}</p>
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Avisos Regulares */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Megaphone className="w-5 h-5 text-club-gold" />
                        <h2 className="text-xl font-bold text-white">Comunicados Recentes</h2>
                    </div>

                    <div className="space-y-4">
                        {regularAnnouncements.map((announcement, i) => (
                            <motion.div
                                key={announcement.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" hover className="h-full">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg ${typeColors[announcement.type]?.bg} flex items-center justify-center flex-shrink-0`}>
                                            <Megaphone className={`w-5 h-5 ${typeColors[announcement.type]?.text}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge className={`${typeColors[announcement.type]?.bg} ${typeColors[announcement.type]?.text} border-0 text-xs`}>
                                                    {typeLabels[announcement.type]}
                                                </Badge>
                                                <span className="text-xs text-white/40">
                                                    {new Date(announcement.date).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-semibold text-white mb-1">{announcement.title}</h3>
                                            <p className="text-sm text-white/50 line-clamp-2">{announcement.content}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0" />
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Estatuto */}
                <section className="mb-12">
                    <AnimatedCard variant="glass" className="border border-club-gold/20">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-club-gold/20 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-8 h-8 text-club-gold" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-xl font-bold text-white mb-2">Estatuto do Clube</h3>
                                <p className="text-white/60 text-sm mb-4">
                                    Consulte o estatuto oficial do Sport Club de Natal, com todas as normas e regulamentos que regem nossa instituição.
                                </p>
                                <a
                                    href="/public/docs/Estatuto Sport Club de Natal.pdf"
                                    download="Estatuto_Sport_Club_de_Natal.pdf"
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-club-gold text-black font-bold rounded-lg hover:bg-club-gold/90 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Baixar Estatuto (PDF)
                                </a>
                            </div>
                        </div>
                    </AnimatedCard>
                </section>

                {/* Link para Notícias */}
                <section className="text-center">
                    <p className="text-white/50 mb-4">Procurando por notícias e artigos?</p>
                    <Link href="/news">
                        <Button variant="outline" className="gap-2">
                            Ver todas as notícias
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </section>
            </div>
        </div>
    );
}
