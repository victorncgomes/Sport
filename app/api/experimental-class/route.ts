import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET: Buscar horários ocupados para uma data específica
// Query params: date (YYYY-MM-DD)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get('date');

        if (!dateStr) {
            return NextResponse.json(
                { error: 'Parâmetro date é obrigatório' },
                { status: 400 }
            );
        }

        // Parse date to get start and end of day
        const date = new Date(dateStr + 'T00:00:00');
        const nextDay = new Date(dateStr + 'T23:59:59');

        // Buscar agendamentos existentes para essa data
        const existingBookings = await prisma.experimentalClass.findMany({
            where: {
                date: {
                    gte: date,
                    lte: nextDay
                },
                status: {
                    in: ['PENDING', 'CONFIRMED']
                }
            },
            select: {
                time: true
            }
        });

        const occupiedTimes = existingBookings.map((b: { time: string }) => b.time);

        return NextResponse.json({
            date: dateStr,
            occupiedTimes
        });

    } catch (error) {
        console.error('Erro ao buscar horários ocupados:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar horários' },
            { status: 500 }
        );
    }
}

// POST: Criar novo agendamento de aula experimental
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, date, time, modalidade } = body;

        // Validação básica
        if (!name || !email || !phone || !date || !time || !modalidade) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        // Verificar se o horário já está ocupado
        const dateObj = new Date(date + 'T00:00:00');
        const existingBooking = await prisma.experimentalClass.findFirst({
            where: {
                date: dateObj,
                time: time,
                status: {
                    in: ['PENDING', 'CONFIRMED']
                }
            }
        });

        if (existingBooking) {
            return NextResponse.json(
                { error: 'Este horário já está ocupado' },
                { status: 409 }
            );
        }

        // Criar o agendamento
        const newBooking = await prisma.experimentalClass.create({
            data: {
                name,
                email,
                phone,
                date: dateObj,
                time,
                modalidade,
                status: 'PENDING'
            }
        });

        return NextResponse.json({
            success: true,
            booking: newBooking,
            message: 'Aula experimental agendada com sucesso!'
        }, { status: 201 });

    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        return NextResponse.json(
            { error: 'Erro ao criar agendamento' },
            { status: 500 }
        );
    }
}
