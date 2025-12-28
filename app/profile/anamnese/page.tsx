'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/ui/hero-section';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnamnesePage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({
        // Obrigatórios
        nomeCompleto: '',
        sabeNadar: null,
        sabeDesvirarBarco: null,

        // Opcionais
        peso: '',
        altura: '',
        telefone: '',
        dataNascimento: '',

        // Saúde (checkboxes)
        problemasCardiacos: false,
        hipertensao: false,
        colesterolElevado: false,
        diabetesMellitus: false,

        // Sintomas (checkboxes)
        tontura: false,
        desmaios: false,
        dorPeito: false,
        faltaAr: false,

        // Hábitos
        consumoAlcool: 'NUNCA',
        fuma: false,
        horasSonoPorNoite: '',

        // Atividade Física
        praticaAtividadeRegular: false,
        perfilCondicionamento: 'SEDENTARIO',

        // Observações
        comentariosAdicionais: ''
    });

    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const validateStep = () => {
        const newErrors: string[] = [];

        if (step === 1) {
            if (!formData.nomeCompleto.trim()) newErrors.push('Nome completo é obrigatório');
            if (formData.sabeNadar === null) newErrors.push('Informe se sabe nadar');
            if (formData.sabeDesvirarBarco === null) newErrors.push('Informe se sabe desvirar o barco');
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
            setErrors([]);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        try {
            const response = await fetch('/api/profile/anamnese', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    condicaoNatatoria: formData.sabeNadar ? 'COM_ESTILO' : 'NAO_SABE',
                    flutuabilidadeVertical10min: formData.sabeDesvirarBarco
                })
            });

            if (response.ok) {
                alert('Anamnese salva com sucesso! +100 pontos! 🎉');
                router.push('/profile/panel');
            } else {
                alert('Erro ao salvar anamnese');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao salvar anamnese');
        }
    };

    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-club-black pb-24">
            <HeroSection
                title="Anamnese"
                subtitle="Ficha de Saúde"
                description="Preencha seus dados para treinar com segurança"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/60">Etapa {step} de {totalSteps}</span>
                        <span className="text-sm text-white/60">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-club-red"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                    <AnimatedCard variant="glass" className="p-4 mb-6 border-red-500/50">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-500 font-bold mb-1">Campos obrigatórios:</p>
                                <ul className="text-red-400 text-sm space-y-1">
                                    {errors.map((error, i) => (
                                        <li key={i}>• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {/* Step 1: Dados Básicos + Obrigatórios */}
                {step === 1 && (
                    <AnimatedCard variant="gradient" className="p-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Dados Básicos</h3>

                            {/* Nome Completo - OBRIGATÓRIO */}
                            <div className="mb-4">
                                <label className="block text-white mb-2">
                                    Nome Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.nomeCompleto}
                                    onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                    placeholder="Seu nome completo"
                                />
                            </div>

                            {/* Sabe Nadar - OBRIGATÓRIO */}
                            <div className="mb-4">
                                <label className="block text-white mb-2">
                                    Você sabe nadar? <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleChange('sabeNadar', true)}
                                        className={`p-4 rounded-lg border-2 transition-all ${formData.sabeNadar === true
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                                : 'bg-white/5 border-white/20 text-white/60'
                                            }`}
                                    >
                                        <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                                        Sim
                                    </button>
                                    <button
                                        onClick={() => handleChange('sabeNadar', false)}
                                        className={`p-4 rounded-lg border-2 transition-all ${formData.sabeNadar === false
                                                ? 'bg-red-500/20 border-red-500 text-red-400'
                                                : 'bg-white/5 border-white/20 text-white/60'
                                            }`}
                                    >
                                        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                                        Não
                                    </button>
                                </div>
                            </div>

                            {/* Sabe Desvirar Barco - OBRIGATÓRIO */}
                            <div className="mb-4">
                                <label className="block text-white mb-2">
                                    Você sabe desvirar o barco? <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleChange('sabeDesvirarBarco', true)}
                                        className={`p-4 rounded-lg border-2 transition-all ${formData.sabeDesvirarBarco === true
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                                : 'bg-white/5 border-white/20 text-white/60'
                                            }`}
                                    >
                                        <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                                        Sim
                                    </button>
                                    <button
                                        onClick={() => handleChange('sabeDesvirarBarco', false)}
                                        className={`p-4 rounded-lg border-2 transition-all ${formData.sabeDesvirarBarco === false
                                                ? 'bg-red-500/20 border-red-500 text-red-400'
                                                : 'bg-white/5 border-white/20 text-white/60'
                                            }`}
                                    >
                                        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                                        Não
                                    </button>
                                </div>
                            </div>

                            {/* Dados Opcionais */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Peso (kg)</label>
                                    <input
                                        type="number"
                                        value={formData.peso}
                                        onChange={(e) => handleChange('peso', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                                        placeholder="70"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/60 text-sm mb-2">Altura (cm)</label>
                                    <input
                                        type="number"
                                        value={formData.altura}
                                        onChange={(e) => handleChange('altura', e.target.value)}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                                        placeholder="175"
                                    />
                                </div>
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {/* Step 2: Saúde (Checkboxes) */}
                {step === 2 && (
                    <AnimatedCard variant="gradient" className="p-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Histórico de Saúde</h3>
                            <p className="text-white/60 text-sm mb-6">Marque se você tem ou já teve:</p>

                            <div className="space-y-3">
                                {[
                                    { key: 'problemasCardiacos', label: 'Problemas Cardíacos' },
                                    { key: 'hipertensao', label: 'Hipertensão (Pressão Alta)' },
                                    { key: 'colesterolElevado', label: 'Colesterol Elevado' },
                                    { key: 'diabetesMellitus', label: 'Diabetes' },
                                    { key: 'tontura', label: 'Tonturas Frequentes' },
                                    { key: 'desmaios', label: 'Desmaios' },
                                    { key: 'dorPeito', label: 'Dor no Peito' },
                                    { key: 'faltaAr', label: 'Falta de Ar / Cansaço Fácil' }
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData[key]}
                                            onChange={(e) => handleChange(key, e.target.checked)}
                                            className="w-5 h-5 rounded border-white/20"
                                        />
                                        <span className="text-white">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {/* Step 3: Hábitos */}
                {step === 3 && (
                    <AnimatedCard variant="gradient" className="p-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">Hábitos de Vida</h3>

                            {/* Consumo de Álcool */}
                            <div className="mb-6">
                                <label className="block text-white mb-2">Consumo de Álcool</label>
                                <select
                                    value={formData.consumoAlcool}
                                    onChange={(e) => handleChange('consumoAlcool', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                >
                                    <option value="NUNCA">Nunca</option>
                                    <option value="OCASIONAL">Ocasional</option>
                                    <option value="MENSAL">Mensal</option>
                                    <option value="SEMANAL">Semanal</option>
                                    <option value="DIARIO">Diário</option>
                                </select>
                            </div>

                            {/* Fuma */}
                            <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors mb-6">
                                <input
                                    type="checkbox"
                                    checked={formData.fuma}
                                    onChange={(e) => handleChange('fuma', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20"
                                />
                                <span className="text-white">Fumante</span>
                            </label>

                            {/* Horas de Sono */}
                            <div className="mb-6">
                                <label className="block text-white mb-2">Horas de sono por noite</label>
                                <input
                                    type="number"
                                    value={formData.horasSonoPorNoite}
                                    onChange={(e) => handleChange('horasSonoPorNoite', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                    placeholder="8"
                                    min="0"
                                    max="24"
                                    step="0.5"
                                />
                            </div>

                            {/* Perfil de Condicionamento */}
                            <div>
                                <label className="block text-white mb-2">Perfil de Condicionamento</label>
                                <select
                                    value={formData.perfilCondicionamento}
                                    onChange={(e) => handleChange('perfilCondicionamento', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                >
                                    <option value="SEDENTARIO">Sedentário</option>
                                    <option value="POUCO_ATIVO">Pouco Ativo</option>
                                    <option value="ATIVO">Ativo</option>
                                    <option value="MUITO_ATIVO">Muito Ativo</option>
                                    <option value="ATLETA">Atleta</option>
                                </select>
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {/* Step 4: Observações */}
                {step === 4 && (
                    <AnimatedCard variant="gradient" className="p-6 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Observações Adicionais</h3>
                            <p className="text-white/60 text-sm mb-4">Alguma informação importante sobre sua saúde?</p>

                            <textarea
                                value={formData.comentariosAdicionais}
                                onChange={(e) => handleChange('comentariosAdicionais', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white min-h-[150px]"
                                placeholder="Ex: Alergia a medicamentos, cirurgias recentes, etc..."
                            />

                            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-bold">Quase lá!</span>
                                </div>
                                <p className="text-emerald-400/80 text-sm">
                                    Ao concluir, você ganhará +100 pontos! 🎉
                                </p>
                            </div>
                        </div>
                    </AnimatedCard>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                    {step > 1 && (
                        <Button
                            onClick={() => setStep(step - 1)}
                            variant="outline"
                            className="flex-1"
                        >
                            Voltar
                        </Button>
                    )}
                    {step < totalSteps ? (
                        <Button
                            onClick={handleNext}
                            className="flex-1 bg-club-red hover:bg-club-red/90"
                        >
                            Próximo
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                            Concluir Anamnese
                        </Button>
                    )}
                </div>

                {/* Legenda */}
                <p className="text-white/40 text-xs text-center mt-4">
                    <span className="text-red-500">*</span> Campos obrigatórios
                </p>
            </div>
        </div>
    );
}
