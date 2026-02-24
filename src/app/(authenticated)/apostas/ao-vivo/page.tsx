'use client';

import { useEffect, useState } from 'react';
import { getLiveBets, pickBet, LiveBet } from '@/services/api';

export default function LiveBetsPage() {
  const [bets, setBets] = useState<LiveBet[]>([]);
  const [loading, setLoading] = useState(true);
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

  const loadLiveBets = async () => {
    try {
      const liveBets = await getLiveBets();
      setBets(liveBets);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar apostas em tempo real!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveBets();
    const interval = setInterval(loadLiveBets, 180000);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error && bets.length === 0) {
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-6 bg-transparent">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Apostas em Tempo Real</h1>
        <button
          onClick={loadLiveBets}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          Atualizar
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card p-3 md:p-4 rounded-xl shadow-lg border border-border">
        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Jogador:</label>
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full md:w-48 bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Jogo:</label>
            <select
              value={filterGame}
              onChange={(e) => setFilterGame(e.target.value)}
              className="w-full md:w-auto bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Todos</option>
              {uniqueGames.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Categoria:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-auto bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Todas</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Todos</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg transition-all"
            >
              ✕ Limpar
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-2 text-xs text-muted-foreground">
            Mostrando {filteredBets.length} de {bets.length} sinais
          </div>
        )}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBets.map((bet) => (
          <div key={bet.id || bet.betId} className="bg-card text-card-foreground rounded-xl overflow-hidden border border-border hover:border-border/80 transition-all">
            <div className="p-4 border-b border-border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{bet.playerName}</h3>
                  <p className="text-sm text-muted-foreground">{bet.category}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${bet.status === 'Meta Alcançada' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  bet.status === 'Meta Não Alcançada' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                  {bet.status}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Jogo</p>
                  <p className="text-sm font-medium text-foreground">{bet.game}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Meta</p>
                    <p className={`text-sm font-bold ${bet.betType === 'Over' ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                      {bet.betType || 'Under'} {bet.target}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Atual</p>
                    <p className="text-sm font-medium text-foreground">{bet.currentValue}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Progresso</p>
                  <div className="mt-1 h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${(bet.completionPercentage ?? 0) >= 80 ? 'bg-emerald-500' :
                        (bet.completionPercentage ?? 0) >= 50 ? 'bg-yellow-500' :
                          'bg-primary'
                        }`}
                      style={{ width: `${bet.completionPercentage ?? 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{(bet.completionPercentage ?? 0).toFixed(1)}%</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Restante</p>
                    <p className="text-sm font-medium text-foreground">{bet.remainingMinutes} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ritmo Necessário</p>
                    <p className="text-sm font-medium text-foreground">{(bet.requiredPacePerMinute ?? 0).toFixed(2)}/min</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Odds</p>
                    <p className="text-sm font-bold text-primary">{bet.odds}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lucro Potencial</p>
                    <p className="text-sm font-bold text-emerald-500">R$ {(bet.potentialProfit ?? 0).toFixed(2)}</p>
                  </div>
                </div>

                {/* Pick bet action */}
                <div className="pt-2 border-t border-border">
                  {bet.picked ? (
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-emerald-500">✅ Pego</span>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Stake: R$ {(bet.userStake ?? 0).toFixed(2)}</p>
                        <p className="text-xs text-emerald-500 font-bold">
                          Lucro: R$ {((bet.odds * (bet.userStake ?? 0)) - (bet.userStake ?? 0)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setPickingBet(bet); setStakeAmount(''); }}
                      className="w-full py-2.5 text-sm font-medium bg-purple-600/80 hover:bg-purple-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      🎯 Pegar Sinal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {bets.length === 0 ? 'Nenhuma aposta em tempo real no momento.' : 'Nenhum sinal encontrado com os filtros selecionados.'}
          </p>
        </div>
      )}

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
                  {pickingBet.betType || 'Under'} {pickingBet.target} {pickingBet.category}
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