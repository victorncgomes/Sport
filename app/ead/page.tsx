'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Play,
    BookOpen,
    Clock,
    Award,
    CheckCircle2,
    ChevronRight,
    Search,
    Filter,
    Waves,
    Shield,
    Wrench,
    Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
    { id: 'all', label: 'Todos', icon: BookOpen },
    { id: 'tecnica', label: 'Técnica', icon: Waves },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'manutencao', label: 'Manutenção', icon: Wrench },
    { id: 'competicao', label: 'Competição', icon: Trophy },
];

const lessons = [
    {
        id: '1',
        title: 'Fundamentos da Remada',
        description: 'Aprenda os 4 estágios da remada: Catch, Drive, Finish e Recovery.',
        category: 'tecnica',
        duration: '12 min',
        xps: 25,
        thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80',
        videoUrl: '#',
        completed: true,
    },
    {
        id: '2',
        title: 'Segurança em Águas Abertas',
        description: 'Procedimentos essenciais para navegação no Rio Potengi e mar aberto.',
        category: 'seguranca',
        duration: '15 min',
        xps: 25,
        thumbnail: 'https://images.unsplash.com/photo-1544551763-70f9fb5c4e3e?auto=format&fit=crop&q=80',
        videoUrl: '#',
        completed: false,
    },
    {
        id: '3',
        title: 'Ajuste de Finas e Carrinho',
        description: 'Como configurar seu barco para máximo conforto e performance.',
        category: 'manutencao',
        duration: '10 min',
        xps: 25,
        thumbnail: 'https://images.unsplash.com/photo-1544551763-8dd44717887e?auto=format&fit=crop&q=80',
        videoUrl: '#',
        completed: false,
    },
    {
        id: '4',
        title: 'Táticas de Regata',
        description: 'Posicionamento, largada e estratégia de prova para atletas.',
        category: 'competicao',
        duration: '20 min',
        xps: 25,
        thumbnail: 'https://images.unsplash.com/photo-1544551763-b8df283d58a5?auto=format&fit=crop&q=80',
        videoUrl: '#',
        completed: false,
    },
];

export default function EADPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLessons = lessons.filter(lesson => {
        const matchesCategory = activeCategory === 'all' || lesson.category === activeCategory;
        const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="EAD | Escola de Remo"
                subtitle="Sport Club de Natal"
                description="Aprimore sua técnica e conhecimento náutico com nossas vídeo-aulas exclusivas."
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Buscar aula..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:border-club-red outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap font-bold text-xs uppercase tracking-widest ${activeCategory === cat.id
                                        ? 'bg-club-red border-club-red text-white shadow-glow-red'
                                        : 'bg-white/5 border-white/10 text-white/30 hover:border-white/20'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Lessons Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson, i) => (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <AnimatedCard variant="glass" className="p-0 overflow-hidden group h-full flex flex-col">
                                {/* Thumbnail */}
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={lesson.thumbnail}
                                        alt={lesson.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-12 h-12 rounded-full bg-club-red flex items-center justify-center shadow-glow-red">
                                            <Play className="w-6 h-6 text-white fill-white" />
                                        </div>
                                    </div>
                                    {lesson.completed && (
                                        <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 left-4">
                                        <Badge className="bg-black/60 backdrop-blur-md border-0 text-[10px] font-black uppercase">
                                            {lesson.duration}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-black text-club-gold uppercase tracking-widest">
                                            {lesson.category}
                                        </span>
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                            <Award className="w-3 h-3" />
                                            +{lesson.xps} XP
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-club-red transition-colors">
                                        {lesson.title}
                                    </h3>
                                    <p className="text-sm text-white/50 mb-6 line-clamp-2">
                                        {lesson.description}
                                    </p>
                                    <div className="mt-auto">
                                        <Button className="w-full gap-2 bg-white/5 hover:bg-white/10 text-white border-white/10 font-bold uppercase tracking-widest text-[10px] h-11">
                                            Assistir Aula
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </div>

                {filteredLessons.length === 0 && (
                    <div className="text-center py-24">
                        <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <h3 className="text-white/30 font-bold">Nenhuma aula encontrada nesta categoria.</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
