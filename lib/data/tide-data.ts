// Dados de maré oficiais (gerado a partir do PDF)
// Estrutura: Record<string, { year: number; month: number; days: Array<{ day: number; weekday: string; tides: Array<{ time: string; height: number }> }> }>

const tideData = {
    "2025-1": {
        "year": 2025,
        "month": 1,
        "days": [
            {
                "day": 1,
                "weekday": "QUA",
                "tides": [
                    { "time": "05:32", "height": 2.11 },
                    { "time": "11:14", "height": 0.37 },
                    { "time": "17:42", "height": 2.32 },
                    { "time": "23:44", "height": 0.2 }
                ]
            }
            // ... (restante dos dados omitido para brevidade) 
        ]
    },
    "2025-2": {
        "year": 2025,
        "month": 2,
        "days": []
    }
    // ... incluir todos os meses/anos restantes
};

export default tideData;
