import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/waitlist - Entrar na fila de espera
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
        const { resourceId, interestedFrom, interestedUntil } = body;

        if (!resourceId || !interestedFrom) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            );
        }

        // Verificar se já está na fila
        const existing = await prisma.waitlistEntry.findFirst({
            where: {
                resourceId,
                userId: user.id,
                notified: false
            }
        });

        if (existing) {
            return NextResponse.json({
                error: 'Você já está na fila de espera',
                position: existing.position
            }, { status: 409 });
        }

        // Calcular posição (último + 1)
        const lastEntry = await prisma.waitlistEntry.findFirst({
            where: { resourceId },
            orderBy: { position: 'desc' }
        });

        const position = (lastEntry?.position || 0) + 1;

        // Criar entrada na fila
        const entry = await prisma.waitlistEntry.create({
            data: {
                resourceId,
                userId: user.id,
                position,
                interestedFrom: new Date(interestedFrom),
                interestedUntil: interestedUntil ? new Date(interestedUntil) : null
            },
            include: {
                resource: true
            }
        });

        return NextResponse.json({
            success: true,
            entry,
            message: `Você está na posição ${position} da fila`
        }, { status: 201 });

    } catch (error) {
        console.error('Error joining waitlist:', error);
        return NextResponse.json(
            { error: 'Erro ao entrar na fila' },
            { status: 500 }
        );
    }
}

// GET /api/waitlist - Ver fila de espera
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const resourceId = searchParams.get('resourceId');

        if (!resourceId) {
            return NextResponse.json(
                { error: 'resourceId é obrigatório' },
                { status: 400 }
            );
        }

        const entries = await prisma.waitlistEntry.findMany({
            where: {
                resourceId,
                notified: false
            },
            orderBy: { position: 'asc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json({ entries });

    } catch (error) {
        console.error('Error fetching waitlist:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar fila' },
            { status: 500 }
        );
    }
}
