// ════════════════════════════════════════════════════════════════
// REGRAS DE GAMIFICAÇÃO - Sport Club de Natal
// Arquivo centralizado com todas as regras de XP do sistema
// ════════════════════════════════════════════════════════════════

/**
 * XP_ACTIONS: Pontos ganhos por cada ação no sistema
 * Estas regras podem ser editadas pela diretoria no painel administrativo
 */
export const XP_ACTIONS = {
    // ═══════════════════════════════════════════════════════════
    // CADASTRO & ONBOARDING
    // ═══════════════════════════════════════════════════════════
    COMPLETAR_CADASTRO: 50,
    ADICIONAR_FOTO_PERFIL: 10,
    PREENCHER_ANAMNESE: 100,
    PRIMEIRO_LOGIN_APP: 20,

    // ═══════════════════════════════════════════════════════════
    // VOLUNTARIADO
    // ═══════════════════════════════════════════════════════════
    ASSINAR_TERMO_VOLUNTARIADO: 25,
    CADASTRAR_DISPONIBILIDADE_HORA: 5,    // por hora cadastrada
    CUMPRIR_ESCALA: 15,                   // por comparecimento confirmado
    COMPLETAR_TAREFA_VOLUNTARIO: 30,
    TAREFA_BEM_AVALIADA: 20,              // avaliação 4-5 estrelas
    VOLUNTARIO_DO_MES: 200,

    // ═══════════════════════════════════════════════════════════
    // TREINOS
    // ═══════════════════════════════════════════════════════════
    PRIMEIRO_TREINO: 50,
    COMPLETAR_AQUECIMENTO: 5,
    COMPLETAR_TREINO: 25,
    COMPLETAR_ALONGAMENTO: 5,
    BATER_RECORDE_PESSOAL: 50,
    TREINO_EM_GRUPO: 15,
    TREINO_CONSECUTIVO_3_DIAS: 20,        // streak

    // ═══════════════════════════════════════════════════════════
    // GARAGEM & BARCOS
    // ═══════════════════════════════════════════════════════════
    CHECKIN_CLUBE: 5,
    CHECKOUT_NO_PRAZO: 5,
    CHECKOUT_BARCO_LIMPO: 10,
    LAVAR_BARCO: 3,
    REPORTAR_PROBLEMA_MANUTENCAO: 10,
    DESBLOQUEAR_BARCO: 75,

    // ═══════════════════════════════════════════════════════════
    // STORE & COMPRAS
    // ═══════════════════════════════════════════════════════════
    PRIMEIRA_COMPRA: 25,
    COMPRA_NA_STORE: 10,                  // por compra realizada
    AVALIAR_PRODUTO: 5,

    // ═══════════════════════════════════════════════════════════
    // COMPETIÇÕES
    // ═══════════════════════════════════════════════════════════
    PARTICIPAR_COMPETICAO: 50,
    PODIO_COMPETICAO: 100,
    PRIMEIRO_LUGAR: 200,

    // ═══════════════════════════════════════════════════════════
    // STREAKS (SEQUÊNCIAS)
    // ═══════════════════════════════════════════════════════════
    STREAK_3_DIAS: 20,
    STREAK_7_DIAS: 50,
    STREAK_14_DIAS: 100,
    STREAK_30_DIAS: 250,
    STREAK_100_DIAS: 1000,

    // ═══════════════════════════════════════════════════════════
    // SOCIAL & ENGAJAMENTO
    // ═══════════════════════════════════════════════════════════
    CONVIDAR_AMIGO: 50,                   // quando amigo se cadastra
    COMPARTILHAR_TREINO: 5,
    PARTICIPAR_EVENTO: 20,
} as const;

/**
 * Categorias de ações para organização no painel da diretoria
 */
export const XP_CATEGORIES = {
    ONBOARDING: {
        label: 'Cadastro & Onboarding',
        icon: 'UserPlus',
        actions: ['COMPLETAR_CADASTRO', 'ADICIONAR_FOTO_PERFIL', 'PREENCHER_ANAMNESE', 'PRIMEIRO_LOGIN_APP']
    },
    VOLUNTARIADO: {
        label: 'Voluntariado',
        icon: 'Heart',
        actions: ['ASSINAR_TERMO_VOLUNTARIADO', 'CADASTRAR_DISPONIBILIDADE_HORA', 'CUMPRIR_ESCALA', 'COMPLETAR_TAREFA_VOLUNTARIO', 'TAREFA_BEM_AVALIADA', 'VOLUNTARIO_DO_MES']
    },
    TREINOS: {
        label: 'Treinos',
        icon: 'Dumbbell',
        actions: ['PRIMEIRO_TREINO', 'COMPLETAR_AQUECIMENTO', 'COMPLETAR_TREINO', 'COMPLETAR_ALONGAMENTO', 'BATER_RECORDE_PESSOAL', 'TREINO_EM_GRUPO', 'TREINO_CONSECUTIVO_3_DIAS']
    },
    GARAGEM: {
        label: 'Garagem & Barcos',
        icon: 'Ship',
        actions: ['CHECKIN_CLUBE', 'CHECKOUT_NO_PRAZO', 'CHECKOUT_BARCO_LIMPO', 'LAVAR_BARCO', 'REPORTAR_PROBLEMA_MANUTENCAO', 'DESBLOQUEAR_BARCO']
    },
    STORE: {
        label: 'Store & Compras',
        icon: 'ShoppingBag',
        actions: ['PRIMEIRA_COMPRA', 'COMPRA_NA_STORE', 'AVALIAR_PRODUTO']
    },
    COMPETICOES: {
        label: 'Competições',
        icon: 'Trophy',
        actions: ['PARTICIPAR_COMPETICAO', 'PODIO_COMPETICAO', 'PRIMEIRO_LUGAR']
    },
    STREAKS: {
        label: 'Sequências',
        icon: 'Flame',
        actions: ['STREAK_3_DIAS', 'STREAK_7_DIAS', 'STREAK_14_DIAS', 'STREAK_30_DIAS', 'STREAK_100_DIAS']
    },
    SOCIAL: {
        label: 'Social',
        icon: 'Users',
        actions: ['CONVIDAR_AMIGO', 'COMPARTILHAR_TREINO', 'PARTICIPAR_EVENTO']
    }
} as const;

/**
 * Recompensas por nível
 */
export const LEVEL_REWARDS: Record<number, string[]> = {
    5: ['Badge "Remador Dedicado"', 'Acesso a estatísticas detalhadas'],
    10: ['+1 slot de reserva simultânea', 'Badge "Persistente"'],
    15: ['Acesso a treinos premium', 'Badge "Experiente"'],
    20: ['Badge "Veterano"', 'Desconto 10% na loja'],
    25: ['Desconto 15% na loja', 'Prioridade em reservas'],
    30: ['Acesso ao clube VIP', 'Badge "Elite"'],
    40: ['Badge "Mestre do Remo"', 'Desconto 20% na loja'],
    50: ['Badge "Lenda do Clube" 👑', 'Acesso a área exclusiva'],
};

/**
 * Badges especiais (não vinculadas a nível)
 */
export const SPECIAL_BADGES = {
    VOLUNTARIO_DO_MES: {
        id: 'voluntario-do-mes',
        name: 'Voluntário do Mês',
        description: 'Maior contribuição em horas de voluntariado no mês',
        icon: '🏅',
        xpBonus: 200
    },
    PRIMEIRO_TREINO_AGUA: {
        id: 'primeiro-treino-agua',
        name: 'Primeiro Treino na Água',
        description: 'Completou o primeiro treino no Rio Potengi',
        icon: '🌊',
        xpBonus: 100
    },
    MADRUGADOR: {
        id: 'madrugador',
        name: 'Madrugador',
        description: 'Treinou antes das 6h da manhã',
        icon: '🌅',
        xpBonus: 25
    },
    REMADOR_NOTURNO: {
        id: 'remador-noturno',
        name: 'Remador do Pôr do Sol',
        description: 'Treinou após as 17h',
        icon: '🌆',
        xpBonus: 25
    }
} as const;

export type XPActionType = keyof typeof XP_ACTIONS;
export type XPCategoryType = keyof typeof XP_CATEGORIES;
