import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                boatUnlocks: true,
                workoutSessions: {
                    where: { status: 'COMPLETED' }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Calcular estatísticas
        const unlockedBoatIds = user.boatUnlocks.map(bu => bu.boatType);

        // Sempre inclui TANQUE como desbloqueado
        if (!unlockedBoatIds.includes('TANQUE')) {
            unlockedBoatIds.unshift('TANQUE');
        }

        // Calcular horas totais de treino
        const totalSeconds = user.workoutSessions.reduce((acc, ws) => acc + (ws.duration || 0), 0);
        const totalHours = Math.round((totalSeconds / 3600) * 10) / 10;

        // Contar treinos no tanque
        const tankWorkouts = user.workoutSessions.filter(ws => ws.mode === 'INDOOR').length;

        // Melhor pace (menor é melhor)
        const paces = user.workoutSessions
            .filter(ws => ws.avgPace)
            .map(ws => ws.avgPace as string);

        let bestPace: string | null = null;
        if (paces.length > 0) {
            // Converter para segundos e pegar o menor
            const pacesInSeconds = paces.map(p => {
                const [min, sec] = p.replace('/500m', '').split(':').map(Number);
                return min * 60 + sec;
            });
            const minSeconds = Math.min(...pacesInSeconds);
            const minutes = Math.floor(minSeconds / 60);
            const seconds = minSeconds % 60;
            bestPace = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        return NextResponse.json({
            unlockedBoats: unlockedBoatIds,
            stats: {
                totalHours,
                tankWorkouts,
                bestPace,
                competitions: 0, // TODO: implementar competições
                podiums: 0,
                coachApproved: false // TODO: implementar aprovação do coach
            }
        });
    } catch (error) {
        console.error('Error fetching boats:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
