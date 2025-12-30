import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { mockSessions } from '../history/mock-data';

// GET /api/workouts/analytics - Estatísticas gerais
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        // Mock implementation for simulation
        const totalWorkouts = mockSessions.length;
        const totalDistance = mockSessions.reduce((acc, curr) => acc + (curr.distance || 0), 0);
        const totalDuration = mockSessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

        // Calculate average pace (very simplified)
        const sessionsWithPace = mockSessions.filter(s => s.avgPace && s.avgPace !== '-');
        const avgPace = sessionsWithPace.length > 0 ? sessionsWithPace[0].avgPace : '--:--';

        const workoutsByType: Record<string, number> = {};
        mockSessions.forEach(s => {
            workoutsByType[s.sport] = (workoutsByType[s.sport] || 0) + 1;
        });

        // Mock weekly volume (last 4 weeks)
        const weeklyVolume = [
            { week: '2025-W48', km: 25 },
            { week: '2025-W49', km: 32 },
            { week: '2025-W50', km: 45 },
            { week: '2025-W51', km: 28 }, // Current partial
        ];

        const paceProgression = mockSessions
            .filter(s => s.sport === 'ROWING' && s.avgPace)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-5)
            .map(s => ({
                date: new Date(s.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                pace: s.avgPace
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
        console.error('Erro ao calcular analytics:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
