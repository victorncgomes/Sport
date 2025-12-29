import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/gamification/unlock-badge - Desbloquear badge (SYSTEM)
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { badgeId, userId } = body;

        const targetUserId = userId || user.id;

        // Verificar se badge existe
        const badge = await prisma.badge.findUnique({
            where: { id: badgeId }
        });

        if (!badge) {
            return NextResponse.json({ error: 'Badge não encontrado' }, { status: 404 });
        }

        // Verificar se já possui
        const existing = await prisma.userBadge.findUnique({
            where: {
                userId_badgeId: {
                    userId: targetUserId,
                    badgeId
                }
            }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Badge já desbloqueado' },
                { status: 400 }
            );
        }

        // Desbloquear badge
        const userBadge = await prisma.userBadge.create({
            data: {
                userId: targetUserId,
                badgeId
            },
            include: {
                badge: true
            }
        });

        // Criar log
        await prisma.activityLog.create({
            data: {
                userId: targetUserId,
                activityType: 'BADGE_UNLOCKED',
                description: `Desbloqueou o badge: ${badge.name}`,
                xpEarned: 0,
                metadata: JSON.stringify({ badgeId })
            }
        });

        return NextResponse.json({
            success: true,
            userBadge
        });

    } catch (error) {
        console.error('Error unlocking badge:', error);
        return NextResponse.json(
            { error: 'Erro ao desbloquear badge' },
            { status: 500 }
        );
    }
}
