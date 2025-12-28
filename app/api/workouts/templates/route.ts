import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/workouts/templates - Listar planilhas de treino
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status') || 'APPROVED';

        const where: any = { status };
        if (type) {
            where.type = type;
        }

        const templates = await prisma.workoutTemplate.findMany({
            where,
            include: {
                stages: {
                    orderBy: { order: 'asc' }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ templates });

    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar planilhas' },
            { status: 500 }
        );
    }
}

// POST /api/workouts/templates - Criar planilha (COACH/BOARD)
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

        // Verificar permissão (COACH ou BOARD)
        const allowedRoles = ['COACH', 'BOARD', 'ADMIN'];
        if (!allowedRoles.includes(user.role)) {
            return NextResponse.json(
                { error: 'Apenas treinadores e diretoria podem criar planilhas' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            title,
            type,
            targetAudience,
            duration,
            distance,
            stages
        } = body;

        // Validações
        if (!title || !type || !duration || !stages || stages.length === 0) {
            return NextResponse.json(
                { error: 'Dados incompletos' },
                { status: 400 }
            );
        }

        // Validar stages
        const totalDuration = stages.reduce((sum: number, stage: any) => sum + stage.duration, 0);
        if (totalDuration !== duration) {
            return NextResponse.json(
                { error: 'Duração total das etapas não corresponde à duração do treino' },
                { status: 400 }
            );
        }

        // Criar template
        const template = await prisma.workoutTemplate.create({
            data: {
                title,
                type,
                targetAudience: JSON.stringify(targetAudience || []),
                duration,
                distance,
                createdById: user.id,
                status: 'APPROVED', // Auto-aprovado se criado por COACH/BOARD
                stages: {
                    create: stages.map((stage: any, index: number) => ({
                        order: index + 1,
                        name: stage.name,
                        duration: stage.duration,
                        intensity: stage.intensity,
                        instructions: stage.instructions,
                        targetPace: stage.targetPace,
                        targetSPM: stage.targetSPM
                    }))
                }
            },
            include: {
                stages: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        return NextResponse.json({
            success: true,
            template
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating template:', error);
        return NextResponse.json(
            { error: 'Erro ao criar planilha' },
            { status: 500 }
        );
    }
}
