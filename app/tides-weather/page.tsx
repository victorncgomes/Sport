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

    // 2. Buscar dados de marés (com cache de 24h) - Apenas 3 dias (ontem, hoje, amanhã)
    const tideData = await withCache(
        'tides:natal:real:3',
        86400, // 24h
        async () => {
            return getRealTideData(3, weatherRaw);
        }
    );

    // 3. Buscar dados de ondas e vento em tempo real (sem cache longo para ser "exato momento")
    const waves = await withCache(
        'waves:natal:current',
        600, // 10 min
        async () => fetchMarineData()
    );

    // Horários de treino do clube
    const trainingSchedule = {
        morning: { start: '05:30', end: '08:00', label: 'Manhã' },
        afternoon: { start: '16:00', end: '18:00', label: 'Tarde' }
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

                {/* Horários de Treino do Clube */}
                <div className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        ⏰ Horários para Prática de Remo
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Horário Manhã */}
                        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-300 font-bold text-sm uppercase tracking-wider">☀️ Manhã</span>
                                <span className="text-white font-mono text-lg">{trainingSchedule.morning.start} - {trainingSchedule.morning.end}</span>
                            </div>
                            <p className="text-white/60 text-xs">
                                Ideal para treinos técnicos. Águas geralmente calmas e vento fraco.
                            </p>
                        </div>

                        {/* Horário Tarde */}
                        <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-400/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-orange-300 font-bold text-sm uppercase tracking-wider">🌅 Tarde</span>
                                <span className="text-white font-mono text-lg">{trainingSchedule.afternoon.start} - {trainingSchedule.afternoon.end}</span>
                            </div>
                            <p className="text-white/60 text-xs">
                                Treinos de resistência. Atenção ao vento que pode aumentar no período.
                            </p>
                        </div>
                    </div>

                    {/* Observações */}
                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-white/70 text-xs leading-relaxed">
                            <strong className="text-white">⚠️ Importante:</strong> Os horários podem variar conforme as condições das marés.
                            Evite remar durante a estofa (mudança de maré) e em condições de vento acima de 25 km/h.
                            Consulte sempre o treinador antes de sair.
                        </p>
                    </div>
                </div>

                {/* Gráfico Marés 3 Dias */}
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
                    <p className="text-xs text-gray-600 mt-2">
                        Sport Club de Natal: Lat 5°46'31"S • Long 35°12'22"W • Fuso UTC -03:00
                    </p>
                </div>
            </main>
        </div>
    );
}
