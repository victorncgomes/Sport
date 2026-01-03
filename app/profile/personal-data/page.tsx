'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Camera,
    Save,
    AlertCircle,
    CheckCircle2,
    Shield,
    CreditCard
} from 'lucide-react';

interface PersonalData {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    rg: string;
    birthDate: string;
    address: {
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    emergencyContact: {
        name: string;
        phone: string;
        relation: string;
    };
    swimLevel: string;
    canFlipBoat: boolean;
}

export default function PersonalDataPage() {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [data, setData] = useState<PersonalData>({
        fullName: 'João Silva Santos',
        email: 'joao.silva@email.com',
        phone: '(84) 99999-9999',
        cpf: '123.456.789-00',
        rg: '1234567',
        birthDate: '1990-05-15',
        address: {
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apto 45',
            neighborhood: 'Centro',
            city: 'Natal',
            state: 'RN',
            zipCode: '59000-000'
        },
        emergencyContact: {
            name: 'Maria Silva',
            phone: '(84) 98888-8888',
            relation: 'Mãe'
        },
        swimLevel: 'ADVANCED',
        canFlipBoat: true
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/user/profile');
                if (response.ok) {
                    const profileData = await response.json();
                    setData(profileData);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateField = (path: string, value: any) => {
        setData(prev => {
            const keys = path.split('.');
            const newData = { ...prev };
            let current: any = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newData;
        });
        setSaved(false);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setSaved(true);
            } else {
                console.error("Erro ao salvar dados");
            }
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-4 pb-24">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Dados Pessoais</h1>
                <p className="text-white/60 text-sm mt-1">
                    Mantenha seus dados atualizados
                </p>
            </div>

            {/* Avatar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-6"
            >
                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                        {data.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-gray-900">
                        <Camera className="w-4 h-4 text-white" />
                    </button>
                </div>
            </motion.div>

            {/* Campos */}
            <div className="space-y-6">
                {/* Dados Básicos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-blue-400" />
                        <h2 className="text-lg font-semibold text-white">Dados Básicos</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-1">Nome Completo</label>
                            <input
                                type="text"
                                value={data.fullName}
                                onChange={(e) => updateField('fullName', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-1">CPF</label>
                                <input
                                    type="text"
                                    value={data.cpf}
                                    onChange={(e) => updateField('cpf', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-white/70 text-sm mb-1">RG</label>
                                <input
                                    type="text"
                                    value={data.rg}
                                    onChange={(e) => updateField('rg', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1">Data de Nascimento</label>
                            <input
                                type="date"
                                value={data.birthDate}
                                onChange={(e) => updateField('birthDate', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Contato */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Phone className="w-5 h-5 text-green-400" />
                        <h2 className="text-lg font-semibold text-white">Contato</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-1">E-mail</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1">Telefone</label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Endereço */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-red-400" />
                        <h2 className="text-lg font-semibold text-white">Endereço</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-1">CEP</label>
                            <input
                                type="text"
                                value={data.address.zipCode}
                                onChange={(e) => updateField('address.zipCode', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-white/70 text-sm mb-1">Rua</label>
                                <input
                                    type="text"
                                    value={data.address.street}
                                    onChange={(e) => updateField('address.street', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-white/70 text-sm mb-1">Nº</label>
                                <input
                                    type="text"
                                    value={data.address.number}
                                    onChange={(e) => updateField('address.number', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1">Complemento</label>
                            <input
                                type="text"
                                value={data.address.complement}
                                onChange={(e) => updateField('address.complement', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-1">Bairro</label>
                                <input
                                    type="text"
                                    value={data.address.neighborhood}
                                    onChange={(e) => updateField('address.neighborhood', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-white/70 text-sm mb-1">Cidade</label>
                                <input
                                    type="text"
                                    value={data.address.city}
                                    onChange={(e) => updateField('address.city', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contato de Emergência */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-lg font-semibold text-white">Contato de Emergência</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-1">Nome</label>
                            <input
                                type="text"
                                value={data.emergencyContact.name}
                                onChange={(e) => updateField('emergencyContact.name', e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-1">Telefone</label>
                                <input
                                    type="tel"
                                    value={data.emergencyContact.phone}
                                    onChange={(e) => updateField('emergencyContact.phone', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-white/70 text-sm mb-1">Relação</label>
                                <input
                                    type="text"
                                    value={data.emergencyContact.relation}
                                    onChange={(e) => updateField('emergencyContact.relation', e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Botão Salvar */}
            <div className="fixed bottom-20 left-4 right-4">
                <button
                    onClick={handleSave}
                    disabled={loading || saved}
                    className={`
                        w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                        ${saved
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }
                        ${loading ? 'opacity-70' : ''}
                    `}
                >
                    {loading ? (
                        'Salvando...'
                    ) : saved ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Salvo com sucesso!
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Salvar Alterações
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
