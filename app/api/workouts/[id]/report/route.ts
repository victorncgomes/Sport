import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const sessionId = params.id;

        // Buscar sessão de treino com todos os dados
        const workout = await prisma.workoutSession.findUnique({
            where: { id: sessionId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                gpsPoints: true
            }
        });

        if (!workout) {
            return NextResponse.json({ error: 'Treino não encontrado' }, { status: 404 });
        }

        // Calcular estatísticas
        const stats = {
            duration: workout.duration || 0,
            distance: workout.distance || 0,
            avgPace: workout.avgPace || '--:--',
            maxSpeed: workout.maxSpeed || 0,
            calories: workout.calories || 0,
            avgHeartRate: workout.avgHeartRate || 0,
            gpsPointsCount: workout.gpsPoints?.length || 0
        };

        // Gerar relatório em formato JSON (pode ser convertido para PDF no frontend)
        const report = {
            id: workout.id,
            date: workout.startedAt,
            user: workout.user,
            mode: workout.mode,
            stats,
            feedback: workout.feedback,
            gpsTrack: workout.gpsPoints?.map(p => ({
                lat: p.latitude,
                lng: p.longitude,
                timestamp: p.timestamp
            }))
        };

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error generating report:', error);
        return NextResponse.json(
            { error: 'Erro ao gerar relatório' },
            { status: 500 }
        );
    }
}
