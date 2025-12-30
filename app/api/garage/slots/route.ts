import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { generateTimeSlots, getAvailableSlots } from '@/lib/utils/boat-suggestion';

// GET /api/garage/slots - Obter slots disponíveis para uma data
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const resourceId = searchParams.get('resourceId');
        const dateStr = searchParams.get('date'); // YYYY-MM-DD
        const duration = parseInt(searchParams.get('duration') || '60'); // minutos

        if (!resourceId || !dateStr) {
            return NextResponse.json(
                { error: 'resourceId e date são obrigatórios' },
                { status: 400 }
            );
        }

        // Gerar todos os slots do dia (5:00 às 20:00, intervalos de 5 min)
        const allSlots = generateTimeSlots(5, 20, 5);

        // Buscar reservas existentes para este recurso nesta data
        const startOfDay = new Date(dateStr);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(dateStr);
        endOfDay.setHours(23, 59, 59, 999);

        const existingReservations = await prisma.reservation.findMany({
            where: {
                resourceId,
                startAt: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    in: ['PENDING', 'CONFIRMED', 'IN_USE']
                }
            },
            select: {
                startAt: true,
                expectedEndAt: true
            }
        });

        // Converter reservas em slots ocupados
        const occupiedSlots: string[] = [];
        for (const reservation of existingReservations) {
            const start = new Date(reservation.startAt);
            const end = new Date(reservation.expectedEndAt);

            let current = new Date(start);
            while (current < end) {
                const h = current.getHours().toString().padStart(2, '0');
                const m = current.getMinutes().toString().padStart(2, '0');
                occupiedSlots.push(`${h}:${m}`);
                current.setMinutes(current.getMinutes() + 5);
            }
        }

        // Filtrar slots disponíveis
        const availableSlots = getAvailableSlots(allSlots, occupiedSlots, duration);

        // Remover slots que já passaram (se for hoje)
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        let filteredSlots = availableSlots;
        if (dateStr === today) {
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

            filteredSlots = availableSlots.filter(slot => slot > currentTime);
        }

        return NextResponse.json({
            date: dateStr,
            resourceId,
            duration,
            totalSlots: allSlots.length,
            occupiedCount: occupiedSlots.length / (duration / 5),
            availableSlots: filteredSlots,
            // Agrupado por horário para facilitar UI
            slotsByHour: groupSlotsByHour(filteredSlots)
        });
    } catch (error) {
        console.error('Error getting available slots:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

// Agrupa slots por hora para facilitar visualização
function groupSlotsByHour(slots: string[]): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};

    for (const slot of slots) {
        const hour = slot.split(':')[0];
        if (!grouped[hour]) {
            grouped[hour] = [];
        }
        grouped[hour].push(slot);
    }

    return grouped;
}
