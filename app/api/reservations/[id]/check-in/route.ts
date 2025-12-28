import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/reservations/[id]/check-in - Check-in (pegar barco)
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

        // Buscar reserva
        const reservation = await prisma.reservation.findUnique({
            where: { id: params.id },
            include: { resource: true }
        });

        if (!reservation) {
            return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
        }

        if (reservation.userId !== user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        if (reservation.status !== 'CONFIRMED') {
            return NextResponse.json({
                error: 'Apenas reservas confirmadas podem fazer check-in',
                currentStatus: reservation.status
            }, { status: 400 });
        }

        // Verificar horário (permitir 15min antes)
        const now = new Date();
        const startAt = new Date(reservation.startAt);
        const fifteenMinBefore = new Date(startAt.getTime() - 15 * 60 * 1000);

        if (now < fifteenMinBefore) {
            return NextResponse.json({
                error: 'Check-in só pode ser feito 15 minutos antes do horário',
                startAt: reservation.startAt
            }, { status: 400 });
        }

        // Atualizar reserva
        const updated = await prisma.reservation.update({
            where: { id: params.id },
            data: {
                status: 'IN_USE',
                actualStartAt: now
            }
        });

        // Atualizar status do recurso
        await prisma.resource.update({
            where: { id: reservation.resourceId },
            data: {
                status: 'IN_USE',
                usageCount: { increment: 1 }
            }
        });

        // TODO: Criar AuditLog

        return NextResponse.json({
            success: true,
            reservation: updated,
            message: 'Check-in realizado com sucesso'
        });

    } catch (error) {
        console.error('Error during check-in:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer check-in' },
            { status: 500 }
        );
    }
}
