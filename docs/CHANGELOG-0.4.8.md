# CHANGELOG v0.4.8

**Data:** 2026-01-02
**Versão anterior:** 0.4.7

---

## 🚀 Novas Funcionalidades

### Central de Ajuda (`/ajuda`)
- Nova página completa de documentação com:
  - **FAQ interativo** com categorias (Geral, Treinos, Voluntariado, Técnico)
  - **Mapa do Site** com todas as rotas organizadas por role
  - **Registro de Funcionalidades** com status (completo/parcial/planejado)
  - **Documentação de Arquitetura** para desenvolvedores e IA
  - Busca integrada na documentação

### Sistema de Sincronização de Documentação
- Novo módulo `lib/config/documentation-sync.ts` que:
  - Rastreia versão do app vs versão da documentação
  - Lista funcionalidades implementadas vs documentadas
  - Changelog simplificado para referência rápida
- API endpoint `GET /api/docs/sync` para verificar sincronização

### Módulo de Notícias da Diretoria Melhorado
- Formulário de publicação atualizado com:
  - **Upload de Imagem Manual** via URL com preview
  - **Opção de Geração por IA** (preparado para integração futura)
  - Tabs para alternar entre modos de upload
  - Validação e preview de imagens

---

## 🔧 Correções de UI

### Menu Inferior Mobile
- Corrigido alinhamento dos ícones no bottom-nav
- Alterado de `space-around` para `space-evenly`
- Adicionado `flex: 1` para distribuição igual dos itens

### Busca Mobile
- Corrigido posicionamento do modal de busca
- Painel agora aparece na parte superior visível
- Adicionado suporte a `safe-area-inset`

---

## 📁 Arquivos Modificados

### Novos Arquivos
- `app/ajuda/page.tsx` - Página de ajuda completa
- `lib/config/documentation-sync.ts` - Sistema de sincronização
- `app/api/docs/sync/route.ts` - API de verificação

### Arquivos Atualizados
- `app/globals.css` - CSS do bottom-nav
- `components/search/search-bar.tsx` - Posicionamento do modal
- `app/diretoria/noticias/page.tsx` - Modal de nova notícia
- `package.json` - Versão atualizada

---

## 📌 Notas para Desenvolvedores/IA

> Quando precisar entender a estrutura do projeto, consulte:
> - `/ajuda` - Documentação completa para usuários e desenvolvedores
> - `lib/config/documentation-sync.ts` - Lista de funcionalidades implementadas
> - `/api/docs/sync` - Status atual da sincronização

### Próximas Implementações Sugeridas
- [ ] Integração real de upload de imagens (Cloudinary/S3)
- [ ] Chamada à API Gemini para geração de imagens
- [ ] Sistema de notificações push para novas publicações
- [ ] CRUD de áreas de voluntariado no banco de dados
- [ ] Programas de treino persistidos no banco

---

*Sport Club de Natal - Desde 1915*
