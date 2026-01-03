/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DOCUMENTAÇÃO SYNC CHECKER - Sport Club de Natal
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Este módulo verifica se a documentação de ajuda está sincronizada com
 * as funcionalidades implementadas no sistema.
 * 
 * USO:
 * - Importe getDocumentationSyncStatus() para verificar sincronização
 * - Compare HELP_DOC_VERSION com APP_VERSION
 * - Use IMPLEMENTED_FEATURES para saber o que está documentado
 * 
 * PARA IA/AGENTE:
 * Quando precisar verificar o que está implementado vs documentado,
 * consulte este arquivo e a página /ajuda para informações completas.
 */

// Versão atual da aplicação (deve bater com package.json)
export const APP_VERSION = '0.4.9';

// Versão da documentação de ajuda (deve bater com ajuda/page.tsx)
export const HELP_DOC_VERSION = '0.4.9';

// Data da última atualização da documentação
export const LAST_DOC_UPDATE = '2026-01-02';

// Registro de todas as funcionalidades do sistema e seu status de documentação
export interface FeatureDocStatus {
    id: string;
    name: string;
    path: string;
    implementedVersion: string;
    documentedVersion: string | null;
    status: 'documented' | 'pending' | 'outdated';
    notes?: string;
}

// Lista mestre de funcionalidades
export const FEATURE_REGISTRY: FeatureDocStatus[] = [
    // Públicas
    { id: 'home', name: 'Página Inicial', path: '/', implementedVersion: '0.1.0', documentedVersion: '0.4.8', status: 'documented' },
    { id: 'news', name: 'Notícias', path: '/news', implementedVersion: '0.2.0', documentedVersion: '0.4.8', status: 'documented' },
    { id: 'gallery', name: 'Galeria', path: '/gallery', implementedVersion: '0.4.8', documentedVersion: '0.4.8', status: 'documented', notes: 'Role-based posting added' },
    { id: 'store', name: 'Loja/Cantina', path: '/store', implementedVersion: '0.3.5', documentedVersion: '0.4.8', status: 'documented' },
    { id: 'about', name: 'Sobre/Contato', path: '/about', implementedVersion: '0.2.0', documentedVersion: '0.4.8', status: 'documented' },

    // Sócios
    { id: 'trainings', name: 'Meus Treinos', path: '/trainings', implementedVersion: '0.4.0', documentedVersion: '0.4.8', status: 'documented' },
    { id: 'training-live', name: 'Treino ao Vivo', path: '/training/live', implementedVersion: '0.4.5', documentedVersion: '0.4.8', status: 'documented', notes: 'GPS e cronômetro funcionais' },
    { id: 'garage', name: 'Garagem', path: '/garage', implementedVersion: '0.4.0', documentedVersion: '0.4.8', status: 'documented' },
    { id: 'tides', name: 'Tábua de Marés', path: '/tides', implementedVersion: '0.4.2', documentedVersion: '0.4.8', status: 'documented' },
    { id: 'voluntariado', name: 'Voluntariado', path: '/voluntariado', implementedVersion: '0.4.0', documentedVersion: '0.4.8', status: 'documented' },
    { id: 'profile', name: 'Perfil', path: '/profile/panel', implementedVersion: '0.3.0', documentedVersion: '0.4.8', status: 'documented' },

    // Coach
    { id: 'coach-painel', name: 'Painel Coach', path: '/coach/painel', implementedVersion: '0.4.5', documentedVersion: '0.4.9', status: 'documented', notes: 'Botões linkados: Chamada, Metas, Ajustes' },
    { id: 'coach-programs', name: 'Programas de Treino', path: '/coach/programs', implementedVersion: '0.4.5', documentedVersion: '0.4.8', status: 'documented' },
    { id: 'coach-chamada', name: 'Chamada', path: '/coach/chamada', implementedVersion: '0.4.9', documentedVersion: '0.4.9', status: 'documented', notes: 'Controle de presença de atletas' },
    { id: 'coach-diary', name: 'Diário do Treinador', path: '/coach/diary', implementedVersion: '0.4.5', documentedVersion: '0.4.9', status: 'documented', notes: 'Atletas vinculados obrigatório' },

    // Diretoria
    { id: 'diretoria', name: 'Painel Diretoria', path: '/diretoria', implementedVersion: '0.4.0', documentedVersion: '0.4.8', status: 'documented' },
    { id: 'diretoria-noticias', name: 'Gerenciar Notícias', path: '/diretoria/noticias', implementedVersion: '0.4.8', documentedVersion: '0.4.8', status: 'documented', notes: 'Upload + IA pendentes' },
    { id: 'diretoria-voluntariado', name: 'Controle Voluntariado', path: '/diretoria/voluntariado', implementedVersion: '0.4.0', documentedVersion: '0.4.9', status: 'documented', notes: 'Botão Nova Área adicionado' },

    // Training
    { id: 'training-gym', name: 'Treino Musculação', path: '/training/live/gym', implementedVersion: '0.4.5', documentedVersion: '0.4.9', status: 'documented', notes: 'Botões +/- visíveis (roxo/azul)' },
    { id: 'training-my-program', name: 'Meu Programa', path: '/training/my-program', implementedVersion: '0.4.5', documentedVersion: '0.4.9', status: 'documented', notes: 'Navegação de semanas ◀▶' },
    { id: 'training-other', name: 'Outras Atividades', path: '/training/other-activities', implementedVersion: '0.4.5', documentedVersion: '0.4.9', status: 'documented', notes: 'Roteamento sport=OTHER corrigido' },

    // Ajuda
    { id: 'ajuda', name: 'Central de Ajuda', path: '/ajuda', implementedVersion: '0.4.8', documentedVersion: '0.4.8', status: 'documented' },
];

// Changelog simplificado para referência
export const CHANGELOG_SUMMARY = [
    { version: '0.4.9', date: '2026-01-02', changes: ['Gym +/- visíveis', 'My-program semanas', 'Coach chamada', 'Font flash fix', 'Outras atividades fix'] },
    { version: '0.4.8', date: '2026-01-02', changes: ['Fix bottom menu', 'Fix search mobile', 'Criar página de ajuda', 'Melhorias na galeria'] },
    { version: '0.4.7', date: '2026-01-01', changes: ['Correção de imagens de notícias', 'Correção do Coach menu', 'Mapa no contato'] },
    { version: '0.4.5', date: '2025-12-30', changes: ['Módulo Coach completo', 'Treino ao vivo com GPS'] },
    { version: '0.4.2', date: '2025-12-29', changes: ['Tábua de marés com dados reais', 'Widget de condições'] },
    { version: '0.4.0', date: '2025-12-28', changes: ['Sistema de treinos', 'Gamificação XP', 'Voluntariado', 'Diretoria'] },
    { version: '0.3.5', date: '2025-12-27', changes: ['Store/Cantina', 'Produtos e cardápio'] },
    { version: '0.3.0', date: '2025-12-26', changes: ['Galeria de fotos', 'Perfil do usuário'] },
    { version: '0.2.0', date: '2025-12-25', changes: ['Notícias', 'Página sobre', 'Autenticação'] },
    { version: '0.1.0', date: '2025-12-24', changes: ['Estrutura inicial', 'Layout base', 'Navegação'] },
];

/**
 * Verifica o status de sincronização da documentação
 */
export function getDocumentationSyncStatus(): {
    isInSync: boolean;
    appVersion: string;
    docVersion: string;
    pendingFeatures: FeatureDocStatus[];
    outdatedFeatures: FeatureDocStatus[];
    documentedCount: number;
    totalCount: number;
    syncPercentage: number;
} {
    const pending = FEATURE_REGISTRY.filter(f => f.status === 'pending');
    const outdated = FEATURE_REGISTRY.filter(f => f.status === 'outdated');
    const documented = FEATURE_REGISTRY.filter(f => f.status === 'documented');

    return {
        isInSync: APP_VERSION === HELP_DOC_VERSION && pending.length === 0 && outdated.length === 0,
        appVersion: APP_VERSION,
        docVersion: HELP_DOC_VERSION,
        pendingFeatures: pending,
        outdatedFeatures: outdated,
        documentedCount: documented.length,
        totalCount: FEATURE_REGISTRY.length,
        syncPercentage: Math.round((documented.length / FEATURE_REGISTRY.length) * 100),
    };
}

/**
 * Retorna funcionalidades que precisam ser documentadas
 */
export function getPendingDocumentation(): FeatureDocStatus[] {
    return FEATURE_REGISTRY.filter(f => f.status === 'pending' || f.status === 'outdated');
}

/**
 * Retorna o changelog desde uma versão específica
 */
export function getChangelogSince(version: string): typeof CHANGELOG_SUMMARY {
    const versionIndex = CHANGELOG_SUMMARY.findIndex(c => c.version === version);
    if (versionIndex === -1) return CHANGELOG_SUMMARY;
    return CHANGELOG_SUMMARY.slice(0, versionIndex);
}

/**
 * Verifica se uma feature específica está documentada
 */
export function isFeatureDocumented(featureId: string): boolean {
    const feature = FEATURE_REGISTRY.find(f => f.id === featureId);
    return feature?.status === 'documented';
}

/**
 * Registra uma nova feature (para uso durante desenvolvimento)
 * Nota: Esta função é apenas para referência, a lista deve ser atualizada manualmente
 */
export function registerNewFeature(
    id: string,
    name: string,
    path: string,
    version: string
): FeatureDocStatus {
    const newFeature: FeatureDocStatus = {
        id,
        name,
        path,
        implementedVersion: version,
        documentedVersion: null,
        status: 'pending',
    };

    console.warn(
        `[Doc Sync] Nova feature "${name}" registrada como pendente de documentação.\n` +
        `Adicione ao FEATURE_REGISTRY em lib/config/documentation-sync.ts e atualize /ajuda`
    );

    return newFeature;
}
