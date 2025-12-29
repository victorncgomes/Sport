import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/coach/reservations/[id]/approve - Aprovar reserva
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

        // Atualizar reserva
        const reservation = await prisma.reservation.update({
            where: { id: params.id },
            data: {
                status: 'CONFIRMED'
            }
        });

        // Atualizar status do recurso
        await prisma.resource.update({
            where: { id: reservation.resourceId },
            data: { status: 'RESERVED' }
        });

        // TODO: Criar notificação para o usuário

        return NextResponse.json({
            success: true,
            reservation
        });

    } catch (error) {
        console.error('Error approving reservation:', error);
        return NextResponse.json(
            { error: 'Erro ao aprovar reserva' },
            { status: 500 }
        );
    }
}
