'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Calendar,
    User,
    ArrowRight,
    Search,
    Newspaper,
    Trophy,
    Heart,
    Dumbbell,
    ChefHat,
    Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';


import { allNews } from '@/lib/data/news-data';

const categoryIcons: Record<string, typeof Trophy> = {
    'Competição': Trophy,
    'Técnica': Dumbbell,
    'Nutrição': ChefHat,
    'Depoimento': Heart,
    'Infraestrutura': Megaphone,
    'Treinamento': Dumbbell,
    'História': Newspaper,
    'Saúde': Heart,
    'Eventos': Calendar,
    'Social': Heart,
};

const categoryColors: Record<string, string> = {
    'Competição': 'bg-amber-500/20 text-amber-400',
    'Técnica': 'bg-blue-500/20 text-blue-400',
    'Nutrição': 'bg-emerald-500/20 text-emerald-400',
    'Depoimento': 'bg-pink-500/20 text-pink-400',
    'Infraestrutura': 'bg-purple-500/20 text-purple-400',
    'Treinamento': 'bg-orange-500/20 text-orange-400',
    'História': 'bg-cyan-500/20 text-cyan-400',
    'Saúde': 'bg-red-500/20 text-red-400',
    'Eventos': 'bg-indigo-500/20 text-indigo-400',
    'Social': 'bg-rose-500/20 text-rose-400',
};


export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAll, setShowAll] = useState(false);

    const filteredNews = allNews.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedNews = showAll ? filteredNews : filteredNews.slice(0, 6);

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Notícias"
                subtitle="Fique por dentro"
                description="Últimas novidades, artigos e acontecimentos do Sport Club de Natal"
                compact
            />

            <div className="container mx-auto px-4 py-12">
                {/* Barra de pesquisa */}
                <div className="max-w-xl mx-auto mb-12">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <Input
                            type="text"
                            placeholder="Buscar notícias, artigos, categorias..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-club-red h-12"
                        />
                    </div>
                </div>

                {/* Link para Mural */}
                <div className="max-w-xl mx-auto mb-8">
                    <Link href="/mural">
                        <AnimatedCard variant="glass" hover className="border border-club-gold/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-club-gold/20 flex items-center justify-center">
                                    <Megaphone className="w-6 h-6 text-club-gold" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">Quadro de Avisos</h3>
                                    <p className="text-sm text-white/50">Comunicados oficiais e estatuto do clube</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-club-gold" />
                            </div>
                        </AnimatedCard>
                    </Link>
                </div>

                {/* Grid de notícias */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedNews.map((article, i) => {
                        const IconComponent = categoryIcons[article.category] || Newspaper;
                        const colorClass = categoryColors[article.category] || 'bg-white/10 text-white/60';

                        return (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <AnimatedCard variant="glass" hover className="h-full flex flex-col">
                                    {/* Image/Gradient placeholder */}
                                    <div className="aspect-video bg-gradient-to-br from-club-red/20 to-club-black rounded-xl mb-4 flex items-center justify-center overflow-hidden relative group">
                                        {article.image ? (
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="text-4xl font-bold bg-gradient-to-r from-club-red to-club-gold bg-clip-text text-transparent">
                                                SCN
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        {/* Category Badge */}
                                        <Badge className={`${colorClass} border-0 w-fit mb-3`}>
                                            <IconComponent className="w-3 h-3 mr-1" />
                                            {article.category}
                                        </Badge>

                                        {/* Title */}
                                        <h2 className="text-lg font-bold text-white line-clamp-2 mb-2">
                                            {article.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-sm text-white/50 line-clamp-3 flex-1 mb-4">
                                            {article.excerpt}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 text-xs text-white/40 pt-3 border-t border-white/10">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>
                                                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    }) : ''}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                <span className="truncate">{article.author}</span>
                                            </div>
                                        </div>

                                        {/* Read More */}
                                        <Link
                                            href={`/news/${article.id}`}
                                            className="inline-flex items-center gap-2 text-club-red font-medium text-sm mt-4 hover:gap-3 transition-all"
                                        >
                                            Ler mais <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Empty state */}
                {filteredNews.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📰</div>
                        <p className="text-white/50 text-lg">Nenhuma notícia encontrada.</p>
                        <p className="text-white/30 text-sm mt-2">
                            Tente buscar por outro termo.
                        </p>
                    </div>
                )}

                {/* Ver todas */}
                {!showAll && filteredNews.length > 6 && (
                    <div className="text-center mt-12">
                        <Button
                            onClick={() => setShowAll(true)}
                            variant="outline"
                            className="gap-2"
                        >
                            Ver todas as notícias ({filteredNews.length})
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
