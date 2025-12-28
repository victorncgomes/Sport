import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// POST /api/store/checkout - Finalizar compra
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
        const { items, shippingAddress, paymentMethod } = body;

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'Carrinho vazio' },
                { status: 400 }
            );
        }

        let total = 0;

        // Validar estoque e calcular total
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                return NextResponse.json(
                    { error: `Produto ${item.productId} não encontrado` },
                    { status: 404 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Estoque insuficiente para ${product.name}` },
                    { status: 400 }
                );
            }

            total += product.price * item.quantity;
        }

        // Criar pedido
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total,
                status: 'PENDING',
                shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
                paymentMethod: paymentMethod || 'PIX',
                items: JSON.stringify(items)
            }
        });

        // Reduzir estoque
        for (const item of items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity }
                }
            });
        }

        // Gamificação: pontos pela compra
        const pointsEarned = Math.floor(total / 10); // 1 ponto a cada R$10
        await prisma.user.update({
            where: { id: user.id },
            data: {
                points: { increment: pointsEarned }
            }
        });

        // Criar log
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                activityType: 'STORE_PURCHASE',
                description: `Compra na store - R$ ${total.toFixed(2)}`,
                xpEarned: pointsEarned,
                metadata: JSON.stringify({ orderId: order.id, total })
            }
        });

        return NextResponse.json({
            success: true,
            order,
            pointsEarned
        });

    } catch (error) {
        console.error('Error processing checkout:', error);
        return NextResponse.json(
            { error: 'Erro ao processar compra' },
            { status: 500 }
        );
    }
}
