import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        // Buscar usuários que assinaram o termo de voluntariado e estão ativos
        const volunteers = await prisma.user.findMany({
            where: {
                isVolunteer: true,
                volunteerTermAcceptance: {
                    status: 'ACTIVE'
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true
            }
        })

        return NextResponse.json(volunteers)
    } catch (error) {
        console.error("Erro ao buscar voluntários:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
