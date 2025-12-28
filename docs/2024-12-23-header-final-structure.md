# Header Sport Club de Natal - Estrutura Final
**Data:** 23 de dezembro de 2024

## ✅ ESTRUTURA APROVADA E FIXADA

Esta é a estrutura **definitiva** do header após refinamentos com o cliente.

### Dimensões Finais

#### Barra Superior (Preta)
- **Altura**: 80px
- **Cor**: `#000000` (preto absoluto)
- **Conteúdo**:
  - Logo/Escudo: 140px x 140px, atravessando as barras
  - Texto "SPORT CLUB": 65px, branco, fonte Saira Condensed
  - Texto "DE NATAL": 65px, preto, fonte Saira Condensed
  - Blocos funcionais à direita (altura 28px):
    - Azul `#0066FF`: Redes Sociais
    - Rosa `#FF00CC`: Parceiros
    - Verde `#00CC00`: Sistema/Usuário

#### Barra Inferior (Vermelha)
- **Altura**: 45px
- **Cor**: `#DC2626` (vermelho institucional)
- **Conteúdo**:
  - Menu centralizado em caixa alta (texto preto)
  - Recorte decorativo diagonal à direita

### Posicionamento Exato dos Elementos

```
┌─────────────────────────────────────────────────────────────┐
│ [BARRA PRETA - 80px altura]                                 │
│                                                              │
│  [Escudo]  SPORT CLUB         [Azul][Rosa][Verde]          │
│  140x140      ↓                                             │
│     ↓      DE NATAL                                         │
│     ↓                                                        │
├─────┴────────────────────────────────────────────────────────┤
│ [BARRA VERMELHA - 45px altura]                     [///]    │
│    INÍCIO  NOTÍCIAS  STORE  GALERIA  CONTATO                │
└─────────────────────────────────────────────────────────────┘
```

#### Escudo
- **Tamanho**: 140px x 140px
- **Posição**: `left-5`, `-bottom-[80px]`
- **Z-index**: 50 (sobrepõe as barras)
- **Efeito**: `drop-shadow-2xl`

#### Texto "SPORT CLUB"
- **Tamanho fonte**: 65px
- **Cor**: Branco (`text-white`)
- **Posição**: `left-[155px]`, `top-[4px]`
- **Fonte**: Saira Condensed Bold
- **Tracking**: `tracking-tight`

#### Texto "DE NATAL"
- **Tamanho fonte**: 65px
- **Cor**: Preto (`text-black`)
- **Posição**: `left-[180px]`, `top-[54px]`
- **Fonte**: Saira Condensed Bold
- **Tracking**: `tracking-tight`

### Blocos Funcionais (Desktop)

| Bloco | Cor | Conteúdo | Altura |
|-------|-----|----------|--------|
| Azul | `#0066FF` | Facebook, Instagram, TikTok | 28px |
| Rosa | `#FF00CC` | GOV, EUR, PTG | 28px |
| Verde | `#00CC00` | User, Bell, Search | 28px |

### Menu (Barra Vermelha)
- **Itens**: INÍCIO, NOTÍCIAS, STORE, GALERIA, CONTATO
- **Estilo**: Caixa alta, texto preto, sans-serif bold
- **Espaçamento**: `gap-12`

## 🔒 REGRAS FIXAS

> [!CAUTION]
> Esta estrutura está **APROVADA** e **FIXADA**. 
> Não alterar sem autorização explícita do cliente.

### Elementos que NÃO devem ser alterados:
- ✅ Altura da barra preta (80px)
- ✅ Altura da barra vermelha (45px)
- ✅ Tamanho do escudo (140px)
- ✅ Posicionamento do escudo atravessando as barras
- ✅ Tamanho e posição de "SPORT CLUB"
- ✅ Tamanho e posição de "DE NATAL"
- ✅ Cores dos blocos funcionais
- ✅ Cores das barras e textos

## 📱 REGRA CRÍTICA - MODO RESPONSIVO

> [!IMPORTANT]
> **Breakpoint: ≤900px (lg:hidden)**

Quando a tela ficar menor que ~900px, o escudo deve:

### O que DEVE acontecer:
- ✅ **Manter 140px x 140px** (mesmo tamanho do desktop)
- ✅ **Centralizar horizontalmente** (`left-1/2 -translate-x-1/2`)
- ✅ **Manter posição vertical** (`-bottom-[80px]` - atravessando as barras)
- ✅ **Continuar invadindo o conteúdo abaixo** (background da página)
- ✅ **Manter drop-shadow-2xl**
- ✅ **Manter z-index: 50**

### O que NÃO DEVE acontecer:
- ❌ **NÃO diminuir o tamanho** do escudo
- ❌ **NÃO alterar a altura** relativa (continua atravessando)
- ❌ **NÃO "encaixar" dentro das barras**
- ❌ **NÃO mudar para 64px ou qualquer outro tamanho**

### Código Mobile (Linhas 185-218):
```tsx
{/* Logo Centralizado - MESMO TAMANHO E ATRAVESSANDO AS BARRAS */}
<Link href="/" className="absolute left-1/2 -translate-x-1/2 -bottom-[80px] z-50">
    <div className="relative w-[140px] h-[140px] drop-shadow-2xl">
        <Image
            src="/sport_shield_new.svg"
            alt="Sport Club de Natal"
            fill
            className="object-contain"
            priority
        />
    </div>
</Link>
```

**Resultado visual esperado:**
```
Mobile (≤900px):
┌─────────────────────┐
│ [BARRA PRETA 80px]  │
│    [Escudo 140px]   │ ← Centralizado
│         ↓           │
├─────────┴───────────┤
│ [BARRA VERMELHA]    │
└─────────────────────┘
      ↓ Escudo invade conteúdo abaixo
```

## Próximos Passos

Repaginação manual elemento por elemento conforme solicitado pelo cliente.

## Arquivo Principal

[components/club-header.tsx](file:///c:/Users/victo/Downloads/Sport/components/club-header.tsx)
