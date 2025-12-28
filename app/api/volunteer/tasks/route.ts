import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/volunteer/tasks - Criar tarefa (BOARD apenas)
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

        // Apenas BOARD pode criar tarefas
        if (user.role !== 'BOARD' && user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas a diretoria pode criar tarefas' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            title,
            description,
            category,
            priority,
            estimatedHours,
            deadline,
            requiredTalents,
            maxVolunteers
        } = body;

        // Criar tarefa
        const task = await prisma.volunteerTask.create({
            data: {
                title,
                description,
                category,
                priority: priority || 'MEDIUM',
                estimatedHours: estimatedHours || 1,
                deadline: deadline ? new Date(deadline) : null,
                requiredTalents: requiredTalents ? JSON.stringify(requiredTalents) : null,
                maxVolunteers: maxVolunteers || 1,
                createdById: user.id,
                status: 'OPEN'
            }
        });

        return NextResponse.json({
            success: true,
            task
        });

    } catch (error) {
        console.error('Error creating volunteer task:', error);
        return NextResponse.json(
            { error: 'Erro ao criar tarefa' },
            { status: 500 }
        );
    }
}

// GET /api/volunteer/tasks - Listar tarefas
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const myTasks = searchParams.get('myTasks') === 'true';

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (category) {
            where.category = category;
        }

        if (myTasks) {
            where.assignedToId = user.id;
        }

        const tasks = await prisma.volunteerTask.findMany({
            where,
            orderBy: [
                { priority: 'desc' },
                { deadline: 'asc' }
            ],
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        return NextResponse.json({ tasks });

    } catch (error) {
        console.error('Error fetching volunteer tasks:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar tarefas' },
            { status: 500 }
        );
    }
}
