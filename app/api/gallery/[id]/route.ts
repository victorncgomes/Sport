import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * API para Post específico da Galeria
 * GET     /api/gallery/[id]    - Buscar post com comentários
 * PUT     /api/gallery/[id]    - Atualizar post
 * DELETE  /api/gallery/[id]    - Excluir post (apenas diretoria)
 */

interface RouteParams {
    params: { id: string }
}

// GET - Buscar post específico
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const post = await prisma.galleryPost.findUnique({
            where: { id: params.id },
            include: {
                comments: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!post) {
            return NextResponse.json(
                { success: false, error: 'Post não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        console.error('[Gallery API] Erro ao buscar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar post' },
            { status: 500 }
        );
    }
}

// PUT - Atualizar post (like, feature, etc)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const body = await request.json();
        const { title, description, category, isFeatured, isApproved, incrementLike } = body;

        const updateData: any = {};

        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category) updateData.category = category;
        if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
        if (isApproved !== undefined) updateData.isApproved = isApproved;

        // Incrementar like
        if (incrementLike) {
            updateData.likes = { increment: 1 };
        }

        const post = await prisma.galleryPost.update({
            where: { id: params.id },
            data: updateData
        });

        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        console.error('[Gallery API] Erro ao atualizar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao atualizar post' },
            { status: 500 }
        );
    }
}

// DELETE - Excluir post (apenas diretoria/admin)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        // TODO: Verificar role do usuário (diretoria/admin)
        // Por enquanto, permitir delete

        await prisma.galleryPost.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true, message: 'Post excluído' });
    } catch (error) {
        console.error('[Gallery API] Erro ao excluir:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao excluir post' },
            { status: 500 }
        );
    }
}
