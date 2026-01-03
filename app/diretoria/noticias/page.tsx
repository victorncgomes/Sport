'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Newspaper,
    Plus,
    Search,
    Calendar,
    Eye,
    Edit,
    Trash2,
    Image,
    Hash,
    Send,
    Loader2,
    CheckCircle,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Notícias simuladas
const mockNews = [
    {
        id: '1',
        title: 'Regata de Verão 2025 - Inscrições Abertas',
        excerpt: 'A tradicional Regata de Verão do Sport Club de Natal já tem data confirmada. Inscreva-se!',
        status: 'PUBLISHED',
        publishedAt: '2025-01-28T14:00:00',
        author: 'Carlos Melo',
        views: 234,
        hashtags: ['#regata', '#verao2025', '#scn']
    },
    {
        id: '2',
        title: 'Resultados do Campeonato Estadual RN',
        excerpt: 'Atletas do SCN conquistam 5 medalhas no Campeonato Estadual de Remo.',
        status: 'PUBLISHED',
        publishedAt: '2025-01-25T10:30:00',
        author: 'Fernanda Santos',
        views: 567,
        hashtags: ['#campeonato', '#remo', '#medalhas']
    },
    {
        id: '3',
        title: 'Novo Programa de Treinamento Master',
        excerpt: 'Coach Roberto apresenta o novo programa específico para atletas acima de 35 anos.',
        status: 'DRAFT',
        publishedAt: null,
        author: 'Roberto Ferreira',
        views: 0,
        hashtags: ['#master', '#treinamento']
    },
    {
        id: '4',
        title: 'Manutenção dos Barcos - Janeiro 2025',
        excerpt: 'Confira o cronograma de manutenção preventiva dos barcos do clube.',
        status: 'PUBLISHED',
        publishedAt: '2025-01-20T09:00:00',
        author: 'Lucas Oliveira',
        views: 189,
        hashtags: ['#manutencao', '#barcos']
    },
];

const statusConfig = {
    PUBLISHED: { label: 'Publicada', color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle },
    DRAFT: { label: 'Rascunho', color: 'bg-amber-500/20 text-amber-400', icon: Clock },
};

export default function NoticiasGerenciamentoPage() {
    const [news, setNews] = useState(mockNews);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newArticle, setNewArticle] = useState({
        title: '',
        excerpt: '',
        content: '',
        hashtags: '',
        imageUrl: '',
        imageMode: 'upload' as 'upload' | 'ai', // 'upload' = manual, 'ai' = gerar com IA
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [generatingImage, setGeneratingImage] = useState(false);

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: news.length,
        published: news.filter(n => n.status === 'PUBLISHED').length,
        drafts: news.filter(n => n.status === 'DRAFT').length,
        totalViews: news.reduce((acc, n) => acc + n.views, 0)
    };

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simular publicação
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newNews = {
            id: String(news.length + 1),
            title: newArticle.title,
            excerpt: newArticle.excerpt,
            status: 'PUBLISHED' as const,
            publishedAt: new Date().toISOString(),
            author: 'Você',
            views: 0,
            hashtags: newArticle.hashtags.split(',').map(t => t.trim()).filter(t => t)
        };

        setNews([newNews, ...news]);
        setIsModalOpen(false);
        setNewArticle({ title: '', excerpt: '', content: '', hashtags: '', imageUrl: '', imageMode: 'upload' });
        setImagePreview(null);
        setLoading(false);
    };

    const handleDelete = (id: string) => {
        setNews(news.filter(n => n.id !== id));
    };

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/diretoria" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Diretoria
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Newspaper className="w-8 h-8 text-orange-400" />
                                Gerenciar Notícias
                            </h1>
                            <p className="text-white/50">Publique e edite notícias do clube</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nova Notícia
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Newspaper className="w-6 h-6 text-white/40 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-xs text-white/40">Total</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-emerald-500/20">
                        <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-emerald-400">{stats.published}</div>
                        <div className="text-xs text-white/40">Publicadas</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center border-amber-500/20">
                        <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-amber-400">{stats.drafts}</div>
                        <div className="text-xs text-white/40">Rascunhos</div>
                    </AnimatedCard>
                    <AnimatedCard variant="glass" className="p-4 text-center">
                        <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-400">{stats.totalViews}</div>
                        <div className="text-xs text-white/40">Visualizações</div>
                    </AnimatedCard>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Buscar notícias..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-club-red/50"
                    />
                </div>

                {/* News List */}
                <div className="space-y-3">
                    {filteredNews.map((article, i) => {
                        const config = statusConfig[article.status as keyof typeof statusConfig];
                        const StatusIcon = config.icon;

                        return (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                            >
                                <AnimatedCard variant="glass" className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-white truncate">{article.title}</h3>
                                                <Badge className={`${config.color} border-0 text-xs shrink-0`}>
                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                    {config.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-white/50 line-clamp-1 mb-2">{article.excerpt}</p>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {article.publishedAt
                                                        ? new Date(article.publishedAt).toLocaleDateString('pt-BR')
                                                        : 'Não publicada'}
                                                </span>
                                                <span>por {article.author}</span>
                                                {article.views > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3" />
                                                        {article.views}
                                                    </span>
                                                )}
                                                {article.hashtags.length > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Hash className="w-3 h-3" />
                                                        {article.hashtags.length} tags
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button size="sm" variant="ghost" className="text-white/40 hover:text-white">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-400/60 hover:text-red-400"
                                                onClick={() => handleDelete(article.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        );
                    })}

                    {filteredNews.length === 0 && (
                        <div className="text-center py-12 text-white/30">
                            <Newspaper className="w-12 h-12 mx-auto mb-4" />
                            <p>Nenhuma notícia encontrada</p>
                        </div>
                    )}
                </div>

                {/* New Article Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 relative z-10"
                            >
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Newspaper className="w-5 h-5 text-orange-400" />
                                    Nova Notícia
                                </h2>
                                <form onSubmit={handlePublish} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Título</label>
                                        <input
                                            required
                                            type="text"
                                            value={newArticle.title}
                                            onChange={e => setNewArticle({ ...newArticle, title: e.target.value })}
                                            placeholder="Título da notícia..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Resumo</label>
                                        <textarea
                                            required
                                            value={newArticle.excerpt}
                                            onChange={e => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                                            placeholder="Um breve resumo para a listagem..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-20 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">Conteúdo</label>
                                        <textarea
                                            required
                                            value={newArticle.content}
                                            onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}
                                            placeholder="Conteúdo completo da notícia..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white h-32 resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1">
                                            <Hash className="w-3 h-3 inline mr-1" />
                                            Hashtags (separadas por vírgula)
                                        </label>
                                        <input
                                            type="text"
                                            value={newArticle.hashtags}
                                            onChange={e => setNewArticle({ ...newArticle, hashtags: e.target.value })}
                                            placeholder="#regata, #scn, #remo"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    {/* Image Upload Section */}
                                    <div className="space-y-3">
                                        <label className="block text-sm text-white/60 mb-1">
                                            <Image className="w-3 h-3 inline mr-1" />
                                            Imagem da Notícia
                                        </label>

                                        {/* Image Mode Tabs */}
                                        <div className="flex gap-2 mb-3">
                                            <button
                                                type="button"
                                                onClick={() => setNewArticle({ ...newArticle, imageMode: 'upload' })}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${newArticle.imageMode === 'upload'
                                                        ? 'bg-club-red text-white'
                                                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                                                    }`}
                                            >
                                                📤 Upload Manual
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewArticle({ ...newArticle, imageMode: 'ai' })}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${newArticle.imageMode === 'ai'
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                                                    }`}
                                            >
                                                🤖 Gerar com IA
                                            </button>
                                        </div>

                                        {/* Upload Mode */}
                                        {newArticle.imageMode === 'upload' && (
                                            <div>
                                                <input
                                                    type="url"
                                                    value={newArticle.imageUrl}
                                                    onChange={e => {
                                                        setNewArticle({ ...newArticle, imageUrl: e.target.value });
                                                        setImagePreview(e.target.value);
                                                    }}
                                                    placeholder="Cole a URL da imagem ou faça upload..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                                                />
                                                <p className="text-[11px] text-white/40 mt-1">
                                                    Formatos: JPG, PNG, WebP. Tamanho recomendado: 1200x630px
                                                </p>
                                            </div>
                                        )}

                                        {/* AI Mode */}
                                        {newArticle.imageMode === 'ai' && (
                                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                                <p className="text-sm text-purple-300 mb-2">
                                                    A imagem será gerada automaticamente com base no título e conteúdo.
                                                </p>
                                                <p className="text-[11px] text-purple-300/60">
                                                    Cores: vermelho e preto do clube | Estilo: esportivo brasileiro
                                                </p>
                                            </div>
                                        )}

                                        {/* Image Preview */}
                                        {imagePreview && newArticle.imageMode === 'upload' && (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-32 object-cover rounded-lg border border-white/10"
                                                    onError={() => setImagePreview(null)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setNewArticle({ ...newArticle, imageUrl: '' });
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-red-500/70"
                                                >
                                                    <Eye className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-club-red hover:bg-club-red/90 gap-2"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Publicar
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
