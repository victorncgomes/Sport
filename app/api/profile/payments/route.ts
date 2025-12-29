import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

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

        // Buscar pagamentos do usuário
        // TODO: Implementar modelo Payment no Prisma
        const payments: any[] = [];
        const pending: any[] = [];

        return NextResponse.json({ payments, pending });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar pagamentos' },
            { status: 500 }
        );
    }
}
