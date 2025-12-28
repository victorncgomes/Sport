import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/reservations - Criar reserva
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
        const { resourceId, startAt, expectedEndAt, notes } = body;

        if (!resourceId || !startAt || !expectedEndAt) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            );
        }

        // Buscar recurso
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId }
        });

        if (!resource) {
            return NextResponse.json({ error: 'Recurso não encontrado' }, { status: 404 });
        }

        // Verificar regras do recurso
        let rules: any = {};
        if (resource.rules) {
            try {
                rules = JSON.parse(resource.rules);
            } catch (e) {
                console.error('Error parsing rules:', e);
            }
        }

        // Regra do tanque: 5 treinos indoor completados
        if (resource.type === 'TANK' && rules.minTankWorkoutsCompleted) {
            const tankWorkouts = await prisma.workoutSession.count({
                where: {
                    userId: user.id,
                    mode: 'INDOOR_TANK',
                    status: 'COMPLETED'
                }
            });

            if (tankWorkouts < rules.minTankWorkoutsCompleted) {
                return NextResponse.json({
                    error: `Você precisa completar ${rules.minTankWorkoutsCompleted} treinos no tanque antes de reservar`,
                    required: rules.minTankWorkoutsCompleted,
                    current: tankWorkouts
                }, { status: 403 });
            }
        }

        // Verificar conflitos de horário
        const conflicts = await prisma.reservation.findMany({
            where: {
                resourceId,
                status: { in: ['CONFIRMED', 'IN_USE'] },
                OR: [
                    {
                        AND: [
                            { startAt: { lte: new Date(startAt) } },
                            { expectedEndAt: { gte: new Date(startAt) } }
                        ]
                    },
                    {
                        AND: [
                            { startAt: { lte: new Date(expectedEndAt) } },
                            { expectedEndAt: { gte: new Date(expectedEndAt) } }
                        ]
                    }
                ]
            }
        });

        if (conflicts.length > 0) {
            return NextResponse.json({
                error: 'Horário conflitante com outra reserva',
                conflicts
            }, { status: 409 });
        }

        // Criar reserva
        const status = rules.requiresApproval ? 'PENDING' : 'CONFIRMED';

        const reservation = await prisma.reservation.create({
            data: {
                resourceId,
                userId: user.id,
                startAt: new Date(startAt),
                expectedEndAt: new Date(expectedEndAt),
                notes,
                status
            },
            include: {
                resource: true
            }
        });

        // Atualizar status do recurso se confirmado
        if (status === 'CONFIRMED') {
            await prisma.resource.update({
                where: { id: resourceId },
                data: { status: 'RESERVED' }
            });
        }

        // TODO: Criar notificação

        return NextResponse.json({
            success: true,
            reservation,
            message: status === 'PENDING'
                ? 'Reserva criada e aguardando aprovação'
                : 'Reserva confirmada'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating reservation:', error);
        return NextResponse.json(
            { error: 'Erro ao criar reserva' },
            { status: 500 }
        );
    }
}

// GET /api/reservations - Listar reservas do usuário
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
        const status = searchParams.get('status');

        const where: any = { userId: user.id };
        if (status) where.status = status;

        const reservations = await prisma.reservation.findMany({
            where,
            orderBy: { startAt: 'desc' },
            include: {
                resource: true
            }
        });

        return NextResponse.json({ reservations });

    } catch (error) {
        console.error('Error fetching reservations:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar reservas' },
            { status: 500 }
        );
    }
}
