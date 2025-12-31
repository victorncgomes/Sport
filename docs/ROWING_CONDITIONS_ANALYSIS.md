# Sistema de Classificação de Condições para Remo

## Visão Geral

O sistema analisa **16 horários viáveis** por dia (9 manhã + 7 tarde) para treino de remo no Sport Club de Natal, considerando:
- Física real do Rio Potengi (correntes de enchente/vazante)
- Horários de funcionamento do clube
- Condições meteorológicas
- Preferência por horários da manhã

## Horários Viáveis

### Manhã (9 slots)
- **Janela**: 05:00 - 10:00
- **Slots**: 05:00, 05:30, 06:00, 06:30, 07:00, 07:30, 08:00, 08:30, 09:00
- **Vantagens**: Vento mais calmo (5-15 km/h), temperatura amena

### Tarde (7 slots)
- **Janela**: 14:30 - 18:30
- **Slots**: 14:30, 15:00, 15:30, 16:00, 16:30, 17:00, 17:30
- **Desvantagens**: Vento mais forte (15-25 km/h), sol intenso até 17h

## Física do Rio Potengi

### Tipo de Ambiente
- **Estuário**: Braço de mar + fluxo natural do rio para o oceano
- **Percurso de Remo**: Saída do clube em direção ao mar (140° SE), retorno oposto

### Comportamento das Correntes

#### Enchente (maré subindo)
- Água do mar **ENTRA** no rio (direção: mar → rio)
- Maré oceânica **CONTRA** fluxo natural do rio
- Correntes **MAIS FRACAS** (forças se equilibram)
- Velocidades: 0.2 - 1.8 nós (0.1 - 0.9 m/s)

#### Vazante (maré descendo)
- Água do mar **SAI** do rio (direção: rio → mar)
- Maré oceânica + fluxo natural do rio **SOMAM**
- Correntes **MUITO FORTES** (forças se somam)
- Velocidades: 0.6 - 2.1 nós (0.3 - 1.1 m/s)

#### Estofa (inversão)
- Ocorre aproximadamente 10-30 minutos **APÓS** a preamar
- Velocidades mínimas: 0.0 - 0.3 nós
- Momento de transição enchente → vazante

### Dados Oficiais (Marinha do Brasil)

| Momento relativo à Preamar | Velocidade Média | Tipo | Direção no Rio |
|----------------------------|------------------|------|----------------|
| 6h antes | 0.2-0.4 nós | Enchente | mar → rio (CONTRA percurso) |
| 5h antes | 0.5-1.3 nós | Enchente | mar → rio (CONTRA percurso) |
| 4h antes | 0.6-1.6 nós | Enchente | mar → rio (CONTRA percurso) |
| 3h antes | 1.1-1.6 nós | Enchente | mar → rio (CONTRA percurso) |
| 2h antes | 0.9-1.8 nós | Enchente | mar → rio (CONTRA percurso) |
| 1h antes | 0.4-1.2 nós | Enchente | mar → rio (CONTRA percurso) |
| **PREAMAR** | 0.0-0.5 nós | Estofa | Transição |
| 1h após | 0.6-1.5 nós | Vazante | rio → mar (A FAVOR volta) |
| 2h após | 1.2-2.1 nós | Vazante | rio → mar (A FAVOR volta) |
| 3h após | 0.8-2.1 nós | Vazante | rio → mar (A FAVOR volta) |
| 4h após | 0.5-1.6 nós | Vazante | rio → mar (A FAVOR volta) |
| 5h após | 0.1-0.4 nós | Vazante | rio → mar (A FAVOR volta) |
| 6h após | 0.1-0.6 nós | Vazante | rio → mar (A FAVOR volta) |

**Observação**: Valores para sizígia média (amplitude ~227cm). Corrigir proporcionalmente conforme amplitude real.

## Lógica de Treino Ideal

### Treino Padrão
- **Duração**: 1 hora total
- **Ida**: 30 min (do clube em direção ao mar - 140° SE)
- **Volta**: 30 min (do mar para o clube - 320° NW)

### Cenário Perfeito
**Saída**: 30-40 minutos **ANTES** da preamar

**Timeline**:
```
T=0min (saída)      → 30-40min antes PM → Enchente diminuindo (~0.5-0.8 nós)
                      IDA com corrente CONTRA (resistência moderada) ✓
                      
T=30min (virada)    → 0-10min antes PM  → Estofa/transição (~0.2-0.4 nós)
                      Momento de girar
                      
T=30-60min (volta)  → 0-30min após PM   → Vazante iniciando/forte (~0.8-1.5 nós)
                      VOLTA com corrente A FAVOR (empurrão forte) ✓✓
```

**Por que isso é ideal**:
- **Ida**: Resistência moderada (bom treino, não excessivo)
- **Volta**: Forte ajuda da corrente (economiza energia, retorno rápido)
- **Equilíbrio perfeito** entre treino e eficiência

## Algoritmo de Scoring

### Fórmula
```
Score Total = CurrentScore + WindScore + WaveScore + TimeOfDayScore
```

### Componentes

#### 1. CurrentScore (0-40 pontos)
Baseado no **balance de correntes** (ida/volta):

**Cálculo do Balance**:
```typescript
idaFavor = favorabilidade da corrente na ida (-1 a +1)
voltaFavor = favorabilidade da corrente na volta (-1 a +1)
currentBalance = idaFavor * 0.4 + voltaFavor * 0.6  // volta pesa mais
CurrentScore = 20 * (1 - currentBalance)
```

**Favorabilidade**:
- **Enchente na ida**: BOM (resistência) → +0.2 a +1.0
- **Vazante na ida**: RUIM (vai embora fácil) → -1.0 a -0.2
- **Vazante na volta**: BOM (empurra de volta) → +0.3 a +1.0
- **Enchente na volta**: RUIM (dificulta volta) → -1.0 a -0.3

#### 2. WindScore (0-30 pontos)
Baseado na velocidade do vento **ajustada por horário**:

**Ajuste por Horário**:
```typescript
Manhã cedo (até 7h):   baseSpeed * 0.6   // 40% mais fraco
Manhã (7-8h):          baseSpeed * 0.75  // 25% mais fraco
Manhã (8-9h):          baseSpeed * 0.9   // 10% mais fraco
Manhã (9-10h):         baseSpeed * 1.0   // Igual
Tarde (até 16h):       baseSpeed * 1.3   // 30% mais forte
Tarde (16-17.5h):      baseSpeed * 1.2   // 20% mais forte
Tarde (17.5-18.5h):    baseSpeed * 1.1   // 10% mais forte
```

**Penalidade**:
- < 10 km/h: 0 pontos
- 10-15 km/h: 8 pontos
- 15-20 km/h: 17 pontos
- 20-25 km/h: 25 pontos
- ≥ 25 km/h: 30 pontos

#### 3. WaveScore (0-15 pontos)
- < 0.3m: 0 pontos
- 0.3-0.5m: 5 pontos
- 0.5-0.8m: 10 pontos
- ≥ 0.8m: 15 pontos

#### 4. TimeOfDayScore (-8 a +15 pontos)
**Manhã** (bônus):
- Término ≤ 7h: **-8 pontos** (BÔNUS manhã cedo!)
- Término ≤ 8h: **-5 pontos** (BÔNUS manhã)
- Término ≤ 9h: 0 pontos (neutro)
- Término ≤ 10h: +12 pontos (penalidade - vento aumentando)

**Tarde** (penalidade):
- Término ≤ 16.5h: +15 pontos (sol forte)
- Término ≤ 17.5h: +10 pontos (melhorando)
- Término ≤ 18.5h: +5 pontos (boa tarde)

### Classificação Final

| Score | Classificação | Descrição |
|-------|--------------|-----------|
| 0-15 | **EXCELENTE** ✅ | Condições ideais para treino |
| 16-30 | **BOA** 👍 | Boas condições, treino produtivo |
| 31-50 | **MODERADA** ⚠️ | Condições moderadas, requer atenção |
| 51-70 | **DIFÍCIL** 🚫 | Condições difíceis, apenas experientes |
| 71-100 | **PERIGOSA** ☠️ | Condições perigosas, não recomendado |

## Regra de Ouro

**PREFERÊNCIA ABSOLUTA MANHÃ**: Em qualquer situação de empate ou scores próximos (diferença ≤ 10 pontos), **SEMPRE** preferir horário da manhã.

```typescript
if (bestAfternoon.score - bestMorning.score <= 10) {
    return bestMorning; // SEMPRE manhã!
}
```

## Uso da API

### Entrada
```typescript
import { analyzeRowingConditions } from '@/lib/utils/rowing-conditions-analyzer';

const result = analyzeRowingConditions({
    currentDate: new Date('2025-01-15'),
    tideData: {
        nextHighTide: new Date('2025-01-15T08:00:00'),
        nextLowTide: new Date('2025-01-15T14:00:00'),
        amplitude: 185  // cm
    },
    weatherData: {
        windSpeed: 12,      // km/h
        windDirection: 135, // graus
        waveHeight: 0.3     // metros
    }
});
```

### Saída
```typescript
{
    date: "2025-01-15",
    morningSlots: SlotAnalysis[],    // 9 slots
    afternoonSlots: SlotAnalysis[],  // 7 slots
    bestTime: {
        slot: SlotAnalysis,
        reason: string,
        alternativeTimes: SlotAnalysis[]
    },
    tideInfo: {
        nextHighTide: "08:00",
        nextLowTide: "14:00",
        amplitude: 185,
        tideType: "média"
    },
    quickSummary: {
        bestPeriod: "morning",
        bestTimeRange: "07:00-08:00",
        classification: "EXCELENTE",
        oneLineReason: "Manhã preferida (vento mais estável e temperatura amena)"
    }
}
```

## Arquivos Implementados

### Tipos
- `types/rowing-conditions.ts` - Interfaces e tipos TypeScript

### Lógica
- `lib/utils/rowing-conditions-analyzer.ts` - Algoritmo de análise completo

### UI
- `components/tides/SlotsTable.tsx` - Tabela de horários viáveis
- `components/tide-widget.tsx` - Widget integrado (modificado)

## Referências

- **Dados de Correntes**: Marinha do Brasil - Cartas de Correntes do Porto de Natal
- **Localização**: Sport Club de Natal (5°46'31"S, 35°12'22"W)
- **Percurso**: 140° SE (ida), 320° NW (volta)
