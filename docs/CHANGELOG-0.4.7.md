# Changelog v0.4.7 - Sport Club de Natal

**Data:** 2026-01-01

## 🎯 Novas Funcionalidades

### Sistema de Votações (Antigo Eleições)
- Refatorado de "Eleições" para "Sistema de Votações"
- Modal para criar nova votação funcional
- Suporte a votações Sim/Não/Abstenção e Múltipla Escolha
- Visualização de progresso em tempo real
- Histórico de votações anteriores com resultados

### Gestão de Sócios Avançada
- Painel expandido com 12 métricas:
  - Gênero (Masculino/Feminino)
  - Faixa etária (Jovens/Masters)
  - Voluntários inscritos vs não inscritos
  - Acesso recente vs inativo (30 dias)
  - Anamnese atualizada vs pendente
  - Afastados +40 dias
  - Atletas competidores

### Voluntariado Expandido
- 8 áreas reorganizadas:
  - Mídia e Comunicação
  - Store
  - Manutenção de Barcos
  - Limpeza do Clube
  - Beta Testers do Aplicativo
  - Área Administrativa
  - Auxiliares dos Treinadores
  - Atendimento
- 23 habilidades categorizadas
- Slots de disponibilidade a cada 15 minutos
- Segunda como primeiro dia da semana

### Garagem da Diretoria
- Botão "Nova Manutenção" funcional
- Estado para modal implementado

### Tide Widget
- "Mais Informações" agora abre página separada

---

## 📦 v0.4.6 (Anteriormente não documentada)

### Imagens de Notícias
- Geradas imagens proprietárias para todas as notícias
- Correções de estilo (4 remadores, clima tropical, diversidade)

### Galeria Renovada
- 4 novas imagens proprietárias
- Remoção de item obsoleto ("Troféu Eficiência 1952")

---

## 📁 Arquivos Modificados

- `package.json` - Versão 0.4.7
- `app/about/page.tsx` - Changelog atualizado
- `app/diretoria/eleicoes/page.tsx` - Sistema de Votações
- `app/diretoria/socios/page.tsx` - Estatísticas expandidas
- `app/diretoria/garagem/page.tsx` - Nova Manutenção funcional
- `lib/config/volunteer-areas.ts` - 8 áreas e 23 habilidades
- `components/tide-widget.tsx` - Link para página de detalhes
