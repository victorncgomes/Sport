# Correção do Menu do Rodapé - Mobile
Data: 2024-12-23

## Problema Reportado
- Ícones com tamanhos diferentes no botão "Início" em modo smartphone
- Menu desaparecendo completamente ao clicar no botão "Perfil"
- Funcionamento normal no modo desktop

## Causa Raiz Identificada
1. **Estilos CSS duplicados** em `globals.css` - classes `.bottom-nav-item` e `.bottom-nav-inner` definidas duas vezes com valores conflitantes
2. **Z-index insuficiente** (z-50) causando conflito com elementos de overlay/loading
3. **Estilos inline conflitantes** no componente `bottom-nav.tsx` sobrepondo as classes CSS

## Correções Aplicadas

### 1. `app/globals.css`
- Consolidados estilos duplicados do `.bottom-nav`, `.bottom-nav-inner` e `.bottom-nav-item`
- Aumentado z-index de 50 para 9999
- Adicionado `display: block !important` e `visibility: visible !important` para garantir exibição
- Padronizado tamanho dos ícones com regra específica: `width: 20px !important; height: 20px !important`

### 2. `components/bottom-nav.tsx`
- Removidos estilos inline conflitantes (`style={{ paddingBottom: '10px' }}`)
- Simplificadas as classes do componente para usar apenas as definições CSS
- Adicionada classe `lg:hidden` para ocultar em desktop (onde não é necessário)
- Removido efeito glow que causava instabilidade visual
- Padronizado `strokeWidth={2}` em todos os ícones

## Arquivos Modificados
- `app/globals.css` - Estilos consolidados
- `components/bottom-nav.tsx` - Componente simplificado
- `middleware.ts` - Removido redirecionamento automático de `/login` para `/dashboard`

---

## Correção Adicional: Redirecionamento do Login (Vercel)

### Problema
A página `/login` estava redirecionando automaticamente para `/dashboard` na Vercel, impedindo o acesso à tela de login.

### Causa
O middleware (`middleware.ts`) tinha uma regra nas linhas 54-57 que redirecionava usuários "logados" (com sessão JWT ativa) para `/dashboard`.

### Correção
Removido o redirecionamento automático, permitindo que a página de login seja acessada independentemente do estado de autenticação (necessário para troca de perfil e demonstração).

### Verificação
Subagente confirmou que a página de login está agora acessível com todos os elementos:
- Logo, campos de email/senha, botão Entrar
- Login social (Google, Apple)
- Botões de demonstração (Sócio, Treinador, Diretoria)
