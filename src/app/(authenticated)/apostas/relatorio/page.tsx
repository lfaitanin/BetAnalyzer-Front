'use client';

import { useState } from 'react';
import { getBetHistory, BetHistory, BetHistoryFilters } from '@/services/api';
import BetsFilter from '@/components/BetsFilter';

type SortField = 'total' | 'stakeTotal' | 'profitTotal' | 'wins' | 'categoria' | 'jogador';
type SortDirection = 'asc' | 'desc';

export default function RelatorioPage() {
  const [bets, setBets] = useState<BetHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [reportType, setReportType] = useState<'categoria' | 'jogador' | 'ranking'>('categoria');
  const [hasSearched, setHasSearched] = useState(false);
  const [sortField, setSortField] = useState<SortField>('total');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Lista de jogadores únicos para o autocomplete
  const uniquePlayers = Array.from(new Set(bets.map(bet => bet.playerName))).sort();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const loadBets = async (filters: BetHistoryFilters) => {
    try {
      setLoading(true);
      const data = await getBetHistory(filters);
      console.log('Dados recebidos:', data);
      setBets(data);
      setError(null);
      setHasSearched(true);
      // Atualiza o jogador selecionado com o valor do filtro de pesquisa
      if (filters.searchTerm) {
        setSelectedPlayer(filters.searchTerm);
      }
    } catch (err) {
      setError('Erro ao carregar relatório');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: BetHistoryFilters) => {
    loadBets(filters);
  };

  // Agrega apostas por categoria
  const aggregated = Object.values(
    bets.reduce((acc, bet) => {
      const categoria = String(bet.categoria);
      if (!acc[categoria]) {
        acc[categoria] = {
          categoria: categoria,
          total: 0,
          stakeTotal: 0,
          profitTotal: 0,
          wins: 0
        };
      }
      acc[categoria].total += 1;
      acc[categoria].stakeTotal += bet.stake;
      acc[categoria].profitTotal += bet.profit;
      if (bet.status === 'Ganhou') {
        acc[categoria].wins += 1;
      }
      return acc;
    }, {} as Record<string, { categoria: string; total: number; stakeTotal: number; profitTotal: number; wins: number }>)
  ).sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'categoria') {
      return multiplier * a.categoria.localeCompare(b.categoria);
    }
    if (sortField === 'jogador') {
      return 0; // Ignora ordenação por jogador na tabela de categorias
    }
    const aValue = Number(a[sortField as keyof typeof a]);
    const bValue = Number(b[sortField as keyof typeof b]);
    return multiplier * (aValue - bValue);
  });

  // Agrega apostas por jogador
  const playerAggregated = Object.values(
    bets
      .filter(bet => bet.playerName.toLowerCase().includes(selectedPlayer.toLowerCase()))
      .reduce((acc, bet) => {
        const categoria = String(bet.categoria);
        const key = `${bet.playerName}|${categoria}`;
        if (!acc[key]) {
          acc[key] = {
            categoria: categoria,
            jogador: bet.playerName,
            total: 0,
            stakeTotal: 0,
            profitTotal: 0,
            wins: 0
          };
        }
        acc[key].total += 1;
        acc[key].stakeTotal += bet.stake;
        acc[key].profitTotal += bet.profit;
        if (bet.status === 'Ganhou') {
          acc[key].wins += 1;
        }
        return acc;
      }, {} as Record<string, { categoria: string; jogador: string; total: number; stakeTotal: number; profitTotal: number; wins: number }>)
  ).sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'categoria') {
      return multiplier * a.categoria.localeCompare(b.categoria);
    }
    if (sortField === 'jogador') {
      return multiplier * a.jogador.localeCompare(b.jogador);
    }
    const aValue = Number(a[sortField as keyof typeof a]);
    const bValue = Number(b[sortField as keyof typeof b]);
    return multiplier * (aValue - bValue);
  });

  // Agrega apostas por jogador para o ranking geral
  const rankingAggregated = Object.values(
    bets.reduce((acc, bet) => {
      if (!acc[bet.playerName]) {
        acc[bet.playerName] = {
          jogador: bet.playerName,
          total: 0,
          wins: 0,
          stakeTotal: 0,
          profitTotal: 0
        };
      }
      acc[bet.playerName].total += 1;
      acc[bet.playerName].stakeTotal += bet.stake;
      acc[bet.playerName].profitTotal += bet.profit;
      if (bet.status === 'Ganhou') {
        acc[bet.playerName].wins += 1;
      }
      return acc;
    }, {} as Record<string, { jogador: string; total: number; wins: number; stakeTotal: number; profitTotal: number }>)
  ).sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'jogador') {
      return multiplier * a.jogador.localeCompare(b.jogador);
    }
    const aValue = Number(a[sortField as keyof typeof a]);
    const bValue = Number(b[sortField as keyof typeof b]);
    return multiplier * (aValue - bValue);
  });

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-6 bg-transparent">
      <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Relatório de Apostas de Basquete</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all ${reportType === 'categoria'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          onClick={() => setReportType('categoria')}
        >
          Por Categoria
        </button>
        <button
          className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all ${reportType === 'jogador'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          onClick={() => setReportType('jogador')}
        >
          Por Jogador
        </button>
        <button
          className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all ${reportType === 'ranking'
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          onClick={() => setReportType('ranking')}
        >
          Ranking Geral
        </button>
      </div>
      <BetsFilter onFilterChange={handleFilterChange} suggestions={uniquePlayers} />
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
          {error}
        </div>
      )}
      {!loading && !error && hasSearched && (
        <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
          <div className="overflow-x-auto">
            {reportType === 'categoria' && (
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-background">
                  <tr>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('categoria')}
                    >
                      Categoria {getSortIcon('categoria')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('total')}
                    >
                      Total {getSortIcon('total')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('stakeTotal')}
                    >
                      Stake {getSortIcon('stakeTotal')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('profitTotal')}
                    >
                      Lucro {getSortIcon('profitTotal')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('wins')}
                    >
                      Sucesso {getSortIcon('wins')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {aggregated.map((item, index) => {
                    const successRate = item.total > 0 ? ((item.wins / item.total) * 100).toFixed(2) + '%' : '0%';
                    return (
                      <tr key={index} className="hover:bg-muted/50 transition-colors">
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-foreground font-medium">{item.categoria}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{item.total}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">R$ {item.stakeTotal.toFixed(2)}</td>
                        <td className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-bold ${item.profitTotal >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          R$ {item.profitTotal.toFixed(2)}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{successRate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {reportType === 'jogador' && (
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-background">
                  <tr>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('jogador')}
                    >
                      Jogador {getSortIcon('jogador')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('categoria')}
                    >
                      Categoria {getSortIcon('categoria')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('total')}
                    >
                      Total {getSortIcon('total')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('stakeTotal')}
                    >
                      Stake {getSortIcon('stakeTotal')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('profitTotal')}
                    >
                      Lucro {getSortIcon('profitTotal')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('wins')}
                    >
                      Sucesso {getSortIcon('wins')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {playerAggregated.map((item, index) => {
                    const successRate = item.total > 0 ? ((item.wins / item.total) * 100).toFixed(2) + '%' : '0%';
                    return (
                      <tr key={index} className="hover:bg-muted/50 transition-colors">
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-foreground font-medium">{item.jogador}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{item.categoria}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{item.total}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">R$ {item.stakeTotal.toFixed(2)}</td>
                        <td className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-bold ${item.profitTotal >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          R$ {item.profitTotal.toFixed(2)}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{successRate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {reportType === 'ranking' && (
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-background">
                  <tr>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('jogador')}
                    >
                      Jogador {getSortIcon('jogador')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('total')}
                    >
                      Total {getSortIcon('total')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('wins')}
                    >
                      Acertos {getSortIcon('wins')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('wins')}
                    >
                      Sucesso {getSortIcon('wins')}
                    </th>
                    <th
                      className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('profitTotal')}
                    >
                      Lucro {getSortIcon('profitTotal')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rankingAggregated.map((item, index) => {
                    const successRate = item.total > 0 ? ((item.wins / item.total) * 100).toFixed(2) + '%' : '0%';
                    return (
                      <tr key={index} className="hover:bg-muted/50 transition-colors">
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-foreground font-medium">{item.jogador}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{item.total}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{item.wins}</td>
                        <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">{successRate}</td>
                        <td className={`px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-bold ${item.profitTotal >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          R$ {item.profitTotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {!hasSearched && !loading && (
        <div className="bg-card text-muted-foreground rounded-xl p-8 text-center border border-border">
          Clique em &quot;Filtrar&quot; para visualizar os resultados
        </div>
      )}
    </div>
  );
}