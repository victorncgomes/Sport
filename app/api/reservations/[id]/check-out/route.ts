import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/reservations/[id]/check-out - Check-out (devolver barco)
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

        const body = await request.json();
        const { stored, washed, damageReported, damageDetails } = body;

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

        if (reservation.status !== 'IN_USE') {
            return NextResponse.json({
                error: 'Apenas reservas em uso podem fazer check-out',
                currentStatus: reservation.status
            }, { status: 400 });
        }

        // Calcular pontos
        let points = 0;
        const now = new Date();
        const expectedEnd = new Date(reservation.expectedEndAt);
        const isOnTime = now <= expectedEnd;

        if (stored) points += 5;
        if (washed) points += 5;
        if (isOnTime) points += 3;
        if (damageReported && damageDetails) points += 3;

        // Penalidades
        if (!stored || !washed) {
            points -= 5;
            // TODO: Notificar diretoria
        }

        // Atualizar reserva
        const updated = await prisma.reservation.update({
            where: { id: params.id },
            data: {
                status: 'COMPLETED',
                actualEndAt: now,
                stored: stored || false,
                washed: washed || false,
                damageReported: damageReported || false,
                damageDetails: damageDetails ? JSON.stringify(damageDetails) : null,
                pointsEarned: Math.max(0, points)
            }
        });

        // Atualizar pontos do usuário
        await prisma.user.update({
            where: { id: user.id },
            data: {
                points: { increment: Math.max(0, points) }
            }
        });

        // Criar ActivityLog
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                activityType: 'BOAT_CHECKOUT',
                description: `Devolveu ${reservation.resource.name}`,
                xpEarned: Math.max(0, points),
                metadata: JSON.stringify({
                    reservationId: params.id,
                    resourceId: reservation.resourceId,
                    stored,
                    washed,
                    onTime: isOnTime
                })
            }
        });

        // Atualizar status do recurso
        await prisma.resource.update({
            where: { id: reservation.resourceId },
            data: { status: 'AVAILABLE' }
        });

        // Se reportou avaria, criar MaintenanceTicket
        if (damageReported && damageDetails) {
            const ticketNumber = `MNT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

            await prisma.maintenanceTicket.create({
                data: {
                    ticketNumber,
                    resourceId: reservation.resourceId,
                    reportedById: user.id,
                    status: 'OPEN',
                    priority: damageDetails.severity === 'CRITICAL' ? 'CRITICAL' : 'MEDIUM',
                    damageType: damageDetails.type || 'OTHER',
                    severity: damageDetails.severity || 'MEDIUM',
                    description: damageDetails.description || '',
                    photos: damageDetails.photos ? JSON.stringify(damageDetails.photos) : null
                }
            });

            // Se crítico, bloquear recurso
            if (damageDetails.severity === 'CRITICAL') {
                await prisma.resource.update({
                    where: { id: reservation.resourceId },
                    data: { status: 'MAINTENANCE' }
                });
            }
        }

        // Notificar próximo da fila
        const nextInLine = await prisma.waitlistEntry.findFirst({
            where: {
                resourceId: reservation.resourceId,
                notified: false
            },
            orderBy: { position: 'asc' }
        });

        if (nextInLine) {
            // TODO: Criar notificação
            await prisma.waitlistEntry.update({
                where: { id: nextInLine.id },
                data: { notified: true }
            });
        }

        return NextResponse.json({
            success: true,
            reservation: updated,
            pointsEarned: Math.max(0, points),
            message: 'Check-out realizado com sucesso'
        });

    } catch (error) {
        console.error('Error during check-out:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer check-out' },
            { status: 500 }
        );
    }
}
