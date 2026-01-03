import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * API CRUD para Área específica
 * GET     /api/volunteer/areas/[id]    - Buscar uma
 * PUT     /api/volunteer/areas/[id]    - Atualizar
 * DELETE  /api/volunteer/areas/[id]    - Excluir
 */

interface RouteParams {
    params: { id: string }
}

// GET - Buscar área específica
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const area = await prisma.volunteerArea.findUnique({
            where: { id: params.id }
        });

        if (!area) {
            return NextResponse.json(
                { success: false, error: 'Área não encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: area });
    } catch (error) {
        console.error('[Volunteer Areas API] Erro ao buscar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar área' },
            { status: 500 }
        );
    }
}

// PUT - Atualizar área
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const body = await request.json();
        const { name, description, icon, color, colorClass, guide, coordinator, minVolunteers, isActive, order } = body;

        const area = await prisma.volunteerArea.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(icon && { icon }),
                ...(color && { color }),
                ...(colorClass && { colorClass }),
                ...(guide !== undefined && { guide }),
                ...(coordinator !== undefined && { coordinator }),
                ...(minVolunteers !== undefined && { minVolunteers }),
                ...(isActive !== undefined && { isActive }),
                ...(order !== undefined && { order }),
            }
        });

        return NextResponse.json({ success: true, data: area });
    } catch (error) {
        console.error('[Volunteer Areas API] Erro ao atualizar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao atualizar área' },
            { status: 500 }
        );
    }
}

// DELETE - Excluir área (soft delete - desativar)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { searchParams } = new URL(request.url);
        const hardDelete = searchParams.get('hard') === 'true';

        if (hardDelete) {
            // Hard delete - remover completamente
            await prisma.volunteerArea.delete({
                where: { id: params.id }
            });
            return NextResponse.json({ success: true, message: 'Área removida permanentemente' });
        } else {
            // Soft delete - apenas desativar
            await prisma.volunteerArea.update({
                where: { id: params.id },
                data: { isActive: false }
            });
            return NextResponse.json({ success: true, message: 'Área desativada' });
        }
    } catch (error) {
        console.error('[Volunteer Areas API] Erro ao excluir:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao excluir área' },
            { status: 500 }
        );
    }
}
