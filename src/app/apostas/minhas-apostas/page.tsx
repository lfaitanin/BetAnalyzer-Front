'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { BetHistory as BaseBetHistory, api } from '@/services/api';

type BetStatus = 'win' | 'loss' | 'pending';
type ApiStatus = 'Ganhou' | 'Perdeu' | 'Pendente';

interface BetHistory extends Omit<BaseBetHistory, 'status'> {
  status: BetStatus;
}

const mapApiStatus = (status: ApiStatus): BetStatus => {
  switch (status) {
    case 'Ganhou':
      return 'win';
    case 'Perdeu':
      return 'loss';
    case 'Pendente':
      return 'pending';
  }
};

export default function MinhasApostasPage() {
  const { user } = useAuth();
  const [bets, setBets] = useState<BetHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<BetStatus>('pending');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    successRate: 0,
    totalProfit: 0
  });

  useEffect(() => {
    const fetchBets = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await api.getUserBets(user.id);
        const mappedBets: BetHistory[] = response.bets.map(bet => ({
          ...bet,
          status: mapApiStatus(bet.status as ApiStatus)
        }));
        setBets(mappedBets);
        setStats({
          total: response.total,
          successRate: response.successRate,
          totalProfit: response.totalProfit
        });
      } catch (error) {
        console.error('Erro ao carregar apostas:', error);
        toast.error('Erro ao carregar histórico de apostas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBets();
  }, [user]);

  const filteredBets = bets.filter(bet => {
    // Filtrar por resultado
    if (filter !== bet.status) {
      return false;
    }

    // Filtrar por data
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
          <h3 className="text-xs sm:text-sm text-gray-500">Total de Apostas</h3>
          <p className="text-lg sm:text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm text-gray-500">Taxa de Acerto</h3>
          <p className="text-lg sm:text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
          <h3 className="text-xs sm:text-sm text-gray-500">Lucro Total</h3>
          <p className={`text-lg sm:text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(stats.totalProfit)}
          </p>
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
        </div>
      </div>

      {/* Lista de Apostas - Versão Mobile (Cards) */}
      <div className="block sm:hidden space-y-3">
        {filteredBets.map((bet) => (
          <div key={bet.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm font-medium text-gray-900">{bet.team}</div>
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
                <p className="text-gray-500">Tipo</p>
                <p className="font-medium">{bet.categoria}</p>
              </div>
              <div>
                <p className="text-gray-500">Valor</p>
                <p className="font-medium">{bet.target}</p>
              </div>
              <div>
                <p className="text-gray-500">Stake</p>
                <p className="font-medium">{formatCurrency(bet.stake)}</p>
              </div>
              <div>
                <p className="text-gray-500">Odds</p>
                <p className="font-medium">{bet.odds}</p>
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
                  Jogo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
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
                <tr key={bet.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {bet.team}  
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(bet.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bet.categoria}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bet.target}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(bet.stake)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bet.odds}</div>
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