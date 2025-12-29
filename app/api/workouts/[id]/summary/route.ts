import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { getXPProgress, getLevelRewards } from '@/lib/utils/xp-system';

// GET /api/workouts/[id]/summary - Resumo do treino
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Buscar sessão
        const workoutSession = await prisma.workoutSession.findUnique({
            where: { id: params.id }
        });

        if (!workoutSession) {
            return NextResponse.json({ error: 'Treino não encontrado' }, { status: 404 });
        }

        if (workoutSession.userId !== user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        // Buscar recordes pessoais
        const personalRecords: string[] = [];

        // Verificar recorde de distância
        if (workoutSession.distance) {
            const previousBest = await prisma.workoutSession.findFirst({
                where: {
                    userId: user.id,
                    id: { not: params.id },
                    status: 'COMPLETED'
                },
                orderBy: { distance: 'desc' },
                select: { distance: true }
            });

            if (!previousBest || (workoutSession.distance > (previousBest.distance || 0))) {
                personalRecords.push(`Novo recorde de distância: ${(workoutSession.distance / 1000).toFixed(2)} km`);
            }
        }

        // Verificar recorde de pace
        if (workoutSession.avgPace) {
            const paceToSeconds = (pace: string) => {
                const [min, sec] = pace.replace('/500m', '').split(':').map(Number);
                return min * 60 + sec;
            };

            const currentPaceSeconds = paceToSeconds(workoutSession.avgPace);

            const previousBestPace = await prisma.workoutSession.findFirst({
                where: {
                    userId: user.id,
                    id: { not: params.id },
                    status: 'COMPLETED',
                    avgPace: { not: null }
                },
                select: { avgPace: true }
            });

            if (previousBestPace?.avgPace) {
                const previousPaceSeconds = paceToSeconds(previousBestPace.avgPace);
                if (currentPaceSeconds < previousPaceSeconds) {
                    personalRecords.push(`Novo recorde de pace: ${workoutSession.avgPace}`);
                }
            } else {
                personalRecords.push(`Primeiro treino com pace registrado: ${workoutSession.avgPace}`);
            }
        }

        // Buscar total de treinos do mês
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyCount = await prisma.workoutSession.count({
            where: {
                userId: user.id,
                status: 'COMPLETED',
                completedAt: { gte: startOfMonth }
            }
        });

        // Verificar se é milestone
        if (monthlyCount === 10) {
            personalRecords.push('🎉 10 treinos este mês!');
        } else if (monthlyCount === 20) {
            personalRecords.push('🏆 20 treinos este mês! Incrível!');
        }

        return NextResponse.json({
            duration: workoutSession.duration || 0,
            distance: workoutSession.distance || 0,
            avgPace: workoutSession.avgPace || '--:--',
            avgSPM: workoutSession.avgSPM || 0,
            calories: workoutSession.calories || 0,
            xpEarned: workoutSession.pointsEarned || 0,
            personalRecords,
            mode: workoutSession.mode,
            completedAt: workoutSession.completedAt,
            monthlyCount,
            // Level info
            currentLevel: user.level,
            currentXP: user.points,
            xpProgress: getXPProgress(user.points),
            rewards: getLevelRewards(user.level)
        });

    } catch (error) {
        console.error('Error getting workout summary:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar resumo' },
            { status: 500 }
        );
    }
}
