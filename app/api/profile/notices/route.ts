import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

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
        const readParam = searchParams.get('read');

        const where: any = { userId: user.id };
        if (readParam !== null) {
            where.read = readParam === 'true';
        }

        // Buscar avisos/notificações
        const notices = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json({ notices });
    } catch (error) {
        console.error('Error fetching notices:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar avisos' },
            { status: 500 }
        );
    }
}
