/**
 * Tabela de Correção de Correntes - Rio Potengi
 * Dados extraídos da Carta da Marinha
 * 
 * Linhas: Amplitude da maré (cm)
 * Colunas: Horas relativas à preamar (-6 a +6)
 * Valores: Correção de velocidade em nós
 */

export const TIDE_CORRECTION_TABLE = {
    amplitudes: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300],
    hours: [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
    data: {
        50: [-0.2, -0.3, -0.5, -0.9, -0.8, -0.5, 0, -0.7, -1.2, -0.9, -0.5, -0.2, -0.2],
        60: [-0.2, -0.3, -0.5, -0.9, -0.7, -0.5, 0, -0.7, -1.1, -0.9, -0.5, -0.2, -0.2],
        70: [-0.2, -0.3, -0.5, -0.8, -0.7, -0.5, 0, -0.6, -1.0, -0.8, -0.5, -0.1, -0.1],
        80: [-0.2, -0.3, -0.4, -0.7, -0.6, -0.4, 0, -0.6, -1.0, -0.7, -0.4, -0.1, -0.1],
        90: [-0.2, -0.2, -0.4, -0.7, -0.6, -0.4, 0, -0.5, -0.9, -0.7, -0.4, -0.1, -0.1],
        100: [-0.2, -0.2, -0.4, -0.6, -0.6, -0.4, 0, -0.5, -0.8, -0.6, -0.4, -0.1, -0.1],
        110: [-0.2, -0.2, -0.4, -0.6, -0.5, -0.4, 0, -0.5, -0.8, -0.6, -0.4, -0.1, -0.1],
        120: [-0.1, -0.2, -0.3, -0.5, -0.5, -0.3, 0, -0.4, -0.7, -0.5, -0.3, -0.1, -0.1],
        130: [-0.1, -0.2, -0.3, -0.5, -0.4, -0.3, 0, -0.4, -0.7, -0.5, -0.3, -0.1, -0.1],
        140: [-0.1, -0.2, -0.3, -0.4, -0.4, -0.3, 0, -0.3, -0.6, -0.4, -0.3, -0.1, -0.1],
        150: [-0.1, -0.1, -0.2, -0.4, -0.3, -0.2, 0, -0.3, -0.6, -0.4, -0.2, -0.1, -0.1],
        160: [-0.1, -0.1, -0.2, -0.3, -0.3, -0.2, 0, -0.3, -0.5, -0.3, -0.2, -0.1, -0.1],
        170: [-0.1, -0.1, -0.2, -0.3, -0.3, -0.2, 0, -0.2, -0.4, -0.3, -0.2, -0.1, -0.1],
        180: [-0.1, -0.1, -0.1, -0.2, -0.2, -0.1, 0, -0.2, -0.4, -0.2, -0.1, 0, 0],
        190: [0, -0.1, -0.1, -0.2, -0.2, -0.1, 0, -0.1, -0.3, -0.2, -0.1, 0, 0],
        200: [0, 0, -0.1, -0.1, -0.1, -0.1, 0, -0.1, -0.2, -0.1, -0.1, 0, 0],
        210: [0, 0, 0, -0.1, -0.1, 0, 0, -0.1, -0.1, -0.1, 0, 0, 0],
        220: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        230: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        240: [0, 0, 0, +0.1, +0.1, 0, 0, 0, +0.1, +0.1, 0, 0, 0],
        250: [0, 0, +0.1, +0.1, +0.1, +0.1, 0, +0.1, +0.1, +0.1, +0.1, 0, 0],
        260: [0, +0.1, +0.1, +0.2, +0.1, +0.1, 0, +0.1, +0.2, +0.2, +0.1, 0, 0],
        270: [+0.1, +0.1, +0.1, +0.2, +0.2, +0.1, 0, +0.2, +0.3, +0.2, +0.1, 0, 0],
        280: [+0.1, +0.1, +0.2, +0.3, +0.2, +0.2, 0, +0.2, +0.3, +0.3, +0.2, 0, 0],
        290: [+0.1, +0.1, +0.2, +0.3, +0.2, +0.2, 0, +0.2, +0.4, +0.3, +0.2, +0.1, +0.1],
        300: [+0.1, +0.1, +0.2, +0.3, +0.3, +0.2, 0, +0.3, +0.5, +0.3, +0.2, +0.1, +0.1]
    } as Record<number, number[]>
};

/**
 * Obtém a correção de correnteza (em nós) por interpolação bilinear
 * @param amplitude Amplitude atual da maré (cm)
 * @param hoursFromHT Horas relativas à preamar (-6 a +6)
 */
export function getCorrection(amplitude: number, hoursFromHT: number): number {
    // 1. Clampar amplitude aos limites da tabela
    const amp = Math.max(50, Math.min(300, amplitude));

    // 2. Clampar horas aos limites
    const hour = Math.max(-6, Math.min(6, hoursFromHT));

    // 3. Encontrar índices para interpolação
    // Amplitude (steps de 10 em 10)
    const ampIndex = (amp - 50) / 10;
    const ampLower = Math.floor(ampIndex) * 10 + 50;
    const ampUpper = Math.ceil(ampIndex) * 10 + 50;
    const ampFraction = ampIndex - Math.floor(ampIndex);

    // Horas (steps de 1 em 1)
    // O índice no array 'data' corresponde a:
    // -6 -> 0, -5 -> 1, ..., 0 -> 6, ..., +6 -> 12
    const hourIndex = hour + 6;
    const hourLower = Math.floor(hourIndex) - 6;
    const hourUpper = Math.ceil(hourIndex) - 6;
    const hourFraction = hourIndex - Math.floor(hourIndex);

    // Obter 4 valores vizinhos
    const rowLower = TIDE_CORRECTION_TABLE.data[ampLower];
    const rowUpper = TIDE_CORRECTION_TABLE.data[ampUpper] || rowLower; // Fallback se upper for igual (ex: 300)

    // Índices de coluna
    const colLower = Math.floor(hourIndex);
    const colUpper = Math.ceil(hourIndex);

    const v11 = rowLower[colLower]; // Amp Lower, Hour Lower
    const v12 = rowLower[colUpper]; // Amp Lower, Hour Upper
    const v21 = rowUpper[colLower]; // Amp Upper, Hour Lower
    const v22 = rowUpper[colUpper]; // Amp Upper, Hour Upper

    // Interpolar Horas primeiro
    const v1 = v11 + (v12 - v11) * hourFraction; // Interpolado na linha Lower
    const v2 = v21 + (v22 - v21) * hourFraction; // Interpolado na linha Upper

    // Interpolar Amplitude
    const finalValue = v1 + (v2 - v1) * ampFraction;

    return finalValue;
}
