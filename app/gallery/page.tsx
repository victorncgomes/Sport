'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { galleryImages, GalleryCategory, GalleryImage, GalleryComment } from '@/lib/data/gallery-images';
import { Camera, Filter, Calendar, Info, MapPin, Search, Trophy, Target, Heart, TrendingUp, TrendingDown, Minus, Medal, Flame, MessageCircle, Share2, Send, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocialRanking } from '@/lib/actions/ranking';
import { performanceRanking } from '@/lib/data/club-assets';
import { Button } from '@/components/ui/button';

export default function GalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'all'>('all');
    const [rankingUsers, setRankingUsers] = useState<any[]>([]);
    const [activeRankingTab, setActiveRankingTab] = useState<'performance' | 'attendance' | 'social'>('performance');
    const [rankingLoading, setRankingLoading] = useState(true);

    // Estados para funcionalidade social
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
    const [newComment, setNewComment] = useState('');
    const [localComments, setLocalComments] = useState<Record<string, GalleryComment[]>>({});

    const filteredImages = selectedCategory === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === selectedCategory);

    useEffect(() => {
        const fetchRanking = async () => {
            const data = await getSocialRanking();
            setRankingUsers(data);
            setRankingLoading(false);
        };
        fetchRanking();

        // Inicializar likes e comentários locais
        const initialComments: Record<string, GalleryComment[]> = {};
        galleryImages.forEach(img => {
            initialComments[img.id] = img.comments;
        });
        setLocalComments(initialComments);
    }, []);

    const displayRankingUsers = rankingUsers.length > 0 ? rankingUsers : performanceRanking;

    const categories: { id: GalleryCategory | 'all', label: string }[] = [
        { id: 'all', label: 'Ver Tudo' },
        { id: 'historico', label: 'Histórico' },
        { id: 'treinos', label: 'Treinos' },
        { id: 'social', label: 'Compromisso Social' },
        { id: 'paisagens', label: 'Paisagens do Clube' },
        { id: 'eventos', label: 'Eventos' },
    ];

    const handleLike = (imageId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setLikedImages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(imageId)) {
                newSet.delete(imageId);
            } else {
                newSet.add(imageId);
            }
            return newSet;
        });
    };

    const handleAddComment = (imageId: string) => {
        if (!newComment.trim()) return;

        const comment: GalleryComment = {
            id: `new-${Date.now()}`,
            userId: 'current-user',
            userName: 'Você',
            text: newComment.trim(),
            createdAt: new Date().toISOString(),
        };

        setLocalComments(prev => ({
            ...prev,
            [imageId]: [comment, ...(prev[imageId] || [])],
        }));
        setNewComment('');
    };

    const getLikeCount = (img: GalleryImage) => {
        const baseLikes = img.likes;
        const isLiked = likedImages.has(img.id);
        const wasAlreadyLiked = img.likedBy.includes('current-user');

        if (isLiked && !wasAlreadyLiked) return baseLikes + 1;
        if (!isLiked && wasAlreadyLiked) return baseLikes - 1;
        return baseLikes;
    };

    const getCommentCount = (img: GalleryImage) => {
        return localComments[img.id]?.length || img.comments.length;
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `${diffDays} dias atrás`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    const navigateImage = (direction: 'prev' | 'next') => {
        if (!selectedImage) return;
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex < 0) newIndex = filteredImages.length - 1;
        if (newIndex >= filteredImages.length) newIndex = 0;
        setSelectedImage(filteredImages[newIndex]);
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Galeria de Memórias"
                subtitle="Acervo Visual SCN"
                description="Explore os registros fotográficos que contam a nossa história, de 1915 aos dias atuais."
                compact
            />

            <div className="container mx-auto px-4 py-12">
                {/* Visual Header & Filters */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-club-red/20 text-club-red border border-club-red/20 shadow-glow-red">
                            <Camera className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-club-red uppercase tracking-tighter">Momentos e Paisagens</h2>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Curta e comente as fotos</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
                        <Filter className="w-4 h-4 text-white/50 mr-2 shrink-0" />
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                                    selectedCategory === cat.id
                                        ? "bg-club-red border-club-red text-white shadow-glow-red"
                                        : "bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid layout with Animation */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredImages.map((img) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AnimatedCard
                                    variant="glass"
                                    className="p-0 group relative overflow-hidden h-full border-white/5 hover:border-club-red/30 transition-all cursor-pointer"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <div className="aspect-[4/5] relative">
                                        <img
                                            src={img.imageUrl}
                                            alt={img.title}
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-club-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                        {/* Social Actions Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded bg-club-red text-white text-[8px] font-black uppercase tracking-widest">
                                                    {categories.find(c => c.id === img.category)?.label}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-tight mb-3">
                                                {img.title}
                                            </h3>

                                            {/* Like and Comment Buttons */}
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={(e) => handleLike(img.id, e)}
                                                    className="flex items-center gap-1.5 group/like"
                                                >
                                                    <Heart
                                                        className={cn(
                                                            "w-5 h-5 transition-all",
                                                            likedImages.has(img.id)
                                                                ? "fill-club-red text-club-red scale-110"
                                                                : "text-white/70 group-hover/like:text-club-red"
                                                        )}
                                                    />
                                                    <span className="text-sm font-bold text-white/70">
                                                        {getLikeCount(img)}
                                                    </span>
                                                </button>
                                                <button className="flex items-center gap-1.5 group/comment">
                                                    <MessageCircle className="w-5 h-5 text-white/70 group-hover/comment:text-club-gold transition-colors" />
                                                    <span className="text-sm font-bold text-white/70">
                                                        {getCommentCount(img)}
                                                    </span>
                                                </button>
                                                <button className="ml-auto">
                                                    <Share2 className="w-4 h-4 text-white/50 hover:text-white transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredImages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 text-center"
                    >
                        <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <p className="text-white/30 uppercase font-black tracking-widest text-xs">Nenhum registro encontrado nesta categoria.</p>
                    </motion.div>
                )}

                {/* Modal de Imagem com Comentários */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => navigateImage('prev')}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-club-red/50 rounded-full transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    onClick={() => navigateImage('next')}
                                    className="absolute right-2 md:right-[350px] top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-club-red/50 rounded-full transition-all"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-club-red/50 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>

                                {/* Image Section */}
                                <div className="flex-1 flex items-center justify-center bg-black p-4 min-h-[300px]">
                                    <img
                                        src={selectedImage.imageUrl}
                                        alt={selectedImage.title}
                                        className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                    />
                                </div>

                                {/* Comments Section */}
                                <div className="w-full md:w-[350px] flex flex-col bg-gray-900/50 border-l border-white/10">
                                    {/* Header */}
                                    <div className="p-4 border-b border-white/10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded bg-club-red text-white text-[8px] font-black uppercase tracking-widest">
                                                {categories.find(c => c.id === selectedImage.category)?.label}
                                            </span>
                                            <span className="text-white/30 text-xs">
                                                {formatTimeAgo(selectedImage.date)}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">
                                            {selectedImage.title}
                                        </h3>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            {selectedImage.description}
                                        </p>
                                    </div>

                                    {/* Like/Comment Stats */}
                                    <div className="flex items-center gap-6 px-4 py-3 border-b border-white/10">
                                        <button
                                            onClick={() => handleLike(selectedImage.id)}
                                            className="flex items-center gap-2 group/like"
                                        >
                                            <Heart
                                                className={cn(
                                                    "w-6 h-6 transition-all",
                                                    likedImages.has(selectedImage.id)
                                                        ? "fill-club-red text-club-red"
                                                        : "text-white/70 group-hover/like:text-club-red"
                                                )}
                                            />
                                            <span className="font-bold text-white">
                                                {getLikeCount(selectedImage)}
                                            </span>
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-6 h-6 text-white/70" />
                                            <span className="font-bold text-white">
                                                {getCommentCount(selectedImage)}
                                            </span>
                                        </div>
                                        <button className="ml-auto p-2 hover:bg-white/10 rounded-full transition-colors">
                                            <Share2 className="w-5 h-5 text-white/50" />
                                        </button>
                                    </div>

                                    {/* Comments List */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px] md:max-h-none">
                                        {(localComments[selectedImage.id] || selectedImage.comments).map((comment) => (
                                            <div key={comment.id} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-club-red to-club-gold flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="font-bold text-white text-sm">
                                                            {comment.userName}
                                                        </span>
                                                        <span className="text-white/30 text-[10px]">
                                                            {formatTimeAgo(comment.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-white/70 text-sm mt-0.5">
                                                        {comment.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Comment */}
                                    <div className="p-4 border-t border-white/10">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(selectedImage.id)}
                                                placeholder="Adicione um comentário..."
                                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-club-red/50"
                                            />
                                            <button
                                                onClick={() => handleAddComment(selectedImage.id)}
                                                disabled={!newComment.trim()}
                                                className="p-2 bg-club-red hover:bg-club-red-dark disabled:bg-white/10 disabled:text-white/30 rounded-full transition-all"
                                            >
                                                <Send className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hall da Fama Section */}
                <div className="mt-24 pt-24 border-t border-white/10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-3 rounded-2xl bg-club-gold/20 text-club-gold border border-club-gold/20 shadow-glow-gold">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Hall da Fama</h2>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Melhores Performance & Engajamento</p>
                        </div>
                    </div>

                    {/* Top 3 Podium */}
                    <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-16">
                        {/* 2nd Place */}
                        <div className="order-2 md:order-1 flex-1 max-w-[280px] w-full">
                            <AnimatedCard variant="glass" className="p-6 text-center transform scale-95 origin-bottom border-silver-500/20">
                                <div className="w-16 h-16 rounded-full bg-slate-700/50 mx-auto mb-4 border-2 border-slate-400 flex items-center justify-center">
                                    <span className="text-xl font-black text-slate-300">2</span>
                                </div>
                                <h4 className="text-white font-black text-lg truncate mb-1">{displayRankingUsers[1]?.name || 'N/A'}</h4>
                                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-4">Elite • {displayRankingUsers[1]?.totalXP || 0} XP</p>
                                <div className="h-1 bg-slate-400/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400 w-[85%]" />
                                </div>
                            </AnimatedCard>
                        </div>

                        {/* 1st Place */}
                        <div className="order-1 md:order-2 flex-1 max-w-[320px] w-full">
                            <AnimatedCard variant="metal" className="p-8 text-center border-club-gold/30 shadow-glow-gold/10">
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-club-gold rounded-full blur-xl opacity-20 animate-pulse" />
                                    <div className="relative w-full h-full rounded-full bg-club-gold/20 border-4 border-club-gold flex items-center justify-center">
                                        <Trophy className="w-12 h-12 text-club-gold" />
                                    </div>
                                    <div className="absolute -bottom-2 right-0 bg-club-gold text-black w-8 h-8 rounded-full flex items-center justify-center font-black">
                                        1
                                    </div>
                                </div>
                                <h4 className="text-white font-black text-2xl truncate mb-1 uppercase tracking-tighter">{displayRankingUsers[0]?.name || 'N/A'}</h4>
                                <p className="text-club-gold text-[10px] uppercase font-black tracking-widest mb-6">Master • {displayRankingUsers[0]?.totalXP || 0} XP</p>
                                <div className="flex justify-center gap-8 py-4 border-t border-white/5">
                                    <div className="text-center">
                                        <p className="text-white font-black">{displayRankingUsers[0]?.meters || 0}m</p>
                                        <p className="text-white/30 text-[8px] uppercase font-bold">Mts Remados</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-black">{displayRankingUsers[0]?.attendance || 0}%</p>
                                        <p className="text-white/30 text-[8px] uppercase font-bold">Presença</p>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </div>

                        {/* 3rd Place */}
                        <div className="order-3 flex-1 max-w-[280px] w-full">
                            <AnimatedCard variant="glass" className="p-6 text-center transform scale-90 origin-bottom border-amber-800/20">
                                <div className="w-16 h-16 rounded-full bg-amber-900/30 mx-auto mb-4 border-2 border-amber-700/50 flex items-center justify-center">
                                    <span className="text-xl font-black text-amber-600">3</span>
                                </div>
                                <h4 className="text-white font-black text-lg truncate mb-1">{displayRankingUsers[2]?.name || 'N/A'}</h4>
                                <p className="text-amber-700 text-[10px] uppercase font-bold tracking-widest mb-4">Elite • {displayRankingUsers[2]?.totalXP || 0} XP</p>
                                <div className="h-1 bg-amber-900/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-700 w-[70%]" />
                                </div>
                            </AnimatedCard>
                        </div>
                    </div>

                    {/* Ranking List */}
                    <div className="space-y-4">
                        {displayRankingUsers.map((entry: any, idx: number) => (
                            <AnimatedCard key={entry.id} variant="glass" className="py-4 px-6 md:px-8 group hover:border-white/20">
                                <div className="flex items-center gap-6">
                                    <div className="w-8 text-center text-white/20 font-black text-xl italic group-hover:text-club-red transition-colors">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </div>
                                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center font-black text-white/50">
                                                {entry.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold group-hover:text-club-red transition-colors">{entry.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-club-gold bg-club-gold/10 px-1.5 py-0.5 rounded italic">
                                                        {entry.category || 'Base'}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-white/30 truncate max-w-[120px]">
                                                        {(entry.meters || 0).toLocaleString()}m remados
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12 md:gap-20">
                                            <div className="hidden lg:block text-center">
                                                <p className="text-white font-black text-lg">{entry.socialPoints}</p>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Heart className="w-3 h-3 text-club-red fill-club-red" />
                                                    <p className="text-white/30 text-[8px] uppercase font-bold">Social</p>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="flex items-center justify-end md:justify-center gap-2">
                                                    <p className="text-white font-black text-lg">{entry.totalXP}</p>
                                                    {entry.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> :
                                                        entry.trend === 'down' ? <TrendingDown className="w-4 h-4 text-club-red" /> :
                                                            <Minus className="w-4 h-4 text-white/20" />}
                                                </div>
                                                <div className="flex items-center justify-end md:justify-center gap-1">
                                                    <Flame className="w-3 h-3 text-club-gold" />
                                                    <p className="text-white/30 text-[8px] uppercase font-bold">XP TOTAL</p>
                                                </div>
                                            </div>
                                            <div className="hidden sm:block">
                                                <Medal className={cn(
                                                    "w-6 h-6",
                                                    idx === 0 ? "text-club-gold" :
                                                        idx === 1 ? "text-slate-400" :
                                                            idx === 2 ? "text-amber-700" : "text-white/5"
                                                )} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="outline" className="text-xs font-black uppercase tracking-widest border-white/10 hover:bg-white/5 gap-2 px-10 h-14">
                            Ver Ranking Histórico Completo
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
