import { HeroSection } from '@/components/ui/hero-section';
import { TideChart } from '@/components/tides/TideChart';
import { TideTimesCard } from '@/components/tides/TideTimesCard';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import { WaveWidget } from '@/components/tides/WaveWidget';
import { RowingAlert } from '@/components/tides/RowingAlert';
import { generateMockTideData } from '@/lib/api/tides';
import { fetchWeatherData, parseWeatherCurrent } from '@/lib/api/weather';
import { withCache } from '@/lib/cache/cache';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const metadata = {
    title: 'Tábua de Marés & Clima - Sport Club de Natal',
    description: 'Condições náuticas em tempo real: marés, clima, ondas e vento para o Rio Potengi em Natal/RN'
};

// Revalidate every 30 minutes
export const revalidate = 1800;

export default async function TidesWeatherPage() {
    // Buscar dados de marés (com cache de 24h)
    const tideData = await withCache(
        'tides:natal:7',
        86400, // 24h
        async () => {
            // TODO: Buscar do banco quando houver dados reais
            // const dbTides = await prisma.tideData.findMany({...});
            // return dbTides;
            return generateMockTideData(7);
        }
    );

    // Buscar clima (com cache de 30min)
    const currentWeather = await withCache(
        'weather:natal:current',
        1800, // 30min
        async () => {
            try {
                const weatherData = await fetchWeatherData();
                return parseWeatherCurrent(weatherData);
            } catch (error) {
                console.error('Weather API error:', error);
                // Fallback data
                return {
                    datetime: new Date(),
                    temperature: 28,
                    feelsLike: 30,
                    humidity: 75,
                    pressure: 1013,
                    visibility: 10000,
                    uvIndex: 8,
                    windSpeed: 15,
                    windDirection: 'NE',
                    windDirDegrees: 45,
                    precipitation: 0,
                    cloudCover: 20,
                    condition: 'clear' as const,
                    conditionText: 'Céu limpo',
                    icon: '01d'
                };
            }
        }
    );

    // Mock wave data (TODO: integrar com API real)
    const waves = {
        datetime: new Date(),
        height: 0.8,
        period: 6.5,
        direction: 'NE',
        directionDegrees: 45,
        waterTemp: 26.5,
        seaState: 'moderate' as const
    };

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Condições Náuticas"
                subtitle="Rio Potengi - Natal/RN"
                description={`Atualizado ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`}
                compact
            />

            <main className="container mx-auto px-4 py-8">

                {/* Grid Principal */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Col 1: Marés Hoje */}
                    <TideTimesCard tideDay={tideData[0]} />

                    {/* Col 2: Clima Atual */}
                    <WeatherWidget weather={currentWeather} />

                    {/* Col 3: Ondas/Vento */}
                    <WaveWidget waves={waves} />
                </div>

                {/* Alerta Condições Ideais */}
                <div className="mb-8">
                    <RowingAlert
                        bestTime={tideData[0].bestRowingTime}
                        coefficient={tideData[0].coefficient}
                        windSpeed={currentWeather.windSpeed}
                        waveHeight={waves.height}
                    />
                </div>

                {/* Gráfico Marés 7 Dias */}
                <div className="mb-8">
                    <TideChart data={tideData} />
                </div>

                {/* Info */}
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Dados de marés baseados em informações da Marinha do Brasil.
                        Dados meteorológicos fornecidos por Open-Meteo.
                        Atualização automática a cada 30 minutos.
                    </p>
                </div>
            </main>
        </div>
    );
}
