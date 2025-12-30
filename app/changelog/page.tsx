import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, AlertTriangle, Wrench, Sparkles } from 'lucide-react';

const changelogData = [
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
        version: '0.3.6',
        date: '2025-12-27',
        items: {
            added: [
                '**PWA:** Service Worker e IndexedDB para funcionamento offline.',
                '**Schema:** 15+ modelos Prisma expandidos.',
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
