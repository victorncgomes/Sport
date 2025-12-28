'use client';

import React, { useState } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ParsedTideData {
    date: string;
    highTide1Time?: string;
    highTide1Height?: number;
    lowTide1Time?: string;
    lowTide1Height?: number;
    highTide2Time?: string;
    highTide2Height?: number;
    lowTide2Time?: string;
    lowTide2Height?: number;
}

export default function TideUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'parsing' | 'preview' | 'uploading' | 'success' | 'error'>('idle');
    const [previewData, setPreviewData] = useState<ParsedTideData[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setPreviewData([]);
        }
    };

    const parseCSV = async () => {
        if (!file) return;

        setStatus('parsing');
        setErrorMessage('');

        try {
            const text = await file.text();
            const lines = text.trim().split('\n');

            // Skip header
            const dataLines = lines.slice(1);
            const parsed: ParsedTideData[] = [];

            for (const line of dataLines) {
                const cols = line.split(',').map(s => s.trim());

                if (cols.length < 9) continue;

                parsed.push({
                    date: cols[0],
                    highTide1Time: cols[1] || undefined,
                    highTide1Height: cols[2] ? parseFloat(cols[2]) : undefined,
                    lowTide1Time: cols[3] || undefined,
                    lowTide1Height: cols[4] ? parseFloat(cols[4]) : undefined,
                    highTide2Time: cols[5] || undefined,
                    highTide2Height: cols[6] ? parseFloat(cols[6]) : undefined,
                    lowTide2Time: cols[7] || undefined,
                    lowTide2Height: cols[8] ? parseFloat(cols[8]) : undefined,
                });
            }

            setPreviewData(parsed);
            setStatus('preview');
        } catch (error) {
            setErrorMessage('Erro ao processar arquivo CSV. Verifique o formato.');
            setStatus('error');
        }
    };

    const uploadData = async () => {
        setStatus('uploading');

        try {
            const response = await fetch('/api/tides/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: previewData })
            });

            if (!response.ok) throw new Error('Erro ao salvar dados');

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setFile(null);
                setPreviewData([]);
            }, 3000);
        } catch (error) {
            setErrorMessage('Erro ao salvar dados no banco.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-black pt-28 pb-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                Upload Dados de Marés
                            </span>
                        </h1>
                        <p className="text-gray-400">
                            Faça upload do arquivo CSV com dados da Marinha do Brasil
                        </p>
                    </div>

                    {/* Instructions */}
                    <AnimatedCard variant="glass" className="mb-8">
                        <h3 className="font-display text-xl text-white mb-4">Formato do Arquivo CSV</h3>
                        <div className="space-y-2 text-sm text-gray-400">
                            <p>O arquivo deve ter o seguinte formato (com header):</p>
                            <code className="block p-3 bg-black/50 rounded-lg text-xs font-mono text-cyan-400">
                                data,alta1_hora,alta1_altura,baixa1_hora,baixa1_altura,alta2_hora,alta2_altura,baixa2_hora,baixa2_altura
                                <br />
                                01/01/2026,05:00,2.4,11:00,0.3,17:00,2.6,23:00,0.2
                            </code>
                            <ul className="list-disc list-inside space-y-1 mt-3">
                                <li>Data no formato DD/MM/YYYY</li>
                                <li>Horários no formato HH:mm</li>
                                <li>Alturas em metros (usar ponto decimal)</li>
                                <li>Campos vazios são permitidos</li>
                            </ul>
                        </div>
                    </AnimatedCard>

                    {/* Upload Area */}
                    <AnimatedCard variant="carbon" className="mb-8">
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="hidden"
                                id="csv-upload"
                            />
                            <label htmlFor="csv-upload" className="cursor-pointer">
                                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-white font-semibold mb-2">
                                    {file ? file.name : 'Clique para selecionar arquivo CSV'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Ou arraste o arquivo aqui
                                </p>
                            </label>
                        </div>

                        {file && status === 'idle' && (
                            <div className="mt-6 text-center">
                                <Button
                                    onClick={parseCSV}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <FileText className="h-5 w-5 mr-2" />
                                    Processar Arquivo
                                </Button>
                            </div>
                        )}
                    </AnimatedCard>

                    {/* Status Messages */}
                    <AnimatePresence mode="wait">
                        {status === 'parsing' && (
                            <motion.div
                                key="parsing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <AnimatedCard variant="glass" className="text-center">
                                    <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                                    <p className="text-white">Processando arquivo...</p>
                                </AnimatedCard>
                            </motion.div>
                        )}

                        {status === 'preview' && previewData.length > 0 && (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <AnimatedCard variant="gradient">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-display text-xl text-white">
                                            Preview dos Dados ({previewData.length} dias)
                                        </h3>
                                        <Button
                                            onClick={uploadData}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Confirmar e Salvar
                                        </Button>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="sticky top-0 bg-black/80">
                                                <tr className="text-gray-400 border-b border-white/10">
                                                    <th className="p-2 text-left">Data</th>
                                                    <th className="p-2">Alta 1</th>
                                                    <th className="p-2">Baixa 1</th>
                                                    <th className="p-2">Alta 2</th>
                                                    <th className="p-2">Baixa 2</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewData.slice(0, 50).map((row, idx) => (
                                                    <tr key={idx} className="border-b border-white/5 text-white">
                                                        <td className="p-2 font-mono text-gray-400">{row.date}</td>
                                                        <td className="p-2 text-center">
                                                            {row.highTide1Time && (
                                                                <>
                                                                    <div className="font-mono text-blue-400">{row.highTide1Time}</div>
                                                                    <div className="text-xs text-gray-500">{row.highTide1Height}m</div>
                                                                </>
                                                            )}
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            {row.lowTide1Time && (
                                                                <>
                                                                    <div className="font-mono text-orange-400">{row.lowTide1Time}</div>
                                                                    <div className="text-xs text-gray-500">{row.lowTide1Height}m</div>
                                                                </>
                                                            )}
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            {row.highTide2Time && (
                                                                <>
                                                                    <div className="font-mono text-blue-400">{row.highTide2Time}</div>
                                                                    <div className="text-xs text-gray-500">{row.highTide2Height}m</div>
                                                                </>
                                                            )}
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            {row.lowTide2Time && (
                                                                <>
                                                                    <div className="font-mono text-orange-400">{row.lowTide2Time}</div>
                                                                    <div className="text-xs text-gray-500">{row.lowTide2Height}m</div>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {previewData.length > 50 && (
                                            <p className="text-center text-gray-500 text-sm mt-4">
                                                Mostrando 50 de {previewData.length} linhas
                                            </p>
                                        )}
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        )}

                        {status === 'uploading' && (
                            <motion.div
                                key="uploading"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <AnimatedCard variant="glass" className="text-center">
                                    <Loader2 className="h-12 w-12 text-green-500 mx-auto mb-4 animate-spin" />
                                    <p className="text-white">Salvando dados no banco...</p>
                                </AnimatedCard>
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <AnimatedCard variant="gradient" className="text-center">
                                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                                    <h3 className="font-display text-2xl text-white mb-2">
                                        Dados salvos com sucesso!
                                    </h3>
                                    <p className="text-white/80">
                                        {previewData.length} dias de dados de marés foram adicionados ao sistema.
                                    </p>
                                </AnimatedCard>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <AnimatedCard variant="gradient" className="border-2 border-red-500/30">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="h-12 w-12 text-red-400 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-display text-xl text-white mb-2">Erro</h3>
                                            <p className="text-red-400">{errorMessage}</p>
                                            <Button
                                                onClick={() => setStatus('idle')}
                                                variant="outline"
                                                className="mt-4"
                                            >
                                                Tentar Novamente
                                            </Button>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
