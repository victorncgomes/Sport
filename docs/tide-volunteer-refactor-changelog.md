# Changelog - Refatoração TideWidget e Voluntariado

## Data: 02/01/2026

### TideWidget (`components/tide-widget.tsx`)

#### Layout Lado a Lado
- Clima e Vento agora ficam lado a lado em um grid de 2 colunas
- Containers foram compactados para melhor aproveitamento de espaço
- Ícones e textos reduzidos proporcionalmente

#### Remoção de Botões Duplicados
- Removidos botões "Anterior" e "Próximo" na parte inferior do widget
- Navegação mantida apenas na parte superior do widget

---

### ConditionsDisplay (`components/tides/ConditionsDisplay.tsx`)

#### Nova Estrutura de Layout
1. **1ª Linha**: Classificação + Correnteza (lado a lado)
2. **2ª Linha**: Superfície da Água + Vento (lado a lado)
3. **3ª Linha**: Pace Favorável + Pace Contra (lado a lado)

#### Pace Duplo
- Agora mostra dois indicadores de pace:
  - **Pace (Favor)**: Impacto quando remando a favor da correnteza
  - **Pace (Contra)**: Impacto quando remando contra a correnteza
- Cálculos baseados em `calculatePaceImpact` com ângulos 0° e 180°

---

### Página Tides/Weather (`app/tides-weather/page.tsx`)

#### Gráfico Reduzido
- Alterado de 7 dias para 3 dias (ontem, hoje, amanhã)

#### Seção de Horários de Remo
- Adicionada nova seção "Horários para Prática de Remo"
- Turno Manhã: 05:30 - 08:00
- Turno Tarde: 16:00 - 18:00
- Observações sobre condições ideais

#### Informações Extras
- Adicionada coordenada geográfica do clube
- Fuso UTC -03:00

---

### Voluntariado (`app/voluntariado/page.tsx`)

#### Novas Áreas (8 no total)
1. Mídia e Comunicação
2. Store
3. Manutenção de Barcos
4. Limpeza do Clube
5. Beta Testers do Aplicativo
6. Área Administrativa
7. Auxiliares dos Treinadores
8. Atendimento

#### Áreas Removidas
- ~~Design Gráfico~~
- ~~Áudio e Narração~~
- ~~Eventos e Regatas~~
- ~~Loja do Clube~~ (renomeado para Store)

#### Dias da Semana
- Segunda agora é o primeiro dia
- Domingo aparece desabilitado (não clicável)

#### Turnos Separados
- Turno Manhã: inputs independentes (ex: 05:45 às 06:45)
- Turno Tarde: inputs independentes (ex: 16:15 às 17:30)
- Permite durações flexíveis de 1 hora, 1h15min, etc.

#### Habilidades Expandidas
Organizadas por categoria:
- **Comunicação**: Fotografia, Edição de Vídeo, Gestão de Redes Sociais, Redação, Criação de Conteúdo
- **Técnico**: Manutenção de Barcos, Fibra/Resina, Marcenaria, Elétrica, Hidráulica, Pintura
- **Remo**: Remo Avançado, Timoneiro, Segurança Náutica, Primeiros Socorros, Salvamento Aquático
- **Administrativo**: Atendimento, Organização, Informática, Excel, Vendas
- **Tecnologia**: Teste de Software, Reporte de Bugs, Feedback UX, Programação
- **Eventos/Limpeza**: Organização de Eventos, Limpeza, Cozinha, Idiomas

---

### Termo de Voluntariado (`app/volunteer/term/page.tsx`)

#### Sincronização
- Áreas sincronizadas com `volunteer-areas.ts`
- IDs atualizados para corresponder ao sistema

#### Time Slots
- Manhã: 05:30 - 08:00
- Tarde: 16:00 - 18:00
- Removido turno noite (18:00 - 22:00)

#### Domingo Desabilitado
- Marcado como `disabled: true` no array de dias
