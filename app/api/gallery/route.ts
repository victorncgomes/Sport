import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * API CRUD da Galeria
 * GET    /api/gallery    - Listar posts
 * POST   /api/gallery    - Criar post (requer role: socio+)
 */

// GET - Listar posts da galeria
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '50');
        const featured = searchParams.get('featured') === 'true';

        const where: any = { isApproved: true };

        if (category && category !== 'all') {
            where.category = category;
        }

        if (featured) {
            where.isFeatured = true;
        }

        const posts = await prisma.galleryPost.findMany({
            where,
            include: {
                comments: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                _count: {
                    select: { comments: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return NextResponse.json({
            success: true,
            data: posts.map(p => ({
                ...p,
                commentCount: p._count.comments
            }))
        });
    } catch (error) {
        console.error('[Gallery API] Erro ao listar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao listar galeria' },
            { status: 500 }
        );
    }
}

// POST - Criar post
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { title, description, imageUrl, category, authorId, authorName } = body;

        if (!title || !imageUrl) {
            return NextResponse.json(
                { success: false, error: 'Título e imagem são obrigatórios' },
                { status: 400 }
            );
        }

        const post = await prisma.galleryPost.create({
            data: {
                title,
                description: description || null,
                imageUrl,
                category: category || 'eventos',
                authorId: authorId || 'anonymous',
                authorName: authorName || 'Sócio',
                isApproved: true, // Auto-aprovar por enquanto
            }
        });

        return NextResponse.json({
            success: true,
            data: post
        }, { status: 201 });

    } catch (error) {
        console.error('[Gallery API] Erro ao criar:', error);
        return NextResponse.json(
            { success: false, error: 'Erro ao criar post' },
            { status: 500 }
        );
    }
}
