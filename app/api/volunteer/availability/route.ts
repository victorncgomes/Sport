import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/volunteer/availability
 * Retorna a disponibilidade semanal do voluntário
 */
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const availability = await prisma.volunteerAvailability.findMany({
            where: {
                userId: user.id,
                isActive: true
            }
        });

        // Converter para formato de slots
        // Usar 'areas' se 'area' não estiver disponível (aguardando prisma generate)
        const slots = availability.map(a => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const areaValue = (a as any).area || a.areas || '';
            return {
                areaId: areaValue,
                dayOfWeek: a.dayOfWeek,
                hour: parseInt(a.startTime.split(':')[0])
            };
        });

        return NextResponse.json({ slots });
    } catch (error) {
        console.error('Erro ao buscar disponibilidade:', error);
        return NextResponse.json({ slots: [] });
    }
}

/**
 * POST /api/volunteer/availability
 * Salva a disponibilidade semanal do voluntário
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const body = await request.json();
        const { slots } = body;

        if (!Array.isArray(slots)) {
            return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
        }

        // Desativar disponibilidades anteriores
        await prisma.volunteerAvailability.updateMany({
            where: { userId: user.id },
            data: { isActive: false }
        });

        // Criar novas disponibilidades
        if (slots.length > 0) {
            for (const slot of slots) {
                await prisma.volunteerAvailability.create({
                    data: {
                        userId: user.id,
                        dayOfWeek: slot.dayOfWeek,
                        startTime: `${slot.hour.toString().padStart(2, '0')}:00`,
                        endTime: `${(slot.hour + 1).toString().padStart(2, '0')}:00`,
                        areas: slot.areaId, // Usando 'areas' até rodar prisma generate
                        isActive: true
                    }
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Disponibilidade salva com sucesso',
            slotsCount: slots.length
        });
    } catch (error) {
        console.error('Erro ao salvar disponibilidade:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
