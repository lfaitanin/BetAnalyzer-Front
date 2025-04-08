'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { api, UserBetData, UserReport } from '@/services/api';

type BetStatus = 'win' | 'loss' | 'pending';
type ApiStatus = 'Ganhou' | 'Perdeu' | 'Pendente' | 'Aberta';

const mapApiStatus = (status: ApiStatus): BetStatus => {
  switch (status) {
    case 'Ganhou':
      return 'win';
    case 'Perdeu':
      return 'loss';
    case 'Pendente':
    case 'Aberta':
      return 'pending';
  }
};

export default function MinhasApostasPage() {
  const { user } = useAuth();
  const [bets, setBets] = useState<UserBetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState<BetStatus>('pending');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [stats, setStats] = useState<UserReport>({
    percAcerto: 0,
    totalProfit: 0,
    totalUnits: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const [betsResponse, statsResponse] = await Promise.all([
          api.getUserBets(user.id),
          api.getUserStats(user.id)
        ]);

        const mappedBets: UserBetData[] = betsResponse.bets.map(bet => ({
          userId: user.id,
          betId: bet.id,
          betTitle: bet.team,
          odd: bet.odds,
          stake: bet.stake,
          meta: bet.target,
          date: bet.date,
          status: mapApiStatus(bet.status as ApiStatus)
        }));

        setBets(mappedBets);
        setStats(statsResponse);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSearch = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para pesquisar apostas');
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error('Por favor, selecione um período de datas');
      return;
    }

    try {
      setIsSearching(true);
      const bets = await api.getUserBetsByDateRange(user.id, dateRange.startDate, dateRange.endDate);
      const mappedBets = bets.map(bet => ({
        ...bet,
        status: mapApiStatus(bet.status as ApiStatus)
      }));
      setBets(mappedBets);
      
      if (mappedBets.length === 0) {
        toast.success('Nenhuma aposta encontrada para o período selecionado');
      } else {
        toast.success(`${mappedBets.length} apostas encontradas`);
      }
    } catch (error) {
      console.error('Erro ao buscar apostas:', error);
      toast.error('Erro ao buscar apostas. Tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const filteredBets = bets.filter(bet => {
    if (filter !== bet.status) {
      return false;
    }

    if (dateRange.startDate && dateRange.endDate) {
      const betDate = new Date(bet.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999);

      if (betDate < startDate || betDate > endDate) {
        return false;
      }
    }

    return true;
  });

  const getResultColor = (result: BetStatus) => {
    switch (result) {
      case 'win':
        return 'text-green-600';
      case 'loss':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getResultText = (result: BetStatus): string => {
    switch (result) {
      case 'win':
        return 'Ganhou';
      case 'loss':
        return 'Perdeu';
      case 'pending':
        return 'Pendente';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Minhas Apostas</h1>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm text-gray-500">Taxa de Acerto</h3>
          <p className="text-lg sm:text-2xl font-bold">{stats.percAcerto.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm text-gray-500">Lucro Total</h3>
          <p className={`text-lg sm:text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.totalProfit)}
          </p>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm text-gray-500">Unidades</h3>
          <p className="text-lg sm:text-2xl font-bold">{stats.totalUnits.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6">
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Filtrar por Resultado
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as BetStatus)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            >
              <option value="pending">Pendentes</option>
              <option value="win">Ganhas</option>
              <option value="loss">Perdidas</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Filtrar por Data
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Pesquisando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Pesquisar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Apostas - Versão Mobile (Cards) */}
      <div className="block sm:hidden space-y-3">
        {filteredBets.map((bet) => (
          <div key={bet.betId} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-medium text-gray-900">{bet.betTitle}</div>
              <span className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${getResultColor(bet.status)}`}>
                {getResultText(bet.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Data</p>
                <p className="font-medium">{formatDate(bet.date)}</p>
              </div>
              <div>
                <p className="text-gray-500">Meta</p>
                <p className="font-medium">{bet.meta}</p>
              </div>
              <div>
                <p className="text-gray-500">Stake</p>
                <p className="font-medium">{formatCurrency(bet.stake)}</p>
              </div>
              <div>
                <p className="text-gray-500">Odds</p>
                <p className="font-medium">{bet.odd}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de Apostas - Versão Desktop (Tabela) */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aposta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stake
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Odds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resultado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBets.map((bet) => (
                <tr key={bet.betId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {bet.betTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(bet.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bet.meta}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(bet.stake)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bet.odd}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getResultColor(bet.status)}`}>
                      {getResultText(bet.status)}
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