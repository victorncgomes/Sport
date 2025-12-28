import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/workouts/start - Iniciar nova sessão de treino
export async function POST(request: NextRequest) {
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
        const { templateId, mode } = body;

        // Validar mode
        const validModes = ['OUTDOOR', 'INDOOR_TANK', 'INDOOR_GENERAL'];
        if (!validModes.includes(mode)) {
            return NextResponse.json({ error: 'Modo inválido' }, { status: 400 });
        }

        // Criar sessão de treino
        const workoutSession = await prisma.workoutSession.create({
            data: {
                userId: user.id,
                templateId: templateId || null,
                mode,
                status: 'IN_PROGRESS',
                startedAt: new Date()
            },
            include: {
                template: true
            }
        });

        return NextResponse.json({
            success: true,
            session: workoutSession
        });

    } catch (error) {
        console.error('Error starting workout:', error);
        return NextResponse.json(
            { error: 'Erro ao iniciar treino' },
            { status: 500 }
        );
    }
}
