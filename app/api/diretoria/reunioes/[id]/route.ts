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
        const { status, title, description, date, location, type, agenda, minutes, attendeesCount } = body

        const updatedMeeting = await prisma.meeting.update({
            where: { id },
            data: {
                status: status || undefined,
                title: title || undefined,
                description: description || undefined,
                date: date ? new Date(date) : undefined,
                location: location || undefined,
                type: type || undefined,
                agenda: agenda || undefined,
                minutes: minutes || undefined,
                attendeesCount: attendeesCount !== undefined ? attendeesCount : undefined,
            }
        })

        return NextResponse.json(updatedMeeting)
    } catch (error) {
        console.error("Erro ao atualizar reunião:", error)
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
        await prisma.meeting.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Erro ao excluir reunião:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
