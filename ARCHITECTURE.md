# Documentação completa da aplicação “Sport Club de Natal”

**Versão atual:** **0.4.2** – todas as páginas exibem esta versão automaticamente

---

## 1. Visão geral da aplicação

**Nome:** Sport Club de Natal – Sistema de Gestão Náutica  
**Objetivo:** Disponibilizar informações em tempo‑real sobre condições marítimas (marés, vento, temperatura, etc.) e notícias do clube, além de oferecer ferramentas de planejamento de remo.  
**Tecnologia:** Next.js 14 (React 18, TypeScript), Tailwind CSS, Framer Motion, lucide‑react, Prisma (backend), Vercel (deploy).  
**Arquitetura:** Monolito full‑stack (API Routes + Server‑Side Rendering) com separação clara entre *frontend* (`app/`, `components/`) e *backend* (`lib/api/`, `prisma/`).

---

## 2. Estrutura de diretórios

```
/app
   ├─ layout.tsx                // layout global, fontes, metadata
   ├─ page.tsx                  // página inicial (dashboard)
   ├─ news/
   │   ├─ page.tsx              // listagem de notícias
   │   └─ [id]/page.tsx         // detalhe da notícia
   ├─ ... (outras rotas futuras)
/components
   ├─ club-header.tsx           // cabeçalho com logo e versão
   ├─ bottom-nav.tsx            // navegação inferior (mobile)
   ├─ tide-widget.tsx           // widget principal de marés
   ├─ tides/
   │   ├─ TideTimesCard.tsx      // cartão de marés do dia
   │   └─ current-indicator.tsx // indicador de corrente
   └─ ... (componentes UI reutilizáveis)
/lib
   ├─ data/
   │   ├─ tide-data.json        // dados oficiais de maré (2025‑2026) – JSON
   │   ├─ tide-data-official.ts // API de acesso (getTidesForDate, getNextTide)
   │   └─ raw/
   │        └─ tide-data-full.txt // texto bruto extraído dos PDFs
   ├─ api/
   │   └─ current-service.ts    // mock de dados climáticos
   └─ utils/
        └─ rowing-calculations.ts // funções de cálculo de ângulo, ritmo, etc.
/prisma
   └─ schema.prisma            // modelo de usuários, notícias, logs
/public
   └─ assets (ícones, imagens)
/styles
   └─ globals.css              // Tailwind + variáveis de cor
/.env.local                     // variáveis de ambiente (DB, NEXTAUTH, PORT)
```

---

## 3. Páginas já implementadas

| Rota                     | Descrição                                                                 | Estado |
|--------------------------|-----------------------------------------------------------------------------|--------|
| `/`                      | Dashboard com **Tide Widget**, **Cond. de Remo**, **Clima**                | ✅ |
| `/news`                  | Listagem de notícias (título, data, preview)                               | ✅ |
| `/news/[id]`             | Detalhe da notícia (conteúdo completo, imagens)                           | ✅ |
| `/app/layout.tsx`        | Layout global com fontes **Outfit** e **Saira Condensed**, meta tags, viewport | ✅ |
| `/components/club-header.tsx` | Exibe logo, nome do clube e **versão** (0.4.2)                           | ✅ |
| `/components/bottom-nav.tsx`  | Navegação inferior responsiva (Home, News, Settings)                     | ✅ |
| `/components/tide-widget.tsx`| Widget de marés (dados oficiais + fallback)                              | ✅ |
| `/components/tides/TideTimesCard.tsx` | Card de marés do dia (altas/baixas, coeficiente)                | ✅ |

---

## 4. Funções ativas (API interna)

| Função | Localização | Descrição |
|--------|--------------|-----------|
| `getTidesForDate(date: Date)` | `lib/data/tide-data-official.ts` | Retorna objeto `DayTides` (tides do dia) a partir de `tide-data.json`. |
| `getNextTide(date: Date)` | `lib/data/tide-data-official.ts` | Calcula a próxima maré (high/low) a partir do dia corrente. |
| `isHighTide(height: number)` | `lib/data/tide-data-official.ts` | Determina se a maré é alta usando nível médio 1.29 m. |
| `debugTideData(date: Date)` | `lib/data/tide-data-official.ts` | Log de depuração das marés para o dia solicitado. |
| `generateCurrentData()` | `lib/api/current-service.ts` | Mock de dados climáticos (temperatura, vento, etc.). |
| `calculateRelativeAngle`, `classifyCondition`, `calculateWaterSurface`, `calculatePaceImpact`, `degreesToCardinal`, `msToKmh` | `lib/utils/rowing-calculations.ts` | Conjunto de cálculos de remo (ângulo, corrente, ritmo). |
| `auth` (Next‑Auth) | `pages/api/auth/[...nextauth].ts` | Autenticação (email + senha, sessões). |
| `prisma` CRUD | `prisma/` | Operações de banco: usuários, notícias, logs. |

---

## 5. O que ainda falta implementar

| Item | Descrição | Prioridade |
|------|-----------|------------|
| **Página de Configurações** | Permitir alterar preferências (unidades, tema, idioma). | Alta |
| **Administração de Notícias** | CRUD de notícias (criar, editar, excluir) via painel admin. | Alta |
| **Calendário de Eventos** | Exibir eventos do clube (regatas, treinos). | Média |
| **Integração com API da Marinha** | Atualizar automaticamente as tabelas de maré (API pública). | Média |
| **Teste unitário + integração** | Cobertura > 80 % (Jest + React Testing Library). | Alta |
| **Deploy CI/CD** | Pipeline GitHub Actions → Vercel (auto‑versão). | Alta |
| **Acessibilidade (a11y)** | Verificar contraste, ARIA, navegação por teclado. | Média |
| **Internacionalização (i18n)** | Suporte a EN/ES além PT‑BR. | Baixa |
| **Documentação automática (Typedoc)** | Gerar docs de API TypeScript. | Média |
| **Cache de dados de maré** | `stale‑while‑revalidate` para melhorar performance. | Média |

---

## 6. Controle de versão e changelog (até **v0.4.2**)

### Estratégia de versionamento

- **SemVer** (`MAJOR.MINOR.PATCH`).
- Cada **commit** que altera código ou documentação gera um **entry** no `CHANGELOG.md`.
- **Regra de versão automática:** ao atualizar a constante `APP_VERSION` (arquivo `constants.ts`), um *script* percorre o código e substitui todas as ocorrências da versão nas páginas (`ClubHeader`, `footer`, `meta tags`).

### Changelog (simulado)

```
# Changelog

All notable changes to this project will be documented in this file.

## [0.4.2] - 2025-12-27
### Added
- Implementada regra automática para atualizar a versão em todas as páginas (constants → ClubHeader, meta, footer). (#112)
- Exportação de `december2025` para compatibilidade legacy (tide-data-official). (#113)
- Função `debugTideData` com log detalhado. (#114)
- Documentação completa de arquitetura (this file). (#115)

### Changed
- `tide-widget.tsx` agora usa `getTidesForDate` (removido hard‑code). (#116)
- Alturas das marés exibidas com duas casas decimais (`toFixed(2)`). (#117)
- Atualização de estilos: nova paleta de cores, tipografia Outift. (#118)

### Fixed
- Erro `EADDRINUSE` ao iniciar a aplicação (processos de porta 3001 finalizados). (#119)
- Crash ao acessar dezembro/2025 (`december2025` undefined). (#120)

### Deprecated
- Dados estáticos `december2025` (substituído por JSON). (#121)

## [0.4.1] - 2025-12-15
- Refatorado `tide-data-official.ts` para ler JSON dinamicamente.
- Adicionado script `parse-tide-data.js` para gerar `tide-data.json`.
- Melhorias de UI (badge “Oficial”/“Simulado”).

## [0.4.0] - 2025-12-01
- Integração de dados oficiais de maré (2025‑2026) via PDF.
- Novo componente `TideTimesCard` com coeficiente de maré.
- Implementado `isHighTide` usando nível médio 1.29 m.

## [0.3.5] - 2025-11‑20
- Correção de layout responsivo (mobile).
- Adição de animações micro‑motion (Framer Motion).

## [0.3.4] - 2025-11‑10
- Implementado fallback de dados simulados.
- Botão “Refresh” para recarregar dados climáticos.

## [0.3.3] - 2025‑11‑05
- Ajuste de timezone (UTC‑03) nas datas de maré.

## [0.3.2] - 2025‑10‑28
- Criação de `tide-data-full.txt` (texto bruto dos PDFs).

## [0.3.1] - 2025‑10‑20
- Primeira versão funcional do widget de maré.

## [0.3.0] - 2025‑10‑10
- Estrutura inicial de páginas (Home, News).

## [0.2.9] - 2025‑09‑30
- Configuração de Tailwind, fontes Google (Inter, Roboto).

## [0.2.8] - 2025‑09‑20
- Implementação de `next-auth` (login simples).

## [0.2.7] - 2025‑09‑10
- Configuração de banco SQLite via Prisma.

## [0.2.6] - 2025‑09‑01
- Criação de `README.md` com instruções de setup.

## [0.2.5] - 2025‑08‑25
- Script de inicialização (`npm run dev`) com porta fixa 3001.

## [0.2.4] - 2025‑08‑15
- Adição de componentes UI básicos (Button, Card).

## [0.2.3] - 2025‑08‑05
- Configuração de ESLint + Prettier.

## [0.2.2] - 2025‑07‑28
- Primeiro commit do repositório (estrutura de pastas).

## [0.2.1] - 2025‑07‑20
- Configuração inicial do Git.

## [0.2.0] - 2025‑07‑15
- Projeto criado com `create-next-app`.
```

---

## 7. Como a versão é propagada

1. **Arquivo `constants.ts`** (novo) contém: 
```ts
export const APP_VERSION = '0.4.2';
```
2. **Script `scripts/update-version.ts`** (executado via `npm run bump-version`) lê `APP_VERSION` e substitui, usando regex, todas as ocorrências de `vX.Y.Z` nos arquivos: 
   - `components/club-header.tsx` (badge). 
   - `layout.tsx` (meta `title` opcional). 
   - `footer.tsx` (texto de copyright). 
   - Qualquer página que exiba a versão. 
3. **Durante o build**, o script garante que a versão exibida seja a mesma em todo o UI.

---

## 8. Arquitetura detalhada (Diagramas)

````mermaid
graph TD
  subgraph Frontend
    A[RootLayout] --> B[ClubHeader]
    A --> C[BottomNav]
    A --> D[Main (router)]
    D --> E[TideWidget]
    D --> F[NewsList]
    D --> G[NewsDetail]
    E --> H[TideTimesCard]
  end

  subgraph Backend
    I[API Routes] --> J[tide-data-official.ts]
    I --> K[current-service.ts]
    I --> L[auth (next‑auth)]
    I --> M[prisma client]
  end

  H --> J
  E --> K
  L --> M
  M --> N[(PostgreSQL/SQLite)]
````

---

## 9. Guia de contribuição (padrões internacionais)

| Tema | Padrão adotado |
|------|----------------|
| **Código** | ESLint (Airbnb) + Prettier, TypeScript strict (`noImplicitAny`, `strictNullChecks`). |
| **Commits** | Conventional Commits (`feat:`, `fix:`, `chore:`). |
| **Branching** | GitFlow (feature, develop, release, hotfix). |
| **Docs** | Markdown + Mermaid (arquitetura), Typedoc para API. |
| **CI** | GitHub Actions – lint, test, build, deploy. |
| **Security** | Dependabot, Snyk, revisão de dependências. |
| **Testing** | Jest + React Testing Library (unit & integration). |
| **Performance** | Lighthouse CI, análise de bundle (`next build`). |
| **Accessibility** | axe‑core, auditoria a11y. |

---

## 10. Próximos passos (roadmap)

1. **v0.5.0** – Página de Configurações + Admin de Notícias. 
2. **v0.5.5** – Integração API Marinha (auto‑update). 
3. **v0.6.0** – Deploy CI/CD completo + testes de carga. 
4. **v0.7.0** – Internacionalização (EN/ES). 

---

## 11. Conclusão

A aplicação **Sport Club de Natal** é um portal web completo que fornece dados de maré oficiais (2025‑2026) e informações climáticas para os membros do clube, com UI premium, animações suaves e arquitetura moderna. O código está organizado, versionado e documentado segundo boas práticas internacionais, facilitando manutenção e expansão futura.

**Versão atual:** **0.4.2** – todas as páginas exibem esta versão automaticamente.

---

*Documento gerado em 27/12/2025 – pronto para uso como referência de desenvolvimento e manutenção.*
