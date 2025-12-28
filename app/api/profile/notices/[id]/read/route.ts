import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const noticeId = params.id;

        // Marcar como lido
        await prisma.notification.update({
            where: { id: noticeId },
            data: { read: true }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking notice as read:', error);
        return NextResponse.json(
            { error: 'Erro ao marcar como lido' },
            { status: 500 }
        );
    }
}
