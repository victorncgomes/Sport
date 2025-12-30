import { auth } from "@/auth"
import { getUnreadCount } from "@/lib/services/notifications-service"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    // Se não estiver logado, podemos retornar o contador para visitantes (provavelmente 0 ou baseado em role simulado)
    // Mas para o contador ser dinâmico no banco, precisamos do userId

    const userId = session?.user?.id || "guest"
    const role = session?.user?.role || "visitante"

    try {
        const count = await getUnreadCount(userId, role)
        return NextResponse.json({ count })
    } catch (error) {
        return NextResponse.json({ count: 0 })
    }
}
