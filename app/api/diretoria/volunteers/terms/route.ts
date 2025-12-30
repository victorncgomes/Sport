import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const terms = await prisma.volunteerTermAcceptance.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: {
                acceptedAt: 'desc'
            }
        })

        return NextResponse.json(terms)
    } catch (error) {
        console.error("Erro ao buscar termos de voluntariado:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
