import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// GET /api/volunteer/heatmap - Heatmap de disponibilidade (BOARD)
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

        // Apenas BOARD pode ver heatmap
        if (user.role !== 'BOARD' && user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas a diretoria pode ver o heatmap' },
                { status: 403 }
            );
        }

        // Buscar todas as disponibilidades
        const availabilities = await prisma.volunteerAvailability.findMany({
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

        // Processar heatmap
        const heatmap: any = {
            monday: {},
            tuesday: {},
            wednesday: {},
            thursday: {},
            friday: {},
            saturday: {},
            sunday: {}
        };

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        availabilities.forEach((avail: any) => {
            days.forEach(day => {
                const slots = avail[day as keyof typeof avail];
                if (slots && typeof slots === 'string') {
                    try {
                        const parsed = JSON.parse(slots);
                        if (Array.isArray(parsed)) {
                            parsed.forEach((slot: string) => {
                                if (!heatmap[day][slot]) {
                                    heatmap[day][slot] = [];
                                }
                                heatmap[day][slot].push({
                                    userId: avail.user.id,
                                    userName: avail.user.name,
                                    userImage: avail.user.image
                                });
                            });
                        }
                    } catch (e) {
                        // Ignorar erros de parse
                    }
                }
            });
        });

        return NextResponse.json({
            heatmap,
            totalVolunteers: availabilities.length
        });

    } catch (error) {
        console.error('Error fetching heatmap:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar heatmap' },
            { status: 500 }
        );
    }
}
