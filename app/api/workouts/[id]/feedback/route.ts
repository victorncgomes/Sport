import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

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

        const { intensity, feeling, notes, muscleGroups } = await request.json();
        const sessionId = params.id;

        // Atualizar sessão de treino com feedback
        const workout = await prisma.workoutSession.update({
            where: { id: sessionId },
            data: {
                feedback: {
                    intensity,
                    feeling,
                    notes,
                    muscleGroups
                }
            }
        });

        return NextResponse.json({ success: true, workout });
    } catch (error) {
        console.error('Error saving feedback:', error);
        return NextResponse.json(
            { error: 'Erro ao salvar feedback' },
            { status: 500 }
        );
    }
}
