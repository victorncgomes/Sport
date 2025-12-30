'use server';

import prisma from '@/lib/db';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface NotificationData {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    link?: string;
    createdAt: Date;
}

// Notificações simuladas para sócios
const MEMBER_NOTIFICATIONS: Omit<NotificationData, 'id'>[] = [
    {
        title: 'Mensalidade de Janeiro',
        message: 'Sua mensalidade de Janeiro/2025 já está disponível para pagamento. Valor: R$ 150,00. Vencimento: 10/01/2025.',
        type: 'WARNING',
        read: false,
        link: '/payments',
        createdAt: new Date('2025-01-05T10:00:00'),
    },
    {
        title: 'Novo Programa de Treinamento',
        message: 'O Coach Roberto disponibilizou um novo programa de treinamento personalizado para você. Acesse "Meu Programa" para conferir.',
        type: 'SUCCESS',
        read: false,
        link: '/training/my-program',
        createdAt: new Date('2025-01-03T14:30:00'),
    },
    {
        title: 'Mensalidade em Atraso',
        message: 'Identificamos que sua mensalidade de Dezembro/2024 está pendente. Regularize sua situação para continuar aproveitando todos os benefícios do clube.',
        type: 'ERROR',
        read: false,
        link: '/payments',
        createdAt: new Date('2024-12-28T09:00:00'),
    },
];

// Notificações simuladas para diretoria
const BOARD_NOTIFICATIONS: Omit<NotificationData, 'id'>[] = [
    {
        title: 'Novo Relatório Financeiro Disponível',
        message: 'O relatório financeiro de Dezembro/2024 foi gerado e está disponível para análise. Clique para visualizar os detalhes.',
        type: 'INFO',
        read: false,
        link: '/diretoria/financeiro/relatorios',
        createdAt: new Date('2025-01-02T08:00:00'),
    },
    {
        title: 'Notícia Aguardando Revisão',
        message: 'Uma nova notícia foi submetida por um membro e aguarda sua revisão antes da publicação: "Regata de Verão 2025".',
        type: 'WARNING',
        read: false,
        link: '/diretoria/noticias',
        createdAt: new Date('2025-01-01T16:45:00'),
    },
    {
        title: 'Novo Programa de Treinamento do Coach',
        message: 'O Coach Roberto criou um novo programa de treinamento para a categoria Júnior. O programa inclui 12 semanas de preparação para a Regata Estadual.',
        type: 'SUCCESS',
        read: false,
        link: '/coach/programs',
        createdAt: new Date('2024-12-30T11:20:00'),
    },
    {
        title: 'Mensagem do Presidente - Boas Festas!',
        message: 'Caros membros da Diretoria, é com imensa alegria que encerro 2025 agradecendo o empenho de todos. Que 2026 traga ainda mais conquistas! Enfrentamos grandes desafios em 2025, mas nossa união foi fundamental. Boas Festas e Feliz 2026! — Carlos, Presidente',
        type: 'INFO',
        read: false,
        link: undefined,
        createdAt: new Date('2024-12-24T10:00:00'),
    },
    {
        title: 'Bem-vindo à Diretoria!',
        message: 'Você foi adicionado como membro da Diretoria do Sport Club de Natal. Acesse o Painel da Diretoria para começar a contribuir com a gestão do clube.',
        type: 'SUCCESS',
        read: true,
        link: '/diretoria',
        createdAt: new Date('2024-01-15T09:00:00'),
    },
];

// Buscar notificações do usuário
export async function getNotifications(userId: string): Promise<NotificationData[]> {
    try {
        // Primeiro, tenta buscar do banco
        const dbNotifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        if (dbNotifications.length > 0) {
            return dbNotifications.map(n => ({
                id: n.id,
                title: n.title,
                message: n.message,
                type: n.type as NotificationType,
                read: n.read,
                link: n.link || undefined,
                createdAt: n.createdAt,
            }));
        }

        // Se não há notificações no banco, retorna simuladas
        return [];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

// Buscar notificações simuladas baseadas no perfil
export async function getNotificationsByProfile(role: string): Promise<NotificationData[]> {
    const notifications = role === 'BOARD' || role === 'ADMIN' || role === 'DIRECTOR'
        ? BOARD_NOTIFICATIONS
        : MEMBER_NOTIFICATIONS;

    return notifications.map((n, index) => ({
        ...n,
        id: `mock-${index + 1}`,
    }));
}

// Marcar notificação como lida
export async function markAsRead(notificationId: string): Promise<boolean> {
    try {
        if (notificationId.startsWith('mock-')) {
            // Simulado - apenas retorna sucesso
            return true;
        }

        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
        return true;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }
}

// Marcar todas como lidas
export async function markAllAsRead(userId: string): Promise<boolean> {
    try {
        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
        return true;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
    }
}

// Criar notificação (para uso interno/backend)
export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = 'INFO',
    link?: string
): Promise<string | null> {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link,
                read: false,
            },
        });
        return notification.id;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
}

// Contar notificações não lidas
export async function getUnreadCount(userId: string, role?: string): Promise<number> {
    try {
        const dbCount = await prisma.notification.count({
            where: { userId, read: false },
        });

        if (dbCount > 0) return dbCount;

        // Se não tem no banco, conta as simuladas
        const mockNotifications = role === 'BOARD' || role === 'ADMIN' || role === 'DIRECTOR'
            ? BOARD_NOTIFICATIONS
            : MEMBER_NOTIFICATIONS;

        return mockNotifications.filter(n => !n.read).length;
    } catch (error) {
        console.error('Error counting unread notifications:', error);
        return 0;
    }
}

// Excluir notificação
export async function deleteNotification(notificationId: string): Promise<boolean> {
    try {
        if (notificationId.startsWith('mock-')) {
            return true;
        }

        await prisma.notification.delete({
            where: { id: notificationId },
        });
        return true;
    } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
    }
}
