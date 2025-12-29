import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validações
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'A senha deve ter no mínimo 6 caracteres' },
                { status: 400 }
            );
        }

        // Verificar se email já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email já está cadastrado' },
                { status: 409 }
            );
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'VISITOR', // Novo usuário começa como visitante
                emailVerified: null // Pode implementar verificação de email depois
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Usuário criado com sucesso',
            user
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Erro ao criar usuário' },
            { status: 500 }
        );
    }
}
