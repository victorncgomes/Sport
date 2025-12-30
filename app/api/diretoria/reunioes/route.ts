import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const meetings = await prisma.meeting.findMany({
            orderBy: { date: 'asc' },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(meetings)
    } catch (error) {
        console.error("Erro ao buscar reuniões:", error)
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
        const { title, description, date, location, type, agenda, participants } = body

        const newMeeting = await prisma.meeting.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                type: type || "BOARD",
                agenda,
                createdBy: session.user.id,
                participants: {
                    create: (participants || []).map((userId: string) => ({
                        userId
                    }))
                }
            }
        })

        // Enviar notificações para os participantes
        if (participants && participants.length > 0) {
            await Promise.all(
                participants.map((userId: string) =>
                    prisma.notification.create({
                        data: {
                            userId,
                            title: "Nova convocação de reunião",
                            message: `Você foi convocado para a reunião: ${title}`,
                            type: "URGENT",
                            link: "/diretoria/reunioes"
                        }
                    })
                )
            )
        }

        return NextResponse.json(newMeeting)
    } catch (error) {
        console.error("Erro ao criar reunião:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
