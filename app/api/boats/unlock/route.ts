import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { BOAT_HIERARCHY, checkBoatUnlockCriteria } from '@/lib/utils/boat-progression';
import { XP_ACTIONS } from '@/lib/utils/xp-system';

interface UnlockBoatRequest {
    boatId: string;
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body: UnlockBoatRequest = await request.json();
        const { boatId } = body;

        // Verificar se barco existe
        const boat = BOAT_HIERARCHY.find(b => b.id === boatId);
        if (!boat) {
            return NextResponse.json({ error: 'Barco não encontrado' }, { status: 404 });
        }

        // Buscar usuário com estatísticas
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

        // Verificar se já desbloqueou
        if (user.boatUnlocks.some(bu => bu.boatType === boatId)) {
            return NextResponse.json({ error: 'Barco já desbloqueado' }, { status: 400 });
        }

        // Calcular estatísticas
        const unlockedBoatIds = user.boatUnlocks.map(bu => bu.boatType);
        const totalSeconds = user.workoutSessions.reduce((acc, ws) => acc + (ws.duration || 0), 0);
        const totalHours = totalSeconds / 3600;
        const tankWorkouts = user.workoutSessions.filter(ws => ws.mode === 'INDOOR').length;

        const paces = user.workoutSessions
            .filter(ws => ws.avgPace)
            .map(ws => ws.avgPace as string);

        let bestPace: string | null = null;
        if (paces.length > 0) {
            const pacesInSeconds = paces.map(p => {
                const [min, sec] = p.replace('/500m', '').split(':').map(Number);
                return min * 60 + sec;
            });
            const minSeconds = Math.min(...pacesInSeconds);
            const minutes = Math.floor(minSeconds / 60);
            const seconds = minSeconds % 60;
            bestPace = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        const userStats = {
            totalHours,
            tankWorkouts,
            bestPace,
            competitions: 0,
            podiums: 0,
            coachApproved: false,
            unlockedBoats: unlockedBoatIds
        };

        // Verificar critérios
        const { canUnlock, missingCriteria } = checkBoatUnlockCriteria(boatId, userStats);

        if (!canUnlock) {
            return NextResponse.json({
                error: 'Critérios não atendidos',
                missingCriteria
            }, { status: 400 });
        }

        // Desbloquear barco
        await prisma.userBoatUnlock.create({
            data: {
                userId: user.id,
                boatType: boatId,
                unlockedBy: 'CRITERIA'
            }
        });

        // Adicionar XP por desbloquear barco
        await prisma.user.update({
            where: { id: user.id },
            data: {
                points: { increment: XP_ACTIONS.DESBLOQUEAR_BARCO }
            }
        });

        // Registrar atividade
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                activityType: 'BOAT_UNLOCK',
                description: `Desbloqueou o barco ${boat.displayName}`,
                xpEarned: XP_ACTIONS.DESBLOQUEAR_BARCO,
                metadata: JSON.stringify({ boatId, boatName: boat.displayName })
            }
        });

        return NextResponse.json({
            success: true,
            boat: boat,
            xpGained: XP_ACTIONS.DESBLOQUEAR_BARCO,
            message: `Parabéns! Você desbloqueou o ${boat.displayName}!`
        });
    } catch (error) {
        console.error('Error unlocking boat:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
