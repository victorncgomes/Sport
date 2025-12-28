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

// Dados de notícias com conteúdo real sobre remo
const allNews = [
    {
        id: '110-anos',
        title: 'O Sport Club de Natal dá início às comemorações pelos 110 anos de história',
        excerpt: 'O Sport Club de Natal iniciou hoje as atividades em celebração aos seus 110 anos de existência. A joia rara do nosso clube, o barco “Oito Com”, desfilou pelo Rio Potengi.',
        content: `O Sport Club de Natal iniciou hoje as atividades em celebração aos seus 110 anos de existência.

A joia rara do nosso clube — o barco “Oito Com”, de fabricação italiana — desfilou de forma imponente pelas águas do Rio Potengi, encantando a todos que acompanharam esse momento histórico.

O “Oito Com” chegou ao Sport Club graças ao empenho de Geraldo Belo Moreno, considerado um dos maiores nomes da história do remo potiguar, em parceria com Rodney Bernardes, então presidente da Confederação Brasileira de Remo (CBR).

O barco foi batizado com o nome de Marcos Vinicio da Costa Moreno, filho de Geraldo e ex-remador do clube. Após um cuidadoso processo de revitalização, o barco voltou a navegar no último dia 4 de outubro, em um lançamento experimental que marcou seu retorno triunfante às águas do Potengi.

Acompanhe nossas redes sociais para saber mais sobre as próximas datas de comemoração dos 110 anos do Gigante do Potengi!`,
        image: '/rowers_sunset.jpg',
        gallery: [],
        category: 'História',
        author: 'Assessoria SCN',
        publishedAt: '2025-12-23',
    },
    {
        id: 'rio-de-esperanca',
        title: 'Sport Club de Natal convida para o lançamento do Projeto Rio de Esperança',
        excerpt: 'Projeto social desenvolvido no Rio Potengi atenderá 56 crianças e adolescentes com aulas de Remo Olímpico no contraturno escolar.',
        content: `É com imensa satisfação que o Sport Club de Natal convida toda a comunidade para o evento de lançamento do Projeto Rio de Esperança.

Este é um projeto que tem como CONCEDENTE o Governo do RN (@governodorn) através da Secretaria de Esporte e Lazer (@esportelazerrn) e como empresa PATROCINADORA a Potigás (@potigasrn).

Desenvolvido às margens do Rio Potengi, o Projeto Rio de Esperança atenderá 56 crianças e adolescentes, de ambos os sexos, prioritariamente em situação de vulnerabilidade social.

O projeto oferecerá o desenvolvimento do Remo Olímpico nos turnos matutinos e vespertinos, funcionando no contraturno escolar dos(as) beneficiários(as), promovendo inclusão social através do esporte.`,
        image: '/news_rio_esperanca.png',
        category: 'Social',
        author: 'Assessoria SCN',
        publishedAt: '2025-12-23',
    },
    {
        id: 'cbi-remo-2025',
        title: 'Sport Club de Natal encerra participação histórica no CBI de Remo',
        excerpt: 'Nossos atletas deram o seu melhor no Rio de Janeiro, mostrando garra, disciplina e verdadeiro espírito de equipe.',
        content: `Encerramos mais uma jornada incrível! 🔴⚫️

O Sport Club de Natal finaliza sua participação no CBI de Remo – Barcos Longos, no Rio de Janeiro, com o coração cheio de orgulho! ⚫️🔴

Nossos atletas deram o seu melhor, mostraram garra, disciplina e o verdadeiro espírito de equipe. Voltamos com a certeza de que estamos no caminho certo — formando não apenas campeões no esporte, mas também grandes pessoas para a vida.

O Sport Club de Natal está mais vivo do que nunca!

⚫️🔴 O GIGANTE DO POTENGI! 🔴⚫️`,
        image: '/news_cbi_remo.png',
        category: 'Competição',
        author: 'Diretoria de Remo',
        publishedAt: '2025-12-22',
    },
    {
        id: 'confraternizacao-2024',
        title: 'Família Sport Club de Natal unida em frente à sede histórica',
        excerpt: 'Atletas, sócios e diretoria reunidos para celebrar mais um ano de conquistas e superação do Gigante do Potengi.',
        content: `O Sport Club de Natal é muito mais que um clube, é uma família!

Reunimos nossa comunidade em frente à nossa sede histórica na Rua Chile para celebrar as conquistas e reafirmar nosso compromisso com o futuro do remo potiguar.

Com a presença de atletas de todas as gerações, desde a escolinha até a equipe master, celebramos a união que faz deste clube uma referência no esporte.`,
        image: '/news_confraternizacao.png',
        category: 'Eventos',
        author: 'Diretoria Social',
        publishedAt: '2025-12-21',
    },
    {
        id: '1',
        title: 'Equipe de Remo conquista 5 medalhas no Campeonato Nordestino',
        excerpt: 'Atletas do Sport Club de Natal brilham na competição realizada em Recife, trazendo para casa 3 ouros e 2 pratas.',
        content: 'Nossa equipe de remo demonstrou excelência...',
        image: '/news_medals.png',
        category: 'Competição',
        author: 'Diretoria Técnica',
        publishedAt: '2025-01-15',
    },
    {
        id: '2',
        title: 'Técnicas de Remada: Como melhorar sua performance no single skiff',
        excerpt: 'Dicas essenciais para aprimorar sua técnica de remada, desde a pegada até a recuperação.',
        content: 'A técnica correta de remada...',
        image: '/news_technique.png',
        gallery: [],
        category: 'Técnica',
        author: 'Coach Fernanda Costa',
        publishedAt: '2025-01-12',
    },
    {
        id: '3',
        title: 'Nutrição para Remadores: O que comer antes e depois dos treinos',
        excerpt: 'Guia completo de alimentação para atletas de remo, com foco em performance e recuperação muscular.',
        content: 'A nutrição adequada é fundamental...',
        image: null,
        category: 'Nutrição',
        author: 'Dra. Ana Nutricionista',
        publishedAt: '2025-01-10',
    },
    {
        id: '4',
        title: 'Depoimento: "O remo mudou minha vida" - João Silva, atleta master',
        excerpt: 'Conheça a história de superação de João, que aos 45 anos descobriu no remo uma nova paixão.',
        content: 'Quando comecei a remar aos 45 anos...',
        image: null,
        category: 'Depoimento',
        author: 'Equipe SCN',
        publishedAt: '2025-01-08',
    },
    {
        id: '5',
        title: 'Nova frota de barcos double chegou ao clube',
        excerpt: 'Investimento em equipamentos de última geração para treinos e competições.',
        content: 'É com grande satisfação que anunciamos...',
        image: null,
        category: 'Infraestrutura',
        author: 'Diretoria',
        publishedAt: '2025-01-05',
    },
    {
        id: '6',
        title: 'Calendário de Competições 2025: Prepare-se para os desafios',
        excerpt: 'Confira as principais competições de remo previstas para este ano e comece a se preparar.',
        content: 'O ano de 2025 promete ser intenso...',
        image: null,
        category: 'Competição',
        author: 'Diretoria Técnica',
        publishedAt: '2025-01-03',
    },
    {
        id: '7',
        title: 'Treinamento de Força para Remadores: Exercícios essenciais',
        excerpt: 'Um programa de fortalecimento complementar para melhorar sua potência nas remadas.',
        content: 'O treinamento de força é crucial...',
        image: null,
        category: 'Treinamento',
        author: 'Coach Marcos Oliveira',
        publishedAt: '2024-12-28',
    },
    {
        id: '8',
        title: 'A história do remo olímpico no Brasil',
        excerpt: 'Da primeira medalha às conquistas recentes, conheça a trajetória do remo brasileiro.',
        content: 'O remo brasileiro tem uma história rica...',
        image: null,
        category: 'História',
        author: 'Equipe SCN',
        publishedAt: '2024-12-25',
    },
    {
        id: '9',
        title: 'Alongamento e prevenção de lesões para remadores',
        excerpt: 'Rotina de alongamentos essenciais para evitar lesões comuns na prática do remo.',
        content: 'A prevenção é o melhor remédio...',
        image: null,
        category: 'Saúde',
        author: 'Fisioterapeuta Roberto',
        publishedAt: '2024-12-20',
    },
    {
        id: '10',
        title: 'Confraternização de final de ano reúne família do remo',
        excerpt: 'Mais de 150 pessoas participaram do evento que celebrou as conquistas de 2024.',
        content: 'A tradicional confraternização...',
        image: null,
        category: 'Eventos',
        author: 'Diretoria Social',
        publishedAt: '2024-12-18',
    },
];

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
};

export default function NewsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAll, setShowAll] = useState(false);

    const filteredNews = allNews.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
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
                                                    {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    })}
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
