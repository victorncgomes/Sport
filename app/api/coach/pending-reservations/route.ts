import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// GET /api/coach/pending-reservations - Reservas pendentes de TODOS os usuários
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

        // Buscar todas as reservas PENDING
        const reservations = await prisma.reservation.findMany({
            where: {
                status: 'PENDING'
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                },
                resource: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    }
                }
            }
        });

        return NextResponse.json({ reservations });

    } catch (error) {
        console.error('Error fetching pending reservations:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar reservas pendentes' },
            { status: 500 }
        );
    }
}
