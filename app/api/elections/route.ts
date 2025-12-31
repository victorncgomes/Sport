import { NextRequest, NextResponse } from 'next/server';

// Dados simulados de eleições
const mockElections = [
    {
        id: '1',
        title: 'Eleição para Diretoria 2026',
        description: 'Eleição dos membros da diretoria executiva para o biênio 2026-2027',
        startDate: '2026-01-15T00:00:00Z',
        endDate: '2026-01-30T23:59:59Z',
        status: 'active',
        totalVotes: 45,
        candidates: [
            { id: 'c1', name: 'João Silva', position: 'Presidente', votes: 25, photo: null },
            { id: 'c2', name: 'Maria Santos', position: 'Presidente', votes: 20, photo: null },
            { id: 'c3', name: 'Pedro Costa', position: 'Vice-Presidente', votes: 30, photo: null },
            { id: 'c4', name: 'Ana Lima', position: 'Vice-Presidente', votes: 15, photo: null }
        ]
    },
    {
        id: '2',
        title: 'Votação: Reforma da Academia',
        description: 'Aprovação do projeto de reforma e ampliação da academia do clube',
        startDate: '2025-12-20T00:00:00Z',
        endDate: '2026-01-10T23:59:59Z',
        status: 'active',
        totalVotes: 78,
        candidates: [
            { id: 'o1', name: 'Aprovar Reforma', position: 'Opção', votes: 65, photo: null },
            { id: 'o2', name: 'Rejeitar Reforma', position: 'Opção', votes: 13, photo: null }
        ]
    },
    {
        id: '3',
        title: 'Eleição para Coach Principal',
        description: 'Escolha do novo coach principal da equipe de remo',
        startDate: '2025-11-01T00:00:00Z',
        endDate: '2025-11-15T23:59:59Z',
        status: 'finished',
        totalVotes: 92,
        candidates: [
            { id: 'co1', name: 'Carlos Souza', position: 'Coach', votes: 55, photo: null },
            { id: 'co2', name: 'Roberto Lima', position: 'Coach', votes: 37, photo: null }
        ]
    }
];

// GET - Listar eleições
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status'); // active, finished, upcoming

        let filtered = mockElections;

        if (status) {
            filtered = mockElections.filter(e => e.status === status);
        }

        return NextResponse.json({
            elections: filtered,
            total: filtered.length
        });
    } catch (error) {
        console.error('Error fetching elections:', error);
        return NextResponse.json(
            { error: 'Failed to fetch elections' },
            { status: 500 }
        );
    }
}

// POST - Criar nova eleição (apenas diretoria)
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Em produção, verificar permissões
        // const session = await getServerSession(authOptions);
        // if (!session || session.user.role !== 'BOARD') {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const newElection = {
            id: `${Date.now()}`,
            ...data,
            status: 'upcoming',
            totalVotes: 0,
            createdAt: new Date().toISOString()
        };

        // Em produção, salvar no banco
        // await prisma.election.create({ data: newElection });

        console.log('New election created:', newElection);

        return NextResponse.json({
            success: true,
            election: newElection
        });
    } catch (error) {
        console.error('Error creating election:', error);
        return NextResponse.json(
            { error: 'Failed to create election' },
            { status: 500 }
        );
    }
}
