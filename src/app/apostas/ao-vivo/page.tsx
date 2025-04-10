'use client';

import { useEffect, useState } from 'react';
import { getLiveBets, LiveBet } from '@/services/api';
import AddBetModal from '@/components/AddBetModal';
import { useAuth } from '@/contexts/AuthContext';

export default function LiveBetsPage() {
  const { user } = useAuth();
  const [bets, setBets] = useState<LiveBet[]>([]);
  const [filteredBets, setFilteredBets] = useState<LiveBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBet, setSelectedBet] = useState<LiveBet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'marked'>('all');
  const [sortBy, setSortBy] = useState<'probability' | 'time'>('probability');

  useEffect(() => {
    const loadLiveBets = async () => {
      try {
        const liveBets = await getLiveBets(user?.id);
        console.log(user?.id)
        setBets(liveBets);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar apostas em tempo real!');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLiveBets();
    // Atualiza a cada 3 minutos
    const interval = setInterval(loadLiveBets, 180000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Efeito para filtrar e ordenar as apostas
  useEffect(() => {
    let result = [...bets];
    
    // Aplicar filtro
    if (filter === 'marked' && user) {
      result = result.filter(bet => bet.check === true);
    }
    
    // Aplicar ordenação
    if (sortBy === 'probability') {
      // Ordenar por probabilidade (status)
      const probabilityOrder = {
        'Muito Provável': 1,
        'Provável': 2,
        'Possível': 3,
        'Risco': 4,
        'Improvável': 5,
        'Meta Alcançada': 6,
        'Meta Não Alcançada': 7
      };
      
      result.sort((a, b) => {
        const orderA = probabilityOrder[a.status] || 999;
        const orderB = probabilityOrder[b.status] || 999;
        return orderA - orderB;
      });
    } else if (sortBy === 'time') {
      // Ordenar por tempo restante (menor para maior)
      result.sort((a, b) => a.remainingMinutes - b.remainingMinutes);
    }
    
    setFilteredBets(result);
  }, [bets, filter, sortBy, user]);

  const handleAddBet = (bet: LiveBet) => {
    setSelectedBet(bet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBet(null);
  };

  const handleFilterChange = (newFilter: 'all' | 'marked') => {
    setFilter(newFilter);
  };

  const handleSortChange = (newSort: 'probability' | 'time') => {
    setSortBy(newSort);
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
  // status: 'Meta Alcançada' | 'Meta Não Alcançada' | 'Risco' | 'Muito Provável' | 'Provável' | 'Possível';

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Apostas em Tempo Real</h1>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filtrar:</span>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => handleFilterChange('marked')}
                className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                  filter === 'marked'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                disabled={!user}
              >
                Minhas Apostas
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => handleSortChange('probability')}
                className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                  sortBy === 'probability'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Probabilidade
              </button>
              <button
                onClick={() => handleSortChange('time')}
                className={`px-3 py-1 text-sm font-medium rounded-r-md ${
                  sortBy === 'time'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Tempo Restante
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBets.map((bet, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bet.playerName}</h3>
                  <p className="text-sm text-gray-500">{bet.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    bet.status === 'Meta Alcançada' ? 'bg-green-100 text-green-800' :
                    bet.status === 'Meta Não Alcançada' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bet.status}
                  </span>
                  {user && (
                    bet.check ? (
                      <div className="p-1 rounded-full bg-green-100 text-green-600" title="Aposta já adicionada">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddBet(bet)}
                        className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                        title="Adicionar à minha carteira"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Jogo</p>
                  <p className="text-sm font-medium text-gray-900">{bet.game}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Meta</p>
                    <p className="text-sm font-medium text-gray-900">{bet.BetType} {bet.target}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Atual</p>
                    <p className="text-sm font-medium text-gray-900">{bet.currentValue}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Progresso</p>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${bet.completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{bet.completionPercentage.toFixed(1)}%</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tempo Restante</p>
                    <p className="text-sm font-medium text-gray-900">{bet.remainingMinutes} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ritmo Necessário</p>
                    <p className="text-sm font-medium text-gray-900">{bet.requiredPacePerMinute.toFixed(2)}/min</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Odds</p>
                    <p className="text-sm font-medium text-gray-900">{bet.odds}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lucro Potencial</p>
                    <p className="text-sm font-medium text-green-600">R$ {bet.potentialProfit.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {filter === 'marked' 
              ? 'Você ainda não adicionou nenhuma aposta.' 
              : 'Nenhuma aposta em tempo real no momento.'}
          </p>
        </div>
      )}

      {selectedBet && (
        <AddBetModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          bet={{
            betId: selectedBet.betId,
            playerName: selectedBet.playerName,
            category: selectedBet.category,
            target: selectedBet.target
          }} 
        />
      )}
    </div>
  );
} 