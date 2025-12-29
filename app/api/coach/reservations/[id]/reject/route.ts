import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/coach/reservations/[id]/reject - Rejeitar reserva
export async function POST(
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

        // Verificar permissão
        const allowedRoles = ['COACH', 'BOARD', 'ADMIN'];
        if (!allowedRoles.includes(user.role)) {
            return NextResponse.json(
                { error: 'Acesso negado' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { reason } = body;

        // Atualizar reserva
        const reservation = await prisma.reservation.update({
            where: { id: params.id },
            data: {
                status: 'CANCELLED',
                notes: reason ? `Rejeitada: ${reason}` : 'Rejeitada pelo treinador'
            }
        });

        // TODO: Criar notificação para o usuário

        return NextResponse.json({
            success: true,
            reservation
        });

    } catch (error) {
        console.error('Error rejecting reservation:', error);
        return NextResponse.json(
            { error: 'Erro ao rejeitar reserva' },
            { status: 500 }
        );
    }
}
