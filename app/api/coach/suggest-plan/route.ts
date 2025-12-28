import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

// Algoritmo de sugestão de planilhas baseado em anamnese
function suggestWorkoutPlan(anamnese: any) {
    const {
        experience,
        goals,
        availability,
        injuries,
        swimLevel,
        canFlipBoat
    } = anamnese;

    // Determinar nível
    let level = 'beginner';
    if (experience > 12) level = 'advanced';
    else if (experience > 6) level = 'intermediate';

    // Determinar frequência semanal
    const weeklyFrequency = Math.min(availability || 3, 6);

    // Determinar foco baseado em objetivos
    const focus = goals?.includes('competição') ? 'performance' :
        goals?.includes('saúde') ? 'fitness' : 'technique';

    // Gerar planilha
    const plan = {
        name: `Planilha ${level === 'beginner' ? 'Iniciante' : level === 'intermediate' ? 'Intermediário' : 'Avançado'} - ${focus}`,
        level,
        focus,
        weeklyFrequency,
        duration: 12, // semanas
        restrictions: injuries || [],
        requiresTankFirst: !canFlipBoat,
        weeks: generateWeeks(level, focus, weeklyFrequency, injuries)
    };

    return plan;
}

function generateWeeks(level: string, focus: string, frequency: number, injuries: string[]) {
    const weeks = [];

    for (let week = 1; week <= 12; week++) {
        const sessions = [];

        for (let day = 1; day <= frequency; day++) {
            const session = generateSession(level, focus, week, day, injuries);
            sessions.push(session);
        }

        weeks.push({
            week,
            sessions,
            notes: week % 4 === 0 ? 'Semana de recuperação' : ''
        });
    }

    return weeks;
}

function generateSession(level: string, focus: string, week: number, day: number, injuries: string[]) {
    const hasInjury = injuries && injuries.length > 0;

    // Intensidade progressiva
    const baseIntensity = level === 'beginner' ? 60 : level === 'intermediate' ? 70 : 80;
    const weekMultiplier = Math.min(1 + (week / 12) * 0.2, 1.2);
    const intensity = Math.round(baseIntensity * weekMultiplier);

    // Duração baseada no nível
    const baseDuration = level === 'beginner' ? 45 : level === 'intermediate' ? 60 : 75;
    const duration = hasInjury ? Math.round(baseDuration * 0.8) : baseDuration;

    // Tipo de treino baseado no foco e dia da semana
    let type = 'technique';
    if (focus === 'performance') {
        if (day === 1 || day === 4) type = 'endurance';
        else if (day === 2 || day === 5) type = 'intervals';
        else type = 'technique';
    } else if (focus === 'fitness') {
        type = day % 2 === 0 ? 'endurance' : 'technique';
    }

    return {
        day,
        type,
        duration,
        intensity,
        warmup: 10,
        cooldown: 10,
        description: getSessionDescription(type, level, intensity),
        exercises: getExercises(type, level, hasInjury)
    };
}

function getSessionDescription(type: string, level: string, intensity: number) {
    const descriptions: any = {
        technique: {
            beginner: 'Foco em técnica básica de remada e postura',
            intermediate: 'Refinamento de técnica e eficiência',
            advanced: 'Técnica avançada e otimização de movimento'
        },
        endurance: {
            beginner: 'Treino aeróbico leve para construir base',
            intermediate: 'Treino de resistência aeróbica moderada',
            advanced: 'Treino de resistência de alta intensidade'
        },
        intervals: {
            beginner: 'Intervalos curtos para adaptação',
            intermediate: 'Intervalos moderados com recuperação ativa',
            advanced: 'Intervalos de alta intensidade'
        }
    };

    return descriptions[type]?.[level] || 'Treino geral';
}

function getExercises(type: string, level: string, hasInjury: boolean) {
    const exercises: any = {
        technique: [
            { name: 'Remada técnica', sets: 3, duration: '10min', intensity: 'baixa' },
            { name: 'Exercícios de postura', sets: 2, duration: '5min', intensity: 'baixa' },
            { name: 'Remada com foco em pegada', sets: 2, duration: '8min', intensity: 'moderada' }
        ],
        endurance: [
            { name: 'Remada contínua', sets: 1, duration: '30min', intensity: 'moderada' },
            { name: 'Remada em ritmo', sets: 2, duration: '10min', intensity: 'moderada' }
        ],
        intervals: [
            { name: 'Intervalos 500m', sets: 6, duration: '2min', rest: '2min', intensity: 'alta' },
            { name: 'Recuperação ativa', sets: 1, duration: '10min', intensity: 'baixa' }
        ]
    };

    let sessionExercises = exercises[type] || exercises.technique;

    // Ajustar para lesões
    if (hasInjury) {
        sessionExercises = sessionExercises.map((ex: any) => ({
            ...ex,
            intensity: ex.intensity === 'alta' ? 'moderada' : ex.intensity,
            notes: 'Ajustado para prevenção de lesões'
        }));
    }

    return sessionExercises;
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { userId } = await request.json();

        // Buscar anamnese do usuário
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                anamnese: true
            }
        });

        if (!user || !user.anamnese) {
            return NextResponse.json({
                error: 'Anamnese não encontrada. O atleta precisa preencher a anamnese primeiro.'
            }, { status: 404 });
        }

        // Gerar sugestão de planilha
        const suggestedPlan = suggestWorkoutPlan(user.anamnese);

        return NextResponse.json({
            success: true,
            plan: suggestedPlan,
            message: 'Planilha gerada com sucesso. Revise e ajuste conforme necessário antes de aprovar.'
        });

    } catch (error) {
        console.error('Error generating workout plan:', error);
        return NextResponse.json(
            { error: 'Erro ao gerar planilha' },
            { status: 500 }
        );
    }
}
