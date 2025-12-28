import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// GET /api/volunteer/reputation/[userId] - Obter reputação de voluntário
export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const reputation = await prisma.volunteerReputation.findUnique({
            where: { userId: params.userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        role: true
                    }
                }
            }
        });

        if (!reputation) {
            // Retornar reputação vazia se não existir
            return NextResponse.json({
                reputation: {
                    userId: params.userId,
                    tasksCompleted: 0,
                    totalHours: 0,
                    averageRating: 0,
                    reliabilityScore: 100
                }
            });
        }

        return NextResponse.json({ reputation });

    } catch (error) {
        console.error('Error fetching reputation:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar reputação' },
            { status: 500 }
        );
    }
}
