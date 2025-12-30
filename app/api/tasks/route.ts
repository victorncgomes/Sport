import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const tasks = await prisma.volunteerTask.findMany({
            orderBy: { createdAt: 'desc' }
        })

        // Mapear campos do banco para o formato esperado pelo frontend se necessário
        const formattedTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status === 'OPEN' ? 'TODO' :
                (task.status === 'IN_PROGRESS' || task.status === 'ASSIGNED' ? 'IN_PROGRESS' : 'DONE'),
            priority: (task.priority === 'URGENT' || task.priority === 'HIGH') ? 'HIGH' :
                (task.priority === 'MEDIUM' ? 'MEDIUM' : 'LOW'),
            assignee: task.assignedToId || "Não atribuído",
            dueDate: task.deadline ? task.deadline.toISOString() : undefined
        }))

        return NextResponse.json(formattedTasks)
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { title, description, priority, category, deadline, assigneeId } = body

        // Gerar número de tarefa único (simulado)
        const taskNumber = `TASK-${Date.now()}`

        const newTask = await prisma.volunteerTask.create({
            data: {
                taskNumber,
                title,
                description: description || "",
                category: category || "OUTROS",
                status: assigneeId ? "ASSIGNED" : "OPEN",
                priority: priority || "MEDIUM",
                deadline: deadline ? new Date(deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 dias
                createdById: session.user.id,
                assignedToId: assigneeId || null,
                estimatedHours: 1
            }
        })

        // Enviar notificação se houver um responsável
        if (assigneeId) {
            await prisma.notification.create({
                data: {
                    userId: assigneeId,
                    title: "Nova tarefa atribuída",
                    message: `Você recebeu uma nova tarefa: ${title}`,
                    type: "INFO",
                    link: "/diretoria/tarefas"
                }
            })
        }

        return NextResponse.json(newTask)
    } catch (error) {
        console.error("Erro ao criar tarefa:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
