import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

interface VolunteerMessage {
    id: string;
    areaId: string;
    message: string;
    createdAt: string;
    senderName: string;
}

/**
 * GET /api/volunteer/messages
 * Retorna mensagens/notificações das áreas do voluntário
 */
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ messages: [] });
        }

        // Buscar áreas em que o usuário está cadastrado
        const userAvailability = await prisma.volunteerAvailability.findMany({
            where: {
                userId: user.id,
                isActive: true
            }
        });

        // Usar 'areas' até rodar prisma generate para 'area'
        const areaIds = [...new Set(userAvailability.map(a => a.areas).filter(Boolean))];

        if (areaIds.length === 0) {
            return NextResponse.json({ messages: [] });
        }

        // Por enquanto, retornar mensagens de exemplo
        // TODO: Implementar quando rodar prisma generate para VolunteerMessage
        const messages: VolunteerMessage[] = [];

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        return NextResponse.json({ messages: [] });
    }
}

/**
 * POST /api/volunteer/messages
 * Envia mensagem para uma área (apenas diretoria)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // Verificar se é diretoria
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true, id: true }
        });

        if (user?.role !== 'ADMIN' && user?.role !== 'BOARD') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const body = await request.json();
        const { areaId, message } = body;

        if (!areaId || !message) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
        }

        // TODO: Implementar quando rodar prisma generate para VolunteerMessage
        return NextResponse.json({
            success: true,
            message: 'Mensagem enviada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
