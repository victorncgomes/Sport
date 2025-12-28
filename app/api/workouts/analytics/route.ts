import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/workouts/analytics - Métricas e progressão do usuário
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

        // Buscar todos os treinos concluídos
        const workouts = await prisma.workoutSession.findMany({
            where: {
                userId: user.id,
                status: 'COMPLETED'
            },
            orderBy: { completedAt: 'asc' }
        });

        // Calcular métricas
        const totalWorkouts = workouts.length;
        const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

        // Pace médio (apenas workouts com pace)
        const workoutsWithPace = workouts.filter(w => w.avgPace);
        const avgPace = workoutsWithPace.length > 0
            ? calculateAveragePace(workoutsWithPace.map(w => w.avgPace!))
            : null;

        // Workouts por tipo
        const workoutsByType: Record<string, number> = {};
        workouts.forEach(w => {
            workoutsByType[w.mode] = (workoutsByType[w.mode] || 0) + 1;
        });

        // Volume semanal (últimas 12 semanas)
        const weeklyVolume = calculateWeeklyVolume(workouts);

        // Progressão de pace (últimos 10 treinos com pace)
        const paceProgression = workoutsWithPace
            .slice(-10)
            .map(w => ({
                date: w.completedAt?.toISOString().split('T')[0],
                pace: w.avgPace
            }));

        return NextResponse.json({
            totalWorkouts,
            totalDistance,
            totalDuration,
            avgPace,
            workoutsByType,
            weeklyVolume,
            paceProgression
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar analytics' },
            { status: 500 }
        );
    }
}

function calculateAveragePace(paces: string[]): string {
    // Converter paces "MM:SS" para segundos
    const seconds = paces.map(pace => {
        const [min, sec] = pace.split(':').map(Number);
        return min * 60 + sec;
    });

    const avgSeconds = seconds.reduce((sum, s) => sum + s, 0) / seconds.length;
    const minutes = Math.floor(avgSeconds / 60);
    const secs = Math.floor(avgSeconds % 60);

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function calculateWeeklyVolume(workouts: any[]): { week: string; km: number }[] {
    const weeks: Record<string, number> = {};

    workouts.forEach(workout => {
        if (!workout.completedAt || !workout.distance) return;

        const date = new Date(workout.completedAt);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Domingo
        const weekKey = weekStart.toISOString().split('T')[0];

        weeks[weekKey] = (weeks[weekKey] || 0) + (workout.distance / 1000);
    });

    return Object.entries(weeks)
        .map(([week, km]) => ({ week, km: Math.round(km * 100) / 100 }))
        .slice(-12); // Últimas 12 semanas
}
