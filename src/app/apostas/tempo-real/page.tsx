'use client';

import { useEffect, useState } from 'react';
import { getLiveBets, LiveBet } from '@/services/api';

export default function TempoRealPage() {
  const [bets, setBets] = useState<LiveBet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBets = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    loadBets();
    const interval = setInterval(loadBets, 180000); // Atualiza a cada 3 minutos
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Apostas em Tempo Real</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jogador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Under</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ritmo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stake</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bets.map((bet) => (
              <tr key={bet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.playerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.team}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.target}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.currentValue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.remainingValue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.remainingMinutes}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.requiredPacePerMinute.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.completionPercentage.toFixed(1)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.odds}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {bet.stake.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  bet.potentialProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  R$ {bet.potentialProfit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    bet.status === 'Meta Alcançada' ? 'bg-green-100 text-green-800' :
                    bet.status === 'Meta Não Alcançada' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bet.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 