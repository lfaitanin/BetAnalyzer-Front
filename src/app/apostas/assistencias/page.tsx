'use client';

import { useState } from 'react';
import { getBetHistory, BetHistory, BetHistoryFilters } from '@/services/api';
import BetsFilter from '@/components/BetsFilter';

export default function AssistenciasPage() {
  const [bets, setBets] = useState<BetHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBets = async (filters: BetHistoryFilters) => {
    try {
      setLoading(true);
      const history = await getBetHistory({ ...filters, category: 'Assists' });
      setBets(history);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar histórico de apostas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: BetHistoryFilters) => {
    loadBets(filters);
  };

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Apostas - Assistências</h1>
      
      <BetsFilter onFilterChange={handleFilterChange} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jogador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stake</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lucro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bets.map((bet) => (
              <tr key={bet.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.playerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.team}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.target}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.result}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.odds}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {bet.stake.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  bet.profit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  R$ {bet.profit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    bet.status === 'GREEN' ? 'bg-green-100 text-green-800' :
                    bet.status === 'RED' ? 'bg-red-100 text-red-800' :
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