'use client';

import { useState } from 'react';
import { getBetHistory, BetHistory, BetHistoryFilters } from '@/services/api';
import BetsFilter from '@/components/BetsFilter';

export default function RebotesPage() {
  const [bets, setBets] = useState<BetHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBets = async (filters: BetHistoryFilters) => {
    try {
      setLoading(true);
      const data = await getBetHistory({
        ...filters,
        category: 'Rebounds'
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

  const handleFilterChange = (filters: BetHistoryFilters) => {
    loadBets(filters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-6 bg-transparent">
      <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Apostas em Rebotes</h1>

      <BetsFilter onFilterChange={handleFilterChange} />

      <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Data</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Jogador</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Meta</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Resultado</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Odds</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Stake</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Lucro</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bets.map((bet, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">
                    {bet.data ? new Date(bet.data).toLocaleDateString('pt-BR') : ''}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-foreground">{bet.playerName}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{bet.team}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{bet.target}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{bet.result}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-primary font-bold">{bet.odds}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">R$ {bet.stake}</td>
                  <td className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-bold ${bet.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    }`}>R$ {bet.profit}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full border ${bet.status === 'Ganhou'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
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