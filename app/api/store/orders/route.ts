import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// GET /api/store/orders - Listar pedidos do usuário
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const where: any = { userId: user.id };
        if (status) {
            where.status = status;
        }

        const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ orders });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar pedidos' },
            { status: 500 }
        );
    }
}
