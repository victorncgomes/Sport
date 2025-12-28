export const mockNotifications = [
    {
        id: '1',
        title: 'Nova Portaria: Uso dos Barcos',
        message: 'Foi publicada uma nova portaria sobre o uso dos barcos. Todos os sócios devem assinar o livro de saída antes de retirar qualquer embarcação.',
        type: 'info' as const,
        read: false,
        createdAt: new Date('2025-12-20T10:30:00'),
        icon: '🚣',
    },
    {
        id: '2',
        title: 'Confraternização 2025',
        message: 'A Diretoria convida todos os associados para a confraternização de fim de ano no dia 28/12 às 18h na sede do clube. Haverá premiação dos atletas destaque!',
        type: 'event' as const,
        read: false,
        createdAt: new Date('2025-12-19T14:00:00'),
        icon: '🎉',
    },
    {
        id: '3',
        title: 'Aviso: Mensalidade em Atraso',
        message: 'Identificamos que sua mensalidade de dezembro está em atraso. Por favor, regularize sua situação para continuar usufruindo dos serviços do clube.',
        type: 'warning' as const,
        read: false,
        createdAt: new Date('2025-12-21T09:00:00'),
        icon: '⚠️',
    },
];

export type Notification = typeof mockNotifications[0];
