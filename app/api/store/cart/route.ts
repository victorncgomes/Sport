import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/store/cart - Adicionar ao carrinho
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
        const { productId, quantity } = body;

        // Verificar produto
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
        }

        if (product.stock < quantity) {
            return NextResponse.json(
                { error: 'Estoque insuficiente' },
                { status: 400 }
            );
        }

        // Adicionar ao carrinho (simplificado - em produção usar session storage ou DB)
        return NextResponse.json({
            success: true,
            message: 'Produto adicionado ao carrinho',
            item: {
                productId,
                product,
                quantity
            }
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json(
            { error: 'Erro ao adicionar ao carrinho' },
            { status: 500 }
        );
    }
}

// GET /api/store/cart - Ver carrinho
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        // Retornar carrinho vazio (em produção, buscar do storage/DB)
        return NextResponse.json({
            items: [],
            total: 0
        });

    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar carrinho' },
            { status: 500 }
        );
    }
}
