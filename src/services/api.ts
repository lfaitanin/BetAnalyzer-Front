interface MonthlyProfit {
  month: string;
  profit: number;
  totalBets: number;
  successRate: number;
}

interface DashboardData {
  monthlyProfit: number;
  totalProfit: number;
  successRate: number;
  totalBets: number;
  roi: number;
  monthlyProfits: MonthlyProfit[];
}

interface BetHistory {
  data: string;
  playerName: string;
  time: string;
  meta: number;
  resultado: number;
  odds: number;
  stake: number;
  lucro: number;
  status: string;
}

interface BetHistoryFilters {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  category: 'Points' | 'Rebounds' | 'Assists' | 'ThreePoints';
}

export interface LiveBet {
  playerName: string;
  category: string;
  game: string;
  target: number;
  currentValue: number;
  remainingValue: number;
  remainingMinutes: number;
  requiredPacePerMinute: number;
  completionPercentage: number;
  odds: number;
  potentialProfit: number;
  status: string;
}

export async function getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData> {
  try {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const response = await fetch(`https://localhost:7275/api/BettingAnalysis/dashboard?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do dashboard');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw error;
  }
}

export async function getBetHistory(filters: BetHistoryFilters): Promise<BetHistory[]> {
  const queryParams = new URLSearchParams();
  
  if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
  if (filters.startDate) queryParams.append('startDate', filters.startDate);
  if (filters.endDate) queryParams.append('endDate', filters.endDate);
  queryParams.append('category', filters.category);

  const response = await fetch(`https://localhost:7275/api/BettingAnalysis/history?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Falha ao carregar histórico de apostas');
  }
  return response.json();
}

export async function getLiveBets(): Promise<LiveBet[]> {
  try {
    const response = await fetch('https://localhost:7275/api/BettingAnalysis/live');
    if (!response.ok) {
      throw new Error('Erro ao buscar apostas em tempo real');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar apostas em tempo real:', error);
    throw error;
  }
} 