// ════════════════════════════════════════════════════════════════
// ÁREAS DE VOLUNTARIADO - Sport Club de Natal
// Definição das áreas onde os sócios podem atuar como voluntários
// ════════════════════════════════════════════════════════════════

export interface VolunteerArea {
    id: string;
    name: string;
    description: string;
    icon: string;           // Nome do ícone Lucide
    color: string;          // Cor para identificação no calendário
    colorClass: string;     // Classe Tailwind para background
    guide?: string;         // Guia/manual da área (editável pela diretoria)
    coordinator?: string;   // Coordenador responsável
    minVolunteers?: number; // Mínimo de voluntários por turno
}

export const VOLUNTEER_AREAS: VolunteerArea[] = [
    {
        id: 'MIDIA',
        name: 'Mídia & Comunicação',
        description: 'Redes sociais, fotografia, vídeos, divulgação de eventos e notícias do clube.',
        icon: 'Camera',
        color: '#8B5CF6',        // Roxo
        colorClass: 'bg-purple-500',
        guide: `## Guia da Área de Mídia

### Responsabilidades
- Gerenciar redes sociais (Instagram, Facebook, WhatsApp)
- Fotografar e filmar treinos e eventos
- Criar artes e posts para divulgação
- Manter o site atualizado com notícias

### Ferramentas
- Canva para criação de artes
- Celular/câmera para fotos e vídeos
- Acesso às redes sociais do clube

### Dicas
- Sempre pedir autorização antes de postar fotos de menores
- Manter a identidade visual do clube (vermelho, preto, dourado)
- Responder mensagens com educação e cordialidade`,
        minVolunteers: 1
    },
    {
        id: 'STORE',
        name: 'Store & Vendas',
        description: 'Atendimento na loja do clube, organização de produtos e vendas.',
        icon: 'ShoppingBag',
        color: '#F59E0B',        // Amarelo/Dourado
        colorClass: 'bg-amber-500',
        guide: `## Guia da Store

### Responsabilidades
- Atender clientes na loja
- Organizar produtos nas prateleiras
- Controlar estoque básico
- Realizar vendas e emitir recibos

### Ferramentas
- Sistema de vendas do clube
- Whatsapp para pedidos

### Dicas
- Conhecer os produtos disponíveis
- Manter a loja organizada e limpa
- Anotar produtos em falta`,
        minVolunteers: 1
    },
    {
        id: 'LIMPEZA',
        name: 'Limpeza & Organização',
        description: 'Limpeza das instalações, organização de materiais e mutirões.',
        icon: 'Sparkles',
        color: '#10B981',        // Verde
        colorClass: 'bg-emerald-500',
        guide: `## Guia de Limpeza

### Áreas de Responsabilidade
- Sede social
- Banheiros
- Garagem de barcos
- Área de treino

### Materiais
- Produtos de limpeza no almoxarifado
- Vassouras, rodos, panos

### Frequência
- Limpeza básica: diária
- Limpeza geral: semanal (sábados)`,
        minVolunteers: 2
    },
    {
        id: 'MANUTENCAO',
        name: 'Manutenção',
        description: 'Reparos em equipamentos, barcos, instalações e manutenção preventiva.',
        icon: 'Wrench',
        color: '#EF4444',        // Vermelho
        colorClass: 'bg-red-500',
        guide: `## Guia de Manutenção

### Responsabilidades
- Reparos básicos em barcos e remos
- Manutenção de equipamentos
- Pequenos reparos na sede
- Reportar problemas graves

### Ferramentas
- Caixa de ferramentas no almoxarifado
- Materiais de reparo para barcos

### Importante
- Não realizar reparos complexos sem autorização
- Documentar todos os reparos realizados
- Reportar problemas que precisam de profissional`,
        minVolunteers: 1
    },
    {
        id: 'TREINAMENTO',
        name: 'Apoio aos Treinos',
        description: 'Auxiliar treinadores, acompanhar iniciantes, ajudar na preparação dos barcos.',
        icon: 'Dumbbell',
        color: '#3B82F6',        // Azul
        colorClass: 'bg-blue-500',
        guide: `## Guia de Apoio aos Treinos

### Responsabilidades
- Auxiliar na preparação dos barcos
- Acompanhar remadores iniciantes
- Ajudar no aquecimento coletivo
- Apoiar treinadores durante aulas

### Requisitos
- Conhecimento básico de remo
- Pelo menos 6 meses de prática

### Segurança
- Verificar coletes salva-vidas
- Conferir condições do barco antes de sair
- Estar atento às condições do rio`,
        minVolunteers: 2
    },
    {
        id: 'ATENDIMENTO',
        name: 'Atendimento & Recepção',
        description: 'Recepção de visitantes, atendimento telefônico e suporte aos sócios.',
        icon: 'MessageCircle',
        color: '#EC4899',        // Rosa
        colorClass: 'bg-pink-500',
        guide: `## Guia de Atendimento

### Responsabilidades
- Recepcionar visitantes
- Atender telefone e WhatsApp
- Tirar dúvidas de sócios
- Auxiliar em eventos

### Postura
- Cordialidade e educação
- Conhecer informações básicas do clube
- Encaminhar questões complexas à diretoria

### Horários de Funcionamento
- Segunda a Sexta: 6h às 18h
- Sábados: 6h às 12h
- Domingos: Fechado (exceto eventos)`,
        minVolunteers: 1
    }
];

/**
 * Retorna uma área pelo ID
 */
export function getAreaById(id: string): VolunteerArea | undefined {
    return VOLUNTEER_AREAS.find(area => area.id === id);
}

/**
 * Retorna a cor de uma área para uso no calendário
 */
export function getAreaColor(id: string): string {
    const area = getAreaById(id);
    return area?.color || '#6B7280'; // gray-500 como fallback
}

/**
 * Retorna a classe de cor Tailwind de uma área
 */
export function getAreaColorClass(id: string): string {
    const area = getAreaById(id);
    return area?.colorClass || 'bg-gray-500';
}

/**
 * Horários de funcionamento do clube para voluntariado
 */
export const VOLUNTEER_HOURS = {
    START: 5,   // 5h da manhã
    END: 18,    // 18h (6h da tarde)
    SLOT_DURATION: 60, // 1 hora por slot
};

/**
 * Dias da semana para voluntariado
 */
export const VOLUNTEER_DAYS = [
    { id: 0, name: 'Domingo', short: 'Dom', available: false },
    { id: 1, name: 'Segunda', short: 'Seg', available: true },
    { id: 2, name: 'Terça', short: 'Ter', available: true },
    { id: 3, name: 'Quarta', short: 'Qua', available: true },
    { id: 4, name: 'Quinta', short: 'Qui', available: true },
    { id: 5, name: 'Sexta', short: 'Sex', available: true },
    { id: 6, name: 'Sábado', short: 'Sáb', available: true },
];

/**
 * Gera os slots de horário disponíveis
 */
export function generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let hour = VOLUNTEER_HOURS.START; hour < VOLUNTEER_HOURS.END; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
}
