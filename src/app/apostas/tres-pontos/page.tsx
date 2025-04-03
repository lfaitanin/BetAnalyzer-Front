'use client';

import { useState } from 'react';
import { BetsFilter } from '@/components/BetsFilter';

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
  date: string;
}

export default function TresPontosPage() {
  const [filteredBets, setFilteredBets] = useState<Bet[]>([
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
      date: '2024-04-01'
    },
  ]);

  const handleFilterChange = (filters: any) => {
    console.log('Filtros aplicados:', filters);
  };

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
              {filteredBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.player}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.team}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.result}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bet.odds}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {bet.stake}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {bet.profit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      bet.status === 'win' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {bet.status === 'win' ? 'Ganhou' : 'Perdeu'}
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