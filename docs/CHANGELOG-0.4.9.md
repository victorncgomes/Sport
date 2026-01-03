# CHANGELOG v0.4.9

**Data:** 2026-01-02
**Versão anterior:** 0.4.8

---

## 🚀 Novas APIs e Funcionalidades

### Upload de Imagens (`/api/upload`)
- Validação de URLs de imagem
- Suporte a domínios confiáveis (Unsplash, Pexels, etc.)
- Preparado para integração com Cloudinary/S3
- Aceita tipos: `url` (validação) e `base64` (futuro upload)

### Geração de Imagens com IA (`/api/ai/generate-image`)
- Integração preparada para Gemini Imagen API
- Prompt engineering específico para o clube:
  - Cores: vermelho (#DC2626) e preto
  - Localização: Natal-RN, Rio Potengi
  - Estilo: esportivo brasileiro
- Estilos suportados: photo, illustration, artistic
- Contextos: news, gallery, event
- Fallback para placeholder quando API não configurada

### Programas de Treinamento (Database)
**Modelos Prisma:**
- `TrainingProgram` - Programas completos
- `ProgramSession` - Sessões individuais
- `AthleteProgram` - Vínculo atleta-programa

**APIs:**
- `GET /api/coach/programs` - Listar programas
- `POST /api/coach/programs` - Criar programa
- `GET /api/coach/programs/[id]` - Buscar um
- `PUT /api/coach/programs/[id]` - Atualizar
- `DELETE /api/coach/programs/[id]` - Excluir

### Áreas de Voluntariado Dinâmicas (Database)
**Modelo Prisma:** `VolunteerArea`
- Nome, descrição, ícone, cor
- Guia/manual em markdown
- Coordenador e mínimo de voluntários
- Soft delete (isActive)

**APIs:**
- `GET /api/volunteer/areas` - Listar áreas
- `POST /api/volunteer/areas` - Criar área
- `GET /api/volunteer/areas/[id]` - Buscar uma
- `PUT /api/volunteer/areas/[id]` - Atualizar
- `DELETE /api/volunteer/areas/[id]` - Desativar/Excluir

### Galeria com Persistência (Database)
**Modelos Prisma:**
- `GalleryPost` - Posts da galeria
- `GalleryComment` - Comentários

**APIs:**
- `GET /api/gallery` - Listar posts
- `POST /api/gallery` - Criar post
- `GET /api/gallery/[id]` - Buscar post
- `PUT /api/gallery/[id]` - Atualizar/Like
- `DELETE /api/gallery/[id]` - Excluir (diretoria)
- `POST /api/gallery/[id]/comments` - Adicionar comentário
- `DELETE /api/gallery/[id]/comments` - Excluir comentário

---

## 📁 Arquivos Criados

### APIs
| Arquivo | Descrição |
|---------|-----------|
| `app/api/upload/route.ts` | Upload de imagens |
| `app/api/ai/generate-image/route.ts` | Geração de imagens com IA |
| `app/api/coach/programs/route.ts` | CRUD programas |
| `app/api/coach/programs/[id]/route.ts` | Programa individual |
| `app/api/volunteer/areas/route.ts` | CRUD áreas voluntariado |
| `app/api/volunteer/areas/[id]/route.ts` | Área individual |
| `app/api/gallery/route.ts` | CRUD galeria |
| `app/api/gallery/[id]/route.ts` | Post individual |
| `app/api/gallery/[id]/comments/route.ts` | Comentários |

### Schema
| Modificação | Descrição |
|-------------|-----------|
| `prisma/schema.prisma` | +6 novos modelos (120 linhas) |

---

## ⚙️ Configuração Necessária

### Para ativar Upload Cloudinary:
```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_secret
```

### Para ativar Geração de Imagens IA:
```env
GEMINI_API_KEY=sua_chave_gemini
```

---

## 🔄 Migração de Dados

Após atualizar, execute:
```bash
npx prisma db push
```

Para popular áreas de voluntariado existentes:
```bash
npx prisma db seed
```

---

## 🎨 Correções de UI e UX (Janeiro 2026)

### Musculação - Botões +/- Visíveis
- **Problema**: Botões `bg-white/10` eram invisíveis
- **Solução**: Cores roxas (reps) e azuis (kg) com bordas
- **Arquivo**: `app/training/live/gym/page.tsx`

### Outras Atividades - Roteamento Corrigido
- **Problema**: Surfe, futebol, etc. geravam 404
- **Solução**: Rota `sport=OTHER&activity=SURF`
- **Arquivo**: `app/training/other-activities/page.tsx`

### Meu Programa - Navegação de Semanas
- **Problema**: Só mostrava semana atual
- **Solução**: Botões ◀ ▶ para ver histórico e futuro
- **Arquivo**: `app/training/my-program/page.tsx`

### Coach Chamada - Página Criada
- **Nova página**: `/coach/chamada`
- **Funcionalidades**: Lista de atletas, botões presente/atrasado/ausente, salvar
- **Arquivo**: `app/coach/chamada/page.tsx`

### Coach Diário - Atletas Obrigatórios
- **Problema**: Anotações sem vínculo a atletas
- **Solução**: Campo obrigatório com label e validação
- **Arquivo**: `app/coach/diary/page.tsx`

### Coach Painel - Botões Linkados
- Chamada → `/coach/chamada`
- Metas → `/coach/metas`
- Ajustes → `/coach/ajustes`
- Botão "→" renomeado para "Detalhes →"

### Font Flash (FOUT) Corrigido
- **Problema**: Texto "Sport Club de Natal" piscava
- **Solução**: `display: 'block'` + `preload: true`
- **Arquivo**: `app/layout.tsx`

### Tema Claro - Header Fixo
- **Problema**: Header ficava ilegível no tema claro
- **Solução**: Removidas regras CSS que alteravam cores
- **Arquivo**: `app/globals.css`

### Busca Mobile - Altura Completa
- **Problema**: Modal cortado em smartphones
- **Solução**: `max-h-[calc(100vh-120px)]` + scroll interno
- **Arquivo**: `components/search/search-bar.tsx`

---

## 📌 Notas Importantes

1. **Upload funciona com URLs** por padrão. Configure Cloudinary para upload direto.
2. **Geração de imagens** usa placeholder se GEMINI_API_KEY não estiver configurada.
3. **Áreas de voluntariado** do arquivo de config continuam funcionando. DB é adicional.
4. **Galeria** agora persiste no banco. Migrar imagens existentes se necessário.

---

*Sport Club de Natal - Desde 1915*

