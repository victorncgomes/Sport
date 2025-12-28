import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/gamification/award-points - Conceder pontos (BOARD/SYSTEM)
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

        // Apenas BOARD/ADMIN podem conceder pontos manualmente
        if (user.role !== 'BOARD' && user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Sem permissão' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { userId, points, reason } = body;

        if (!userId || !points) {
            return NextResponse.json(
                { error: 'userId e points são obrigatórios' },
                { status: 400 }
            );
        }

        // Atualizar pontos
        const targetUser = await prisma.user.update({
            where: { id: userId },
            data: {
                points: { increment: points }
            }
        });

        // Criar log
        await prisma.activityLog.create({
            data: {
                userId,
                activityType: 'MANUAL_POINTS_AWARD',
                description: reason || 'Pontos concedidos pela diretoria',
                xpEarned: points,
                metadata: JSON.stringify({ awardedBy: user.id })
            }
        });

        return NextResponse.json({
            success: true,
            newTotal: targetUser.points
        });

    } catch (error) {
        console.error('Error awarding points:', error);
        return NextResponse.json(
            { error: 'Erro ao conceder pontos' },
            { status: 500 }
        );
    }
}
