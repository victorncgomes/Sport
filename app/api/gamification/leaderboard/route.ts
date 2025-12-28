import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/gamification/leaderboard - Ranking de usuários
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'all-time'; // all-time, monthly, weekly
        const limit = parseInt(searchParams.get('limit') || '50');

        let where: any = {};

        // Filtrar por período
        if (period === 'monthly') {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            where.createdAt = { gte: startOfMonth };
        } else if (period === 'weekly') {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            where.createdAt = { gte: startOfWeek };
        }

        // Buscar top usuários por pontos
        const leaderboard = await prisma.user.findMany({
            where,
            orderBy: { points: 'desc' },
            take: limit,
            select: {
                id: true,
                name: true,
                image: true,
                role: true,
                points: true,
                level: true,
                createdAt: true
            }
        });

        // Adicionar ranking
        const rankedLeaderboard = leaderboard.map((user, index) => ({
            ...user,
            rank: index + 1
        }));

        return NextResponse.json({
            leaderboard: rankedLeaderboard,
            period,
            total: rankedLeaderboard.length
        });

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar ranking' },
            { status: 500 }
        );
    }
}
