import { NextRequest, NextResponse } from 'next/server';

// API de busca global
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        const lowerQuery = query.toLowerCase();

        // Buscar em diferentes categorias
        const results = {
            news: mockNews.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.content.toLowerCase().includes(lowerQuery)
            ).slice(0, 3),

            events: mockEvents.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery)
            ).slice(0, 3),

            members: mockMembers.filter(item =>
                item.name.toLowerCase().includes(lowerQuery) ||
                item.role.toLowerCase().includes(lowerQuery)
            ).slice(0, 5),

            boats: mockBoats.filter(item =>
                item.name.toLowerCase().includes(lowerQuery) ||
                item.type.toLowerCase().includes(lowerQuery)
            ).slice(0, 3)
        };

        const totalResults =
            results.news.length +
            results.events.length +
            results.members.length +
            results.boats.length;

        return NextResponse.json({
            query,
            totalResults,
            results
        });
    } catch (error) {
        console.error('Error searching:', error);
        return NextResponse.json(
            { error: 'Failed to search' },
            { status: 500 }
        );
    }
}

// Dados simulados - IDs must match news/[id]/page.tsx
const mockNews = [
    { id: '110-anos', title: 'O Sport Club de Natal dá início às comemorações pelos 110 anos de história', content: 'O barco Oito Com desfilou pelo Rio Potengi em celebração aos 110 anos do clube', date: '2025-12-23', category: 'História' },
    { id: 'rio-de-esperanca', title: 'Sport Club de Natal convida para o lançamento do Projeto Rio de Esperança', content: 'Projeto social atenderá 56 crianças e adolescentes com aulas de Remo Olímpico', date: '2025-12-23', category: 'Social' },
    { id: 'cbi-remo-2025', title: 'Sport Club de Natal encerra participação histórica no CBI de Remo', content: 'Nossos atletas deram o seu melhor no Rio de Janeiro, mostrando garra e disciplina', date: '2025-12-22', category: 'Competição' },
    { id: 'confraternizacao-2024', title: 'Família Sport Club de Natal unida em frente à sede histórica', content: 'Atletas, sócios e diretoria celebram conquistas do Gigante do Potengi', date: '2025-12-21', category: 'Eventos' },
    { id: '1', title: 'Equipe de Remo conquista 5 medalhas no Campeonato Nordestino', content: 'Atletas do Sport Club de Natal brilham em Recife com 3 ouros e 2 pratas', date: '2025-01-15', category: 'Competição' },
    { id: '2', title: 'Técnicas de Remada: Como melhorar sua performance no single skiff', content: 'Dicas essenciais para aprimorar sua técnica de remada', date: '2025-01-12', category: 'Técnica' }
];

const mockEvents = [
    { id: '1', title: 'Regata de Fim de Ano', description: 'Competição interna entre equipes', date: '2026-01-15', location: 'Rio Potengi' },
    { id: '2', title: 'Aula Experimental de Remo', description: 'Aula gratuita para iniciantes', date: '2026-01-20', location: 'Sede do Clube' },
    { id: '3', title: 'Assembleia Geral', description: 'Reunião anual de sócios', date: '2026-02-01', location: 'Auditório' }
];

const mockMembers = [
    { id: '1', name: 'João Silva', role: 'Atleta', category: 'Remo', level: 'Avançado' },
    { id: '2', name: 'Maria Santos', role: 'Coach', category: 'Remo', level: 'Profissional' },
    { id: '3', name: 'Pedro Costa', role: 'Atleta', category: 'Remo', level: 'Intermediário' },
    { id: '4', name: 'Ana Lima', role: 'Diretoria', category: 'Administração', level: 'Secretária' },
    { id: '5', name: 'Carlos Souza', role: 'Atleta', category: 'Remo', level: 'Iniciante' }
];

const mockBoats = [
    { id: '1', name: 'Single Skiff #1', type: 'Single Skiff', status: 'Disponível', condition: 'Excelente' },
    { id: '2', name: 'Double Skiff #1', type: 'Double Skiff', status: 'Em uso', condition: 'Boa' },
    { id: '3', name: 'Quad Skiff #1', type: 'Quad Skiff', status: 'Manutenção', condition: 'Regular' },
    { id: '4', name: 'Canoe #1', type: 'Canoe', status: 'Disponível', condition: 'Excelente' }
];
