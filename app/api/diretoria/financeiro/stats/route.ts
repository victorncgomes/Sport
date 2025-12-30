import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

interface MonthStats {
    mes: string
    receitas: number
    despesas: number
    saldo: number
}

export async function GET() {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    try {
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        const statsByMonth: Record<string, MonthStats> = {}

        for (let i = 0; i < 6; i++) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const monthLabel = `${months[d.getMonth()]}/${d.getFullYear().toString().slice(2)}`
            statsByMonth[monthLabel] = { mes: monthLabel, receitas: 0, despesas: 0, saldo: 0 }
        }

        // Buscar transações financeiras (se o modelo existir)
        try {
            const transactions = await (prisma as any).financialTransaction.findMany({
                where: {
                    date: {
                        gte: sixMonthsAgo
                    }
                }
            })

            transactions.forEach((t: { date: Date | string; type: string; amount: number }) => {
                const d = new Date(t.date)
                const monthLabel = `${months[d.getMonth()]}/${d.getFullYear().toString().slice(2)}`
                if (statsByMonth[monthLabel]) {
                    if (t.type === "REVENUE") {
                        statsByMonth[monthLabel].receitas += t.amount
                    } else {
                        statsByMonth[monthLabel].despesas += t.amount
                    }
                    statsByMonth[monthLabel].saldo = statsByMonth[monthLabel].receitas - statsByMonth[monthLabel].despesas
                }
            })
        } catch {
            // Modelo ainda não gerado - continuar sem transações
        }

        // Buscar pagamentos (mensalidades pagas)
        const payments = await prisma.payment.findMany({
            where: {
                status: "PAID",
                paidAt: {
                    gte: sixMonthsAgo
                }
            }
        })

        payments.forEach((p: { paidAt: Date | null; amount: number }) => {
            if (p.paidAt) {
                const d = new Date(p.paidAt)
                const monthLabel = `${months[d.getMonth()]}/${d.getFullYear().toString().slice(2)}`
                if (statsByMonth[monthLabel]) {
                    statsByMonth[monthLabel].receitas += p.amount
                    statsByMonth[monthLabel].saldo = statsByMonth[monthLabel].receitas - statsByMonth[monthLabel].despesas
                }
            }
        })

        const sortedStats = Object.values(statsByMonth).reverse()

        return NextResponse.json(sortedStats)
    } catch (error) {
        console.error("Erro ao gerar estatísticas financeiras:", error)
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }
}

