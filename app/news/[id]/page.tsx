
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Calendar,
    User,
    ChevronLeft,
    Share2,
    Clock,
    Tag,
    Trophy,
    Dumbbell,
    ChefHat,
    Heart,
    Newspaper,
    Megaphone
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { allNews } from '@/lib/data/news-data';

const categoryIcons: Record<string, any> = {
    'Competição': Trophy,
    'Técnica': Dumbbell,
    'Nutrição': ChefHat,
    'Depoimento': Heart,
    'Infraestrutura': Megaphone,
    'História': Newspaper,
    'Social': Heart,
    'Eventos': Megaphone,
    'Treinamento': Dumbbell,
    'Saúde': Heart,
};

export default function ArticlePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    // Busca a notícia pelo ID
    const article = allNews.find(n => n.id === id);

    if (!article) {
        return (
            <div className="min-h-screen bg-club-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Notícia não encontrada</h1>
                    <Link href="/news">
                        <Button>Voltar para Notícias</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const IconComponent = categoryIcons[article.category] || Newspaper;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title={article.title}
                subtitle={article.category}
                compact
            />

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="max-w-4xl mx-auto">
                    <Link href="/news" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 text-sm transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para Notícias
                    </Link>

                    <AnimatedCard variant="glass" className="p-10">
                        {/* Image (se existir) */}
                        {article.image && (
                            <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
                                <Image
                                    src={article.image}
                                    alt={article.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Article Meta */}
                        <div className="flex flex-wrap items-center gap-6 mb-10 border-b border-white/5 pb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-club-red/10 flex items-center justify-center text-club-red">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Publicado por</p>
                                    <p className="text-sm font-bold text-white">{article.author}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-club-gold/10 flex items-center justify-center text-club-gold">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Data</p>
                                    <p className="text-sm font-bold text-white">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('pt-BR') : ''}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Leitura</p>
                                    <p className="text-sm font-bold text-white">4 min</p>
                                </div>
                            </div>

                            <div className="ml-auto">
                                <Button variant="ghost" className="gap-2 text-white/40 hover:text-white text-xs uppercase font-black tracking-widest">
                                    <Share2 className="w-4 h-4" /> Compartilhar
                                </Button>
                            </div>
                        </div>

                        {/* Article Body */}
                        <div className="prose prose-invert max-w-none">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge className="bg-club-red border-0 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1">
                                    <IconComponent className="w-3 h-3 mr-2" />
                                    {article.category}
                                </Badge>
                            </div>

                            <p className="text-xl text-white/80 leading-relaxed font-medium mb-8 italic border-l-4 border-club-red pl-6">
                                {article.excerpt || ''}
                            </p>

                            <div className="text-white/70 leading-relaxed space-y-6 text-lg">
                                {(article.content || '').split('\n\n').map((paragraph, i) => (
                                    <p key={i}>{paragraph.trim()}</p>
                                ))}
                            </div>

                            {/* Galeria de Fotos */}
                            {article.gallery && article.gallery.length > 0 && (
                                <div className="mt-12 mb-8">
                                    <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-club-gold pl-4">
                                        Galeria de Fotos
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {article.gallery.map((img: string, idx: number) => (
                                            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group">
                                                <Image
                                                    src={img}
                                                    alt={`Galeria ${idx + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Tags */}
                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-2 text-white/30">
                            <Tag className="w-4 h-4 mr-2" />
                            {['Remo', article.category, 'Sport Club de Natal'].map(tag => (
                                <span key={tag} className="text-xs hover:text-club-red cursor-pointer transition-colors">#{tag}</span>
                            ))}
                        </div>
                    </AnimatedCard>

                    {/* Related Articles Suggestion */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/news" className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-club-gold/50 transition-all">
                            <p className="text-[10px] font-black text-club-gold uppercase tracking-[0.2em] mb-4">Ver todas</p>
                            <h4 className="text-white font-bold opacity-60 hover:opacity-100 transition-opacity">Conheça mais notícias do Sport Club de Natal</h4>
                        </Link>
                        <Link href="/" className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between text-right hover:border-club-red/50 transition-all">
                            <p className="text-[10px] font-black text-club-red uppercase tracking-[0.2em] mb-4">Início</p>
                            <h4 className="text-white font-bold opacity-60 hover:opacity-100 transition-opacity">Voltar para a página principal</h4>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
