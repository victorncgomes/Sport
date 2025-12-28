
export interface Invoice {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue';
    paymentMethod?: string;
    paymentDate?: string;
    pixCode?: string;
}

export interface MemberFinance {
    memberId: string;
    balance: number;
    nextDueDate: string;
    invoices: Invoice[];
}

export const memberFinanceData: MemberFinance = {
    memberId: 'MT-2024-001',
    balance: 0,
    nextDueDate: '2025-01-10',
    invoices: [
        {
            id: 'INV-001',
            description: 'Mensalidade Janeiro 2025',
            amount: 150.00,
            dueDate: '2025-01-10',
            status: 'pending',
            pixCode: '00020126360014BR.GOV.BCB.PIX0114+55849999999995204000053039865406150.005802BR5913SPORT CLUB NAT6005NATAL62070503***6304E2D9'
        },
        {
            id: 'INV-002',
            description: 'Mensalidade Dezembro 2024',
            amount: 150.00,
            dueDate: '2024-12-10',
            status: 'paid',
            paymentMethod: 'Cartão de Crédito',
            paymentDate: '2024-12-08'
        },
        {
            id: 'INV-003',
            description: 'Inscrição Regata de Verão',
            amount: 50.00,
            dueDate: '2024-12-15',
            status: 'paid',
            paymentMethod: 'Pix',
            paymentDate: '2024-12-15'
        }
    ]
};
