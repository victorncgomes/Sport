import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/coach/active-workouts - Treinos ativos de TODOS os usuários
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

        // Verificar se é COACH ou BOARD
        const allowedRoles = ['COACH', 'BOARD', 'ADMIN'];
        if (!allowedRoles.includes(user.role)) {
            return NextResponse.json(
                { error: 'Acesso negado' },
                { status: 403 }
            );
        }

        // Buscar todos os treinos IN_PROGRESS
        const workouts = await prisma.workoutSession.findMany({
            where: {
                status: 'IN_PROGRESS'
            },
            orderBy: { startedAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                }
            }
        });

        return NextResponse.json({ workouts });

    } catch (error) {
        console.error('Error fetching active workouts:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar treinos ativos' },
            { status: 500 }
        );
    }
}
