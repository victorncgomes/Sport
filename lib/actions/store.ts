
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getStoreAnalytics() {
    try {
        const totalSales = await prisma.order.aggregate({
            where: { status: 'PAID' },
            _sum: { total: true }
        });

        const ordersCount = await prisma.order.count();

        const topProducts = await prisma.product.findMany({
            include: {
                _count: {
                    select: { orderItems: true }
                }
            },
            orderBy: {
                orderItems: { _count: 'desc' }
            },
            take: 5
        });

        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: { lt: 5 }
            }
        });

        return {
            revenue: totalSales._sum.total || 0,
            orders: ordersCount,
            topProducts,
            lowStock: lowStockProducts
        };
    } catch (error) {
        console.error('Error fetching store analytics:', error);
        return { revenue: 0, orders: 0, topProducts: [], lowStock: [] };
    }
}

export async function updateProductStock(productId: string, newStock: number) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { stock: newStock }
        });
        revalidatePath('/admin/store');
        return { success: true };
    } catch (error) {
        console.error('Error updating stock:', error);
        return { success: false };
    }
}
