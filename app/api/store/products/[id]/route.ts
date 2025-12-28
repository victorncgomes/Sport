import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// PUT /api/store/products/[id] - Atualizar produto (ADMIN)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
                { error: 'Apenas administradores podem atualizar produtos' },
                { status: 403 }
            );
        }

        const body = await request.json();

        const product = await prisma.product.update({
            where: { id: params.id },
            data: body
        });

        return NextResponse.json({
            success: true,
            product
        });

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar produto' },
            { status: 500 }
        );
    }
}

// DELETE /api/store/products/[id] - Remover produto (ADMIN)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
                { error: 'Apenas administradores podem remover produtos' },
                { status: 403 }
            );
        }

        await prisma.product.delete({
            where: { id: params.id }
        });

        return NextResponse.json({
            success: true
        });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Erro ao remover produto' },
            { status: 500 }
        );
    }
}
