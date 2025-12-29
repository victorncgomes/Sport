import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// GET /api/workouts/history - Histórico de treinos do usuário
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

        const { searchParams } = new URL(request.url);
        const mode = searchParams.get('mode');
        const status = searchParams.get('status') || 'COMPLETED';
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = {
            userId: user.id,
            status
        };

        if (mode && mode !== 'ALL') {
            where.mode = mode;
        }

        const [workouts, total] = await Promise.all([
            prisma.workoutSession.findMany({
                where,
                orderBy: { startedAt: 'desc' },
                take: limit,
                skip: offset,
                include: {
                    template: {
                        select: {
                            title: true,
                            type: true
                        }
                    }
                }
            }),
            prisma.workoutSession.count({ where })
        ]);

        return NextResponse.json({
            workouts,
            total,
            limit,
            offset
        });

    } catch (error) {
        console.error('Error fetching workout history:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar histórico' },
            { status: 500 }
        );
    }
}
