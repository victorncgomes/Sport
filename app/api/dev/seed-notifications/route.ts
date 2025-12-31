import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// API para popular notificações de exemplo (apenas para desenvolvimento)
export async function POST(request: NextRequest) {
    try {
        // Buscar primeiro usuário para vincular as notificações
        const firstUser = await prisma.user.findFirst();

        if (!firstUser) {
            return NextResponse.json(
                { error: 'Nenhum usuário encontrado. Crie um usuário primeiro.' },
                { status: 404 }
            );
        }

        const notifications = [
            {
                userId: firstUser.id,
                title: 'Bem-vindo ao Sport Club de Natal!',
                message: 'Sua conta foi criada com sucesso. Explore todas as funcionalidades do app.',
                type: 'SUCCESS',
                read: false
            },
            {
                userId: firstUser.id,
                title: 'Novo Treino Disponível',
                message: 'O coach Carlos criou um novo plano de treino para você. Confira no módulo de treinos.',
                type: 'INFO',
                read: false
            },
            {
                userId: firstUser.id,
                title: 'Reserva Confirmada',
                message: 'Sua reserva do barco Single Skiff para amanhã às 06:00 foi confirmada.',
                type: 'SUCCESS',
                read: true
            },
            {
                userId: firstUser.id,
                title: 'Mensalidade Vencendo',
                message: 'Sua mensalidade vence em 3 dias. Acesse a área de pagamentos para regularizar.',
                type: 'WARNING',
                read: false
            },
            {
                userId: firstUser.id,
                title: 'Manutenção Programada',
                message: 'O sistema ficará em manutenção no domingo das 02:00 às 04:00.',
                type: 'INFO',
                read: true
            },
            {
                userId: firstUser.id,
                title: 'Novo Badge Conquistado!',
                message: 'Parabéns! Você conquistou o badge "Remador Dedicado" por completar 10 treinos.',
                type: 'SUCCESS',
                read: false
            },
            {
                userId: firstUser.id,
                title: 'Evento: Regata de Verão',
                message: 'Inscrições abertas para a Regata de Verão 2026. Garanta sua vaga!',
                type: 'INFO',
                read: false
            },
            {
                userId: firstUser.id,
                title: 'Atualização de Perfil Necessária',
                message: 'Por favor, atualize seus dados pessoais e contato de emergência.',
                type: 'WARNING',
                read: true
            },
            {
                userId: firstUser.id,
                title: 'Novo Produto na Loja',
                message: 'Confira a nova coleção de uniformes oficiais do clube na loja.',
                type: 'INFO',
                read: true
            },
            {
                userId: firstUser.id,
                title: 'Feedback de Treino',
                message: 'Seu último treino foi avaliado pelo coach. Veja os comentários no seu perfil.',
                type: 'INFO',
                read: false
            },
            {
                userId: firstUser.id,
                title: 'Condições do Rio',
                message: 'Alerta: Ventos fortes previstos para amanhã. Condições desfavoráveis para remo.',
                type: 'WARNING',
                read: false
            },
            {
                userId: firstUser.id,
                title: 'Reunião da Diretoria',
                message: 'Assembleia geral marcada para 15/01 às 19:00. Sua presença é importante.',
                type: 'INFO',
                read: true
            }
        ];

        // Criar todas as notificações
        await prisma.notification.createMany({
            data: notifications
        });

        return NextResponse.json({
            success: true,
            message: `${notifications.length} notificações criadas com sucesso!`,
            userId: firstUser.id
        });

    } catch (error) {
        console.error('Erro ao popular notificações:', error);
        return NextResponse.json(
            { error: 'Erro ao criar notificações' },
            { status: 500 }
        );
    }
}
