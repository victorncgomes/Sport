# Changelog - Limpeza Vite e Organização

**Data:** 2026-01-01

## Resumo
Removidos arquivos relacionados ao Vite e atualizado o projeto para usar exclusivamente Next.js.

## Arquivos Removidos
- `vite.config.ts` - Configuração do Vite
- `index.html` - Entry point HTML do Vite
- `tsconfig.node.json` - Configuração TypeScript para Vite
- `src/vite-env.d.ts` - Tipos do Vite

## Pastas Removidas
- `src/` - Estrutura de código Vite (componentes, páginas, lib duplicados)
- `server/` - Servidor Express do Vite

## package.json - Alterações

### Scripts Removidos
- `dev:client` - `vite`
- `dev:server` - `tsx watch server/index.ts`
- `preview` - `vite preview`

### Scripts Atualizados
- `dev` - Alterado de `concurrently` para `next dev -p 3001`
- `build` - Alterado de `tsc -b && vite build` para `next build`
- `lint` - Alterado de `eslint .` para `next lint`
- `start` - Adicionado `next start -p 3001`

### Dependências Removidas
- `cors`
- `express`
- `jsonwebtoken`
- `react-router-dom`
- `@types/cors`
- `@types/express`
- `@types/jsonwebtoken`
- `@vitejs/plugin-react`
- `concurrently`
- `vite`

### Dependências Adicionadas
- `next` - ^14.1.0
- `next-auth` - ^5.0.0-beta.4
- `eslint-config-next` - ^14.1.0

## tsconfig.json - Correções
- Alterado `paths["@/*"]` de `["./src/*"]` para `["./*"]`
- Removida referência ao `tsconfig.node.json` 
- Atualizado `include` para Next.js App Router
- Excluída pasta `src` do TypeScript

## Status Final
- ✅ Servidor Next.js rodando na porta 3001
- ✅ Aplicação carregando com sucesso
- ✅ Header, footer e conteúdo principal funcionando
- ✅ Tema escuro com cores vermelho/branco do clube

