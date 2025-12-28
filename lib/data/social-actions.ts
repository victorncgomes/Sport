export type SocialActionType = 'voluntariado' | 'tarefa' | 'campanha';
export type SocialActionStatus = 'aberto' | 'em-progresso' | 'concluido' | 'cancelado';

export interface SocialAction {
    id: string;
    title: string;
    description: string;
    type: SocialActionType;
    status: SocialActionStatus;
    date: string;
    location: string;
    points: number;
    volunteersNeeded: number;
    volunteersRegistered: number;
}

export const socialActions: SocialAction[] = [
    {
        id: '1',
        title: 'Limpeza das Margens do Rio Potengi',
        description: 'Ação coletiva para retirada de resíduos sólidos das margens próximas à garagem. Essencial para a preservação do nosso local de treino.',
        type: 'voluntariado',
        status: 'aberto',
        date: '2025-01-15',
        location: 'Garagem do Clube',
        points: 50,
        volunteersNeeded: 20,
        volunteersRegistered: 8
    },
    {
        id: '2',
        title: 'Reforma das Prateleiras da Garagem',
        description: 'Pintura e ajustes nas prateleiras de barcos da categoria Máster.',
        type: 'tarefa',
        status: 'em-progresso',
        date: '2024-12-23',
        location: 'Garagem',
        points: 30,
        volunteersNeeded: 4,
        volunteersRegistered: 3
    },
    {
        id: '3',
        title: 'Campanha de Arrecadação de Alimentos',
        description: 'Coleta de alimentos não perecíveis para a comunidade do Passo da Pátria. Cada 1kg = 5 pontos.',
        type: 'campanha',
        status: 'aberto',
        date: '2024-12-30',
        location: 'Secretaria',
        points: 100,
        volunteersNeeded: 50,
        volunteersRegistered: 12
    },
    {
        id: '4',
        title: 'Organização do Arquivo de Presidentes',
        description: 'Digitalização e organização das fotos históricas para a Galeria de Honra.',
        type: 'tarefa',
        status: 'aberto',
        date: '2025-01-10',
        location: 'Sede Administrativa',
        points: 40,
        volunteersNeeded: 2,
        volunteersRegistered: 0
    },
    {
        id: '5',
        title: 'Apoio na Regata de Verão',
        description: 'Auxílio na logística da regata: cronometragem, suporte nos barcos de apoio e recepção de atletas.',
        type: 'voluntariado',
        status: 'aberto',
        date: '2025-02-02',
        location: 'Raia do Rio Potengi',
        points: 150,
        volunteersNeeded: 15,
        volunteersRegistered: 5
    }
];
