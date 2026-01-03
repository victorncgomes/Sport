import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * API CRUD de Programas de Treinamento
 * GET    /api/coach/programs       - Listar todos
 * POST   /api/coach/programs       - Criar novo
 */

// GET - Listar programas
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter'); // all, SYSTEM, COACH
        const level = searchParams.get('level');
        const status = searchParams.get('status') || 'ACTIVE';

        const where: any = { status };

        if (filter === 'SYSTEM') {
            where.isSystem = true;
        } else if (filter === 'COACH') {
            where.isSystem = false;
        }

        if (level) {
            where.level = level;
        }

        const programs = await prisma.trainingProgram.findMany({
            where,
            include: {
                sessions: {
                    orderBy: { dayOfWeek: 'asc' }
                },
                _count: {
                    select: { athletes: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transformar para incluir assignedCount compatível com interface existente
        const programsWithCount = programs.map(p => ({
            ...p,
            assignedCount: p._count.athletes,
            createdBy: p.isSystem ? 'SYSTEM' : 'COACH'
        }));

        return NextResponse.json({
            success: true,
            data: programsWithCount
        });
    } catch (error) {
        console.error('[Programs API] Erro ao listar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao listar programas' },
            { status: 500 }
        );
    }
}

// POST - Criar programa
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, description, level, durationWeeks, sessionsPerWeek, sessions, coachId } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Nome é obrigatório' },
                { status: 400 }
            );
        }

        // Criar programa
        const program = await prisma.trainingProgram.create({
            data: {
                name,
                description: description || null,
                level: level || 'INICIANTE',
                durationWeeks: durationWeeks || 4,
                sessionsPerWeek: sessionsPerWeek || 3,
                createdBy: coachId || 'COACH',
                isSystem: false,
                status: 'DRAFT',
            }
        });

        // Criar sessões se fornecidas
        if (sessions && Array.isArray(sessions) && sessions.length > 0) {
            await prisma.programSession.createMany({
                data: sessions.map((s: any, idx: number) => ({
                    programId: program.id,
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

        // Buscar programa completo
        const fullProgram = await prisma.trainingProgram.findUnique({
            where: { id: program.id },
            include: { sessions: true }
        });

        return NextResponse.json({
            success: true,
            data: fullProgram
        }, { status: 201 });

    } catch (error) {
        console.error('[Programs API] Erro ao criar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao criar programa' },
            { status: 500 }
        );
    }
}
