'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    HelpCircle, BookOpen, Map, FileText, Search, ChevronDown, ChevronUp,
    Home, Newspaper, ShoppingBag, Image, Phone, Dumbbell, Heart, Briefcase,
    User, Anchor, Calendar, Trophy, Users, Waves, Sun, Moon, Clock,
    Camera, MessageCircle, Star, CheckCircle, AlertTriangle, Info,
    Settings, Database, Code, Layers, GitBranch, Shield, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENTAÇÃO DE AJUDA - SPORT CLUB DE NATAL
// Versão: 0.4.8
// Última atualização: 2026-01-02
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AVISO PARA A IA/AGENTE:
 * Esta página contém toda a documentação da aplicação.
 * Quando estiver perdido ou precisar entender a arquitetura, consulte esta página.
 * 
 * ESTRUTURA DE PASTAS:
 * - /app - Páginas Next.js (App Router)
 * - /components - Componentes React reutilizáveis
 * - /lib - Utilitários, actions, dados e configurações
 * - /prisma - Schema do banco de dados SQLite
 * - /public - Assets estáticos (imagens, ícones)
 * - /docs - Changelogs e documentação técnica
 * 
 * ROLES DO SISTEMA:
 * - VISITOR: Visitante não logado
 * - SOCIO: Sócio regular
 * - ATLETA: Atleta competidor
 * - TREINADOR: Coach/Treinador
 * - DIRETORIA: Membro da diretoria
 * - ADMIN: Administrador do sistema
 */

// Versão da documentação - deve ser atualizada quando houver mudanças
export const HELP_DOC_VERSION = '0.4.8';
export const HELP_LAST_UPDATE = '2026-01-02';

// Registro de funcionalidades implementadas (para sync checker)
export const IMPLEMENTED_FEATURES = [
    { id: 'home', name: 'Página Inicial', version: '0.1.0', path: '/', status: 'complete' },
    { id: 'news', name: 'Notícias', version: '0.2.0', path: '/news', status: 'complete' },
    { id: 'gallery', name: 'Galeria', version: '0.3.0', path: '/gallery', status: 'complete' },
    { id: 'store', name: 'Loja/Cantina', version: '0.3.5', path: '/store', status: 'complete' },
    { id: 'about', name: 'Sobre/Contato', version: '0.2.0', path: '/about', status: 'complete' },
    { id: 'trainings', name: 'Treinos (Dashboard)', version: '0.4.0', path: '/trainings', status: 'complete' },
    { id: 'training-live', name: 'Treino ao Vivo', version: '0.4.5', path: '/training/live', status: 'partial' },
    { id: 'garage', name: 'Garagem', version: '0.4.0', path: '/garage', status: 'complete' },
    { id: 'tides', name: 'Tábua de Marés', version: '0.4.2', path: '/tides', status: 'complete' },
    { id: 'voluntariado', name: 'Voluntariado (Sócio)', version: '0.4.0', path: '/voluntariado', status: 'complete' },
    { id: 'coach-painel', name: 'Painel Coach', version: '0.4.5', path: '/coach/painel', status: 'complete' },
    { id: 'coach-programs', name: 'Programas de Treino', version: '0.4.5', path: '/coach/programs', status: 'partial' },
    { id: 'diretoria', name: 'Painel Diretoria', version: '0.4.0', path: '/diretoria', status: 'complete' },
    { id: 'diretoria-noticias', name: 'Gerenciar Notícias', version: '0.4.8', path: '/diretoria/noticias', status: 'partial' },
    { id: 'diretoria-voluntariado', name: 'Controle Voluntariado', version: '0.4.0', path: '/diretoria/voluntariado', status: 'complete' },
    { id: 'profile', name: 'Perfil do Usuário', version: '0.3.0', path: '/profile/panel', status: 'complete' },
    { id: 'login', name: 'Login', version: '0.1.0', path: '/member/login', status: 'complete' },
    { id: 'ajuda', name: 'Página de Ajuda', version: '0.4.8', path: '/ajuda', status: 'complete' },
];

// FAQ Items
const FAQ_ITEMS = [
    {
        category: 'Geral',
        items: [
            {
                question: 'Como faço para me tornar sócio do clube?',
                answer: 'Entre em contato pelo WhatsApp (84) 99999-9999 ou visite a secretaria do clube. Você precisará preencher uma ficha de cadastro, apresentar documentos e pagar a taxa de inscrição.'
            },
            {
                question: 'Qual o horário de funcionamento do clube?',
                answer: 'Segunda a Sábado: 5h às 18h. Domingo: Fechado (exceto em eventos). Os treinos de remo acontecem principalmente no período da manhã (5h45-7h) e fim de tarde (16h15-17h30).'
            },
            {
                question: 'Como acessar meu perfil no aplicativo?',
                answer: 'Clique no ícone "Perfil" no menu inferior (mobile) ou superior (desktop). Se você ainda não tem conta, use a opção "Entrar" e faça login com suas credenciais de sócio.'
            }
        ]
    },
    {
        category: 'Treinos',
        items: [
            {
                question: 'Como reservar um horário de treino?',
                answer: 'Na página de Treinos, selecione a data desejada no calendário e escolha um slot disponível. Confirme a reserva e o sistema registrará sua presença.'
            },
            {
                question: 'O que é o sistema de XP e níveis?',
                answer: 'Cada treino realizado, meta cumprida e ação social gera XP (pontos de experiência). Ao acumular XP, você sobe de nível e desbloqueia barcos mais avançados para remar.'
            },
            {
                question: 'Como funciona a Tábua de Marés?',
                answer: 'A Tábua de Marés exibe as condições do rio Potengi em tempo real: altura da maré, força do vento, temperatura e classificação das condições para remo (Excelente, Bom, Moderado, Ruim).'
            }
        ]
    },
    {
        category: 'Voluntariado',
        items: [
            {
                question: 'Como me cadastrar como voluntário?',
                answer: 'Acesse o menu "Voluntariado", aceite o termo de adesão, selecione suas áreas de interesse e disponibilidade. Um coordenador entrará em contato para orientações.'
            },
            {
                question: 'Quais áreas de voluntariado existem?',
                answer: 'Mídia e Comunicação, Store, Manutenção de Barcos, Limpeza do Clube, Beta Testers, Área Administrativa, Auxiliares dos Treinadores e Atendimento.'
            }
        ]
    },
    {
        category: 'Técnico',
        items: [
            {
                question: 'O aplicativo funciona offline?',
                answer: 'Parcialmente. Algumas funcionalidades como visualização de treinos salvos e informações do perfil funcionam offline. Reservas e dados em tempo real requerem conexão.'
            },
            {
                question: 'Encontrei um bug, como reportar?',
                answer: 'Use o menu \"Contato\" ou envie um e-mail para contato@sportClubNatal.com.br descrevendo o problema com capturas de tela se possível.'
            }
        ]
    }
];

// Mapa do Site com rotas
const SITE_MAP = [
    {
        category: 'Público',
        icon: Home,
        routes: [
            { path: '/', name: 'Página Inicial', description: 'Dashboard com widgets de maré, notícias e próximos eventos' },
            { path: '/news', name: 'Notícias', description: 'Todas as notícias e eventos do clube' },
            { path: '/gallery', name: 'Galeria', description: 'Fotos históricas e atuais, ranking de performance' },
            { path: '/store', name: 'Store', description: 'Produtos oficiais e cardápio da cantina' },
            { path: '/about', name: 'Contato', description: 'Informações do clube, história, diretoria e mapa' },
        ]
    },
    {
        category: 'Sócios',
        icon: User,
        routes: [
            { path: '/trainings', name: 'Meus Treinos', description: 'Dashboard de treinos, calendário e progressão' },
            { path: '/training/live/[type]', name: 'Treino ao Vivo', description: 'Sessão de treino com GPS e cronômetro' },
            { path: '/garage', name: 'Garagem', description: 'Reserva de barcos e equipamentos' },
            { path: '/tides', name: 'Tábua de Marés', description: 'Condições do rio em tempo real' },
            { path: '/voluntariado', name: 'Voluntariado', description: 'Cadastro de disponibilidade voluntária' },
            { path: '/profile/panel', name: 'Meu Perfil', description: 'Dados pessoais, XP, badges e configurações' },
        ]
    },
    {
        category: 'Treinadores',
        icon: Dumbbell,
        routes: [
            { path: '/coach/painel', name: 'Painel Coach', description: 'Dashboard do treinador com métricas' },
            { path: '/coach/programs', name: 'Programas', description: 'Criar e atribuir programas de treino' },
            { path: '/coach/calendar', name: 'Calendário', description: 'Agendar treinos e aulas experimentais' },
            { path: '/diretoria/voluntariado', name: 'Voluntariado', description: 'Visualizar escala de voluntários' },
        ]
    },
    {
        category: 'Diretoria',
        icon: Briefcase,
        routes: [
            { path: '/diretoria', name: 'Painel Diretoria', description: 'Dashboard administrativo completo' },
            { path: '/diretoria/noticias', name: 'Notícias', description: 'Publicar e gerenciar notícias' },
            { path: '/diretoria/voluntariado', name: 'Voluntariado', description: 'Gestão de escalas e termos' },
            { path: '/diretoria/membros', name: 'Membros', description: 'Lista e gestão de sócios' },
            { path: '/diretoria/financeiro', name: 'Financeiro', description: 'Relatórios financeiros' },
        ]
    }
];

// Arquitetura do Sistema
const ARCHITECTURE = {
    frontend: {
        title: 'Frontend',
        tech: 'Next.js 14 (App Router)',
        details: [
            'React 18 com Server Components',
            'Tailwind CSS para estilização',
            'Framer Motion para animações',
            'Lucide React para ícones',
            'Radix UI para componentes acessíveis'
        ]
    },
    backend: {
        title: 'Backend',
        tech: 'Next.js API Routes',
        details: [
            'Prisma ORM com SQLite',
            'NextAuth.js para autenticação',
            'API RESTful em /api/*',
            'Server Actions em /lib/actions/*'
        ]
    },
    database: {
        title: 'Banco de Dados',
        tech: 'SQLite (Prisma)',
        details: [
            'Schema em /prisma/schema.prisma',
            'Migrations automáticas',
            'Seed data para desenvolvimento',
            'Modelos: User, Boat, Training, News, etc.'
        ]
    },
    deploy: {
        title: 'Deploy',
        tech: 'Vercel',
        details: [
            'CI/CD via GitHub',
            'Edge Functions para performance',
            'Variáveis de ambiente no dashboard',
            'Preview deployments para PRs'
        ]
    }
};

// Componente de Seção FAQ
function FAQSection({ category, items }: { category: string; items: { question: string; answer: string }[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">{category}</h3>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <AnimatedCard
                        key={index}
                        variant="glass"
                        className="overflow-hidden"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                        >
                            <span className="text-white font-medium pr-4">{item.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="w-5 h-5 text-club-red shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-white/40 shrink-0" />
                            )}
                        </button>
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/10"
                                >
                                    <p className="p-4 text-white/70 text-sm leading-relaxed">
                                        {item.answer}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </AnimatedCard>
                ))}
            </div>
        </div>
    );
}

// Página Principal de Ajuda
export default function AjudaPage() {
    const [activeTab, setActiveTab] = useState<'faq' | 'sitemap' | 'architecture' | 'features'>('faq');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs = [
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
        { id: 'sitemap', label: 'Mapa do Site', icon: Map },
        { id: 'features', label: 'Funcionalidades', icon: Zap },
        { id: 'architecture', label: 'Arquitetura', icon: Layers },
    ];

    // Filtrar FAQ por busca
    const filteredFAQ = searchQuery.trim()
        ? FAQ_ITEMS.map(cat => ({
            ...cat,
            items: cat.items.filter(item =>
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(cat => cat.items.length > 0)
        : FAQ_ITEMS;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Central de Ajuda"
                subtitle="Documentação Completa"
                description="Tire suas dúvidas, explore funcionalidades e entenda a arquitetura do sistema."
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Header com versão */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-club-red/20 text-club-red">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Documentação v{HELP_DOC_VERSION}</h2>
                            <p className="text-white/40 text-sm">Atualizada em {HELP_LAST_UPDATE}</p>
                        </div>
                    </div>
                    <Link href="/about">
                        <Button variant="outline" className="gap-2">
                            <Phone className="w-4 h-4" />
                            Falar com Suporte
                        </Button>
                    </Link>
                </div>

                {/* Barra de busca */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar na documentação..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-club-red/50"
                    />
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-none">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                                    activeTab === tab.id
                                        ? 'border-club-red text-white'
                                        : 'border-transparent text-white/40 hover:text-white'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Conteúdo */}
                <AnimatePresence mode="wait">
                    {/* FAQ Tab */}
                    {activeTab === 'faq' && (
                        <motion.div
                            key="faq"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {filteredFAQ.length > 0 ? (
                                filteredFAQ.map((section) => (
                                    <FAQSection
                                        key={section.category}
                                        category={section.category}
                                        items={section.items}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                    <p className="text-white/40">Nenhum resultado encontrado para "{searchQuery}"</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Sitemap Tab */}
                    {activeTab === 'sitemap' && (
                        <motion.div
                            key="sitemap"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {SITE_MAP.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <div key={section.category}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-white/10">
                                                <Icon className="w-5 h-5 text-club-gold" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white">{section.category}</h3>
                                        </div>
                                        <div className="grid gap-3">
                                            {section.routes.map((route) => (
                                                <AnimatedCard
                                                    key={route.path}
                                                    variant="glass"
                                                    className="p-4 hover:border-club-red/30 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h4 className="font-bold text-white">{route.name}</h4>
                                                            <p className="text-white/50 text-sm mt-1">{route.description}</p>
                                                        </div>
                                                        <code className="text-xs bg-white/10 px-2 py-1 rounded text-club-gold shrink-0">
                                                            {route.path}
                                                        </code>
                                                    </div>
                                                </AnimatedCard>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Features Tab */}
                    {activeTab === 'features' && (
                        <motion.div
                            key="features"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="grid gap-3 mb-6">
                                <div className="flex items-center gap-4 text-sm text-white/60">
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        Completo
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                                        Parcial
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-blue-400" />
                                        Planejado
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {IMPLEMENTED_FEATURES.map((feature) => (
                                    <AnimatedCard
                                        key={feature.id}
                                        variant="glass"
                                        className="p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {feature.status === 'complete' && (
                                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                                )}
                                                {feature.status === 'partial' && (
                                                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                                                )}
                                                {feature.status === 'planned' && (
                                                    <Info className="w-5 h-5 text-blue-400" />
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-white">{feature.name}</h4>
                                                    <code className="text-xs text-white/40">{feature.path}</code>
                                                </div>
                                            </div>
                                            <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/60">
                                                v{feature.version}
                                            </span>
                                        </div>
                                    </AnimatedCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Architecture Tab */}
                    {activeTab === 'architecture' && (
                        <motion.div
                            key="architecture"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Aviso para AI */}
                            <AnimatedCard variant="glass" className="p-4 border-purple-500/30 bg-purple-500/10">
                                <div className="flex items-start gap-3">
                                    <Code className="w-5 h-5 text-purple-400 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-purple-300">Nota para IA/Agente</h4>
                                        <p className="text-purple-200/70 text-sm mt-1">
                                            Esta seção contém informações técnicas sobre a arquitetura do projeto.
                                            Consulte aqui quando precisar entender a estrutura de pastas, tecnologias
                                            utilizadas ou padrões do projeto.
                                        </p>
                                    </div>
                                </div>
                            </AnimatedCard>

                            {/* Grid de arquitetura */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {Object.values(ARCHITECTURE).map((section) => (
                                    <AnimatedCard key={section.title} variant="glass" className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-club-red/20">
                                                {section.title === 'Frontend' && <Layers className="w-5 h-5 text-club-red" />}
                                                {section.title === 'Backend' && <Code className="w-5 h-5 text-club-red" />}
                                                {section.title === 'Banco de Dados' && <Database className="w-5 h-5 text-club-red" />}
                                                {section.title === 'Deploy' && <GitBranch className="w-5 h-5 text-club-red" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{section.title}</h4>
                                                <p className="text-club-gold text-sm">{section.tech}</p>
                                            </div>
                                        </div>
                                        <ul className="space-y-2">
                                            {section.details.map((detail, i) => (
                                                <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                                                    <span className="text-club-red mt-1">•</span>
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </AnimatedCard>
                                ))}
                            </div>

                            {/* Estrutura de Pastas */}
                            <AnimatedCard variant="glass" className="p-6">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-club-gold" />
                                    Estrutura de Pastas
                                </h4>
                                <pre className="text-xs text-white/70 bg-black/30 p-4 rounded-lg overflow-x-auto">
                                    {`Sport/
├── app/                    # Páginas Next.js (App Router)
│   ├── api/               # API Routes
│   ├── coach/             # Páginas do Coach
│   ├── diretoria/         # Páginas da Diretoria
│   ├── gallery/           # Galeria de Fotos
│   ├── news/              # Notícias
│   ├── profile/           # Perfil do Usuário
│   ├── store/             # Loja e Cantina
│   ├── trainings/         # Sistema de Treinos
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Card, etc)
│   ├── search/           # Componente de Busca
│   ├── tide-widget.tsx   # Widget de Marés
│   └── ...
├── lib/                   # Utilitários e Lógica
│   ├── actions/          # Server Actions
│   ├── config/           # Configurações (volunteer-areas, etc)
│   ├── data/             # Dados estáticos (news, gallery, etc)
│   └── utils.ts          # Funções utilitárias
├── prisma/               # Banco de Dados
│   ├── schema.prisma     # Schema do DB
│   └── seed.ts           # Dados iniciais
├── public/               # Assets Estáticos
│   ├── images/           # Imagens
│   ├── store/            # Imagens da Loja
│   └── ...
└── docs/                 # Documentação Técnica`}</pre>
                            </AnimatedCard>

                            {/* Roles do Sistema */}
                            <AnimatedCard variant="glass" className="p-6">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-club-gold" />
                                    Roles do Sistema
                                </h4>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[
                                        { role: 'VISITOR', desc: 'Visitante não autenticado', color: 'bg-gray-500' },
                                        { role: 'SOCIO', desc: 'Sócio regular do clube', color: 'bg-blue-500' },
                                        { role: 'ATLETA', desc: 'Atleta competidor', color: 'bg-green-500' },
                                        { role: 'TREINADOR', desc: 'Coach/Treinador', color: 'bg-amber-500' },
                                        { role: 'DIRETORIA', desc: 'Membro da diretoria', color: 'bg-purple-500' },
                                        { role: 'ADMIN', desc: 'Administrador do sistema', color: 'bg-red-500' },
                                    ].map((item) => (
                                        <div key={item.role} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                            <div>
                                                <code className="text-white font-bold text-sm">{item.role}</code>
                                                <p className="text-white/50 text-xs">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AnimatedCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Rodapé */}
                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-white/30 text-sm">
                        Sport Club de Natal © 2026 • Versão {HELP_DOC_VERSION}
                    </p>
                    <p className="text-white/20 text-xs mt-2">
                        Esta documentação é atualizada a cada nova versão do aplicativo.
                    </p>
                </div>
            </div>
        </div>
    );
}
