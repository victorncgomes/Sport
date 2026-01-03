import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * API para Comentários da Galeria
 * POST   /api/gallery/[id]/comments    - Adicionar comentário
 * DELETE /api/gallery/[id]/comments    - Excluir comentário (diretoria)
 */

interface RouteParams {
    params: { id: string }
}

// POST - Adicionar comentário
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const body = await request.json();
        const { userId, userName, text } = body;

        if (!text || !text.trim()) {
            return NextResponse.json(
                { success: false, error: 'Texto do comentário é obrigatório' },
                { status: 400 }
            );
        }

        const comment = await prisma.galleryComment.create({
            data: {
                postId: params.id,
                userId: userId || 'anonymous',
                userName: userName || 'Sócio',
                text: text.trim()
            }
        });

        return NextResponse.json({
            success: true,
            data: comment
        }, { status: 201 });

    } catch (error) {
        console.error('[Gallery Comments API] Erro ao criar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao criar comentário' },
            { status: 500 }
        );
    }
}

// DELETE - Excluir comentário específico
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { searchParams } = new URL(request.url);
        const commentId = searchParams.get('commentId');

        if (!commentId) {
            return NextResponse.json(
                { success: false, error: 'commentId é obrigatório' },
                { status: 400 }
            );
        }

        await prisma.galleryComment.delete({
            where: { id: commentId }
        });

        return NextResponse.json({ success: true, message: 'Comentário excluído' });
    } catch (error) {
        console.error('[Gallery Comments API] Erro ao excluir:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao excluir comentário' },
            { status: 500 }
        );
    }
}
