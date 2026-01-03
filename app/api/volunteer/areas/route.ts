import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * API CRUD de Áreas de Voluntariado
 * GET    /api/volunteer/areas    - Listar todas
 * POST   /api/volunteer/areas    - Criar nova (apenas diretoria)
 */

// GET - Listar áreas
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('active') !== 'false';

        const areas = await prisma.volunteerArea.findMany({
            where: activeOnly ? { isActive: true } : undefined,
            orderBy: { order: 'asc' }
        });

        return NextResponse.json({
            success: true,
            data: areas
        });
    } catch (error) {
        console.error('[Volunteer Areas API] Erro ao listar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao listar áreas' },
            { status: 500 }
        );
    }
}

// POST - Criar área
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, description, icon, color, colorClass, guide, coordinator, minVolunteers } = body;

        if (!name || !description) {
            return NextResponse.json(
                { success: false, error: 'Nome e descrição são obrigatórios' },
                { status: 400 }
            );
        }

        // Verificar se já existe
        const existing = await prisma.volunteerArea.findUnique({
            where: { name }
        });

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Já existe uma área com este nome' },
                { status: 409 }
            );
        }

        // Contar áreas para definir ordem
        const count = await prisma.volunteerArea.count();

        const area = await prisma.volunteerArea.create({
            data: {
                name,
                description,
                icon: icon || 'Heart',
                color: color || '#6B7280',
                colorClass: colorClass || 'bg-gray-500',
                guide: guide || null,
                coordinator: coordinator || null,
                minVolunteers: minVolunteers || 1,
                order: count
            }
        });

        return NextResponse.json({
            success: true,
            data: area
        }, { status: 201 });

    } catch (error) {
        console.error('[Volunteer Areas API] Erro ao criar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao criar área' },
            { status: 500 }
        );
    }
}
