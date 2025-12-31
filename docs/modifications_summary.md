# Documentação de Modificações - Módulo Sócio e Treinador

## Data: 2024-05-20 (Simulada)

### 1. Módulo Treinador (Coach)
- **Login do Treinador (`app/coach/login/page.tsx`):**
    - Criada página de login dedicada com design premium.
    - Implementado modo demonstração que redireciona diretamente para o dashboard.
- **Dashboard do Treinador (`app/coach/dashboard/page.tsx`):**
    - Convertido para Server Component dinâmico.
    - Implementada busca de dados reais via action `getCoachDashboardData`.
    - Exibição de estatísticas reais (treinos, alunos, frequência).
    - Listagem de próximos treinos baseada no banco de dados.
- **Server Actions (`lib/actions/coach.ts`):**
    - `getCoachDashboardData`: Busca estatísticas e treinos vinculados ao treinador.
    - `createTraining`: Permite a criação de novos treinos.
    - `markAttendance`: Permite registrar presença dos alunos.

### 2. Módulo Sócio (Member)
- **Login do Sócio (`app/member/login/page.tsx`):**
    - Criada página de login para o portal do sócio.
    - Design coerente com a identidade visual do clube (vermelho/preto/dourado).
- **Dashboard do Sócio (`app/dashboard/page.tsx`):**
    - Totalmente revitalizado com design "Glassmorphism".
    - Dados dinâmicos via `getMemberDashboardData`.
    - Resumo de atividades, saldo de pontos, status de mensalidade e próximos treinos.
- **Painel de Perfil (`app/profile/panel/page.tsx`):**
    - Transformado em Server Component dinâmico.
    - Exibição real de dados de gamificação (pontos, nível, ranking).
    - Menu de navegação para sub-seções.
- **Carteirinha Digital (`app/profile/card/page.tsx`):**
    - Implementada com dados dinâmicos do banco de dados.
    - Visual de "cartão físico" com QR Code para identificação.
- **Server Actions (`lib/actions/member.ts`):**
    - `getMemberDashboardData`: Busca perfil, mensalidades, reservas e presenças em treinos.
    - `enrollInTraining`: Permite inscrição em novas turmas.
    - `reserveBoat`: Gerencia reservas de barcos com verificação de conflitos rudimentar.

### 3. Melhorias Gerais
- **Página de Login Principal (`app/login/page.tsx`):**
    - Corrigidas as rotas de redirecionamento para os fluxos específicos (/coach/login, /member/login, /diretoria/login).
- **Arquitetura:**
    - Reforçado o uso de Server Actions para separação de lógica de dados e UI.
    ### 4. Hall da Fama (Ranking)
- **Hall da Fama (Ranking)**: Corrigido crash `TypeError`, integrado dados dinâmicos do Prisma e padronizado nomenclatura no menu.
- **Server Action (`lib/actions/ranking.ts`):**
    - Refatorada a função `getSocialRanking` para agregar dados de performance (`PerformanceRecord`) e calcular estatísticas dinâmicas por usuário.

### 5. Identidade Visual e Assets
- **Identidade Visual e Assets**: Gerada imagem real para barcos (`rowing_boat_eight`) e integradas imagens reais na loja via Unsplash.

### 6. Refatoração de Navegação e Funcionalidades
- **Estrutura de Navegação Rígida**: Implementado sistema de menus fixos para Visitante, Sócio, Treinador e Diretoria, garantindo consistência visual.
- **Remoção de Indicadores**: Removido o ícone de scroll (mouse) da HeroSection para simplificar a UI.
- **Aula Experimental**: Redesenhada a página de agendamento com tema Dark premium para resolver problemas de cores ilegíveis.
- **Painel Financeiro**: Adicionada seção de Situação Financeira (mensalidade, boletos, pix) diretamente no painel do usuário.
- **Dashboard do Treinador**: Adicionada visualização de agendamentos de barcos para acompanhamento técnico.
- **Acesso Diretoria**: Padronizado menu administrativo para a diretoria, substituindo itens genéricos.

### 7. Correções de Erros e Estrutura (21/12/2025)
- **MainNav (`components/main-nav.tsx`):**
    - Corrigido erro de sintaxe TypeScript (`Cannot find name 'className'`) causado por estrutura JSX quebrada.
    - Implementado estado `loginOpen` para o formulário de login inline conforme novos requisitos de UI.
    - Corrigidos os imports de ícones ausentes (`ChevronRight`, `LogIn`).
    - Unificada a estrutura de menus e navegação mobile para suportar itens com dropdown.
    - Adicionada lógica de redirecionamento dinâmico no ícone de usuário: redirecionamento para o dashboard correspondente se logado, ou abertura do formulário de login se visitante.
    - **Correção de Tipagem**: Definidas interfaces explicitas `NavItem` e `NavDropdown` para resolver incompatibilidade de tipos no loop de renderização dos menus desktop e mobile.

### 8. Correções de Autenticação e Páginas da Diretoria (22/12/2024)
- **Variáveis de Ambiente (`.env`, `.env.local`):**
    - Corrigido `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL` de porta 3008 para 3001.
    - Resolvido problema de autenticação que impedia acesso às áreas protegidas.
- **Novas Páginas da Diretoria:**
    - **Eleições (`app/diretoria/eleicoes/page.tsx`):** Sistema de votações com candidatos, próximas eleições e histórico.
    - **Voluntariado (`app/diretoria/voluntariado/page.tsx`):** Gestão de programas de voluntariado e cadastro de voluntários.
    - **Sócios (`app/diretoria/socios/page.tsx`):** Gestão completa de membros com busca, filtros e status de mensalidade.
    - **Documentos (`app/diretoria/documentos/page.tsx`):** Repositório de estatuto, atas, regulamentos e formulários.

### 9. Reestruturação Completa do Header (22/12/2024)
- **Remoção de Componentes Obsoletos:**
    - Removidos `site-header.tsx` e `main-nav.tsx` (sistema de navegação antigo).
    - Removida completamente a hero-section ultrapassada.
- **Novos Componentes:**
    - **ClubHeader (`components/club-header.tsx`):** Novo componente principal de header com estrutura moderna:
        - **Top Bar (Desktop):** Pink Box (redes sociais), Blue Box (parceiros: Governo RN, PMN, Potiguas, Eureka), Green Box (usuário, busca, notificações).
        -  **Main Bar:** Background dividido (vermelho #DC2626 e preto), escudo centralizado (`sport_shield_new.svg`), texto "SPORT CLUB" (branco, 16pt) e "DE NATAL" (vermelho, 16pt), listras decorativas (`stripes_inclined.svg`).
        - **Menu Desktop:** INÍCIO, NOTÍCIAS, STORE, GALERIA, CONTATO (fonte Saira Condensed 8pt).
        - **Responsividade:** Breakpoint em 992px (lg), versão mobile com escudo centralizado e menu hamburguer.
    - **MobileMenu (`components/mobile-menu.tsx`):** Menu mobile com animação slide-in, backdrop blur e gradiente nas cores do clube.
- **Modificações de Estilo (`app/globals.css`):**
    - Adicionadas variáveis CSS: `--header-height-desktop: 156px`, `--header-height-mobile: 80px`.
    - Classes utilitárias: `.club-red`, `.bg-club-red`.
- **Atualização de Layout (`app/layout.tsx`):**
    - Substituído import de `SiteHeader` por `ClubHeader`.
- **Integração:**
    - Integrado com `AuthContext` para redirecionamento baseado em roles.
    - Mantida compatibilidade com `BottomNav` existente.
    - Utilizados SVGs fornecidos: `sport_shield_new.svg` e `stripes_inclined.svg`.

### 10. Inicialização do Servidor (28/12/2025)
- **Servidor Local**: Iniciado na porta 3001 (`npm run dev`).
- **Verificação**: Confirmado funcionamento via subagente, com carregamento completo do header, notícias, estatísticas e navegação mobile.
- **Correção de Erros (Schema)**: 
    - Adicionados campos `isVolunteer`, `volunteerSince` e `volunteerTermAcceptance` ao modelo `User`.
    - Criado modelo `VolunteerTermAcceptance` para registrar o aceite legal dos termos de voluntariado.
    - Resolvidos erros de compilação em `app/api/volunteer/accept-term/route.ts`.
    - **Nota**: Procedimento de limpeza de cache realizado (`Remove-Item node_modules/.prisma`) e verificado via script de runtime.

### 11. Sistema de Treinos - Finalização (29/12/2025)
- **Revisão Completa**: Identificadas 12 páginas e 10 APIs funcionais no módulo Training.
- **Bug Fix**: Corrigido erro ao finalizar treino onde `sessionId=null` causava falha na página cooldown.
    - `app/training/live/page.tsx`: Adicionada verificação de sessionId antes de redirecionar.
    - `app/training/cooldown/page.tsx`: Tratamento para string 'null'.
- **Nova Página**: Criada `app/training/analytics/page.tsx` com:
    - Cards de estatísticas (treinos, distância, tempo, pace)
    - Gráfico de volume semanal
    - Progressão de pace
    - Distribuição por tipo de treino
    - Conquistas/marcos alcançados

### 12. Funcionalidades Avançadas (29/12/2025)
- **Bug Fix SessionProvider**: Removido `useSession` da página cooldown que causava erro.
- **Sistema de Streak**: 
    - API `/api/gamification/streak` para calcular dias consecutivos de treino
    - Componente `StreakDisplay` com versões compact e full
    - Integração no dashboard de treinos
- **Web Bluetooth - Monitores Cardíacos**:
    - `lib/bluetooth/heart-rate.ts` - API para conectar monitores via Web Bluetooth
    - `lib/bluetooth/use-heart-rate.ts` - Hook React para gerenciar conexão
    - `components/training/HeartRateDisplay.tsx` - UI com coração pulsante e zonas cardíacas
    - Modo simulado como fallback quando Bluetooth não disponível
- **Coach Module**: Verificado existente com 6 páginas frontend e 8 APIs backend

### 13. Intervalos de 5 Minutos na Garagem (29/12/2025)
- **Alteração Solicitada**: Horários de reserva de barcos alterados de intervalos de 1 hora para 5 minutos.
- **Arquivos Modificados**: 
    - `components/garage/reservation-modal.tsx` - Select com 192 opções (05:00 às 20:55)
    - Horários especiais: Nascer do Sol 🌅, Popular ⭐, Pôr do Sol 🌇

### 14. Correção Tábua de Marés - Valores Inconsistentes (29/12/2025)
- **Problema**: Widget da home e página de detalhes `/tides` mostravam valores diferentes.
- **Causa**: Widget usava `tide-data-official.ts`, página usava mockData hardcoded.
- **Solução**: Página `/tides/page.tsx` agora importa e usa `getTidesForDate()` e `isHighTide()` do mesmo módulo oficial.

### 15. Redesign Sistema de Treinos - Inspirado em EXA/ErgData (29/12/2025)
- **Motivação**: Screenshots de apps profissionais de remo (EXA, ErgData) analisados para melhorar UX.
- **Arquivos Modificados**:
    - `app/training/live/page.tsx` - Redesign completo:
        - Timer gigante (72-96px) no formato dark
        - Pace e SPM lado a lado em grande destaque (48-56px)
        - Gráfico de intensidade em tempo real (Recharts)
        - Layout vertical centralizado
        - Fundo preto puro (como apps profissionais)
    - `app/training/start/page.tsx` - Modos de treino avançados:
        - Interface em 3 etapas (Local → Modo → Configuração)
        - Modo Livre (sem meta)
        - Modo Por Tempo (10, 20, 30, 45, 60 min)
        - Modo Por Distância (500m, 1km, 2km, 5km, 10km)
        - Modo Intervalado (4x500m, 6x500m, 5x1000m, 8x250m)

### 16. Correções de Bugs e UX - Sistema de Treinos (29/12/2025)
- **Página de Barcos (`/boats`)**:
    - Removido `useSession()` que causava erro fora do SessionProvider
    - Agora usa dados mock/API direta sem dependência de sessão
- **Dashboard de Treinos (`/training`)**:
    - Removidos links de planilhas confusas
    - Grid de atalhos agora mostra: Barcos, Histórico, Analytics
- **Botão de Feedback**:
    - Adicionado botão visível no cooldown que redireciona para `/training/feedback/session`
- **Seletor de Horário Garagem**:
    - Criado `TimePickerWheel` com interface estilo rodinha/alarm de smartphone
    - Substituído select com 192 opções por seletor interativo
    - Arquivo: `components/ui/time-picker-wheel.tsx`

### 17. Marcador de Voga (Stroke Coach) via Acelerômetro (29/12/2025)
- **Motivação**: Funcionar como SpeedCoach GPS 2, CoxBox ou Concept2 PM5
- **Arquivos Criados**:
    - `lib/sensors/accelerometer-stroke-detector.ts`:
        - Classe `StrokeDetector` usando DeviceMotion API
        - Detecta picos de aceleração para identificar remadas
        - Filtro de ruído configurável
        - Calcula SPM (Stroke Rate / VOGA)
        - Modo simulado para testes (`SimulatedStrokeDetector`)
    - `lib/sensors/use-stroke-detector.ts`:
        - Hook React para integração com componentes
        - Hook `useDistancePerStroke` para DPS
    - `lib/sensors/index.ts`: Exports
- **Tela Live Atualizada** (`app/training/live/page.tsx`):
    - SPM agora vem do acelerômetro real
    - Nova métrica: DPS (Distance Per Stroke) em metros
    - Nova métrica: Total de Strokes
    - Indicador de modo (Acelerômetro / Simulado)
- **Métricas Estilo SpeedCoach**:
    - Split/500m + SPM grandes
    - DPS, Distância, Calorias, Strokes, BPM em grid

### 18. Sistema Multi-Esporte (29/12/2025)
- **Página Start Refatorada** (`app/training/start/page.tsx`):
    - Fluxo em 4 etapas: Esporte → Local → Modo → Configuração
    - 4 modalidades suportadas:
        - 🚣 **Remo**: Rio, Tanque, Ergômetro
        - 🏃 **Corrida**: Outdoor, Esteira
        - 🚴 **Bicicleta**: Outdoor, Spinning
        - 🏋️ **Musculação**: Academia
    - Presets de distância específicos por esporte
    - Interface com cards coloridos por modalidade
- **Página de Musculação** (`app/training/live/gym/page.tsx`):
    - Timer de treino
    - Adicionar exercícios por grupo muscular
    - Registro de séries: reps × peso
    - Timer de descanso entre séries (60s)
    - Cálculo de volume total (kg)
    - Biblioteca de exercícios: Peito, Costas, Ombros, Bíceps, Tríceps, Pernas, Core

### 19. Programas de Treinamento (29/12/2025)
- **Página do Coach** (`app/coach/programs/page.tsx`):
    - Lista de programas do sistema e personalizados
    - Filtros: Todos, Sistema, Meus
    - Visualização de sessões semanais com emojis por tipo
    - Modal para atribuir programas a atletas
    - Estatísticas: total programas, atletas ativos, personalizados
- **Página Meu Programa** (`app/training/my-program/page.tsx`):
    - Progresso do programa atual (semana X de Y)
    - Barra de progresso animada
    - Treino de Hoje em destaque
    - Calendário semanal com status das sessões
    - Lista completa de sessões com botão de início
    - Estatísticas de adesão e XP
- **Dashboard Atualizado** (`app/training/page.tsx`):
    - Grid de atalhos agora com 4 colunas: Programa, Barcos, Histórico, Analytics

### 20. Reorganização da Documentação e Changelog (31/12/2025)
- **Seção Tecnologia & Inovação** (`app/about/page.tsx`):
    - Removida exposição de padrões internos SemVer
    - Atualizada versão de "V0.3.2" para "V0.4.5"
    - Texto simplificado mostrando funcionalidades principais
    - Adicionado link "Ver documentação completa" para `/docs`
- **Nova Página de Documentação** (`app/docs/page.tsx`):
    - Central de Documentação com 4 abas: Versões, Mapa do Site, Arquitetura, Orientações
    - Histórico completo de 32 versões (0.0.1 a 0.4.5)
    - Mapa do site com 80+ páginas organizadas por área (Público, Sócio, Coach, Diretoria, Admin)
    - Diagrama de arquitetura do sistema (Frontend → API → ORM → Database)
    - Guias de uso: reservar barco, registrar treino, acumular pontos
- **Changelog Expandido** (`app/changelog/page.tsx`):
    - Expandido de 6 para 32 versões completas
    - Todas as versões do CHANGELOG.md agora visíveis na interface

### 21. Sistema de Classificação de Condições para Remo por Horários Viáveis (31/12/2025)
- **Motivação**: Widget de marés mostrava classificação única para o dia inteiro, ignorando variação de correntes e horários de funcionamento do clube.
- **Solução Implementada**:
    - **Análise de 16 Horários Viáveis**: 9 slots manhã (05:00-09:00) + 7 slots tarde (14:30-17:30)
    - **Física Real do Rio Potengi**: Correntes de enchente (mar → rio) vs vazante (rio → mar)
    - **Algoritmo de Scoring**: CurrentScore (0-40) + WindScore (0-30) + WaveScore (0-15) + TimeOfDayScore (-8 a +15)
    - **Preferência Absoluta Manhã**: Em empates ou diferença ≤10 pontos, sempre escolhe manhã
- **Arquivos Criados**:
    - `types/rowing-conditions.ts` - Novos tipos: `SlotAnalysis`, `BestTimeResult`, `RowingConditionsOutput`
    - `lib/utils/rowing-conditions-analyzer.ts` - Algoritmo completo com dados oficiais da Marinha
    - `components/tides/SlotsTable.tsx` - Tabela expansível com todos os horários
    - `docs/ROWING_CONDITIONS_ANALYSIS.md` - Documentação técnica completa
- **Arquivos Modificados**:
    - `components/tide-widget.tsx` - Substituída classificação única por melhor horário + tabela expansível
- **Interface**:
    - **Melhor Horário**: Card destacado com horário, classificação e motivo
    - **Condição Atual**: Exibida se estiver em horário viável
    - **Botão Expandir**: Mostra tabela com todos os 16 horários analisados
    - **Tabela Detalhada**: Score, classificação, fase da maré, corrente, vento por horário
- **Dados Oficiais**: Velocidades de corrente da Marinha do Brasil (Porto de Natal)

