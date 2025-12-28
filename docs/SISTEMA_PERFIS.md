# Sistema de Perfis do Sport Club de Natal

Data: 23/12/2025

## Resumo

Sistema de menus dinâmicos baseado em perfil implementado.

## Perfis

### 1. Visitante
- INÍCIO, NOTÍCIAS, STORE, GALERIA, CONTATO

### 2. Sócio / Atleta
- Anterior + TREINOS (inclui **Garagem Náutica** como aba para agendamento de barcos)
- Acesso à voluntariado

### 3. Treinador
- Anterior + PAINEL TREINADOR
- Gestão de atletas, análise de performance, treinos

### 4. Diretoria
- Anterior + PAINEL DIRETORIA
- **Garagem** (controle de manutenção, estatísticas, agendamentos)
- **Tarefas** (antes "Kanban")
- Financeiro, Reuniões, Eleições, Sócios, Documentos

## Estrutura da Garagem

| Perfil | Acesso | Funcionalidade |
|--------|--------|----------------|
| Sócio | /trainings → aba Garagem | Reserva de barcos |
| Diretoria | /diretoria/garagem | Manutenção, estatísticas, agendamentos |

## Como Acessar

1. Acesse `/login`
2. Clique em: Diretoria, Treinador ou Sócio
