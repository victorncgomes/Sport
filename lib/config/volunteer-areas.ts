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
        name: 'Mídia e Comunicação',
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
        name: 'Store',
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
        id: 'MANUTENCAO_BARCOS',
        name: 'Manutenção de Barcos',
        description: 'Reparos em barcos, remos, e equipamentos náuticos. Manutenção preventiva.',
        icon: 'Wrench',
        color: '#EF4444',        // Vermelho
        colorClass: 'bg-red-500',
        guide: `## Guia de Manutenção de Barcos

### Responsabilidades
- Reparos básicos em barcos e remos
- Manutenção de equipamentos náuticos
- Verificação de integridade dos cascos
- Reportar problemas graves

### Ferramentas
- Caixa de ferramentas no almoxarifado
- Materiais de reparo para barcos (fibra, resina)

### Importante
- Não realizar reparos complexos sem autorização
- Documentar todos os reparos realizados
- Reportar problemas que precisam de profissional`,
        minVolunteers: 1
    },
    {
        id: 'LIMPEZA_CLUBE',
        name: 'Limpeza do Clube',
        description: 'Limpeza das instalações, organização de materiais e mutirões.',
        icon: 'Sparkles',
        color: '#10B981',        // Verde
        colorClass: 'bg-emerald-500',
        guide: `## Guia de Limpeza do Clube

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
        id: 'BETA_TESTERS',
        name: 'Beta Testers do Aplicativo',
        description: 'Testar novas funcionalidades do app, reportar bugs e sugerir melhorias.',
        icon: 'Smartphone',
        color: '#06B6D4',        // Ciano
        colorClass: 'bg-cyan-500',
        guide: `## Guia de Beta Testers

### Responsabilidades
- Testar novas versões do aplicativo
- Reportar bugs e problemas encontrados
- Sugerir melhorias de usabilidade
- Participar de pesquisas de satisfação

### Como Reportar
- Usar o canal específico no WhatsApp
- Incluir capturas de tela quando possível
- Descrever os passos para reproduzir o problema

### Requisitos
- Ter o aplicativo sempre atualizado
- Disponibilidade para testar novidades`,
        minVolunteers: 3
    },
    {
        id: 'ADMINISTRATIVO',
        name: 'Área Administrativa',
        description: 'Apoio administrativo, secretaria, organização de documentos e atendimento.',
        icon: 'Briefcase',
        color: '#6366F1',        // Índigo
        colorClass: 'bg-indigo-500',
        guide: `## Guia Administrativo

### Responsabilidades
- Apoiar a secretaria do clube
- Organizar documentos e arquivos
- Auxiliar em processos burocráticos
- Atender ligações e e-mails

### Horários
- Funcionamento: Segunda a Sexta, 8h às 17h
- Sábados: 8h às 12h

### Ferramentas
- Computador da secretaria
- Sistema de gestão do clube`,
        minVolunteers: 1
    },
    {
        id: 'AUXILIARES_TREINADORES',
        name: 'Auxiliares dos Treinadores',
        description: 'Auxiliar treinadores, acompanhar iniciantes, ajudar na preparação dos barcos.',
        icon: 'Dumbbell',
        color: '#3B82F6',        // Azul
        colorClass: 'bg-blue-500',
        guide: `## Guia de Auxiliares dos Treinadores

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
        name: 'Atendimento',
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
 * Habilidades disponíveis para voluntários
 */
export const VOLUNTEER_SKILLS = [
    // Comunicação
    { id: 'fotografia', name: 'Fotografia', category: 'Comunicação' },
    { id: 'video', name: 'Edição de Vídeo', category: 'Comunicação' },
    { id: 'redacao', name: 'Redação e Textos', category: 'Comunicação' },
    { id: 'redes_sociais', name: 'Gestão de Redes Sociais', category: 'Comunicação' },
    // Técnico
    { id: 'manutencao_barcos', name: 'Manutenção de Barcos', category: 'Técnico' },
    { id: 'fibra_resina', name: 'Trabalho com Fibra/Resina', category: 'Técnico' },
    { id: 'marcenaria', name: 'Marcenaria Básica', category: 'Técnico' },
    { id: 'eletrica', name: 'Elétrica Básica', category: 'Técnico' },
    { id: 'hidraulica', name: 'Hidráulica Básica', category: 'Técnico' },
    // Remo
    { id: 'remo_avancado', name: 'Remo Avançado', category: 'Remo' },
    { id: 'timoneiro', name: 'Timoneiro Experiente', category: 'Remo' },
    { id: 'seguranca_nautica', name: 'Segurança Náutica', category: 'Remo' },
    { id: 'primeiros_socorros', name: 'Primeiros Socorros', category: 'Remo' },
    // Administrativo
    { id: 'atendimento', name: 'Atendimento ao Público', category: 'Administrativo' },
    { id: 'organizacao', name: 'Organização e Arquivos', category: 'Administrativo' },
    { id: 'informatica', name: 'Informática Básica', category: 'Administrativo' },
    { id: 'excel', name: 'Excel/Planilhas', category: 'Administrativo' },
    // Beta Testing
    { id: 'teste_software', name: 'Teste de Software', category: 'Tecnologia' },
    { id: 'report_bugs', name: 'Reporte de Bugs', category: 'Tecnologia' },
    { id: 'ux_feedback', name: 'Feedback de UX', category: 'Tecnologia' },
    // Eventos
    { id: 'organizacao_eventos', name: 'Organização de Eventos', category: 'Eventos' },
    { id: 'cozinha', name: 'Cozinha/Alimentação', category: 'Eventos' },
    { id: 'limpeza', name: 'Limpeza e Organização', category: 'Eventos' },
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
 * Slots de 15 minutos para maior flexibilidade
 */
export const VOLUNTEER_HOURS = {
    START: 5,   // 5h da manhã
    END: 18,    // 18h (6h da tarde)
    SLOT_DURATION: 15, // 15 minutos por slot para maior flexibilidade
};

/**
 * Dias da semana para voluntariado (Segunda como primeiro dia)
 */
export const VOLUNTEER_DAYS = [
    { id: 1, name: 'Segunda-feira', short: 'Seg', available: true },
    { id: 2, name: 'Terça-feira', short: 'Ter', available: true },
    { id: 3, name: 'Quarta-feira', short: 'Qua', available: true },
    { id: 4, name: 'Quinta-feira', short: 'Qui', available: true },
    { id: 5, name: 'Sexta-feira', short: 'Sex', available: true },
    { id: 6, name: 'Sábado', short: 'Sáb', available: true },
    { id: 0, name: 'Domingo', short: 'Dom', available: false },
];

/**
 * Gera os slots de horário disponíveis (a cada 15 minutos)
 */
export function generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let hour = VOLUNTEER_HOURS.START; hour < VOLUNTEER_HOURS.END; hour++) {
        for (let min = 0; min < 60; min += VOLUNTEER_HOURS.SLOT_DURATION) {
            slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
        }
    }
    return slots;
}

/**
 * Retorna habilidades agrupadas por categoria
 */
export function getSkillsByCategory(): Record<string, typeof VOLUNTEER_SKILLS> {
    return VOLUNTEER_SKILLS.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, typeof VOLUNTEER_SKILLS>);
}
