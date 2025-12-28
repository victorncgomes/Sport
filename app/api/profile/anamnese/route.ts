import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

        // Formatar datas se necessário
        const data = {
            ...body,
            userId: user.id,
            birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
            weight: body.weight ? parseFloat(body.weight) : undefined,
            height: body.height ? parseFloat(body.height) : undefined,
        };

        // Upsert anamnese
        const anamnese = await prisma.anamneseForm.upsert({
            where: { userId: user.id },
            update: data,
            create: data
        });

        // Gamificação: Adicionar pontos se for a primeira vez
        // Por agora, apenas retornamos sucesso. 
        // Em v0.4.1 integraremos o sistema de pontos real.

        return NextResponse.json({ success: true, data: anamnese });
    } catch (error) {
        console.error('Error saving anamnese:', error);
        return NextResponse.json(
            { error: 'Erro ao salvar ficha de anamnese' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const anamnese = await prisma.anamneseForm.findFirst({
            where: { user: { email: session.user.email } }
        });

        return NextResponse.json(anamnese);
    } catch (error) {
        console.error('Error fetching anamnese:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar ficha de anamnese' },
            { status: 500 }
        );
    }
}
