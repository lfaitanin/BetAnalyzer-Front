'use client';

import { useEffect, useState } from 'react';
import { getBetHistory } from '@/services/api';
import { BetsFilter } from '@/components/BetsFilter';

interface Bet {
  data: string;
  playerName: string;
  time: string;
  meta: number;
  resultado: number;
  odds: number;
  stake: number;
  lucro: number;
  status: string;
}

export default function BolasDe3Page() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBets = async (filters: any) => {
    try {
      setLoading(true);
      const data = await getBetHistory({
        ...filters,
        category: 'ThreePointers'
      });
      setBets(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar histórico de apostas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBets({});
  }, []);

  const handleFilterChange = (filters: any) => {
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
    <div className="space-y-6 p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900">Apostas em Bolas de 3</h1>
      
      <BetsFilter onFilterChange={handleFilterChange} />
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
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
              {bets.map((bet, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(bet.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.playerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.meta}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.resultado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.odds}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {bet.stake}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {bet.lucro}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      bet.status === 'Ganhou' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
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
    </div>
  );
} 