import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/volunteer/tasks/[id]/submit - Submeter tarefa concluída
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
        const { notes, attachments } = body;

        // Buscar tarefa
        const task = await prisma.volunteerTask.findUnique({
            where: { id: params.id }
        });

        if (!task) {
            return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
        }

        // Verificar se é o responsável
        if (task.assignedToId !== user.id) {
            return NextResponse.json(
                { error: 'Você não está atribuído a esta tarefa' },
                { status: 403 }
            );
        }

        // Verificar se está em progresso
        if (task.status !== 'IN_PROGRESS') {
            return NextResponse.json(
                { error: 'Tarefa não está em progresso' },
                { status: 400 }
            );
        }

        // Atualizar tarefa para PENDING_REVIEW
        const updatedTask = await prisma.volunteerTask.update({
            where: { id: params.id },
            data: {
                status: 'PENDING_REVIEW',
                completedAt: new Date(),
                notes: notes || null,
                attachments: attachments ? JSON.stringify(attachments) : null
            }
        });

        // Criar ActivityLog
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                activityType: 'VOLUNTEER_TASK_SUBMITTED',
                description: `Submeteu a tarefa: ${task.title}`,
                xpEarned: 0,
                metadata: JSON.stringify({ taskId: task.id })
            }
        });

        // TODO: Notificar diretoria

        return NextResponse.json({
            success: true,
            task: updatedTask
        });

    } catch (error) {
        console.error('Error submitting task:', error);
        return NextResponse.json(
            { error: 'Erro ao submeter tarefa' },
            { status: 500 }
        );
    }
}
