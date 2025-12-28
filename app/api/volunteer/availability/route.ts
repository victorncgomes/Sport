import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// PUT /api/volunteer/availability - Atualizar disponibilidade semanal
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
        const { availability } = body;

        // availability é um objeto: { monday: ['09:00-12:00', '14:00-18:00'], tuesday: [...], ... }

        // Upsert availability
        const updated = await prisma.volunteerAvailability.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                monday: availability.monday ? JSON.stringify(availability.monday) : null,
                tuesday: availability.tuesday ? JSON.stringify(availability.tuesday) : null,
                wednesday: availability.wednesday ? JSON.stringify(availability.wednesday) : null,
                thursday: availability.thursday ? JSON.stringify(availability.thursday) : null,
                friday: availability.friday ? JSON.stringify(availability.friday) : null,
                saturday: availability.saturday ? JSON.stringify(availability.saturday) : null,
                sunday: availability.sunday ? JSON.stringify(availability.sunday) : null
            },
            update: {
                monday: availability.monday ? JSON.stringify(availability.monday) : null,
                tuesday: availability.tuesday ? JSON.stringify(availability.tuesday) : null,
                wednesday: availability.wednesday ? JSON.stringify(availability.wednesday) : null,
                thursday: availability.thursday ? JSON.stringify(availability.thursday) : null,
                friday: availability.friday ? JSON.stringify(availability.friday) : null,
                saturday: availability.saturday ? JSON.stringify(availability.saturday) : null,
                sunday: availability.sunday ? JSON.stringify(availability.sunday) : null
            }
        });

        return NextResponse.json({
            success: true,
            availability: updated
        });

    } catch (error) {
        console.error('Error updating availability:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar disponibilidade' },
            { status: 500 }
        );
    }
}

// GET /api/volunteer/availability - Obter disponibilidade
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

        const availability = await prisma.volunteerAvailability.findUnique({
            where: { userId: user.id }
        });

        return NextResponse.json({
            availability: availability || null
        });

    } catch (error) {
        console.error('Error fetching availability:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar disponibilidade' },
            { status: 500 }
        );
    }
}
