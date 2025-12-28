import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/maintenance/tickets - Criar ticket de manutenção
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
        const { resourceId, damageType, severity, description, photos } = body;

        if (!resourceId || !damageType || !severity || !description) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            );
        }

        // Gerar número do ticket
        const ticketNumber = `MNT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

        // Criar ticket
        const ticket = await prisma.maintenanceTicket.create({
            data: {
                ticketNumber,
                resourceId,
                reportedById: user.id,
                status: 'OPEN',
                priority: severity === 'CRITICAL' ? 'CRITICAL' : 'MEDIUM',
                damageType,
                severity,
                description,
                photos: photos ? JSON.stringify(photos) : null,
                timeline: JSON.stringify([{
                    action: 'CREATED',
                    userId: user.id,
                    timestamp: new Date().toISOString(),
                    notes: 'Ticket criado'
                }])
            },
            include: {
                resource: true,
                reportedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Se crítico, bloquear recurso
        if (severity === 'CRITICAL') {
            await prisma.resource.update({
                where: { id: resourceId },
                data: { status: 'MAINTENANCE' }
            });
        }

        // TODO: Notificar diretoria

        return NextResponse.json({
            success: true,
            ticket,
            message: `Ticket ${ticketNumber} criado com sucesso`
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating maintenance ticket:', error);
        return NextResponse.json(
            { error: 'Erro ao criar ticket' },
            { status: 500 }
        );
    }
}

// GET /api/maintenance/tickets - Listar tickets (COACH/BOARD)
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
        const resourceId = searchParams.get('resourceId');
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');

        const where: any = {};
        if (resourceId) where.resourceId = resourceId;
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const tickets = await prisma.maintenanceTicket.findMany({
            where,
            orderBy: [
                { priority: 'desc' },
                { openedAt: 'desc' }
            ],
            include: {
                resource: true,
                reportedBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json({ tickets });

    } catch (error) {
        console.error('Error fetching tickets:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar tickets' },
            { status: 500 }
        );
    }
}
