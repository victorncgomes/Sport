import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/workouts/[id]/gps-points - Salvar pontos GPS em batch
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const { points } = body;

        if (!points || !Array.isArray(points) || points.length === 0) {
            return NextResponse.json({ error: 'Pontos GPS inválidos' }, { status: 400 });
        }

        // Verificar se a sessão pertence ao usuário
        const workoutSession = await prisma.workoutSession.findUnique({
            where: { id: params.id }
        });

        if (!workoutSession) {
            return NextResponse.json({ error: 'Treino não encontrado' }, { status: 404 });
        }

        if (workoutSession.userId !== user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        // Filtrar pontos com accuracy > 50m
        const validPoints = points.filter((point: any) => point.accuracy <= 50);

        if (validPoints.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'Nenhum ponto válido (accuracy > 50m)',
                saved: 0
            });
        }

        // Salvar pontos em batch
        await prisma.gPSTrackPoint.createMany({
            data: validPoints.map((point: any) => ({
                sessionId: params.id,
                lat: point.lat,
                lng: point.lng,
                timestamp: point.timestamp,
                accuracy: point.accuracy,
                altitude: point.altitude,
                speed: point.speed,
                heading: point.heading
            }))
        });

        return NextResponse.json({
            success: true,
            saved: validPoints.length,
            filtered: points.length - validPoints.length
        });

    } catch (error) {
        console.error('Error saving GPS points:', error);
        return NextResponse.json(
            { error: 'Erro ao salvar pontos GPS' },
            { status: 500 }
        );
    }
}

// GET /api/workouts/[id]/gps-points - Obter track GPS completo
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const points = await prisma.gPSTrackPoint.findMany({
            where: { sessionId: params.id },
            orderBy: { timestamp: 'asc' }
        });

        return NextResponse.json({ points });

    } catch (error) {
        console.error('Error fetching GPS track:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar track GPS' },
            { status: 500 }
        );
    }
}
