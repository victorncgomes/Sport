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

        if (!user || (user.role !== 'diretoria' && user.role !== 'admin')) {
            return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const day = searchParams.get('day');
        const area = searchParams.get('area');

        // Buscar voluntários com suas disponibilidades
        const volunteers = await prisma.user.findMany({
            where: {
                volunteerTerm: {
                    accepted: true
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                volunteerTerm: {
                    select: {
                        availability: true
                    }
                }
            }
        });

        // Formatar dados
        const formattedVolunteers = volunteers.map(v => ({
            id: v.id,
            name: v.name,
            email: v.email,
            availability: v.volunteerTerm?.availability || []
        }));

        return NextResponse.json({ volunteers: formattedVolunteers });
    } catch (error) {
        console.error('Error fetching volunteer calendar:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar calendário' },
            { status: 500 }
        );
    }
}
