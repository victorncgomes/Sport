import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, AlertTriangle, Wrench, Sparkles } from 'lucide-react';

const changelogData = [
    {
        version: '0.5.0',
        date: '2025-12-25',
        items: {
            added: [
                '**Loja:** Modal de detalhes do produto com descrição expandida, tamanhos e especificações.',
                '**Galeria:** Sistema social completo com curtidas e comentários.',
                '**Galeria:** Simulação de interações de usuários (10 usuários, comentários e likes).',
                '**Galeria:** Modal de visualização com seção de comentários e navegação.',
            ],
            improved: [
                '**Painel Diretoria:** Containers com fundo sólido, bordas coloridas e efeitos de glow.',
                '**Experiência Mobile:** Ajustes de responsividade nos modais e grids.',
            ]
        }
    },
    {
        version: '0.4.0',
        date: '2025-12-23',
        items: {
            added: [
                'Fallback de dados mockados para perfil em produção (João Silva demo).',
            ],
            fixed: [
                'Menu do rodapé mobile: z-index aumentado e estilos consolidados.',
                'Redirecionamento automático `/login` → `/dashboard` removido.',
                'Tamanhos de ícones inconsistentes no bottom-nav.',
            ]
        }
    },
    {
        version: '0.3.6',
        date: '2025-12-20',
        items: {
            added: [
                'Seção de **Informações Financeiras** no Painel do Usuário (`/profile/panel`).',
                'Dashboard do Treinador com visualização de **Agendamentos de Barcos**.',
                'Tema **Dark Premium** na página de Aula Experimental para máxima legibilidade.',
                'Imagens reais e profissionais na **Store** via Unsplash.',
                'Estrutura rígida de navegação por cargo (Visitante, Sócio, Coach, Diretoria).',
            ],
            fixed: [
                'Removido o indicador de scroll ("mouse") da página inicial.',
                'Padronizada a **Estrutura de Menus Rígida** por cargo.',
                'Corrigido erro de título e sintaxe no Dashboard Administrativo.',
                'Resolvida inconsistência na simulação de acessos no dropdown de login.',
                'Corrigida responsividade do **Bottom Navigation** em smartphones.',
            ]
        }
    },
    {
        version: '0.3.5',
        date: '2025-12-20',
        items: {
            fixed: [
                '**Hall da Fama**: Corrigido crash crítico na página de ranking devido a propriedades indefinidas.',
                'Navegação padronizada com nome consistente "Hall da Fama" em toda aplicação.',
            ],
            added: [
                'Dados dinâmicos do banco integrados ao ranking social.',
                'Imagens reais geradas para barcos e produtos iniciais.',
            ]
        }
    },
    {
        version: '0.3.0',
        date: '2025-12-19',
        items: {
            added: [
                'Redesign completo com cores oficiais (Blood Red #DC2626, Gold #FFD700, Black #0A0A0A).',
                'Sistema de gamificação e ranqueamento social.',
                'Galeria de imagens dinâmica do clube.',
                'Integração de notícias via RSS.',
                'Store expandida com múltiplas categorias.',
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
