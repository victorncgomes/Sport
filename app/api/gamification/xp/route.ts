import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { XP_ACTIONS, checkLevelUp } from '@/lib/utils/xp-system';

interface AddXPRequest {
    action: keyof typeof XP_ACTIONS;
    customAmount?: number;
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body: AddXPRequest = await request.json();
        const { action, customAmount } = body;

        // Determinar quantidade de XP
        let xpAmount = customAmount || XP_ACTIONS[action] || 0;

        if (xpAmount <= 0) {
            return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
        }

        // Buscar usuário atual
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const oldXP = user.points;
        const newXP = oldXP + xpAmount;

        // Verificar level up
        const levelUpInfo = checkLevelUp(oldXP, newXP);

        // Atualizar usuário
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                points: newXP,
                level: levelUpInfo.newLevel
            }
        });

        // Registrar atividade
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                activityType: 'XP_GAIN',
                description: `Ganhou ${xpAmount} XP por ${action}`,
                xpEarned: xpAmount,
                metadata: JSON.stringify({ action, leveledUp: levelUpInfo.leveledUp })
            }
        });

        return NextResponse.json({
            success: true,
            xpGained: xpAmount,
            totalXP: newXP,
            ...levelUpInfo
        });
    } catch (error) {
        console.error('Error adding XP:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { points: true, level: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        return NextResponse.json({
            xp: user.points,
            level: user.level
        });
    } catch (error) {
        console.error('Error fetching XP:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
