// Calculador de Nível Inicial baseado na Anamnese
// Sport Club de Natal - Fase 1

export type InitialLevel = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';

export interface AnamneseData {
    // Obrigatórios
    sabeNadar: boolean;
    sabeDesvirarBarco: boolean;

    // Opcionais
    perfilCondicionamento?: 'SEDENTARIO' | 'POUCO_ATIVO' | 'ATIVO' | 'MUITO_ATIVO' | 'ATLETA';
    praticaAtividadeRegular?: boolean;
    experienciaRemo?: 'NENHUMA' | 'TEORICA' | 'JA_REMEI' | 'REGULAR' | 'COMPETIDOR';
    peso?: number;
    altura?: number;
    horasSonoPorNoite?: number;

    // Saúde
    problemasCardiacos?: boolean;
    hipertensao?: boolean;
    diabetesMellitus?: boolean;
}

interface LevelResult {
    level: InitialLevel;
    score: number;
    description: string;
    suggestedTraining: string;
    restrictions: string[];
    initialBoat: string;
}

/**
 * Calcula o nível inicial do atleta baseado na anamnese
 */
export function calculateInitialLevel(data: AnamneseData): LevelResult {
    let score = 0;
    const restrictions: string[] = [];

    // === CRITÉRIOS OBRIGATÓRIOS ===

    // Natação é fundamental
    if (!data.sabeNadar) {
        restrictions.push('Necessário aprender a nadar antes de treinos na água');
        return {
            level: 'INICIANTE',
            score: 0,
            description: 'Foco em natação e treinos indoor',
            suggestedTraining: 'Aulas de natação + familiarização com remo no tanque',
            restrictions,
            initialBoat: 'TANQUE'
        };
    }

    score += 20; // Sabe nadar

    if (data.sabeDesvirarBarco) {
        score += 15;
    } else {
        restrictions.push('Treino de segurança: desvirar barco obrigatório');
    }

    // === CONDICIONAMENTO FÍSICO ===
    const condicionamentoScores: Record<string, number> = {
        SEDENTARIO: 0,
        POUCO_ATIVO: 10,
        ATIVO: 20,
        MUITO_ATIVO: 30,
        ATLETA: 40
    };

    if (data.perfilCondicionamento) {
        score += condicionamentoScores[data.perfilCondicionamento] || 0;
    }

    if (data.praticaAtividadeRegular) {
        score += 10;
    }

    // === EXPERIÊNCIA COM REMO ===
    const experienciaScores: Record<string, number> = {
        NENHUMA: 0,
        TEORICA: 5,
        JA_REMEI: 15,
        REGULAR: 30,
        COMPETIDOR: 50
    };

    if (data.experienciaRemo) {
        score += experienciaScores[data.experienciaRemo] || 0;
    }

    // === SAÚDE ===
    if (data.problemasCardiacos) {
        restrictions.push('Monitoramento cardíaco obrigatório durante treinos');
        score -= 10;
    }

    if (data.hipertensao) {
        restrictions.push('Evitar treinos de alta intensidade sem supervisão');
        score -= 5;
    }

    if (data.diabetesMellitus) {
        restrictions.push('Manter controle glicêmico antes e após treinos');
        score -= 5;
    }

    // === QUALIDADE DE VIDA ===
    if (data.horasSonoPorNoite && data.horasSonoPorNoite >= 7) {
        score += 5;
    }

    // === DETERMINAÇÃO DO NÍVEL ===
    let level: InitialLevel;
    let description: string;
    let suggestedTraining: string;
    let initialBoat: string;

    if (score >= 80) {
        level = 'AVANCADO';
        description = 'Pronto para treinos desafiadores';
        suggestedTraining = '4-5x/semana, 60-90min, intensidade variada';
        initialBoat = 'CANOE'; // Pula o tanque se for avançado
    } else if (score >= 45) {
        level = 'INTERMEDIARIO';
        description = 'Base sólida para evolução';
        suggestedTraining = '3-4x/semana, 45-60min, intensidade moderada';
        initialBoat = 'TANQUE';
    } else {
        level = 'INICIANTE';
        description = 'Foco em fundamentos e técnica';
        suggestedTraining = '2-3x/semana, 30-45min, intensidade baixa';
        initialBoat = 'TANQUE';
    }

    return {
        level,
        score: Math.max(0, score),
        description,
        suggestedTraining,
        restrictions,
        initialBoat
    };
}

/**
 * Retorna cor e badge baseado no nível
 */
export function getLevelInfo(level: InitialLevel): {
    color: string;
    bgColor: string;
    borderColor: string;
    emoji: string;
    label: string;
} {
    switch (level) {
        case 'AVANCADO':
            return {
                color: 'text-orange-400',
                bgColor: 'bg-orange-500/20',
                borderColor: 'border-orange-500',
                emoji: '🔥',
                label: 'Avançado'
            };
        case 'INTERMEDIARIO':
            return {
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/20',
                borderColor: 'border-purple-500',
                emoji: '💪',
                label: 'Intermediário'
            };
        default:
            return {
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/20',
                borderColor: 'border-blue-500',
                emoji: '🌊',
                label: 'Iniciante'
            };
    }
}

/**
 * Calcula IMC se peso e altura forem informados
 */
export function calculateBMI(peso?: number, altura?: number): number | null {
    if (!peso || !altura || altura === 0) return null;
    const alturaMetros = altura / 100;
    return Math.round((peso / (alturaMetros * alturaMetros)) * 10) / 10;
}

/**
 * Retorna categoria de IMC
 */
export function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
}
