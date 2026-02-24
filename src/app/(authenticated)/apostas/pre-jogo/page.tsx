'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function PreGamePage() {
    const { t } = useTranslation();

    const [playerId, setPlayerId] = useState<string>('');
    const [oppCode, setOppCode] = useState<string>('');
    const [stat, setStat] = useState<'pts' | 'reb' | 'ast'>('pts');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ prob: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Em produção, isso iria para um endpoint no Next.js (BFF) ou direto pro FastAPI, dependendo da arquitetura
            // Presumindo um proxy ou rota do FastAPI em http://localhost:8000
            const response = await fetch('http://localhost:8000/predict_pre_game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player_id: parseInt(playerId),
                    opp_code: oppCode.toUpperCase(),
                    stat: stat
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Erro ao buscar previsão');
            }

            const data = await response.json();
            setResult({ prob: data.prob_over * 100 });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-20 p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-6">
                Oracle Pré-Jogo 🔮
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Predictor Form */}
                <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm space-y-4">
                    <p className="text-muted-foreground text-sm mb-4">
                        Consulte o modelo de Machine Learning (XGBoost) para a probabilidade de um jogador bater a linha (Over) no próximo jogo, baseado na matriz de dados pré-jogo.
                    </p>

                    <form onSubmit={handlePredict} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Player ID (NBA)</label>
                            <input
                                type="number"
                                required
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="Ex: 2544"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Time Adversário (Tricode)</label>
                            <input
                                type="text"
                                required
                                maxLength={3}
                                value={oppCode}
                                onChange={(e) => setOppCode(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
                                placeholder="Ex: LAL, BOS"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Estatística</label>
                            <select
                                value={stat}
                                onChange={(e) => setStat(e.target.value as any)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                            >
                                <option value="pts">Pontos (PTS)</option>
                                <option value="reb">Rebotes (REB)</option>
                                <option value="ast">Assistências (AST)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${loading
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25'
                                }`}
                        >
                            {loading ? (
                                <span className="material-icons animate-spin text-sm">refresh</span>
                            ) : (
                                <span className="material-icons text-sm">online_prediction</span>
                            )}
                            {loading ? 'Calculando...' : 'Gerar Probabilidade'}
                        </button>
                    </form>
                </div>

                {/* Result Section */}
                <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center min-h-[300px]">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                            <span className="material-icons text-red-500 text-4xl mb-2">error_outline</span>
                            <p className="text-red-500 font-bold">Erro na Consulta</p>
                            <p className="text-red-500/70 text-sm mt-1">{error}</p>
                        </div>
                    )}

                    {!error && !result && !loading && (
                        <div className="text-center text-muted-foreground">
                            <span className="material-icons text-6xl mb-4 opacity-50">analytics</span>
                            <p>Preencha os dados e consulte o oráculo para ver a probabilidade.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-primary animate-pulse font-bold">Invocando Algoritmos...</p>
                        </div>
                    )}

                    {result && !loading && !error && (
                        <div className="text-center">
                            <h3 className="text-muted-foreground font-medium mb-2">Probabilidade de Over</h3>
                            <div className="flex items-end justify-center gap-1 mb-4">
                                <span className={`text-6xl font-black tracking-tighter ${result.prob >= 60 ? 'text-emerald-500 dark:text-emerald-400' :
                                    result.prob <= 40 ? 'text-red-500 dark:text-red-400' :
                                        'text-yellow-500 dark:text-yellow-400'
                                    }`}>
                                    {result.prob.toFixed(1)}
                                </span>
                                <span className="text-2xl text-muted-foreground font-bold mb-1">%</span>
                            </div>

                            <div className="w-full bg-border rounded-full h-4 mb-4 overflow-hidden outline outline-1 outline-border">
                                <div
                                    className={`h-4 rounded-full transition-all duration-1000 ${result.prob >= 60 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                        result.prob <= 40 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                            'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                                        }`}
                                    style={{ width: `${result.prob}%` }}
                                ></div>
                            </div>

                            <p className="text-sm text-foreground bg-background p-3 rounded-lg border border-border mt-4">
                                {result.prob >= 60 ? '🔥 Alta confiança para o Over. O modelo encontrou padrões favoráveis no matchup e no histórico recente.' :
                                    result.prob <= 40 ? '🧊 Sinal frio para o Over. Sugere-se analisar a linha de Under.' :
                                        '⚠️ Terreno incerto. O modelo não tem convicção forte (coin flip). Cuidado com a aposta.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
