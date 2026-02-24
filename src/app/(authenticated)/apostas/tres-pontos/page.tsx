'use client';

import { useState } from 'react';
import BetsFilter from '@/components/BetsFilter';
import { BetHistoryFilters } from '@/services/api';

interface Bet {
  id: string;
  player: string;
  team: string;
  target: number;
  result: number;
  odds: number;
  stake: number;
  profit: number;
  status: 'win' | 'loss';
  data: string;
}

export default function TresPontosPage() {
  const [filteredBets] = useState<Bet[]>([
    {
      id: '1',
      player: 'Stephen Curry',
      team: 'Warriors',
      target: 4.5,
      result: 6,
      odds: 1.90,
      stake: 100,
      profit: 90,
      status: 'win',
      data: '2024-04-01'
    },
  ]);

  const handleFilterChange = (filters: BetHistoryFilters) => {
    console.log('Filtros aplicados:', filters);
  };

  return (
    <div className="space-y-6 p-6 bg-transparent">
      <h1 className="text-2xl font-black text-white uppercase tracking-tight">Apostas em Bolas de 3</h1>

      <BetsFilter onFilterChange={handleFilterChange} />

      <div className="glass rounded-xl shadow-md overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Jogador</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Meta</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Resultado</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Odds</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Stake</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Lucro</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{bet.data ? new Date(bet.data).toLocaleDateString('pt-BR') : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{bet.player}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{bet.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{bet.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{bet.result}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neon-purple font-bold">{bet.odds}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">R$ {bet.stake}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${bet.profit >= 0 ? 'text-neon-green' : 'text-rose-500'}`}>R$ {bet.profit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${bet.status === 'win'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                      {bet.status === 'win' ? 'GREEN' : 'RED'}
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