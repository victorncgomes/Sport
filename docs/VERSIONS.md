# Histórico de Versões - Sport Club de Natal

Este documento registra a evolução do sistema de gestão e portal do sócio.

Padrão SemVer:
- **0.0.x**: Correções e ajustes finos
- **0.x.0**: Novas funcionalidades principais
- **x.0.0**: Mudança na arquitetura

---

## [0.5.0] - 2024-12-25
### Adicionado
- **Loja:** Modal de detalhes do produto com descrição expandida, tamanhos, especificações e parcelamento
- **Galeria:** Sistema social completo com curtidas e comentários
- **Galeria:** Simulação de interações de usuários (10 usuários, comentários e likes)
- **Galeria:** Modal de visualização com seção de comentários e navegação entre imagens

### Melhorado
- **Painel Diretoria:** Containers com fundo sólido, bordas coloridas e efeitos de glow para melhor visibilidade
- **Painel Diretoria:** Layout de cards reformulado com gradientes e efeitos visuais
- **Experiência Mobile:** Ajustes de responsividade nos modais e grids

### Estrutura de Dados
- `gallery-images.ts`: Novo modelo com likes, likedBy e comments para suporte social

---

## [0.4.0] - 2024-12-23
### Adicionado
- Fallback de dados mockados para perfil em produção (João Silva demo)

### Corrigido
- Menu do rodapé mobile: z-index aumentado, estilos consolidados
- Redirecionamento automático `/login` → `/dashboard` removido
- Tamanhos de ícones inconsistentes no bottom-nav

### Removido (Refatoração)
- `components/main-nav.tsx` (428 linhas) - código morto
- `components/site-header.tsx` (323 linhas) - código morto
- `components/GamingNavigation.tsx` (338 linhas) - código morto

---

## [0.3.6] - 2024-12-20
### Adicionado
- Seção de Informações Financeiras no Painel do Usuário
- Dashboard do Treinador com Agendamentos de Barcos
- Tema Dark Premium na página de Aula Experimental
- Imagens reais na Store via Unsplash

### Corrigido
- Estrutura de Menus Rígida por cargo
- Inconsistência na simulação de acessos no dropdown

---

## [0.3.5] - 2024-12-20
### Corrigido
- Crash crítico na página de ranking (Hall da Fama)
- Padronização dos links no menu global

### Adicionado
- Ranking Dinâmico com agregação de dados de performance
- Assets reais (Barco Oito Com)

---

## [0.3.2] - 2024-05-20
### Adicionado
- Portal do Voluntariado
- Login Integrado via dropdown
- Proposta de Sócio (pré-cadastro)
- Gestão de Tarefas (ex-Kanban)

---

## [0.3.1] - 2024-05-18
### Adicionado
- Dashboard do Treinador revitalizado
- Ficha do Associado
- Sistema de Presença via Server Actions

---

## [0.3.0] - 2024-05-15
### Repaginação
- Identidade Visual 2.0 (Vermelho, Preto, Ouro, Glassmorphism)
- Módulo de Gamificação (níveis, pontos, conquistas)
- Carteirinha Digital com QR Code

---

## [0.2.14] - 2024-05-10
- Autenticação básica via NextAuth
- Integração inicial com Prisma + SQLite
- Dashboard dinâmico para Sócios

---

## [0.2.10] - 2024-05-02
- Loja oficial do clube (Store)
- Galeria de imagens

---

## [0.2.5] - 2024-04-25
- Reserva de Barcos com verificação de disponibilidade
- Painel de Notícias

---

## [0.2.0] - 2024-04-15
### Repaginação
- Transição para Next.js 14 App Router
- Arquitetura Mobile-First

---

## [0.1.12] - 2024-04-05
- Estrutura base de permissões
- Componentes UI fundamentais

---

## [0.1.5] - 2024-03-25
- Protótipo inicial da Landing Page

---

## [0.1.1] - 2024-03-10
### Inicial
- Criação do repositório e estrutura base
