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
        if (!acc[categoria]) {
          acc[categoria] = {
            categoria: categoria,
            jogador: bet.playerName,
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
    <div className="space-y-4 md:space-y-6 p-2 md:p-6 bg-gray-50">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Relatório de Apostas de Basquete</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 md:px-4 py-2 rounded text-sm ${reportType === 'categoria' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setReportType('categoria')}
        >
          Por Categoria
        </button>
        <button
          className={`px-3 md:px-4 py-2 rounded text-sm ${reportType === 'jogador' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setReportType('jogador')}
        >
          Por Jogador
        </button>
        <button
          className={`px-3 md:px-4 py-2 rounded text-sm ${reportType === 'ranking' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setReportType('ranking')}
        >
          Ranking Geral
        </button>
      </div>
      <BetsFilter onFilterChange={handleFilterChange} suggestions={uniquePlayers} />
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      )}
      {!loading && !error && hasSearched && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {reportType === 'categoria' && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('categoria')}
                    >
                      Categoria {getSortIcon('categoria')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('total')}
                    >
                      Total de Apostas {getSortIcon('total')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('stakeTotal')}
                    >
                      Stake Total {getSortIcon('stakeTotal')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('profitTotal')}
                    >
                      Lucro Total {getSortIcon('profitTotal')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('wins')}
                    >
                      Taxa de Sucesso {getSortIcon('wins')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {aggregated.map((item, index) => {
                    const successRate = item.total > 0 ? ((item.wins / item.total) * 100).toFixed(2) + '%' : '0%';
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{item.categoria}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{item.total}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">R$ {item.stakeTotal.toFixed(2)}</td>
                        <td className={`px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm ${item.profitTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {item.profitTotal.toFixed(2)}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{successRate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {reportType === 'jogador' && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('jogador')}
                    >
                      Jogador {getSortIcon('jogador')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('categoria')}
                    >
                      Categoria {getSortIcon('categoria')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('total')}
                    >
                      Total de Apostas {getSortIcon('total')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('stakeTotal')}
                    >
                      Stake Total {getSortIcon('stakeTotal')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('profitTotal')}
                    >
                      Lucro Total {getSortIcon('profitTotal')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('wins')}
                    >
                      Taxa de Sucesso {getSortIcon('wins')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {playerAggregated.map((item, index) => {
                    const successRate = item.total > 0 ? ((item.wins / item.total) * 100).toFixed(2) + '%' : '0%';
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{item.jogador}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{item.categoria}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{item.total}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">R$ {item.stakeTotal.toFixed(2)}</td>
                        <td className={`px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm ${item.profitTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {item.profitTotal.toFixed(2)}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{successRate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {reportType === 'ranking' && (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('jogador')}
                    >
                      Jogador {getSortIcon('jogador')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('total')}
                    >
                      Total {getSortIcon('total')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('wins')}
                    >
                      Acertos {getSortIcon('wins')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('wins')}
                    >
                      Sucesso {getSortIcon('wins')}
                    </th>
                    <th 
                      className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('profitTotal')}
                    >
                      Lucro {getSortIcon('profitTotal')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rankingAggregated.map((item, index) => {
                    const successRate = item.total > 0 ? ((item.wins / item.total) * 100).toFixed(2) + '%' : '0%';
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{item.jogador}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{item.total}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{item.wins}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{successRate}</td>
                        <td className={`px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm ${item.profitTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
        <div className="text-center p-8 text-gray-600">
          Clique em &quot;Pesquisar&quot; para visualizar os resultados
        </div>
      )}
    </div>
  );
} 