import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()
        const { status, title, description, priority, assigneeId } = body

        // Buscar tarefa atual para verificar se o responsável mudou
        const currentTask = await prisma.volunteerTask.findUnique({
            where: { id }
        })

        // Mapear status do frontend para o banco
        let prismaStatus = status
        if (status === 'TODO') prismaStatus = 'OPEN'
        if (status === 'IN_PROGRESS') prismaStatus = 'IN_PROGRESS'
        if (status === 'DONE') prismaStatus = 'COMPLETED'

        const updatedTask = await prisma.volunteerTask.update({
            where: { id },
            data: {
                status: prismaStatus || undefined,
                title: title !== undefined ? title : undefined,
                description: description !== undefined ? description : undefined,
                priority: priority !== undefined ? priority : undefined,
                assignedToId: assigneeId !== undefined ? assigneeId : undefined
            }
        })

        // Enviar notificação se o responsável mudou ou foi definido agora
        if (assigneeId && assigneeId !== currentTask?.assignedToId) {
            await prisma.notification.create({
                data: {
                    userId: assigneeId,
                    title: "Nova tarefa atribuída",
                    message: `Você recebeu uma nova tarefa ou reatribuição: ${updatedTask.title}`,
                    type: "INFO",
                    link: "/diretoria/tarefas"
                }
            })
        }

        return NextResponse.json(updatedTask)
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const { id } = await params
        await prisma.volunteerTask.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
