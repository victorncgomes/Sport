import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

interface StartWorkoutRequest {
    mode: 'OUTDOOR' | 'INDOOR' | 'GYM' | 'INDOOR_TANK' | 'INDOOR_GENERAL';
    workoutType?: string;
    boatId?: string;
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const body: StartWorkoutRequest = await request.json();
        const { mode, workoutType, boatId } = body;

        // Normalizar modo
        const normalizedMode = mode.replace('_TANK', '').replace('_GENERAL', '');

        // Criar sessão de treino
        const workoutSession = await prisma.workoutSession.create({
            data: {
                userId: user.id,
                mode: normalizedMode,
                status: 'IN_PROGRESS',
                startedAt: new Date(),
                metadata: JSON.stringify({
                    workoutType: workoutType || mode,
                    boatId,
                    startedVia: 'app'
                })
            }
        });

        return NextResponse.json({
            success: true,
            sessionId: workoutSession.id,
            session: workoutSession
        });
    } catch (error) {
        console.error('Error starting workout:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
