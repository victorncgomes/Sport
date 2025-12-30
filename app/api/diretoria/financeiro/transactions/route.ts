import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // REVENUE or EXPENSE
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    try {
        const where: any = {}
        if (type) where.type = type
        if (category) where.category = category
        if (status) where.status = status

        const transactions = await prisma.financialTransaction.findMany({
            where,
            orderBy: {
                date: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(transactions)
    } catch (error) {
        console.error("Erro ao buscar transações financeiras:", error)
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
        const { type, category, description, amount, date, status, userId } = body

        if (!type || !category || !description || !amount) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
        }

        const transaction = await prisma.financialTransaction.create({
            data: {
                type,
                category,
                description,
                amount: parseFloat(amount),
                date: date ? new Date(date) : new Date(),
                status: status || "COMPLETED",
                userId: userId || null
            }
        })

        return NextResponse.json(transaction)
    } catch (error) {
        console.error("Erro ao criar transação financeira:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}
