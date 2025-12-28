import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/volunteer/tasks/[id]/accept - Aceitar tarefa
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

        // Buscar tarefa
        const task = await prisma.volunteerTask.findUnique({
            where: { id: params.id }
        });

        if (!task) {
            return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
        }

        // Verificar se já está atribuída
        if (task.assignedToId) {
            return NextResponse.json(
                { error: 'Tarefa já está atribuída' },
                { status: 400 }
            );
        }

        // Verificar se está aberta
        if (task.status !== 'OPEN') {
            return NextResponse.json(
                { error: 'Tarefa não está disponível' },
                { status: 400 }
            );
        }

        // Atribuir tarefa
        const updatedTask = await prisma.volunteerTask.update({
            where: { id: params.id },
            data: {
                assignedToId: user.id,
                status: 'IN_PROGRESS',
                acceptedAt: new Date()
            }
        });

        // Criar ActivityLog
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                activityType: 'VOLUNTEER_TASK_ACCEPTED',
                description: `Aceitou a tarefa: ${task.title}`,
                xpEarned: 0,
                metadata: JSON.stringify({ taskId: task.id })
            }
        });

        return NextResponse.json({
            success: true,
            task: updatedTask
        });

    } catch (error) {
        console.error('Error accepting task:', error);
        return NextResponse.json(
            { error: 'Erro ao aceitar tarefa' },
            { status: 500 }
        );
    }
}
