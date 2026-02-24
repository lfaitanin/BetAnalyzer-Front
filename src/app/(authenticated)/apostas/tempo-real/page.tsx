'use client';

import { useEffect, useState } from 'react';
import { getLiveBets, pickBet, LiveBet } from '@/services/api';

export default function TempoRealPage() {
  const [bets, setBets] = useState<LiveBet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterGame, setFilterGame] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  // Pick bet modal
  const [pickingBet, setPickingBet] = useState<LiveBet | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [pickLoading, setPickLoading] = useState(false);

  const loadBets = async () => {
    try {
      setLoading(true);
      const liveBets = await getLiveBets();
      setBets(liveBets);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar apostas em tempo real');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBets();
    const interval = setInterval(loadBets, 180000);
    return () => clearInterval(interval);
  }, []);

  // Get unique values for filter dropdowns
  const uniqueGames = [...new Set(bets.map(b => b.game))];
  const uniqueCategories = [...new Set(bets.map(b => b.category))];
  const uniqueStatuses = [...new Set(bets.map(b => b.status))];

  // Apply filters
  const filteredBets = bets.filter(bet => {
    if (filterGame && bet.game !== filterGame) return false;
    if (filterCategory && bet.category !== filterCategory) return false;
    if (filterStatus && bet.status !== filterStatus) return false;
    if (filterSearch && !bet.playerName.toLowerCase().includes(filterSearch.toLowerCase())) return false;
    return true;
  });

  const handlePickBet = async () => {
    if (!pickingBet || !stakeAmount) return;
    try {
      setPickLoading(true);
      await pickBet(pickingBet.betId, parseFloat(stakeAmount));
      // Update local state
      setBets(prev => prev.map(b =>
        b.betId === pickingBet.betId
          ? { ...b, picked: true, userStake: parseFloat(stakeAmount) }
          : b
      ));
      setPickingBet(null);
      setStakeAmount('');
    } catch (err) {
      console.error('Erro ao pegar aposta:', err);
    } finally {
      setPickLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterGame('');
    setFilterCategory('');
    setFilterStatus('');
    setFilterSearch('');
  };

  const hasActiveFilters = filterGame || filterCategory || filterStatus || filterSearch;

  if (loading && bets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error && bets.length === 0) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-6 bg-transparent">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-black text-white tracking-tight">Apostas em Tempo Real</h1>
        <button
          onClick={loadBets}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          Atualizar
        </button>
      </div>

      {/* Filters */}
      <div className="glass p-3 md:p-4 rounded-xl shadow-lg border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">Jogador:</label>
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full md:w-48 bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">Jogo:</label>
            <select
              value={filterGame}
              onChange={(e) => setFilterGame(e.target.value)}
              className="w-full md:w-auto bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Todos</option>
              {uniqueGames.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">Categoria:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-auto bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Todas</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Todos</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg transition-all"
            >
              ✕ Limpar
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-2 text-xs text-gray-500">
            Mostrando {filteredBets.length} de {bets.length} sinais
          </div>
        )}
      </div>

      {/* Table */}
      <div className="glass rounded-xl shadow-lg overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Jogo</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Jogador</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Linha</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Atual</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">%</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Odds</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBets.map((bet) => (
                <tr key={bet.id || bet.betId} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-xs text-gray-400">{bet.game}</td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-xs md:text-sm font-medium text-white">{bet.playerName}</td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${bet.category === 'Points' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        bet.category === 'Rebounds' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          bet.category === 'Assists' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                      {bet.category}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${bet.betType === 'Over'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                      }`}>
                      {bet.betType} {bet.target}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-xs text-gray-300">{bet.target}</td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-xs md:text-sm text-white font-bold">{bet.currentValue}</td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-xs text-gray-300">{bet.completionPercentage?.toFixed(1) ?? 0}%</td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-xs md:text-sm text-neon-purple font-bold">{bet.odds}</td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full border ${bet.status === 'Meta Alcançada' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        bet.status === 'Meta Não Alcançada' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                      {bet.status}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                    {bet.picked ? (
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          ✅ R$ {bet.userStake?.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Lucro: R$ {((bet.odds * bet.userStake) - bet.userStake).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setPickingBet(bet); setStakeAmount(''); }}
                        className="px-3 py-1.5 text-xs font-medium bg-purple-600/80 hover:bg-purple-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        🎯 Pegar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBets.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    {bets.length === 0 ? 'Nenhum sinal ativo no momento' : 'Nenhum sinal encontrado com os filtros selecionados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pick Bet Modal */}
      {pickingBet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setPickingBet(null)}>
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">🎯 Registrar Aposta</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Jogador:</span>
                <span className="text-white font-medium">{pickingBet.playerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Jogo:</span>
                <span className="text-white">{pickingBet.game}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Aposta:</span>
                <span className={`font-bold ${pickingBet.betType === 'Over' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {pickingBet.betType} {pickingBet.target} {pickingBet.category}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Odds:</span>
                <span className="text-purple-400 font-bold">{pickingBet.odds}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Atual:</span>
                <span className="text-white">{pickingBet.currentValue} / {pickingBet.target}</span>
              </div>

              <div className="border-t border-white/10 pt-3">
                <label className="block text-sm text-gray-400 mb-2">Stake (R$):</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Ex: 10.00"
                  min="0.01"
                  step="0.01"
                  className="w-full bg-black/40 border border-white/10 text-white text-lg font-bold rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                  autoFocus
                />
              </div>

              {stakeAmount && parseFloat(stakeAmount) > 0 && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Retorno potencial:</span>
                    <span className="text-white font-bold">R$ {(parseFloat(stakeAmount) * pickingBet.odds).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-purple-300">Lucro potencial:</span>
                    <span className="text-emerald-400 font-bold">R$ {((parseFloat(stakeAmount) * pickingBet.odds) - parseFloat(stakeAmount)).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPickingBet(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handlePickBet}
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || pickLoading}
                className="flex-1 px-4 py-2.5 text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
              >
                {pickLoading ? '⏳ Registrando...' : '✅ Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}