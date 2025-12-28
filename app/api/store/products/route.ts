import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// GET /api/store/products - Listar produtos
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured') === 'true';
        const search = searchParams.get('search');

        const where: any = { isAvailable: true };

        if (category) {
            where.category = category;
        }

        if (featured) {
            where.featured = true;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({
            products,
            total: products.length
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar produtos' },
            { status: 500 }
        );
    }
}

// POST /api/store/products - Criar produto (ADMIN)
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Apenas administradores podem criar produtos' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            name,
            description,
            category,
            price,
            stock,
            images,
            thumbnail,
            tags,
            featured
        } = body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                category,
                price,
                stock: stock || 0,
                images: images ? JSON.stringify(images) : null,
                thumbnail: thumbnail || null,
                tags: tags ? JSON.stringify(tags) : null,
                featured: featured || false,
                isAvailable: true
            }
        });

        return NextResponse.json({
            success: true,
            product
        });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Erro ao criar produto' },
            { status: 500 }
        );
    }
}
