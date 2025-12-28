import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/notifications/subscribe - Subscribe para web push
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { subscription } = body;

        // Salvar subscription (preparado para web push)
        // TODO: Implementar lógica de push notifications

        return NextResponse.json({
            success: true,
            message: 'Subscription salva (push notifications em desenvolvimento)'
        });

    } catch (error) {
        console.error('Error subscribing to push:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer subscribe' },
            { status: 500 }
        );
    }
}
