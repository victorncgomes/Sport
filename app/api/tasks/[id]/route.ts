import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

// PATCH - Atualizar tarefa
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const taskId = params.id;
        const updates = await request.json();

        const task = await prisma.task.update({
            where: { id: taskId },
            data: updates,
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json({ success: true, task });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar tarefa' },
            { status: 500 }
        );
    }
}

// DELETE - Deletar tarefa
export async function DELETE(
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

        if (!user || (user.role !== 'diretoria' && user.role !== 'admin')) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        await prisma.task.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { error: 'Erro ao deletar tarefa' },
            { status: 500 }
        );
    }
}
