import { NextRequest, NextResponse } from 'next/server';

// Dados simulados de reuniões
const mockMeetings = [
    {
        id: '1',
        title: 'Reunião Mensal da Diretoria',
        description: 'Discussão sobre orçamento e planejamento 2026',
        date: '2026-01-20T19:00:00Z',
        duration: 120,
        location: 'Sala de Reuniões - Sede',
        organizer: 'João Silva',
        participants: ['Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Souza'],
        status: 'scheduled',
        type: 'board'
    },
    {
        id: '2',
        title: 'Assembleia Geral Ordinária',
        description: 'Prestação de contas e votação de propostas',
        date: '2026-02-15T18:00:00Z',
        duration: 180,
        location: 'Auditório Principal',
        organizer: 'Diretoria',
        participants: [],
        status: 'scheduled',
        type: 'general'
    },
    {
        id: '3',
        title: 'Reunião de Coaches',
        description: 'Alinhamento de metodologias de treino',
        date: '2026-01-10T17:00:00Z',
        duration: 90,
        location: 'Sala de Treinamento',
        organizer: 'Carlos Souza',
        participants: ['Roberto Lima', 'Fernanda Costa'],
        status: 'completed',
        type: 'coaches'
    }
];

// GET - Listar reuniões
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status'); // scheduled, completed, cancelled
        const type = searchParams.get('type'); // board, general, coaches

        let filtered = mockMeetings;

        if (status) {
            filtered = filtered.filter(m => m.status === status);
        }

        if (type) {
            filtered = filtered.filter(m => m.type === type);
        }

        // Ordenar por data
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return NextResponse.json({
            meetings: filtered,
            total: filtered.length
        });
    } catch (error) {
        console.error('Error fetching meetings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch meetings' },
            { status: 500 }
        );
    }
}

// POST - Agendar nova reunião
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Em produção, verificar permissões
        // const session = await getServerSession(authOptions);
        // if (!session) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const newMeeting = {
            id: `${Date.now()}`,
            ...data,
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };

        // Em produção, salvar no banco
        // await prisma.meeting.create({ data: newMeeting });

        console.log('New meeting scheduled:', newMeeting);

        return NextResponse.json({
            success: true,
            meeting: newMeeting
        });
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        return NextResponse.json(
            { error: 'Failed to schedule meeting' },
            { status: 500 }
        );
    }
}
