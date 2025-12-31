import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, AlertTriangle, Wrench, Sparkles } from 'lucide-react';

interface ChangelogRelease {
    version: string;
    date: string;
    items: {
        added?: string[];
        improved?: string[];
        fixed?: string[];
    };
}

const changelogData: ChangelogRelease[] = [
    {
        version: '0.4.6',
        date: '2025-12-31',
        items: {
            fixed: [
                '**UI:** Tamanho dos botões de modalidades reduzido (Remo, Musculação, Outras Atividades).',
                '**Middleware:** Voluntariado, Docs e Changelog não redirecionam mais para login.',
                '**Barcos:** Renomeado "Canoa" para "Canoe" e "Canoa Dupla" para "Double Canoe".',
                '**Pagamentos:** Histórico de pagamentos integrado com API.',
                '**Lint:** Corrigidos erros TypeScript em datas opcionais.',
            ],
            added: [
                '**APIs:** `/api/payments/history` - Histórico de pagamentos.',
                '**APIs:** `/api/users?role=BOARD` - Listar membros da diretoria.',
                '**Dados:** 8 pagamentos simulados para histórico.',
                '**Dados:** 5 membros da diretoria simulados.',
                '**Dados:** 5 tarefas simuladas para sistema Kanban.',
            ],
            improved: [
                '**Documentação:** Arquitetura de Barcos vs Garagem documentada.',
                '**Documentação:** Regras de negócio do sistema de eleições.',
                '**Package:** Versão atualizada para 0.4.6.',
            ]
        }
    },
    {
        version: '0.4.5',
        date: '2025-12-30',
        items: {
            added: [
                '**Treino Curto:** Modal de confirmação para treinos <3min com opções Armazenar/Descartar.',
                '**Alongamento:** Nova página `/training/stretching` com 3 níveis e 21 exercícios.',
                '**Coach:** 5 novas páginas - Treinos Ativos, Reservas, Diário, Novo Plano, Calendário.',
                '**Sócios:** Ficha individual com dados completos, treinos, pagamentos e barcos.',
                '**Aulas Experimentais:** 5 agendamentos simulados no calendário do coach.',
            ],
            fixed: [
                'Erro de sintaxe em `api/workouts/history/route.ts`.',
                'Links do painel do coach para Novo Plano e Diário.',
                'Estrutura JSX corrigida no painel do coach.',
            ]
        }
    },
    {
        version: '0.4.4',
        date: '2025-12-28',
        items: {
            added: [
                '**Registro:** Sistema de cadastro de usuários com validação completa.',
                '**Banco de Dados:** Seed com dados de exemplo (3 usuários, barcos, produtos).',
            ],
            fixed: [
                'Erro de sintaxe em `app/api/tides/upload/route.ts`.',
                'Suspense boundary em 4 páginas com useSearchParams.',
            ]
        }
    },
    {
        version: '0.4.3',
        date: '2025-12-28',
        items: {
            added: [
                '**Coach:** API de sugestão de planilhas com 12 semanas de treino.',
                '**Tarefas:** Kanban board com drag and drop.',
                '**Voluntariado:** Calendário de atividades.',
            ]
        }
    },
    {
        version: '0.4.2',
        date: '2025-12-28',
        items: {
            added: [
                '**Coach:** API `/api/coach/athletes` para listar atletas.',
                '**Dashboard:** Painel do coach funcional.',
            ]
        }
    },
    {
        version: '0.4.1',
        date: '2025-12-27',
        items: {
            added: [
                '**Reservas:** Intervalos de 15 minutos.',
                '**Perfil:** Páginas de Pagamentos, Avisos e Configurações.',
                '**APIs:** Rotas de perfil completas.',
            ],
            fixed: [
                'Sistema de notificações (sininho).',
            ]
        }
    },
    {
        version: '0.4.0',
        date: '2025-12-27',
        items: {
            added: [
                '**Logos:** Parceiros no header e bottom nav (Governo RN, Prefeitura, Potigás, ERK, CBR).',
                '**Treino:** Página `/training/live` com GPS tracking e cronômetro.',
            ]
        }
    },
    {
        version: '0.3.9',
        date: '2025-12-27',
        items: {
            added: [
                '**Garagem:** Módulo completo com 10 APIs.',
                '**Check-in/Check-out:** Sistema de controle de barcos.',
                '**Fila de Espera:** Recurso para barcos ocupados.',
            ]
        }
    },
    {
        version: '0.3.8',
        date: '2025-12-27',
        items: {
            added: [
                '**GPS Tracking:** Filtro de accuracy, cálculo Haversine, auto-pause.',
                '**Aquecimento:** Página com 5 exercícios de core.',
            ]
        }
    },
    {
        version: '0.3.7',
        date: '2025-12-27',
        items: {
            added: [
                '**Treinos:** Dashboard de treinos.',
                '**Seletor:** Tipo de treino (indoor/outdoor).',
                '**APIs:** Rotas de treinos (start, complete, templates).',
            ]
        }
    },
    {
        version: '0.3.6',
        date: '2025-12-27',
        items: {
            added: [
                '**PWA:** Service Worker para funcionamento offline.',
                '**IndexedDB:** Manager para dados locais.',
                '**Schema:** 15+ modelos Prisma expandidos.',
            ]
        }
    },
    {
        version: '0.3.5',
        date: '2025-12-26',
        items: {
            added: [
                '**Anamnese:** Ficha completa em 5 etapas.',
                '**Voluntariado:** Termo de aceite.',
                '**EAD:** Sistema Escola de Remo.',
            ]
        }
    },
    {
        version: '0.3.4',
        date: '2025-12-26',
        items: {
            added: [
                '**Notícias:** Sistema de publicações.',
                '**Marés:** Widget de condições do rio.',
            ]
        }
    },
    {
        version: '0.3.3',
        date: '2025-12-25',
        items: {
            added: [
                '**Perfis:** Estrutura base de perfis de usuário.',
                '**Carteirinha:** Digital com QR Code.',
            ]
        }
    },
    {
        version: '0.3.2',
        date: '2025-12-25',
        items: {
            added: [
                '**Voluntariado:** Portal completo.',
                '**Login:** Via dropdown no header.',
                '**Proposta:** Formulário de sócio.',
            ]
        }
    },
    {
        version: '0.3.1',
        date: '2025-12-24',
        items: {
            added: [
                '**Treinador:** Dashboard do coach.',
                '**Associado:** Ficha do membro.',
                '**Presença:** Sistema de controle.',
            ]
        }
    },
    {
        version: '0.3.0',
        date: '2025-12-24',
        items: {
            added: [
                '**Identidade Visual 2.0:** Vermelho, Preto, Ouro com glassmorphism.',
                '**Gamificação:** Sistema de níveis, pontos e conquistas.',
            ]
        }
    },
    {
        version: '0.2.14',
        date: '2024-12-23',
        items: {
            added: [
                '**Autenticação:** NextAuth integrado.',
                '**Prisma:** Banco de dados SQLite.',
                '**Dashboard:** Dinâmico por perfil.',
            ]
        }
    },
    {
        version: '0.2.12',
        date: '2024-12-22',
        items: {
            improved: [
                'Performance de carregamento.',
                'Responsividade mobile.',
            ]
        }
    },
    {
        version: '0.2.10',
        date: '2024-12-21',
        items: {
            added: [
                '**Loja:** Store oficial.',
                '**Galeria:** Álbum de imagens.',
            ]
        }
    },
    {
        version: '0.2.8',
        date: '2024-12-20',
        items: {
            added: [
                '**Eventos:** Sistema de eventos.',
                '**RSVP:** Confirmação de presença.',
            ]
        }
    },
    {
        version: '0.2.5',
        date: '2024-12-19',
        items: {
            added: [
                '**Reservas:** Sistema de barcos.',
                '**Notícias:** Painel de publicações.',
            ]
        }
    },
    {
        version: '0.2.3',
        date: '2024-12-18',
        items: {
            added: [
                '**Pagamentos:** Sistema mock.',
                '**Histórico:** Financeiro do membro.',
            ]
        }
    },
    {
        version: '0.2.0',
        date: '2024-12-17',
        items: {
            added: [
                '**Next.js 14:** Migração para App Router.',
                '**Mobile-First:** Arquitetura responsiva.',
            ]
        }
    },
    {
        version: '0.1.12',
        date: '2024-12-16',
        items: {
            added: [
                '**Permissões:** Estrutura de roles.',
                '**UI:** Componentes fundamentais.',
            ]
        }
    },
    {
        version: '0.1.10',
        date: '2024-12-15',
        items: {
            improved: [
                'Sistema de navegação.',
                'Estilização de cards.',
            ]
        }
    },
    {
        version: '0.1.8',
        date: '2024-12-14',
        items: {
            added: [
                '**Header:** Com logo do clube.',
                '**Footer:** Responsivo.',
            ]
        }
    },
    {
        version: '0.1.5',
        date: '2024-12-13',
        items: {
            added: [
                '**Landing Page:** Protótipo inicial.',
                '**Eventos:** Seção de eventos.',
            ]
        }
    },
    {
        version: '0.1.3',
        date: '2024-12-12',
        items: {
            added: [
                '**Tailwind:** Configuração inicial.',
                '**Tema:** Cores e fontes base.',
            ]
        }
    },
    {
        version: '0.1.1',
        date: '2024-12-11',
        items: {
            added: [
                '**Repositório:** Criação do projeto.',
                '**Next.js:** Estrutura base.',
            ]
        }
    },
    {
        version: '0.0.5',
        date: '2024-12-10',
        items: {
            added: [
                '**ESLint:** Configuração.',
                '**Prettier:** Formatação de código.',
            ]
        }
    },
    {
        version: '0.0.3',
        date: '2024-12-09',
        items: {
            added: [
                '**Arquitetura:** Definição de estrutura.',
                '**Docs:** Documentação inicial.',
            ]
        }
    },
    {
        version: '0.0.1',
        date: '2024-12-08',
        items: {
            added: [
                '**Início:** Criação do projeto.',
                '**Diretórios:** Estrutura de pastas.',
            ]
        }
    },
];

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-club-black pt-20 pb-24">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-club-red/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-club-gold/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-club-red/10 border border-club-red/20">
                        <Sparkles className="w-4 h-4 text-club-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-club-gold">Histórico de Versões</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                        Changelog
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto">
                        Acompanhe todas as melhorias, novidades e correções implementadas no sistema do Sport Club de Natal.
                    </p>
                </div>

                {/* Timeline */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {changelogData.map((release, idx) => (
                        <AnimatedCard key={release.version} variant="glass" className="p-8">
                            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-white/10">
                                <Badge className="bg-club-gold text-black font-black text-sm px-4 py-1">
                                    v{release.version}
                                </Badge>
                                <span className="text-white/40 text-sm font-mono">{release.date}</span>
                            </div>

                            {/* Added Features */}
                            {release.items.added && release.items.added.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 rounded-lg bg-emerald-500/10">
                                            <Plus className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Adicionado</h3>
                                    </div>
                                    <ul className="space-y-2 ml-10">
                                        {release.items.added.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle className="w-3 h-3 text-emerald-500 mt-1 flex-shrink-0" />
                                                <span className="text-sm text-white/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Improved Features */}
                            {release.items.improved && release.items.improved.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 rounded-lg bg-purple-500/10">
                                            <Sparkles className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-purple-400">Melhorado</h3>
                                    </div>
                                    <ul className="space-y-2 ml-10">
                                        {release.items.improved.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle className="w-3 h-3 text-purple-500 mt-1 flex-shrink-0" />
                                                <span className="text-sm text-white/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Fixed Issues */}
                            {release.items.fixed && release.items.fixed.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 rounded-lg bg-blue-500/10">
                                            <Wrench className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Corrigido</h3>
                                    </div>
                                    <ul className="space-y-2 ml-10">
                                        {release.items.fixed.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                                                <span className="text-sm text-white/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </AnimatedCard>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center">
                    <p className="text-xs text-white/30 italic">
                        Todas as atualizações seguem o padrão de versionamento semântico (SemVer).
                    </p>
                </div>
            </div>
        </div>
    );
}
