// Dados simulados de histórico de pagamentos
export const SIMULATED_PAYMENTS = [
    {
        id: 'pay-1',
        date: '2025-12-01',
        amount: 150.00,
        type: 'MENSALIDADE',
        status: 'PAGO',
        method: 'PIX',
        description: 'Mensalidade Dezembro/2025'
    },
    {
        id: 'pay-2',
        date: '2025-11-01',
        amount: 150.00,
        type: 'MENSALIDADE',
        status: 'PAGO',
        method: 'CARTAO',
        description: 'Mensalidade Novembro/2025'
    },
    {
        id: 'pay-3',
        date: '2025-10-15',
        amount: 80.00,
        type: 'EVENTO',
        status: 'PAGO',
        method: 'PIX',
        description: 'Regata Estadual 2025'
    },
    {
        id: 'pay-4',
        date: '2025-10-01',
        amount: 150.00,
        type: 'MENSALIDADE',
        status: 'PAGO',
        method: 'PIX',
        description: 'Mensalidade Outubro/2025'
    },
    {
        id: 'pay-5',
        date: '2025-09-01',
        amount: 150.00,
        type: 'MENSALIDADE',
        status: 'PAGO',
        method: 'BOLETO',
        description: 'Mensalidade Setembro/2025'
    },
    {
        id: 'pay-6',
        date: '2025-08-20',
        amount: 45.00,
        type: 'LOJA',
        status: 'PAGO',
        method: 'CARTAO',
        description: 'Camiseta Sport Club'
    },
    {
        id: 'pay-7',
        date: '2025-08-01',
        amount: 150.00,
        type: 'MENSALIDADE',
        status: 'PAGO',
        method: 'PIX',
        description: 'Mensalidade Agosto/2025'
    },
    {
        id: 'pay-8',
        date: '2025-07-01',
        amount: 150.00,
        type: 'MENSALIDADE',
        status: 'PAGO',
        method: 'PIX',
        description: 'Mensalidade Julho/2025'
    }
];

export const UPCOMING_PAYMENTS = [
    {
        id: 'upcoming-1',
        dueDate: '2026-01-05',
        amount: 150.00,
        type: 'MENSALIDADE',
        status: 'PENDENTE',
        description: 'Mensalidade Janeiro/2026'
    }
];
