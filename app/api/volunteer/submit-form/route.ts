import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

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
        const { termVersion, termHash, termContent, areas, availability, ipAddress, userAgent } = body;

        // Validar dados obrigatórios
        if (!termVersion || !termHash || !termContent || !areas || !availability) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            );
        }

        // Verificar se já existe um termo aceito
        const existingTerm = await prisma.volunteerTermAcceptance.findUnique({
            where: { userId: user.id }
        });

        if (existingTerm) {
            // Atualizar termo existente
            await prisma.volunteerTermAcceptance.update({
                where: { userId: user.id },
                data: {
                    termVersion,
                    termHash,
                    termContentSnapshot: termContent,
                    areas: JSON.stringify(areas),
                    availability: JSON.stringify(availability),
                    ipAddress: ipAddress || 'unknown',
                    userAgent: userAgent || 'unknown',
                    acceptedAt: new Date(),
                    status: 'ACTIVE'
                }
            });
        } else {
            // Criar novo termo
            await prisma.volunteerTermAcceptance.create({
                data: {
                    userId: user.id,
                    termVersion,
                    termHash,
                    termContentSnapshot: termContent,
                    areas: JSON.stringify(areas),
                    availability: JSON.stringify(availability),
                    ipAddress: ipAddress || 'unknown',
                    userAgent: userAgent || 'unknown',
                    status: 'ACTIVE'
                }
            });
        }

        // Atualizar status de voluntário do usuário
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVolunteer: true,
                volunteerSince: user.volunteerSince || new Date(),
                points: { increment: 50 }
            }
        });

        // Registrar atividade
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                activityType: 'VOLUNTEER',
                description: 'Aceitou o termo de voluntariado',
                xpEarned: 50
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Termo de voluntariado registrado com sucesso!',
            pointsEarned: 50
        });
    } catch (error) {
        console.error('Error submitting volunteer form:', error);
        return NextResponse.json(
            { error: 'Erro ao registrar termo' },
            { status: 500 }
        );
    }
}
