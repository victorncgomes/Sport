# CHANGELOG - Sport Club de Natal

Histórico completo de versões do sistema de gestão do Sport Club de Natal.

**Padrão SemVer:**
- `0.x.0`: Mudança significativa (nova funcionalidade principal)
- `0.0.x`: Correções, melhorias e ajustes menores

---

## [0.4.9] - 2026-01-02

### Corrigido
- **Módulo de Treino:**
  - Navegação entre semanas em "Meu Programa" com botões ◀ ▶
  - Botão "Voltar para esta semana" quando navegando fora da semana atual
  - Roteamento de "Outras Atividades" para `/training/start?sport=OTHER&activity=SURF`
  
- **Módulo Coach:**
  - Sistema de chamada completo (`/coach/chamada`)
  - Campo de atletas obrigatório no diário com validação
  - Botões do painel linkados corretamente (Chamada, Metas, Ajustes)
  
- **Módulo de Musculação:**
  - Botões +/- mais visíveis com cores distintas:
    - Roxo para repetições
    - Azul para peso (kg)

- **UI/UX:**
  - Correção de FOUT (Flash of Unstyled Text) no header
  - Header fixo no tema claro
  - Modal de busca mobile com altura completa

### Verificado
- Todos os testes de funcionalidade executados com sucesso
- Walkthrough completo criado com evidências

---

## [0.4.7] - 2025-12-31

### Corrigido
- **Módulo de Treino:**
  - Sessões passadas agora acessíveis em "Meu Programa"
  - Botão "Repetir" para treinos completados
  - Botão "Fazer" para treinos pendentes do passado
  - Badge "Pendente" para sessões não completadas
  - Link "Ver Histórico" adicionado
  - Título "Meu Programa" redimensionado (modo compacto)
  
- **Página de Início de Treino:**
  - Tamanho dos cards de seleção de esporte reduzido
  - Esportes "Corrida" e "Bicicleta" removidos
  - Esportes "Aquecimento" e "Alongamento" adicionados

---

## [0.4.5] - 2025-12-30

### Adicionado
- **Verificação de Treino Curto (<3min):**
  - Modal de confirmação com opções "Armazenar" ou "Descartar"
  - XP reduzido (5 pts) para treinos curtos
  - Função `handleDiscard` para excluir sessões descartadas

- **Página de Alongamento (`/training/stretching`):**
  - 3 níveis: Básico (5min), Moderado (10min), Profundo (15min)
  - 21 exercícios específicos para remadores
  - Timer circular com contagem regressiva
  - Fullscreen toggle e dicas por exercício

- **Módulo Coach Completo:**
  - `/coach/active-workouts` - Monitoramento em tempo real
  - `/coach/pending-reservations` - Aprovar/Rejeitar reservas
  - `/coach/diary` - Diário do treinador
  - `/coach/new-plan` - Criar planos de treino
  - `/coach/calendar` - Calendário com 5 aulas experimentais simuladas

- **Ficha Individual de Sócio (`/diretoria/socios/[id]`):**
  - Dados pessoais, estatísticas de treino
  - Histórico de pagamentos, barcos habilitados
  - Contato de emergência
  - Links clicáveis na lista de sócios

### Corrigido
- Erro de comentário de bloco não fechado em `route.ts`
- Estrutura JSX no painel do coach
- Links do painel do coach para new-plan e diary

---

## [0.5.0] - 2025-12-29 _(Preview - Não Publicada)_

## [0.4.5] - 2025-12-29

### Corrigido
- **Módulo de Voluntariado:**
  - Sincronização total entre Prisma Schema e API Routes.
  - Correção de campos inexistentes (`acceptedAt`, `feedback`, `tasksCompleted`).
  - Padronização de nomes de campos (`category`, `deadline`, `estimatedHours`, `hoursWorked`).
  - Geração automática de `taskNumber` (TSK-XXXXX) na criação de tarefas.
  - Tornou `assignedToId` opcional em `VolunteerTask` para permitir tarefas abertas.
  - Adicionados campos `requiredTalents` e `maxVolunteers` ao modelo de tarefas.
  - Atualização do modelo `VolunteerReputation` com `totalHours` e `reliabilityScore`.

- **GPS Tracking:**
  - Correção de tipo no `GPSPoint` (timestamp de string para number) para compatibilidade com IndexedDB.

---

## [0.4.4] - 2024-12-28

### Adicionado
- **Sistema de Registro de Usuários:**
  - API `/api/auth/register` com validação completa
  - Página `/register` com formulário de cadastro
  - Validação de email duplicado
  - Hash de senha com bcrypt
  - Redirecionamento para login após sucesso

- **Banco de Dados Completo:**
  - Seed com dados de exemplo
  - 3 usuários (admin, coach, membro)
  - Barcos, produtos, badges, notificações
  - Todas as APIs integradas com Prisma

### Corrigido
- Erro de sintaxe em `app/api/tides/upload/route.ts`
- Suspense boundary em 4 páginas com useSearchParams
- ResponsiveContainer do Recharts com minWidth

---

## [0.4.3] - 2024-12-28

### Adicionado
- **Módulo Coach - Sugestão de Planilhas:**
  - API `/api/coach/suggest-plan` com algoritmo inteligente
  - Geração automática de 12 semanas de treino personalizado

- **Sistema de Tarefas:**
  - Kanban board com drag and drop
  - API `/api/tasks` (CRUD completo)

- **Calendário de Voluntariado:**
  - API `/api/volunteer/calendar`
  - Visualização por dia/horário

---

## [0.4.2] - 2024-12-28

### Adicionado
- API `/api/coach/athletes` para listar atletas
- Dashboard do coach funcional

---

## [0.4.1] - 2024-12-27

### Adicionado
- Página de reserva com intervalos de 15 minutos
- Páginas de Pagamentos, Avisos e Configurações
- APIs de perfil completas

### Corrigido
- Sistema de notificações (sininho)

---

## [0.4.0] - 2024-12-27

### Adicionado
- **Logos de Parceiros:**
  - SVGs no header e bottom nav
  - Links para Governo RN, Prefeitura, Potigás, ERK, CBR

- **Sistema de Treino Ativo:**
  - Página `/training/live` com GPS tracking
  - Cronômetro, métricas, controles
  - Página de feedback pós-treino

---

## [0.3.9] - 2024-12-27

### Adicionado
- **Módulo de Garagem Completo:**
  - 10 APIs de recursos e reservas
  - Sistema de check-in/check-out
  - Fila de espera
  - Regras de negócio (5 treinos indoor antes do tanque)

---

## [0.3.8] - 2024-12-27

### Adicionado
- **GPS Tracking:**
  - GPS Tracker com filtro de accuracy
  - Cálculo de distância com Haversine
  - Auto-pause

- **Página de Aquecimento:**
  - 5 exercícios de core
  - Timer por exercício

---

## [0.3.7] - 2024-12-27

### Adicionado
- Dashboard de treinos
- Seletor de tipo de treino
- APIs de treinos (start, complete, templates)

---

## [0.3.6] - 2024-12-27

### Adicionado
- **PWA Offline-First:**
  - Service Worker
  - IndexedDB Manager
  - Manifest PWA

- **Schema Prisma Expandido:**
  - 15+ modelos (Treinos, Garagem, Voluntariado)

---

## [0.3.5] - 2024-12-26

### Adicionado
- Ficha de Anamnese completa (5 etapas)
- Termo de Voluntariado
- Sistema EAD (Escola de Remo)

---

## [0.3.4] - 2024-12-26

### Adicionado
- Sistema de notícias
- Widget de marés e condições

---

## [0.3.3] - 2024-12-25

### Adicionado
- Estrutura base de perfis
- Carteirinha digital com QR Code

---

## [0.3.2] - 2024-12-25

### Adicionado
- Portal do Voluntariado
- Login via dropdown
- Proposta de Sócio

---

## [0.3.1] - 2024-12-24

### Adicionado
- Dashboard do Treinador
- Ficha do Associado
- Sistema de Presença

---

## [0.3.0] - 2024-12-24

### Repaginação
- **Identidade Visual 2.0:**
  - Vermelho, Preto, Ouro
  - Glassmorphism
- **Gamificação:**
  - Níveis e pontos
  - Conquistas

---

## [0.2.14] - 2024-12-23

### Adicionado
- Autenticação NextAuth
- Integração Prisma + SQLite
- Dashboard dinâmico

---

## [0.2.12] - 2024-12-22

### Melhorado
- Performance de carregamento
- Responsividade mobile

---

## [0.2.10] - 2024-12-21

### Adicionado
- Loja oficial (Store)
- Galeria de imagens

---

## [0.2.8] - 2024-12-20

### Adicionado
- Sistema de eventos
- RSVP de participação

---

## [0.2.5] - 2024-12-19

### Adicionado
- Reserva de barcos
- Painel de notícias

---

## [0.2.3] - 2024-12-18

### Adicionado
- Sistema de pagamentos (mock)
- Histórico financeiro

---

## [0.2.0] - 2024-12-17

### Repaginação
- Transição para Next.js 14 App Router
- Arquitetura Mobile-First

---

## [0.1.12] - 2024-12-16

### Adicionado
- Estrutura de permissões
- Componentes UI fundamentais

---

## [0.1.10] - 2024-12-15

### Melhorado
- Sistema de navegação
- Estilização de cards

---

## [0.1.8] - 2024-12-14

### Adicionado
- Header com logo
- Footer responsivo

---

## [0.1.5] - 2024-12-13

### Adicionado
- Protótipo da Landing Page
- Seção de eventos

---

## [0.1.3] - 2024-12-12

### Adicionado
- Configuração Tailwind
- Tema base (cores, fontes)

---

## [0.1.1] - 2024-12-11

### Inicial
- Criação do repositório
- Estrutura base Next.js

---

## [0.0.5] - 2024-12-10

### Setup
- Configuração inicial de dependências
- ESLint e Prettier

---

## [0.0.3] - 2024-12-09

### Setup
- Definição de arquitetura
- Documentação inicial

---

## [0.0.1] - 2024-12-08

### Início
- Criação do projeto
- Estrutura de diretórios
