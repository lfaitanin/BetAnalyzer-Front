const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7275';

export interface MonthlyProfit {
  month: string;
  profit: number;
}

export interface DashboardData {
  monthlyProfit: number;
  totalBets: number;
  successRate: number;
  totalProfit: number;
  winRate: number;
  roi: number;
  monthlyProfitGrowth: number;
  totalProfitGrowth: number;
  successRateGrowth: number;
  totalBetsGrowth: number;
  monthlyProfits: MonthlyProfit[];
}

export interface CategoryPerformance {
  category: string;
  winRate: number;
  totalBets: number;
  profit: number;
}

export interface BetHistoryFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  searchTerm?: string;
}

export interface BetHistory {
  id: string;
  data: string; // Correct property name mapped from C#
  playerName: string;
  team: string;
  categoria: string;
  target: number;
  result: number;
  odds: number;
  stake: number;
  profit: number;
  status: 'Ganhou' | 'Perdeu' | 'Pendente';
  underOver: string;
}

export interface LiveBet {
  game: string;
  id: string;
  betId: number;
  date: string;
  playerName: string;
  team: string;
  category: string;
  betType: 'Over' | 'Under';
  target: number;
  currentValue: number;
  remainingValue: number;
  remainingMinutes: number;
  requiredPacePerMinute: number;
  completionPercentage: number;
  odds: number;
  stake: number;
  potentialProfit: number;
  status: 'Meta Alcançada' | 'Meta Não Alcançada' | 'Risco' | 'Muito Provável' | 'Provável' | 'Possível' | 'Improvável';
  picked: boolean;
  userStake: number;
}

export async function getDashboardData(startDate?: string, endDate?: string, userId?: string): Promise<DashboardData> {
  try {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (userId) queryParams.append('userId', userId);

    const response = await fetch(`${API_URL}/api/BettingAnalysis/dashboard?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do dashboard');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    throw error;
  }
}

export async function getTopCategories(startDate?: string, endDate?: string, userId?: string): Promise<CategoryPerformance[]> {
  try {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (userId) queryParams.append('userId', userId);

    const response = await fetch(`${API_URL}/api/BettingAnalysis/top-categories?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Erro ao carregar categorias');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    throw error;
  }
}

export async function getBetHistory(filters: BetHistoryFilters): Promise<BetHistory[]> {
  try {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
    if (filters.category) queryParams.append('category', filters.category);

    const response = await fetch(`${API_URL}/api/BettingAnalysis/history?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Erro ao carregar histórico de apostas');
    }
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      target: item.target ?? item.Target ?? item.meta ?? item.Meta ?? 0
    }));
  } catch (error) {
    console.error('Erro ao carregar histórico de apostas:', error);
    throw error;
  }
}

export async function getLiveBets(): Promise<LiveBet[]> {
  try {
    const response = await fetch(`${API_URL}/api/BettingAnalysis/live`);
    if (!response.ok) {
      throw new Error('Erro ao carregar apostas em tempo real');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao carregar apostas em tempo real:', error);
    throw error;
  }
}

export async function pickBet(betId: number, stake: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/BettingAnalysis/pick`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betId, stake }),
    });
    if (!response.ok) {
      throw new Error('Erro ao registrar aposta');
    }
  } catch (error) {
    console.error('Erro ao registrar aposta:', error);
    throw error;
  }
} 