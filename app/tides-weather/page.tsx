import { HeroSection } from '@/components/ui/hero-section';
import { TideChart } from '@/components/tides/TideChart';
import { TideTimesCard } from '@/components/tides/TideTimesCard';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import { WaveWidget } from '@/components/tides/WaveWidget';
import { RowingAlert } from '@/components/tides/RowingAlert';
import { getRealTideData } from '@/lib/api/tides';
import { fetchWeatherData, parseWeatherCurrent, fetchMarineData } from '@/lib/api/weather';
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
    // 1. Buscar clima (com cache de 30min) - Precisamos dele para o pôr do sol
    const weatherRaw = await withCache(
        'weather:natal:full',
        1800,
        async () => fetchWeatherData()
    );

    const currentWeather = parseWeatherCurrent(weatherRaw);

    // 2. Buscar dados de marés (com cache de 24h) - Usando os dados oficiais e astronomia da API
    const tideData = await withCache(
        'tides:natal:real:7',
        86400, // 24h
        async () => {
            return getRealTideData(7, weatherRaw);
        }
    );

    // 3. Buscar dados de ondas e vento em tempo real (sem cache longo para ser "exato momento")
    const waves = await withCache(
        'waves:natal:current',
        600, // 10 min
        async () => fetchMarineData()
    );

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
