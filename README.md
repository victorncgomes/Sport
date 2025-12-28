# Sport Club de Natal - Sistema de Gestão

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-5.9-green.svg)

Sistema completo de gestão para o Sport Club de Natal, clube de remo fundado em 1915.

## 🎯 Sobre o Projeto

> [!IMPORTANT]
> **CONFIGURAÇÃO DE PORTA CRÍTICA**
> Esta aplicação **DEVE** rodar estritamente na porta **3001** para evitar conflitos com outros serviços do ecossistema.
> Não altere a porta padrão nos scripts de desenvolvimento ou produção.
>
> **Porta Obrigatória:** `3001`

Aplicação web mobile-first, PWA instalável, com autenticação completa, sistema de permissões (RBAC), gestão de barcos, treinos, pagamentos, competições e muito mais.

### ⚡ Features Principais

**Para Visitantes:**
- ✅ História do clube e linha do tempo
- ✅ Notícias públicas
- ✅ Guia completo do remo olímpico
- ✅ Agenda de competições
- ✅ Agendamento de aula experimental

**Para Sócios:**
- ✅ Dashboard personalizado
- ✅ Reserva de barcos com check-in/check-out fotográfico
- ✅ Gestão de treinos e planilhas
- ✅ Inscrições em competições
- ✅ Carteirinha digital com QR Code
- ✅ Pagamentos via PIX
- ✅ Mural interno

**Para Treinadores:**
- ✅ Gestão de treinos
- ✅ Acompanhamento de evolução
- ✅ Aprovação de aulas experimentais

**Para Administração:**
- ✅ Gestão completa de usuários
- ✅ Dashboard financeiro
- ✅ Controle de barcos e manutenções
- ✅ Sistema de eleições online
- ✅ Gerenciamento de conteúdo

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **PWA:** next-pwa + Workbox

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Next.js API Routes
- **Auth:** NextAuth.js v5

### Database
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Migrations:** Prisma Migrate

### DevOps
- **Container:** Docker + Docker Compose
- **Testing:** Vitest + Playwright

## 📋 Pré-requisitos

- Node.js 20+ e npm/yarn/pnpm
- Docker e Docker Compose
- Git

## 🚀 Instalação e Setup

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/seu-usuario/sport-club-natal.git
cd sport-club-natal
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

### 3. Configure as variáveis de ambiente

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edite o arquivo \`.env.local\` com suas configurações:

\`\`\`env
DATABASE_URL="postgresql://scnatal:scnatal_password@localhost:5432/scnatal_db?schema=public"
NEXTAUTH_SECRET="gere-um-secret-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

**Para gerar um NEXTAUTH_SECRET:**
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 4. Suba os containers (PostgreSQL, MinIO, Redis)

\`\`\`bash
docker-compose up -d
\`\`\`

Verifique se os serviços estão rodando:
\`\`\`bash
docker-compose ps
\`\`\`

### 5. Execute as migrations do banco de dados

\`\`\`bash
npx prisma migrate dev
\`\`\`

### 6. Popule o banco com dados de teste

\`\`\`bash
npm run db:seed
\`\`\`

### 7. Inicie o servidor de desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

A aplicação estará disponível em: **http://localhost:3000**

## 🔑 Credenciais de Teste

Após executar o seed, você terá as seguintes credenciais:

### 👤 Admin
- **Email:** admin@scnatal.com.br
- **Senha:** admin123
- **Acesso:** Total (todas as funcionalidades)

### 🎓 Treinador
- **Email:** treinador@scnatal.com.br
- **Senha:** coach123
- **Acesso:** Gestão de treinos e atletas

### ⛵ Sócio
- **Email:** socio1@email.com
- **Senha:** member123
- **Acesso:** Reservas, treinos, pagamentos

## 📁 Estrutura do Projeto

\`\`\`
sport-club-natal/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rotas de autenticação
│   │   └── login/
│   ├── (public)/            # Rotas públicas
│   │   ├── about/
│   │   ├── news/
│   │   └── trial-booking/
│   ├── (dashboard)/         # Rotas protegidas (sócios)
│   │   ├── dashboard/
│   │   ├── boats/
│   │   ├── trainings/
│   │   └── profile/
│   ├── (coach)/             # Rotas de treinadores
│   ├── (admin)/             # Rotas de administração
│   └── api/                 # API Routes
├── components/              # Componentes React
│   ├── ui/                  # Componentes shadcn/ui
│   ├── layout/              # Layouts e navegação
│   ├── features/            # Componentes de features
│   └── shared/              # Componentes compartilhados
├── lib/                     # Utilitários e configurações
│   ├── db.ts                # Prisma Client
│   ├── auth.ts              # NextAuth config
│   ├── permissions.ts       # Sistema RBAC
│   └── validations/         # Schemas Zod
├── prisma/                  # Database schema e migrations
│   ├── schema.prisma
│   └── seed.ts
└── public/                  # Arquivos estáticos
\`\`\`

## 🧪 Testes

### Testes unitários
\`\`\`bash
npm test
\`\`\`

### Testes E2E
\`\`\`bash
npm run test:e2e
\`\`\`

### Coverage
\`\`\`bash
npm run test:coverage
\`\`\`

## 🗄️ Gerenciamento do Banco de Dados

### Prisma Studio (Interface visual)
\`\`\`bash
npm run db:studio
\`\`\`

### Criar uma nova migration
\`\`\`bash
npx prisma migrate dev --name descricao_da_mudanca
\`\`\`

### Resetar o banco (CUIDADO - apaga todos os dados)
\`\`\`bash
npx prisma migrate reset
\`\`\`

## 📱 PWA - Progressive Web App

A aplicação é instalável como PWA em dispositivos móveis e desktop.

### Para instalar no celular:
1. Acesse o site pelo navegador
2. Clique em "Adicionar à tela inicial"
3. O ícone do app aparecerá na tela inicial

### Para instalar no desktop (Chrome):
1. Clique no ícone de instalação na barra de endereço
2. Siga as instruções

## 🔒 Segurança & LGPD

- ✅ Senhas criptografadas com bcrypt
- ✅ Autenticação via JWT (NextAuth)
- ✅ RBAC (Role-Based Access Control)
- ✅ Rate limiting em APIs sensíveis
- ✅ Sanitização de inputs
- ✅ Exportação de dados do usuário (LGPD)
- ✅ Exclusão de conta com confirmação
- ✅ Audit logs de ações críticas

## 🎨 Design System

### Cores do Clube
- **Vermelho Principal:** #dc2626
- **Preto Dominante:** #0a0a0a
- **Cinzas:** Escala de neutral (50-950)

### Breakpoints
- **sm:** 640px (smartphone landscape)
- **md:** 768px (tablet)
- **lg:** 1024px (desktop)
- **xl:** 1280px (widescreen)

## 🚢 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Docker Production
\`\`\`bash
docker build -t sport-club-natal .
docker run -p 3000:3000 sport-club-natal
\`\`\`

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| \`npm run dev\` | Inicia servidor de desenvolvimento |
| \`npm run build\` | Gera build de produção |
| \`npm start\` | Inicia servidor de produção |
| \`npm test\` | Executa testes unitários |
| \`npm run test:e2e\` | Executa testes E2E |
| \`npm run lint\` | Verifica erros de linting |
| \`npm run db:generate\` | Gera Prisma Client |
| \`npm run db:push\` | Push schema para o banco (dev) |
| \`npm run db:migrate\` | Cria e aplica migrations |
| \`npm run db:seed\` | Popula banco com dados |
| \`npm run db:studio\` | Abre Prisma Studio |

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Sport Club de Natal
- **Site:** https://scnatal.com.br
- **Email:** contato@scnatal.com.br
- **Telefone:** (84) 99999-9999
- **Endereço:** Rio Potengi, Natal/RN

---

**Desenvolvido com ❤️ e ⛵ para o Sport Club de Natal**

*Fundado em 7 de abril de 1915 • 110 anos de tradição náutica*
