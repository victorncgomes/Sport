import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    try {
        const query: any = {
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                dueDate: 'desc'
            }
        }

        // Se houver filtros, aplicamos aqui
        // No SQLite, filtros de data podem ser mais complexos se não estiverem normalizados
        // Mas podemos filtrar por descrição (ex: contendo o mês) ou por intervalo de data

        const where: any = {}

        if (status) {
            where.status = status
        }

        if (search) {
            where.user = {
                name: {
                    contains: search
                }
            }
        }

        // Para simplificar a integração inicial, vamos retornar todos e filtrar no client por agora
        // ou buscar todos os que contenham "Mensalidade" na descrição
        where.description = {
            contains: "Mensalidade"
        }

        query.where = where

        const payments = await prisma.payment.findMany(query)

        return NextResponse.json(payments)
    } catch (error) {
        console.error("Erro ao buscar pagamentos:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
