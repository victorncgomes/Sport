import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || (user.role !== 'treinador' && user.role !== 'diretoria' && user.role !== 'admin')) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        // Buscar todos os atletas
        const athletes = await prisma.user.findMany({
            where: {
                role: { in: ['socio', 'atleta'] }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                _count: {
                    select: {
                        workoutSessions: {
                            where: {
                                createdAt: {
                                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // última semana
                                }
                            }
                        }
                    }
                }
            }
        });

        // Calcular estatísticas
        const stats = {
            totalAthletes: athletes.length,
            activeToday: 0, // TODO: implementar lógica
            avgPerformance: 85, // TODO: calcular baseado em dados reais
            upcomingGoals: 0 // TODO: implementar sistema de metas
        };

        const athletesWithWorkouts = athletes.map(a => ({
            ...a,
            workoutsThisWeek: a._count.workoutSessions,
            level: 'Intermediário' // TODO: determinar baseado em dados
        }));

        return NextResponse.json({ athletes: athletesWithWorkouts, stats });
    } catch (error) {
        console.error('Error fetching athletes:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar atletas' },
            { status: 500 }
        );
    }
}
