'use client';

import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    FileText, Map, GitBranch, BookOpen, HelpCircle,
    CheckCircle, ArrowRight, Home, Users, Ship, Trophy,
    Calendar, Settings, Sparkles, Clock, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

// ============================================================================
// DADOS: Histórico de Versões (30+ versões)
// ============================================================================
const versionHistory = [
    {
        version: '0.4.5',
        date: '30/12/2025',
        summary: 'Módulo Coach completo com 5 novas páginas (treinos ativos, reservas pendentes, diário, novo plano, calendário). Página de alongamento com 3 níveis e 21 exercícios específicos para remadores. Ficha individual de sócio com dados completos, histórico de pagamentos e barcos habilitados. Modal de confirmação para treinos curtos (<3min) com opções Armazenar/Descartar.',
        type: 'feature'
    },
    {
        version: '0.4.4',
        date: '28/12/2025',
        summary: 'Sistema completo de registro de usuários com API /api/auth/register, validação de email duplicado e hash de senha com bcrypt. Banco de dados expandido com seed contendo 3 usuários de exemplo (admin, coach, membro), barcos, produtos e badges iniciais.',
        type: 'feature'
    },
    {
        version: '0.4.3',
        date: '28/12/2025',
        summary: 'API de sugestão inteligente de planilhas de treino com geração automática de 12 semanas personalizadas. Sistema Kanban com drag-and-drop para gestão de tarefas. Calendário de voluntariado com visualização por dia/horário.',
        type: 'feature'
    },
    {
        version: '0.4.2',
        date: '28/12/2025',
        summary: 'Nova API /api/coach/athletes para listar e gerenciar atletas vinculados ao treinador. Dashboard do coach funcional com estatísticas de treinos, alunos e frequência.',
        type: 'feature'
    },
    {
        version: '0.4.1',
        date: '27/12/2025',
        summary: 'Sistema de reservas com intervalos de 15 minutos. Novas páginas de Pagamentos (histórico, PIX, Mercado Pago), Avisos (filtros, lido/não lido) e Configurações (toggles, logout). Correção do sistema de notificações.',
        type: 'feature'
    },
    {
        version: '0.4.0',
        date: '27/12/2025',
        summary: 'Integração de logos de parceiros oficiais no header e bottom nav (Governo RN, Prefeitura de Natal, Potigás, ERK, CBR) com links funcionais. Sistema de treino ativo em /training/live com tracking GPS em tempo real, cronômetro e métricas.',
        type: 'major'
    },
    {
        version: '0.3.9',
        date: '27/12/2025',
        summary: 'Módulo de Garagem completo com 10 APIs para gestão de recursos e reservas. Sistema de check-in/check-out com registro fotográfico. Fila de espera para barcos ocupados. Regras de negócio (5 treinos indoor obrigatórios antes do tanque).',
        type: 'feature'
    },
    {
        version: '0.3.8',
        date: '27/12/2025',
        summary: 'GPS Tracker avançado com filtro de accuracy, cálculo de distância usando fórmula de Haversine e auto-pause. Nova página de aquecimento com 5 exercícios de core e timer por exercício.',
        type: 'feature'
    },
    {
        version: '0.3.7',
        date: '27/12/2025',
        summary: 'Dashboard de treinos com cards de estatísticas, gráficos e histórico. Seletor de tipo de treino (indoor/outdoor, ergômetro, tanque, rio). APIs de treinos para iniciar, completar e buscar templates.',
        type: 'feature'
    },
    {
        version: '0.3.6',
        date: '27/12/2025',
        summary: 'Progressive Web App (PWA) com funcionamento offline. Service Worker para cache de assets. IndexedDB Manager para armazenamento local de dados. Schema Prisma expandido com 15+ modelos para Treinos, Garagem e Voluntariado.',
        type: 'feature'
    },
    {
        version: '0.3.5',
        date: '26/12/2025',
        summary: 'Ficha de Anamnese completa em 5 etapas (identificação, saúde, atividade física, habilidades náuticas, objetivos). Termo de Voluntariado com aceite legal. Sistema EAD (Escola de Remo) com vídeos e módulos.',
        type: 'feature'
    },
    {
        version: '0.3.4',
        date: '26/12/2025',
        summary: 'Sistema de notícias com listagem, detalhes e imagens. Widget de marés e condições do rio com dados da Marinha (Capitania dos Portos RN), classificação para remo e informações astronômicas.',
        type: 'feature'
    },
    {
        version: '0.3.3',
        date: '25/12/2025',
        summary: 'Estrutura base de perfis de usuário com dados pessoais, gamificação e configurações. Carteirinha digital com QR Code único para identificação no clube.',
        type: 'feature'
    },
    {
        version: '0.3.2',
        date: '25/12/2025',
        summary: 'Portal completo do Voluntariado com cadastro de habilidades e disponibilidade. Login via dropdown no header (sem página separada). Formulário de Proposta de Sócio.',
        type: 'feature'
    },
    {
        version: '0.3.1',
        date: '24/12/2025',
        summary: 'Dashboard exclusivo do Treinador com estatísticas de atletas e turmas. Ficha do Associado com dados completos. Sistema de controle de Presença em treinos.',
        type: 'feature'
    },
    {
        version: '0.3.0',
        date: '24/12/2025',
        summary: 'Nova Identidade Visual 2.0 com paleta Vermelho/Preto/Ouro e efeitos glassmorphism. Sistema de Gamificação com níveis, pontos XP e conquistas (badges). Ranking social.',
        type: 'major'
    },
    {
        version: '0.2.14',
        date: '23/12/2024',
        summary: 'Autenticação completa com NextAuth (login, logout, sessões). Integração Prisma com SQLite. Dashboard dinâmico baseado no perfil do usuário (sócio, coach, diretoria).',
        type: 'feature'
    },
    {
        version: '0.2.12',
        date: '22/12/2024',
        summary: 'Otimizações de performance no carregamento de páginas. Melhorias de responsividade para dispositivos móveis em todas as telas.',
        type: 'fix'
    },
    {
        version: '0.2.10',
        date: '21/12/2024',
        summary: 'Loja oficial (Store) com catálogo de produtos, carrinho e checkout. Galeria de imagens do clube com álbuns por categoria.',
        type: 'feature'
    },
    {
        version: '0.2.8',
        date: '20/12/2024',
        summary: 'Sistema de eventos do clube com calendário, detalhes e localização. Funcionalidade RSVP para confirmação de presença.',
        type: 'feature'
    },
    {
        version: '0.2.5',
        date: '19/12/2024',
        summary: 'Sistema de reserva de barcos com seleção de data/horário e verificação de disponibilidade. Painel de notícias na home.',
        type: 'feature'
    },
    {
        version: '0.2.3',
        date: '18/12/2024',
        summary: 'Sistema de pagamentos (mock) com geração de boletos e PIX. Histórico financeiro do membro com status de mensalidades.',
        type: 'feature'
    },
    {
        version: '0.2.0',
        date: '17/12/2024',
        summary: 'Migração completa para Next.js 14 com App Router. Arquitetura Mobile-First como padrão de desenvolvimento.',
        type: 'major'
    },
    {
        version: '0.1.12',
        date: '16/12/2024',
        summary: 'Estrutura de permissões por roles (VISITOR, MEMBER, COACH, BOARD, ADMIN). Componentes UI fundamentais (Button, Card, Input, Modal).',
        type: 'feature'
    },
    {
        version: '0.1.10',
        date: '15/12/2024',
        summary: 'Melhorias no sistema de navegação desktop e mobile. Refinamento visual dos cards e componentes.',
        type: 'fix'
    },
    {
        version: '0.1.8',
        date: '14/12/2024',
        summary: 'Header principal com logo do clube e menu de navegação. Footer responsivo com links e redes sociais.',
        type: 'feature'
    },
    {
        version: '0.1.5',
        date: '13/12/2024',
        summary: 'Protótipo inicial da Landing Page com hero section e seções informativas. Área de próximos eventos.',
        type: 'feature'
    },
    {
        version: '0.1.3',
        date: '12/12/2024',
        summary: 'Configuração do Tailwind CSS com tema customizado. Definição de cores base (vermelho, preto, dourado) e tipografia.',
        type: 'setup'
    },
    {
        version: '0.1.1',
        date: '11/12/2024',
        summary: 'Criação do repositório Git. Estrutura base Next.js com TypeScript e configuração inicial do projeto.',
        type: 'setup'
    },
    {
        version: '0.0.5',
        date: '10/12/2024',
        summary: 'Configuração de ESLint para linting de código. Prettier para formatação automática e padronização.',
        type: 'setup'
    },
    {
        version: '0.0.3',
        date: '09/12/2024',
        summary: 'Definição da arquitetura do sistema (camadas, módulos, padrões). Documentação técnica inicial.',
        type: 'setup'
    },
    {
        version: '0.0.1',
        date: '08/12/2024',
        summary: 'Criação do projeto Sport Club de Natal. Estrutura inicial de diretórios e configuração do ambiente.',
        type: 'setup'
    },
];


// ============================================================================
// DADOS: Mapa do Site
// ============================================================================
const siteMap = {
    publico: {
        title: 'Área Pública',
        icon: Home,
        color: 'text-emerald-400',
        pages: [
            { name: 'Início', path: '/' },
            { name: 'Sobre o Clube', path: '/about' },
            { name: 'Notícias', path: '/news' },
            { name: 'Loja', path: '/store' },
            { name: 'Galeria', path: '/gallery' },
            { name: 'Eventos', path: '/events' },
            { name: 'Competições', path: '/competitions' },
            { name: 'Condições do Rio', path: '/tides' },
            { name: 'Aula Experimental', path: '/experimental-class' },
            { name: 'Login', path: '/login' },
            { name: 'Cadastro', path: '/register' },
            { name: 'Documentação', path: '/docs' },
            { name: 'Changelog', path: '/changelog' },
        ]
    },
    socio: {
        title: 'Área do Sócio',
        icon: Users,
        color: 'text-blue-400',
        pages: [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Meu Perfil', path: '/profile/panel' },
            { name: 'Carteirinha Digital', path: '/profile/card' },
            { name: 'Ficha de Anamnese', path: '/profile/anamnese' },
            { name: 'Treinos', path: '/training' },
            { name: 'Iniciar Treino', path: '/training/start' },
            { name: 'Treino Ativo', path: '/training/live' },
            { name: 'Histórico', path: '/training/history' },
            { name: 'Estatísticas', path: '/training/analytics' },
            { name: 'Meu Programa', path: '/training/my-program' },
            { name: 'Garagem', path: '/garage' },
            { name: 'Barcos', path: '/boats' },
            { name: 'Voluntariado', path: '/volunteer' },
            { name: 'Escola de Remo', path: '/ead' },
            { name: 'Hall da Fama', path: '/ranking' },
            { name: 'Pagamentos', path: '/payments' },
            { name: 'Avisos', path: '/notices' },
            { name: 'Configurações', path: '/settings' },
        ]
    },
    coach: {
        title: 'Área do Treinador',
        icon: Trophy,
        color: 'text-purple-400',
        pages: [
            { name: 'Dashboard', path: '/coach/dashboard' },
            { name: 'Painel', path: '/coach/painel' },
            { name: 'Atletas', path: '/coach/athletes' },
            { name: 'Calendário', path: '/coach/calendar' },
            { name: 'Programas', path: '/coach/programs' },
            { name: 'Treinos Ativos', path: '/coach/active-workouts' },
            { name: 'Reservas Pendentes', path: '/coach/pending-reservations' },
            { name: 'Diário', path: '/coach/diary' },
            { name: 'Novo Plano', path: '/coach/new-plan' },
            { name: 'Metas', path: '/coach/metas' },
            { name: 'Ajustes', path: '/coach/ajustes' },
        ]
    },
    diretoria: {
        title: 'Área da Diretoria',
        icon: Ship,
        color: 'text-club-gold',
        pages: [
            { name: 'Painel', path: '/diretoria' },
            { name: 'Sócios', path: '/diretoria/socios' },
            { name: 'Financeiro', path: '/diretoria/financeiro' },
            { name: 'Mensalidades', path: '/diretoria/financeiro/mensalidades' },
            { name: 'Receitas', path: '/diretoria/financeiro/receitas' },
            { name: 'Despesas', path: '/diretoria/financeiro/despesas' },
            { name: 'Relatórios', path: '/diretoria/financeiro/relatorios' },
            { name: 'Reuniões', path: '/diretoria/reunioes' },
            { name: 'Voluntariado', path: '/diretoria/voluntariado' },
            { name: 'Documentos', path: '/diretoria/documentos' },
            { name: 'Eleições', path: '/diretoria/eleicoes' },
            { name: 'Notícias', path: '/diretoria/noticias' },
            { name: 'Kanban', path: '/diretoria/kanban' },
            { name: 'Garagem', path: '/diretoria/garagem' },
            { name: 'Acervo', path: '/diretoria/acervo' },
            { name: 'Auditoria', path: '/diretoria/auditoria' },
        ]
    },
    admin: {
        title: 'Administração',
        icon: Settings,
        color: 'text-red-400',
        pages: [
            { name: 'Dashboard', path: '/admin/dashboard' },
            { name: 'Usuários', path: '/admin/users' },
            { name: 'Inventário', path: '/admin/inventory' },
            { name: 'Estatísticas', path: '/admin/stats' },
            { name: 'Tarefas', path: '/admin/tasks' },
            { name: 'Upload Marés', path: '/admin/tides/upload' },
            { name: 'Avisos', path: '/admin/notices' },
            { name: 'Loja', path: '/admin/store' },
        ]
    }
};

// ============================================================================
// DADOS: Orientações de Uso
// ============================================================================
const userGuides = [
    {
        title: 'Como reservar um barco',
        steps: [
            'Acesse "Garagem" no menu principal',
            'Escolha o barco desejado',
            'Selecione data e horário',
            'Confirme a reserva',
            'Faça check-in ao chegar no clube'
        ]
    },
    {
        title: 'Como registrar seu treino',
        steps: [
            'Acesse "Treinos" no menu',
            'Clique em "Iniciar Treino"',
            'Escolha modalidade e local',
            'Ative o GPS se for ao ar livre',
            'Finalize e veja suas estatísticas'
        ]
    },
    {
        title: 'Como acumular pontos',
        steps: [
            'Complete treinos regulares',
            'Participe do voluntariado',
            'Conclua cursos na Escola de Remo',
            'Mantenha sua anamnese atualizada',
            'Suba de nível e desbloqueie conquistas'
        ]
    }
];

// ============================================================================
// COMPONENTES
// ============================================================================

function VersionTimeline() {
    const [showAll, setShowAll] = useState(false);
    const displayedVersions = showAll ? versionHistory : versionHistory.slice(0, 10);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'major': return 'bg-club-gold text-black';
            case 'feature': return 'bg-blue-500/20 text-blue-400';
            case 'fix': return 'bg-emerald-500/20 text-emerald-400';
            case 'setup': return 'bg-white/10 text-white/60';
            default: return 'bg-white/10 text-white/60';
        }
    };

    return (
        <div className="space-y-4">
            {displayedVersions.map((v, idx) => (
                <div key={v.version} className={`flex gap-4 items-start ${idx === 0 ? '' : 'opacity-80'}`}>
                    <div className="flex-shrink-0 w-20 text-right">
                        <Badge className={getTypeColor(v.type)}>v{v.version}</Badge>
                    </div>
                    <div className="flex-shrink-0 w-px h-12 bg-white/10 relative">
                        <div className={`absolute top-2 -left-1 w-2 h-2 rounded-full ${idx === 0 ? 'bg-club-gold' : 'bg-white/30'}`} />
                    </div>
                    <div className="flex-1 pb-4">
                        <p className="text-xs text-white/40 mb-1">{v.date}</p>
                        <p className="text-sm text-white/70">{v.summary}</p>
                    </div>
                </div>
            ))}
            {!showAll && versionHistory.length > 10 && (
                <button
                    onClick={() => setShowAll(true)}
                    className="w-full py-3 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2"
                >
                    Ver todas as {versionHistory.length} versões <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

function SiteMapSection() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(siteMap).map(([key, section]) => (
                <AnimatedCard key={key} variant="glass" className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center`}>
                            <section.icon className={`w-5 h-5 ${section.color}`} />
                        </div>
                        <h3 className="font-bold text-white">{section.title}</h3>
                    </div>
                    <div className="space-y-2">
                        {section.pages.map((page) => (
                            <Link
                                key={page.path}
                                href={page.path}
                                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors py-1"
                            >
                                <ChevronRight className="w-3 h-3" />
                                {page.name}
                            </Link>
                        ))}
                    </div>
                </AnimatedCard>
            ))}
        </div>
    );
}

function UserGuidesSection() {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            {userGuides.map((guide, idx) => (
                <AnimatedCard key={idx} variant="glass" className="p-6">
                    <h3 className="font-bold text-white mb-4">{guide.title}</h3>
                    <ol className="space-y-2">
                        {guide.steps.map((step, stepIdx) => (
                            <li key={stepIdx} className="flex items-start gap-3 text-sm text-white/60">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">
                                    {stepIdx + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </AnimatedCard>
            ))}
        </div>
    );
}

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================
export default function DocsPage() {
    const tabs = [
        { id: 'versions', label: 'Versões', icon: GitBranch },
        { id: 'sitemap', label: 'Mapa do Site', icon: Map },
        { id: 'guides', label: 'Orientações', icon: HelpCircle },
    ];

    const [activeTab, setActiveTab] = useState('versions');

    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-club-gold/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Central de Documentação</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                        Documentação
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto">
                        Tudo sobre o aplicativo do Sport Club de Natal: histórico de versões, mapa do site e orientações de uso.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'versions' && (
                        <AnimatedCard variant="glass" className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <GitBranch className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Histórico de Versões</h2>
                                    <p className="text-sm text-white/50">Acompanhe a evolução do aplicativo</p>
                                </div>
                            </div>
                            <VersionTimeline />
                        </AnimatedCard>
                    )}

                    {activeTab === 'sitemap' && (
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <Map className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Mapa do Site</h2>
                                    <p className="text-sm text-white/50">Todas as páginas organizadas por área</p>
                                </div>
                            </div>
                            <SiteMapSection />
                        </div>
                    )}

                    {activeTab === 'guides' && (
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-club-gold/20 flex items-center justify-center">
                                    <HelpCircle className="w-6 h-6 text-club-gold" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Orientações de Uso</h2>
                                    <p className="text-sm text-white/50">Como utilizar as principais funcionalidades</p>
                                </div>
                            </div>
                            <UserGuidesSection />
                        </div>
                    )}
                </div>

                {/* Footer Links */}
                <div className="mt-16 text-center">
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/changelog" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                            <Clock className="w-4 h-4" />
                            Ver changelog detalhado
                        </Link>
                        <Link href="/about" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
                            <ArrowRight className="w-4 h-4" />
                            Voltar para Sobre
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
