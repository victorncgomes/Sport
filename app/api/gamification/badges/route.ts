import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/gamification/badges - Listar badges disponíveis
export async function GET(request: NextRequest) {
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

        // Buscar todos os badges
        const allBadges = await prisma.badge.findMany({
            orderBy: { category: 'asc' }
        });

        // Buscar badges do usuário
        const userBadges = await prisma.userBadge.findMany({
            where: { userId: user.id },
            include: {
                badge: true
            }
        });

        const userBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

        // Marcar badges desbloqueados
        const badgesWithStatus = allBadges.map(badge => ({
            ...badge,
            unlocked: userBadgeIds.has(badge.id),
            unlockedAt: userBadges.find(ub => ub.badgeId === badge.id)?.unlockedAt || null
        }));

        return NextResponse.json({
            badges: badgesWithStatus,
            totalUnlocked: userBadgeIds.size,
            totalAvailable: allBadges.length
        });

    } catch (error) {
        console.error('Error fetching badges:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar badges' },
            { status: 500 }
        );
    }
}
