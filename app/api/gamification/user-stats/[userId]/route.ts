import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/gamification/user-stats/[userId] - Estatísticas de gamificação do usuário
export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: params.userId },
            select: {
                id: true,
                name: true,
                image: true,
                points: true,
                level: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Buscar badges desbloqueados
        const badges = await prisma.userBadge.count({
            where: { userId: params.userId }
        });

        // Buscar atividades recentes
        const recentActivities = await prisma.activityLog.findMany({
            where: { userId: params.userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Calcular total de XP ganho
        const totalXP = await prisma.activityLog.aggregate({
            where: { userId: params.userId },
            _sum: { xpEarned: true }
        });

        // Buscar treinos completados
        const workoutsCompleted = await prisma.workoutSession.count({
            where: {
                userId: params.userId,
                status: 'COMPLETED'
            }
        });

        // Buscar tarefas de voluntariado completadas
        const volunteerTasksCompleted = await prisma.volunteerTask.count({
            where: {
                assignedToId: params.userId,
                status: 'COMPLETED'
            }
        });

        // Calcular ranking
        const usersAbove = await prisma.user.count({
            where: {
                points: { gt: user.points }
            }
        });

        const rank = usersAbove + 1;

        return NextResponse.json({
            user,
            stats: {
                points: user.points,
                level: user.level,
                totalXP: totalXP._sum.xpEarned || 0,
                badgesUnlocked: badges,
                workoutsCompleted,
                volunteerTasksCompleted,
                rank
            },
            recentActivities
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar estatísticas' },
            { status: 500 }
        );
    }
}
