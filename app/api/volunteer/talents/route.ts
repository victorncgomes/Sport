import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// PUT /api/volunteer/talents - Atualizar talentos/habilidades
export async function PUT(request: NextRequest) {
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
        const { talents } = body;

        // talents é um array de objetos: [{ category: 'TECHNICAL', skill: 'Fotografia', level: 'ADVANCED' }, ...]

        // Deletar talentos existentes
        await prisma.volunteerTalent.deleteMany({
            where: { userId: user.id }
        });

        // Criar novos talentos
        if (talents && talents.length > 0) {
            await prisma.volunteerTalent.createMany({
                data: talents.map((talent: any) => ({
                    userId: user.id,
                    category: talent.category,
                    skill: talent.skill,
                    level: talent.level || 'INTERMEDIATE'
                }))
            });
        }

        // Buscar talentos atualizados
        const updatedTalents = await prisma.volunteerTalent.findMany({
            where: { userId: user.id }
        });

        return NextResponse.json({
            success: true,
            talents: updatedTalents
        });

    } catch (error) {
        console.error('Error updating talents:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar talentos' },
            { status: 500 }
        );
    }
}

// GET /api/volunteer/talents - Obter talentos
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let targetUserId: string;

        if (userId) {
            // Buscar talentos de outro usuário (para BOARD)
            targetUserId = userId;
        } else {
            // Buscar próprios talentos
            const user = await prisma.user.findUnique({
                where: { email: session.user.email }
            });

            if (!user) {
                return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
            }

            targetUserId = user.id;
        }

        const talents = await prisma.volunteerTalent.findMany({
            where: { userId: targetUserId }
        });

        return NextResponse.json({ talents });

    } catch (error) {
        console.error('Error fetching talents:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar talentos' },
            { status: 500 }
        );
    }
}
