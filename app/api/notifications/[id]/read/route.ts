import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/notifications/[id]/read - Marcar notificação como lida
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Atualizar notificação
        const notification = await prisma.notification.update({
            where: {
                id: params.id,
                userId: user.id
            },
            data: {
                read: true,
                readAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            notification
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        return NextResponse.json(
            { error: 'Erro ao marcar notificação como lida' },
            { status: 500 }
        );
    }
}
