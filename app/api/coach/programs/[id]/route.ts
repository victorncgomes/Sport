import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * API CRUD para Programa específico
 * GET     /api/coach/programs/[id]    - Buscar um
 * PUT     /api/coach/programs/[id]    - Atualizar
 * DELETE  /api/coach/programs/[id]    - Excluir
 */

interface RouteParams {
    params: { id: string }
}

// GET - Buscar programa específico
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const program = await prisma.trainingProgram.findUnique({
            where: { id: params.id },
            include: {
                sessions: { orderBy: { dayOfWeek: 'asc' } },
                athletes: {
                    select: {
                        id: true,
                        userId: true,
                        status: true,
                        progress: true,
                        startDate: true
                    }
                }
            }
        });

        if (!program) {
            return NextResponse.json(
                { success: false, error: 'Programa não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: program });
    } catch (error) {
        console.error('[Programs API] Erro ao buscar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar programa' },
            { status: 500 }
        );
    }
}

// PUT - Atualizar programa
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const body = await request.json();
        const { name, description, level, durationWeeks, sessionsPerWeek, status, sessions } = body;

        // Atualizar programa
        const program = await prisma.trainingProgram.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(level && { level }),
                ...(durationWeeks && { durationWeeks }),
                ...(sessionsPerWeek && { sessionsPerWeek }),
                ...(status && { status }),
            }
        });

        // Se sessões foram fornecidas, substituir todas
        if (sessions && Array.isArray(sessions)) {
            // Deletar sessões antigas
            await prisma.programSession.deleteMany({
                where: { programId: params.id }
            });

            // Criar novas sessões
            await prisma.programSession.createMany({
                data: sessions.map((s: any, idx: number) => ({
                    programId: params.id,
                    dayOfWeek: s.dayOfWeek,
                    type: s.type || 'REMO',
                    title: s.title,
                    description: s.description || null,
                    duration: s.duration || 60,
                    intensity: s.intensity || 'MODERADO',
                    order: idx
                }))
            });
        }

        // Buscar programa atualizado
        const fullProgram = await prisma.trainingProgram.findUnique({
            where: { id: params.id },
            include: { sessions: true }
        });

        return NextResponse.json({ success: true, data: fullProgram });
    } catch (error) {
        console.error('[Programs API] Erro ao atualizar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao atualizar programa' },
            { status: 500 }
        );
    }
}

// DELETE - Excluir programa
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        // Verificar se é programa do sistema
        const program = await prisma.trainingProgram.findUnique({
            where: { id: params.id }
        });

        if (!program) {
            return NextResponse.json(
                { success: false, error: 'Programa não encontrado' },
                { status: 404 }
            );
        }

        if (program.isSystem) {
            return NextResponse.json(
                { success: false, error: 'Não é possível excluir programas do sistema' },
                { status: 403 }
            );
        }

        // Excluir (cascade deleta sessões)
        await prisma.trainingProgram.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true, message: 'Programa excluído' });
    } catch (error) {
        console.error('[Programs API] Erro ao excluir:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao excluir programa' },
            { status: 500 }
        );
    }
}
