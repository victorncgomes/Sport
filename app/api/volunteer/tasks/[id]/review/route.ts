import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/volunteer/tasks/[id]/review - Revisar tarefa (BOARD)
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

        // Apenas BOARD pode revisar
        if (user.role !== 'BOARD' && user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas a diretoria pode revisar tarefas' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { approved, feedback, hoursWorked } = body;

        // Buscar tarefa
        const task = await prisma.volunteerTask.findUnique({
            where: { id: params.id },
            include: {
                assignedTo: true
            }
        });

        if (!task) {
            return NextResponse.json({ error: 'Tarefa não encontrada' }, { status: 404 });
        }

        if (task.status !== 'PENDING_REVIEW') {
            return NextResponse.json(
                { error: 'Tarefa não está pendente de revisão' },
                { status: 400 }
            );
        }

        // Calcular pontos baseado em prioridade e horas
        let points = 0;
        const taskEstimatedHours = task.estimatedDuration ?? 1;
        if (approved) {
            const basePoints = hoursWorked || taskEstimatedHours;
            const priorityMultiplier = {
                'LOW': 1,
                'MEDIUM': 1.5,
                'HIGH': 2,
                'URGENT': 3
            }[task.priority] || 1;

            points = Math.round(basePoints * 10 * priorityMultiplier);
        }

        // Atualizar tarefa
        const updatedTask = await prisma.volunteerTask.update({
            where: { id: params.id },
            data: {
                status: approved ? 'COMPLETED' : 'REJECTED',
                reviewedById: user.id,
                reviewedAt: new Date(),
                reviewNotes: feedback || null,
                pointsAwarded: approved ? points : 0
            }
        });

        if (approved && task.assignedTo) {
            // Atualizar pontos do usuário
            await prisma.user.update({
                where: { id: task.assignedTo.id },
                data: {
                    points: { increment: points }
                }
            });

            // Criar ActivityLog
            await prisma.activityLog.create({
                data: {
                    userId: task.assignedTo.id,
                    activityType: 'VOLUNTEER_TASK_COMPLETED',
                    description: `Completou a tarefa: ${task.title}`,
                    xpEarned: points,
                    metadata: JSON.stringify({
                        taskId: task.id,
                        hoursWorked,
                        priority: task.priority
                    })
                }
            });

            // Atualizar reputação de voluntariado
            await prisma.volunteerReputation.upsert({
                where: { userId: task.assignedTo.id },
                create: {
                    userId: task.assignedTo.id,
                    totalTasksCompleted: 1,
                    avgRating: 5
                },
                update: {
                    totalTasksCompleted: { increment: 1 }
                }
            });
        }

        return NextResponse.json({
            success: true,
            task: updatedTask,
            pointsAwarded: approved ? points : 0
        });

    } catch (error) {
        console.error('Error reviewing task:', error);
        return NextResponse.json(
            { error: 'Erro ao revisar tarefa' },
            { status: 500 }
        );
    }
}
