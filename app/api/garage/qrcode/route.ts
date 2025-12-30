import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import QRCode from 'qrcode';

// POST /api/garage/qrcode - Gerar QR Code para uma reserva
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
        const { reservationId } = body;

        // Buscar reserva
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { resource: true }
        });

        if (!reservation) {
            return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
        }

        if (reservation.userId !== user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        // Dados do QR Code
        const qrData = {
            type: 'RESERVATION_CHECKIN',
            reservationId: reservation.id,
            resourceId: reservation.resourceId,
            resourceName: reservation.resource.name,
            userId: user.id,
            startAt: reservation.startAt.toISOString(),
            expectedEndAt: reservation.expectedEndAt.toISOString(),
            generatedAt: new Date().toISOString()
        };

        // Gerar QR Code como Data URL
        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return NextResponse.json({
            qrCode: qrCodeDataUrl,
            reservation: {
                id: reservation.id,
                resourceName: reservation.resource.name,
                startAt: reservation.startAt,
                expectedEndAt: reservation.expectedEndAt,
                status: reservation.status
            }
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// PUT /api/garage/qrcode - Processar scan de QR Code (check-in/out)
export async function PUT(request: NextRequest) {
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
        const { qrData, action } = body; // action: 'CHECKIN' ou 'CHECKOUT'

        if (!qrData || !qrData.reservationId) {
            return NextResponse.json({ error: 'QR Code inválido' }, { status: 400 });
        }

        // Buscar reserva
        const reservation = await prisma.reservation.findUnique({
            where: { id: qrData.reservationId },
            include: { resource: true, user: true }
        });

        if (!reservation) {
            return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
        }

        // Verificar se é o dono da reserva ou um coach/admin
        const isOwner = reservation.userId === user.id;
        const isStaff = ['COACH', 'DIRETORIA', 'ADMIN'].includes(user.role);

        if (!isOwner && !isStaff) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        if (action === 'CHECKIN') {
            // Verificar se pode fazer check-in
            if (reservation.status !== 'CONFIRMED' && reservation.status !== 'PENDING') {
                return NextResponse.json({
                    error: `Não é possível fazer check-in. Status atual: ${reservation.status}`
                }, { status: 400 });
            }

            // Atualizar reserva para IN_USE
            const updated = await prisma.reservation.update({
                where: { id: reservation.id },
                data: {
                    status: 'IN_USE',
                    actualStartAt: new Date()
                }
            });

            // Atualizar recurso para IN_USE
            await prisma.resource.update({
                where: { id: reservation.resourceId },
                data: {
                    status: 'IN_USE',
                    usageCount: { increment: 1 }
                }
            });

            return NextResponse.json({
                success: true,
                action: 'CHECKIN',
                message: `Check-in realizado! Barco ${reservation.resource.name} liberado.`,
                reservation: updated
            });

        } else if (action === 'CHECKOUT') {
            // Verificar se pode fazer check-out
            if (reservation.status !== 'IN_USE') {
                return NextResponse.json({
                    error: `Não é possível fazer check-out. Status atual: ${reservation.status}`
                }, { status: 400 });
            }

            // Pedir checklist (será enviado em outra request)
            // Por agora, só marca como completado
            const updated = await prisma.reservation.update({
                where: { id: reservation.id },
                data: {
                    status: 'COMPLETED',
                    actualEndAt: new Date()
                }
            });

            // Atualizar recurso para AVAILABLE
            await prisma.resource.update({
                where: { id: reservation.resourceId },
                data: { status: 'AVAILABLE' }
            });

            // Adicionar XP ao usuário
            const xpEarned = 10;
            await prisma.user.update({
                where: { id: reservation.userId },
                data: {
                    points: { increment: xpEarned }
                }
            });

            return NextResponse.json({
                success: true,
                action: 'CHECKOUT',
                message: `Check-out realizado! Barco ${reservation.resource.name} devolvido.`,
                xpEarned,
                reservation: updated
            });
        }

        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    } catch (error) {
        console.error('Error processing QR code:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
