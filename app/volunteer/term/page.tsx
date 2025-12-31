'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    CheckCircle2,
    Calendar,
    Briefcase,
    Send,
    ExternalLink,
    User,
    Download
} from 'lucide-react';

// Atividades de voluntariado disponíveis
const VOLUNTEER_ACTIVITIES = [
    { id: 'MEDIA', name: 'Mídia e Comunicação', description: 'Fotografia, vídeo, redes sociais, design gráfico', icon: '📸' },
    { id: 'STORE', name: 'Loja do Clube', description: 'Atendimento, organização, vendas', icon: '🛍️' },
    { id: 'EVENTS', name: 'Eventos', description: 'Organização de regatas, festas, confraternizações', icon: '🎉' },
    { id: 'MAINTENANCE', name: 'Manutenção', description: 'Cuidados com barcos, equipamentos, garagem', icon: '🔧' },
    { id: 'TEACHING', name: 'Ensino', description: 'Auxiliar novos remadores, aulas para iniciantes', icon: '🎓' },
    { id: 'ADMINISTRATIVE', name: 'Administrativo', description: 'Secretaria, documentação, financeiro', icon: '📋' },
    { id: 'KITCHEN', name: 'Copa/Cozinha', description: 'Preparação de lanches, café, organização', icon: '☕' },
    { id: 'SECURITY', name: 'Segurança', description: 'Apoio em eventos, controle de acesso', icon: '🔐' }
];

// Dias da semana para disponibilidade
const WEEK_DAYS = [
    { id: 'MON', name: 'Segunda', short: 'Seg' },
    { id: 'TUE', name: 'Terça', short: 'Ter' },
    { id: 'WED', name: 'Quarta', short: 'Qua' },
    { id: 'THU', name: 'Quinta', short: 'Qui' },
    { id: 'FRI', name: 'Sexta', short: 'Sex' },
    { id: 'SAT', name: 'Sábado', short: 'Sáb' },
    { id: 'SUN', name: 'Domingo', short: 'Dom' }
];

const TIME_SLOTS = [
    { id: 'MORNING', name: 'Manhã', time: '06:00 - 12:00' },
    { id: 'AFTERNOON', name: 'Tarde', time: '12:00 - 18:00' },
    { id: 'EVENING', name: 'Noite', time: '18:00 - 22:00' }
];

interface UserData {
    name: string;
    email: string;
    cpf: string;
    phone: string;
}

export default function VolunteerTermPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    // Dados do termo
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedRules, setAcceptedRules] = useState(false);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [availability, setAvailability] = useState<{ [key: string]: string[] }>({
        MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [], SUN: []
    });

    // Buscar dados do usuário logado
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                if (session?.user) {
                    // Em produção, buscar dados completos do perfil
                    setUserData({
                        name: session.user.name || 'Usuário',
                        email: session.user.email || '',
                        cpf: '***.***.***-**', // Mascarado por segurança
                        phone: '(**) *****-****'
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            }
        };
        fetchUserData();
    }, []);

    const toggleActivity = (activityId: string) => {
        setSelectedActivities(prev =>
            prev.includes(activityId)
                ? prev.filter(a => a !== activityId)
                : [...prev, activityId]
        );
    };

    const toggleAvailability = (day: string, slot: string) => {
        setAvailability(prev => ({
            ...prev,
            [day]: prev[day].includes(slot)
                ? prev[day].filter(s => s !== slot)
                : [...prev[day], slot]
        }));
    };

    const getTotalSlots = () => {
        return Object.values(availability).flat().length;
    };

    const canProceed = () => {
        switch (step) {
            case 1: return acceptedTerms && acceptedRules;
            case 2: return selectedActivities.length > 0;
            case 3: return getTotalSlots() > 0;
            default: return false;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/volunteer/accept-term', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    acceptedTerms: true,
                    activities: selectedActivities,
                    availability
                })
            });

            if (response.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Erro ao enviar termo:', error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo à equipe!</h2>
                    <p className="text-white/60 mb-4">
                        Seu termo de voluntariado foi aceito com sucesso.
                        Agora você pode participar das atividades do clube!
                    </p>
                    <div className="bg-blue-500/20 rounded-lg p-3 mb-4">
                        <p className="text-blue-400 font-semibold text-lg">+150 pontos</p>
                        <p className="text-blue-300 text-sm">Bônus de adesão ao voluntariado</p>
                    </div>
                    <a href="/volunteer" className="text-blue-400 hover:text-blue-300">
                        Ver tarefas disponíveis →
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 pb-24">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Termo de Voluntariado</h1>
                <p className="text-white/60 text-sm mt-1">
                    Junte-se à nossa equipe de voluntários
                </p>
            </div>

            {/* Dados do Usuário (preview) */}
            {userData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                            {userData.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                            <p className="text-white font-medium">{userData.name}</p>
                            <p className="text-white/50 text-sm">{userData.email}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 flex items-center">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${s < step ? 'bg-green-500 text-white' : s === step ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/40'}
                        `}>
                            {s < step ? '✓' : s}
                        </div>
                        {s < 3 && (
                            <div className={`flex-1 h-1 mx-2 rounded ${s < step ? 'bg-green-500' : 'bg-white/10'}`} />
                        )}
                    </div>
                ))}
            </div>

            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
            >
                {/* Step 1: Aceitar Termos */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-6 h-6 text-blue-400" />
                            <h2 className="text-lg font-semibold text-white">Termos e Condições</h2>
                        </div>

                        {/* Link para o termo completo */}
                        <a
                            href="/public/docs/termo-de-adesao-completo.pdf"
                            target="_blank"
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Termo de Adesão Completo</p>
                                    <p className="text-white/50 text-sm">Clique para ler o documento</p>
                                </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-white/40" />
                        </a>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                            <h3 className="text-blue-300 font-medium mb-2">Resumo do Termo:</h3>
                            <ul className="text-blue-200/80 text-sm space-y-1">
                                <li>• Participação voluntária e não remunerada</li>
                                <li>• Compromisso com as atividades escolhidas</li>
                                <li>• Respeito às normas e regulamentos do clube</li>
                                <li>• Uso adequado dos equipamentos e instalações</li>
                                <li>• Confidencialidade das informações do clube</li>
                            </ul>
                        </div>

                        <div className="space-y-3 mt-6">
                            <label className="flex items-start gap-3 p-4 bg-white/5 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-white/20"
                                />
                                <span className="text-white/80 text-sm">
                                    Li e concordo com o <strong className="text-blue-400">Termo de Adesão ao Voluntariado</strong> do Sport Club de Natal.
                                </span>
                            </label>

                            <label className="flex items-start gap-3 p-4 bg-white/5 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={acceptedRules}
                                    onChange={(e) => setAcceptedRules(e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-white/20"
                                />
                                <span className="text-white/80 text-sm">
                                    Comprometo-me a seguir as <strong className="text-blue-400">Regras de Conduta</strong> e colaborar com a equipe.
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Step 2: Escolher Atividades */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="w-6 h-6 text-purple-400" />
                            <h2 className="text-lg font-semibold text-white">Áreas de Interesse</h2>
                        </div>

                        <p className="text-white/60 text-sm mb-4">
                            Selecione as atividades em que você gostaria de ajudar:
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            {VOLUNTEER_ACTIVITIES.map((activity) => (
                                <button
                                    key={activity.id}
                                    onClick={() => toggleActivity(activity.id)}
                                    className={`
                                        p-4 rounded-xl text-left transition-all
                                        ${selectedActivities.includes(activity.id)
                                            ? 'bg-blue-600 border-2 border-blue-400'
                                            : 'bg-white/5 border-2 border-transparent hover:border-white/20'
                                        }
                                    `}
                                >
                                    <span className="text-2xl mb-2 block">{activity.icon}</span>
                                    <p className={`font-medium text-sm ${selectedActivities.includes(activity.id) ? 'text-white' : 'text-white/80'}`}>
                                        {activity.name}
                                    </p>
                                    <p className={`text-xs mt-1 ${selectedActivities.includes(activity.id) ? 'text-white/70' : 'text-white/40'}`}>
                                        {activity.description}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <p className="text-white/40 text-sm mt-2">
                            {selectedActivities.length} área(s) selecionada(s)
                        </p>
                    </div>
                )}

                {/* Step 3: Disponibilidade */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-6 h-6 text-green-400" />
                            <h2 className="text-lg font-semibold text-white">Disponibilidade</h2>
                        </div>

                        <p className="text-white/60 text-sm mb-4">
                            Marque os horários em que você pode ajudar:
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-white/50 text-left p-2"></th>
                                        {TIME_SLOTS.map(slot => (
                                            <th key={slot.id} className="text-white/70 text-center p-2">
                                                <div>{slot.name}</div>
                                                <div className="text-xs text-white/40">{slot.time}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {WEEK_DAYS.map(day => (
                                        <tr key={day.id}>
                                            <td className="text-white/70 p-2 font-medium">{day.short}</td>
                                            {TIME_SLOTS.map(slot => (
                                                <td key={slot.id} className="p-1 text-center">
                                                    <button
                                                        onClick={() => toggleAvailability(day.id, slot.id)}
                                                        className={`
                                                            w-10 h-10 rounded-lg transition-all
                                                            ${availability[day.id].includes(slot.id)
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-white/10 text-white/40 hover:bg-white/20'
                                                            }
                                                        `}
                                                    >
                                                        {availability[day.id].includes(slot.id) ? '✓' : ''}
                                                    </button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="text-white/40 text-sm mt-2">
                            {getTotalSlots()} horário(s) selecionado(s)
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold"
                    >
                        Voltar
                    </button>
                )}

                {step < 3 ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                        className={`
                            flex-1 py-3 rounded-xl font-semibold transition-all
                            ${canProceed()
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                            }
                        `}
                    >
                        Próximo
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!canProceed() || loading}
                        className={`
                            flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2
                            ${canProceed() && !loading
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                            }
                        `}
                    >
                        {loading ? (
                            'Enviando...'
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Confirmar Adesão
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
