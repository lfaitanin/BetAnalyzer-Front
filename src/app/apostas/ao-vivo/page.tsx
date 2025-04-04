'use client';

import { useEffect, useState } from 'react';
import { getLiveBets, LiveBet } from '@/services/api';

export default function LiveBetsPage() {
  const [bets, setBets] = useState<LiveBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLiveBets = async () => {
      try {
        const liveBets = await getLiveBets();
        setBets(liveBets);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar apostas em tempo real');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLiveBets();
    // Atualiza a cada 3 minutos
    const interval = setInterval(loadLiveBets, 180000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        {error}
      </div>
    );
  }
  // status: 'Meta Alcançada' | 'Meta Não Alcançada' | 'Risco' | 'Muito Provável' | 'Provável' | 'Possível';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Apostas em Tempo Real</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bets.map((bet, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bet.playerName}</h3>
                  <p className="text-sm text-gray-500">{bet.category}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  bet.status === 'Meta Alcançada' ? 'bg-green-100 text-green-800' :
                  bet.status === 'Meta Não Alcançada' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {bet.status}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Jogo</p>
                  <p className="text-sm font-medium text-gray-900">{bet.game}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Meta</p>
                    <p className="text-sm font-medium text-gray-900">Under {bet.target}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Atual</p>
                    <p className="text-sm font-medium text-gray-900">{bet.currentValue}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Progresso</p>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${bet.completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{bet.completionPercentage.toFixed(1)}%</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tempo Restante</p>
                    <p className="text-sm font-medium text-gray-900">{bet.remainingMinutes} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ritmo Necessário</p>
                    <p className="text-sm font-medium text-gray-900">{bet.requiredPacePerMinute.toFixed(2)}/min</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Odds</p>
                    <p className="text-sm font-medium text-gray-900">{bet.odds}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lucro Potencial</p>
                    <p className="text-sm font-medium text-green-600">R$ {bet.potentialProfit.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma aposta em tempo real no momento.</p>
        </div>
      )}
    </div>
  );
} 