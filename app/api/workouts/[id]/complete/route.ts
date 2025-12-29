import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/workouts/[id]/complete - Finalizar treino
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
        const {
            duration,
            distance,
            avgPace,
            avgSPM,
            calories,
            boatStored,
            boatWashed,
            damageReported,
            damageDetails
        } = body;

        // Buscar sessão
        const workoutSession = await prisma.workoutSession.findUnique({
            where: { id: params.id }
        });

        if (!workoutSession) {
            return NextResponse.json({ error: 'Treino não encontrado' }, { status: 404 });
        }

        if (workoutSession.userId !== user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        if (workoutSession.status !== 'IN_PROGRESS') {
            return NextResponse.json({ error: 'Treino já finalizado' }, { status: 400 });
        }

        // Calcular pontos
        let points = 10; // Base

        // Bônus por distância (outdoor)
        if (distance && distance > 10000) {
            points += 15;
        }

        // Bônus por duração (indoor)
        if (duration && duration > 3600) {
            points += 12;
        }

        // Checklist (outdoor)
        if (workoutSession.mode === 'OUTDOOR') {
            if (boatStored) points += 5;
            if (boatWashed) points += 5;
            if (damageReported && damageDetails) points += 3;

            // Penalidades
            if (!boatStored || !boatWashed) {
                points -= 5;
                // TODO: Notificar diretoria
            }
        }

        // Atualizar sessão
        const updatedSession = await prisma.workoutSession.update({
            where: { id: params.id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                duration,
                distance,
                avgPace,
                avgSPM,
                calories,
                boatStored: boatStored || false,
                boatWashed: boatWashed || false,
                damageReported: damageReported || false,
                damageDetails: damageDetails ? JSON.stringify(damageDetails) : null,
                pointsEarned: Math.max(0, points)
            }
        });

        // Buscar XP atual antes de atualizar
        const oldXP = user.points;
        const newXP = oldXP + Math.max(0, points);

        // Calcular level up
        const oldLevel = user.level;
        let newLevel = oldLevel;
        let leveledUp = false;
        const rewards: string[] = [];

        // Fórmula: XP para próximo nível = 100 * nível^1.5
        const getXPForLevel = (level: number) => Math.floor(100 * Math.pow(level, 1.5));

        // Verificar se subiu de nível
        while (newXP >= getXPForLevel(newLevel)) {
            newLevel++;
            leveledUp = true;
        }

        // Atualizar pontos e nível do usuário
        await prisma.user.update({
            where: { id: user.id },
            data: {
                points: newXP,
                level: newLevel
            }
        });

        // Criar ActivityLog
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                activityType: 'WORKOUT_COMPLETED',
                description: `Treino ${workoutSession.mode} concluído`,
                xpEarned: Math.max(0, points),
                metadata: JSON.stringify({
                    sessionId: params.id,
                    mode: workoutSession.mode,
                    distance,
                    duration,
                    leveledUp,
                    newLevel: leveledUp ? newLevel : undefined
                })
            }
        });

        // TODO: Verificar badges desbloqueados
        // TODO: Se reportou avaria, criar MaintenanceTicket

        return NextResponse.json({
            success: true,
            session: updatedSession,
            xpEarned: Math.max(0, points),
            totalXP: newXP,
            leveledUp,
            oldLevel,
            newLevel,
            rewards
        });

    } catch (error) {
        console.error('Error completing workout:', error);
        return NextResponse.json(
            { error: 'Erro ao finalizar treino' },
            { status: 500 }
        );
    }
}
