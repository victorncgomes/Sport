import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET: Listar todas as aulas experimentais (para o módulo coach)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const where: any = {};

        // Filtrar por status
        if (status) {
            where.status = status;
        }

        // Filtrar por período
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate + 'T00:00:00'),
                lte: new Date(endDate + 'T23:59:59')
            };
        } else if (startDate) {
            where.date = {
                gte: new Date(startDate + 'T00:00:00')
            };
        }

        const classes = await prisma.experimentalClass.findMany({
            where,
            orderBy: [
                { date: 'asc' },
                { time: 'asc' }
            ]
        });

        return NextResponse.json({ classes });

    } catch (error) {
        console.error('Erro ao listar aulas experimentais:', error);
        return NextResponse.json(
            { error: 'Erro ao listar aulas experimentais' },
            { status: 500 }
        );
    }
}

// PATCH: Atualizar status de uma aula experimental
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, notes } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'ID e status são obrigatórios' },
                { status: 400 }
            );
        }

        const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Status inválido' },
                { status: 400 }
            );
        }

        const updated = await prisma.experimentalClass.update({
            where: { id },
            data: {
                status,
                ...(notes && { notes })
            }
        });

        return NextResponse.json({
            success: true,
            booking: updated
        });

    } catch (error) {
        console.error('Erro ao atualizar aula experimental:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar aula experimental' },
            { status: 500 }
        );
    }
}

// DELETE: Cancelar uma aula experimental
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'ID é obrigatório' },
                { status: 400 }
            );
        }

        // Soft delete - apenas marca como cancelado
        const updated = await prisma.experimentalClass.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });

        return NextResponse.json({
            success: true,
            message: 'Aula experimental cancelada'
        });

    } catch (error) {
        console.error('Erro ao cancelar aula experimental:', error);
        return NextResponse.json(
            { error: 'Erro ao cancelar aula experimental' },
            { status: 500 }
        );
    }
}
