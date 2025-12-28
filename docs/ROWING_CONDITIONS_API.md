# API de Condições de Remo - Rio Potengi

## Visão Geral

Este documento descreve a API de condições de remo implementada para o Sport Club do Recife e Natal, fornecendo dados automáticos de correnteza, vento, classificação de condições e impacto estimado no pace para remadores no Rio Potengi.

## Estrutura de Dados JSON

### Resposta Completa

```json
{
  "current": {
    "speed_m_s": 0.65,
    "direction_deg": 135,
    "relative_angle_deg": 45
  },
  "wind": {
    "speed_m_s": 5.2,
    "direction_deg": 220,
    "relative_angle_deg": 80,
    "gusts_m_s": 6.76
  },
  "condition_rating": "technical",
  "condition_classification": {
    "rating": "technical",
    "color": "yellow",
    "label": "Técnica",
    "description": "Condições desafiadoras - requer técnica apurada"
  },
  "water_condition": {
    "surface": "ripple",
    "side_chop_index": 32,
    "description": "Ondulação leve a moderada"
  },
  "pace_impact": {
    "delta_s_per_500m": 11.4,
    "percentage": 14.4,
    "description": "Perda de 11.4s/500m"
  },
  "timestamp": "2025-12-23T22:00:00.000Z"
}
```

## Descrição dos Campos

### Current (Correnteza)

- **speed_m_s**: Velocidade da corrente em metros por segundo
- **direction_deg**: Direção da corrente em graus (0-360, onde 0° = Norte)
- **relative_angle_deg**: Ângulo relativo ao percurso de remo (0-180°)

### Wind (Vento)

- **speed_m_s**: Velocidade do vento em metros por segundo
- **direction_deg**: Direção do vento em graus (0-360)
- **relative_angle_deg**: Ângulo relativo ao percurso
- **gusts_m_s**: Velocidade das rajadas em m/s

### Condition Rating (Classificação)

Valores possíveis:
- **"favorable"**: Condições favoráveis (ângulo ≤ 30°)
- **"technical"**: Condições técnicas (30° < ângulo ≤ 110°)
- **"difficult"**: Condições ingratas (ângulo > 110°)

### Water Condition (Condição da Água)

- **surface**: Estado da superfície
  - `"mirror"`: Água espelhada (vento < 2.5 m/s)
  - `"ripple"`: Ondulação (2.5-7.0 m/s)
  - `"chaotic"`: Lago caótico (> 7.0 m/s)
- **side_chop_index**: Índice de chop lateral (0-100)
- **description**: Descrição textual da condição

### Pace Impact (Impacto no Pace)

- **delta_s_per_500m**: Impacto em segundos por 500m
  - Valores negativos = ganho de tempo (condições favoráveis)
  - Valores positivos = perda de tempo (condições adversas)
- **percentage**: Impacto percentual na velocidade
- **description**: Descrição do impacto

## Fórmulas de Cálculo

### 1. Ângulo Relativo

```typescript
relativeAngle = min(|direction - courseAzimuth|, 360 - |direction - courseAzimuth|)
```

Onde:
- `direction`: Direção do vento/corrente em graus
- `courseAzimuth`: Azimute do percurso (315° para o percurso principal do Potengi)

### 2. Classificação de Condição

```typescript
if (relativeAngle <= 30°) → "favorable"
else if (relativeAngle <= 110°) → "technical"
else → "difficult"
```

### 3. Índice de Chop Lateral

```typescript
lateralFactor = sin(relativeAngle × π / 180)
windFactor = min(windSpeed / 15, 1)
chopIndex = lateralFactor × windFactor × 100
```

### 4. Impacto no Pace

```typescript
currentComponent = currentSpeed × cos(relativeAngle × π / 180)
relativeImpact = (currentComponent / boatSpeed) × K
delta_s_per_500m = -relativeImpact × (500 / boatSpeed)
```

Onde:
- `K`: Coeficiente de impacto (padrão: 1.0, calibrável)
- `boatSpeed`: Velocidade média do barco (4.5 m/s ≈ 2:00/500m)

## Fontes de Dados

### Implementação Atual (Simulada)

Os dados atuais são gerados com base em:
- Dados de maré da Marinha do Brasil
- Modelos de corrente baseados em ciclos de maré
- Padrões de vento simulados

### Integração Futura (APIs Externas)

#### Correnteza e Maré
- **DHN - Marinha do Brasil**: https://www.marinha.mil.br/chm/dados-do-seg-sistema-mare
- **Copernicus Marine Service**: https://marine.copernicus.eu
- **NOAA Tidal Currents**: https://tidesandcurrents.noaa.gov

#### Vento e Ondas
- **OpenWeatherMap Marine API**: https://openweathermap.org/api/marine
- **ECMWF ERA5**: https://www.ecmwf.int/en/forecasts/datasets/reanalysis-datasets/era5
- **NOAA WaveWatch III**: https://polar.ncep.noaa.gov/waves/

## Guia de Calibração

### Coeficiente K (Impacto no Pace)

O coeficiente K deve ser calibrado com dados reais do clube:

1. **Coleta de Dados**:
   - Registrar pace real em diferentes condições
   - Anotar velocidade/direção da corrente
   - Registrar velocidade/direção do vento

2. **Análise**:
   - Comparar pace previsto vs pace real
   - Calcular erro médio
   - Ajustar K para minimizar erro

3. **Fórmula de Ajuste**:
   ```
   K_novo = K_atual × (pace_real / pace_previsto)
   ```

### Exemplo de Registro

```typescript
{
  date: "2025-12-23",
  actual_pace_s_500m: 125.0,
  predicted_pace_s_500m: 132.0,
  current_speed_m_s: 0.65,
  wind_speed_m_s: 5.2,
  notes: "Treino matinal, maré vazante"
}
```

## Configuração do Percurso

### Percurso Principal - Rio Potengi

```typescript
{
  name: "Rio Potengi - Percurso Principal",
  azimuth: 315, // NW
  coordinates: {
    start: { lat: -5.7945, lng: -35.2108 },
    end: { lat: -5.7892, lng: -35.2156 }
  },
  average_boat_speed_m_s: 4.5 // ~2:00/500m
}
```

## Uso no Widget

O widget de tábua de marés exibe automaticamente:

1. **Modo Resumo**: Condições básicas de clima e vento
2. **Modo Detalhes**: 
   - Correnteza com direção e velocidade
   - Classificação de condições (favorável/técnica/ingrata)
   - Condição da água e chop lateral
   - Impacto estimado no pace

## Exemplos de Uso

### Condições Favoráveis

```json
{
  "current": { "speed_m_s": 0.45, "direction_deg": 315, "relative_angle_deg": 0 },
  "condition_rating": "favorable",
  "pace_impact": { "delta_s_per_500m": -5.0 }
}
```
**Interpretação**: Corrente a favor, ganho de 5 segundos por 500m

### Condições Técnicas

```json
{
  "current": { "speed_m_s": 0.60, "direction_deg": 45, "relative_angle_deg": 90 },
  "condition_rating": "technical",
  "water_condition": { "side_chop_index": 45 }
}
```
**Interpretação**: Corrente lateral, chop moderado, requer técnica

### Condições Ingratas

```json
{
  "current": { "speed_m_s": 0.80, "direction_deg": 135, "relative_angle_deg": 180 },
  "condition_rating": "difficult",
  "pace_impact": { "delta_s_per_500m": 17.8 }
}
```
**Interpretação**: Corrente contrária forte, perda de ~18 segundos por 500m

## Notas Técnicas

- Todos os ângulos são medidos em graus (0-360)
- Velocidades em metros por segundo (m/s)
- Conversão: 1 m/s ≈ 3.6 km/h ≈ 1.94 nós
- Timestamps em formato ISO 8601
- Coordenadas em graus decimais (WGS84)
