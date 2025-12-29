import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// GET - Listar tarefas
export async function GET(request: NextRequest) {
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

        // Buscar tarefas (todas para diretoria, apenas atribuídas para outros)
        const where: any = user.role === 'diretoria' || user.role === 'admin'
            ? {}
            : { assignedToId: user.id };

        const tasks = await prisma.task.findMany({
            where,
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar tarefas' },
            { status: 500 }
        );
    }
}

// POST - Criar tarefa
export async function POST(request: NextRequest) {
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

        const { title, description, priority, dueDate, assignedToId } = await request.json();

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                status: 'TODO',
                dueDate: dueDate ? new Date(dueDate) : null,
                assignedToId,
                createdById: user.id
            },
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

        return NextResponse.json({ success: true, task }, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json(
            { error: 'Erro ao criar tarefa' },
            { status: 500 }
        );
    }
}
