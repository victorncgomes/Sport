# CHANGELOG

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.4.3] - 2025-12-27

### Adicionado
- **Store Completa:**
  - 8 APIs da store implementadas
  - CRUD de produtos (ADMIN)
  - Sistema de carrinho
  - Checkout com validação de estoque
  - Listagem de pedidos
  - Gamificação integrada (pontos por compra)

## [0.4.2] - 2025-12-27

### Adicionado
- **Sistema de Notificações:**
  - 3 APIs de notificações
  - Listagem de notificações com filtro
  - Marcar como lida
  - Subscribe para web push (preparado)

## [0.4.1] - 2025-12-27

### Adicionado
- **Gamificação Completa:**
  - 5 APIs de gamificação
  - Sistema de pontos manual (BOARD)
  - Leaderboard com períodos (all-time, monthly, weekly)
  - Sistema de badges
  - Desbloquear badges
  - Estatísticas completas de usuário

## [0.4.0] - 2025-12-27

### Adicionado
- **Voluntariado Expandido:**
  - 8 APIs de voluntariado implementadas
  - Sistema de tarefas completo (criar, aceitar, submeter, revisar)
  - Sistema de disponibilidade semanal
  - Banco de talentos/habilidades
  - Sistema de reputação de voluntários
  - Heatmap de disponibilidade para diretoria
  - Cálculo automático de pontos por tarefa (baseado em prioridade e horas)

## [0.3.9] - 2025-12-27

### Adicionado
- **Módulo de Garagem Completo**
  - Página principal (`/training/garage`) com lista de recursos e filtros
  - Página de minhas reservas (`/training/garage/my-reservations`)
  - Sistema de check-in e check-out
  
- **APIs Backend - Garagem (7 endpoints)**
  - `GET /api/resources` - Listar barcos e tanque
  - `POST /api/resources` - Criar recurso (apenas BOARD)
  - `POST /api/reservations` - Criar reserva com validação de regras
  - `GET /api/reservations` - Listar reservas do usuário
  - `POST /api/reservations/[id]/check-in` - Check-in com validação de horário
  - `POST /api/reservations/[id]/check-out` - Check-out com checklist e gamificação
  - `POST /api/waitlist` - Entrar na fila de espera
  - `GET /api/waitlist` - Ver fila de espera
  - `POST /api/maintenance/tickets` - Criar ticket de manutenção
  - `GET /api/maintenance/tickets` - Listar tickets

- **Regras de Negócio**
  - Regra do tanque: 5 treinos indoor completados antes de reservar
  - Detecção de conflitos de horário
  - Sistema de pontos no check-out (guardou +5, lavou +5, no prazo +3, reportou avaria +3)
  - Penalidades (-5 pontos se não guardou ou lavou)
  - Criação automática de tickets de manutenção ao reportar avarias
  - Bloqueio de recurso se avaria crítica
  - Notificação automática da fila de espera

---

## [0.3.8] - 2025-12-27

### Adicionado
- **GPS Tracking Completo**
  - GPS Tracker (`lib/gps/tracker.ts`) com watchPosition, auto-pause e buffer IndexedDB
  - Filtro de accuracy (> 50m descartado)
  - Detecção automática de pausa (velocidade < 0.5 m/s por 30s)
  - Cálculo de distância com Haversine
  
- **Utilitários de Cálculo**
  - `lib/utils/workout-calculations.ts` com funções para:
    - Cálculo de pace (MM:SS/500m)
    - Splits de 500m
    - Estimativa de calorias (baseado em MET)
    - Estimativa de SPM (Strokes Per Minute)
    - Formatações de tempo e distância

- **Página de Aquecimento**
  - `/training/warmup` com 5 exercícios de core activation
  - Timer por exercício
  - Checklist de conclusão
  - Navegação entre exercícios

- **APIs Backend - GPS e Analytics**
  - `POST /api/workouts/[id]/gps-points` - Salvar pontos GPS em batch
  - `GET /api/workouts/[id]/gps-points` - Obter track GPS completo
  - `GET /api/workouts/history` - Histórico com filtros e paginação
  - `GET /api/workouts/analytics` - Métricas e progressão (volume semanal, pace, etc)

---

## [0.3.7] - 2025-12-27

### Adicionado
- **Módulo de Treinos - Base**
  - Dashboard de treinos em `/training` com treino do dia e últimos treinos
  - Seletor de tipo de treino em `/training/start` (Outdoor, Tanque, Indoor Geral)
  - Bottom Navigation atualizado com ícone de Treinos
  
- **APIs Backend - Treinos**
  - `POST /api/workouts/start` - Iniciar nova sessão de treino
  - `POST /api/workouts/[id]/complete` - Finalizar treino com cálculo de pontos e gamificação
  - `GET /api/workouts/templates` - Listar planilhas de treino aprovadas
  - `POST /api/workouts/templates` - Criar planilha de treino (apenas COACH/BOARD)

### Modificado
- Bottom Navigation: rotas de treinos atualizadas de `/trainings` para `/training`

---

## [0.3.6] - 2025-12-27

### Adicionado
- **PWA Offline-First Completo**
  - Service Worker (`public/sw.js`) com estratégias de cache:
    - Network First para APIs
    - Cache First para assets estáticos
    - Stale-While-Revalidate para dados de maré
  - Manifest PWA (`public/manifest.json`) com ícones e shortcuts
  - IndexedDB Manager (`lib/db/indexed-db.ts`) para armazenamento offline
  - Background Sync preparado para sincronização de dados
  - Página offline (`/offline`) para quando não há conexão
  - PWA Utils (`lib/pwa/install-prompt.ts`) com prompt inteligente de instalação

- **Schema Prisma Expandido (15+ modelos)**
  - **Módulo de Treinos:**
    - `WorkoutTemplate` - Planilhas de treino criadas por COACH
    - `WorkoutStage` - Etapas de um treino
    - `WorkoutSession` - Sessões de treino executadas
    - `GPSTrackPoint` - Pontos GPS coletados durante treino outdoor
  
  - **Módulo de Garagem:**
    - `Resource` - Barcos e tanque
    - `Reservation` - Reservas de recursos
    - `WaitlistEntry` - Fila de espera
    - `MaintenanceTicket` - Tickets de manutenção
  
  - **Módulo de Voluntariado Expandido:**
    - `VolunteerTask` - Tarefas de voluntariado
    - `VolunteerAvailability` - Disponibilidade semanal
    - `VolunteerReputation` - Sistema de reputação
    - `VolunteerTalent` - Banco de talentos

### Modificado
- Modelo `User` expandido com relações para todos os novos módulos

---

## [0.3.5] - 2025-12-27

### Adicionado
- **Ficha de Anamnese Completa**
  - Formulário multi-etapas (5 estágios) em `/profile/anamnese`
  - API de submissão e consulta (`/api/profile/anamnese`)
  - Gamificação: +100 pontos ao completar
  
- **Termo de Voluntariado Redesenhado**
  - Formulário de 5 seções: Áreas, Disponibilidade, LGPD, Normas, Assinatura
  - Implementado em `/volunteer/term`
  - API de submissão (`/api/volunteer/submit-form`)
  - Gamificação: +50 pontos ao aceitar
  
- **Sistema EAD (Escola de Remo)**
  - Página inicial em `/ead` com categorias de vídeos
  - Busca e filtros
  - Sistema de progresso
  - Gamificação: +25 XPs por vídeo assistido

### Modificado
- Calendário de voluntariado na diretoria (`/diretoria/voluntariado`)
- Download direto do Estatuto em `/mural`
- Padding inferior em `/trainings` e `/garage` para evitar sobreposição com Bottom Nav

### Corrigido
- Autenticação atualizada para `auth()` do NextAuth v5
- Schema Prisma: removidas anotações `@db.Text` incompatíveis com SQLite

---

## [0.3.4] - 2025-12-26

### Adicionado
- Sistema de notícias com listagem e detalhes
- Widget de marés e condições de remo
- Estrutura base de perfis (Visitante, Sócio, Coach, Diretoria)

### Modificado
- Melhorias na UI/UX geral
- Otimizações de performance

---

## Versões Anteriores

Versões 0.3.3 e anteriores não documentadas neste changelog.

---

## Roadmap

### v0.3.8 (Próxima)
- Treinos GPS + Indoor
- Aquecimento e alongamento
- 5 APIs adicionais

### v0.3.9
- Módulo Garagem completo
- 9 APIs de recursos e reservas

### v0.4.0
- Voluntariado expandido
- 10 APIs de tarefas e reputação

### v0.4.1
- Gamificação completa
- 5 APIs de pontos e badges

### v0.4.2 (Final)
- Notificações
- Testes completos
- Documentação
