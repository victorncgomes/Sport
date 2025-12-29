import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// GET /api/resources - Listar recursos (barcos + tanque)
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');

        const where: any = {};
        if (type) where.type = type;
        if (status) where.status = status;

        const resources = await prisma.resource.findMany({
            where,
            orderBy: [
                { type: 'asc' },
                { name: 'asc' }
            ],
            include: {
                _count: {
                    select: {
                        reservations: true,
                        waitlist: true,
                        maintenanceTickets: true
                    }
                }
            }
        });

        return NextResponse.json({ resources });

    } catch (error) {
        console.error('Error fetching resources:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar recursos' },
            { status: 500 }
        );
    }
}

// POST /api/resources - Criar recurso (BOARD only)
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

        // Verificar permissão (BOARD ou ADMIN)
        const allowedRoles = ['BOARD', 'ADMIN'];
        if (!allowedRoles.includes(user.role)) {
            return NextResponse.json(
                { error: 'Apenas diretoria pode criar recursos' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            name,
            type,
            category,
            description,
            imageUrl,
            location,
            rules
        } = body;

        // Validações
        if (!name || !type || !description || !location) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            );
        }

        const validTypes = ['BOAT', 'TANK'];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { error: 'Tipo inválido' },
                { status: 400 }
            );
        }

        // Criar recurso
        const resource = await prisma.resource.create({
            data: {
                name,
                type,
                category,
                description,
                imageUrl,
                location,
                rules: rules ? JSON.stringify(rules) : null,
                status: 'AVAILABLE'
            }
        });

        return NextResponse.json({
            success: true,
            resource
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating resource:', error);
        return NextResponse.json(
            { error: 'Erro ao criar recurso' },
            { status: 500 }
        );
    }
}
