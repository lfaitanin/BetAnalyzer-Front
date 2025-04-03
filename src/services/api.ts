const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7275';

export interface MonthlyProfit {
  month: string;
  profit: number;
  totalBets: number;
  successRate: number;
}

export interface DashboardData {
  monthlyProfit: number;
  totalProfit: number;
  successRate: number;
  totalBets: number;
  roi: number;
  monthlyProfits: MonthlyProfit[];
}

export interface BetHistory {
  id: number;
  date: string;
  playerName: string;
  team: string;
  category: string;
  target: number;
  result: number;
  odds: number;
  stake: number;
  profit: number;
  status: string;
}

export interface BetHistoryFilters {
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  category?: 'Points' | 'Rebounds' | 'Assists' | 'ThreePoints';
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

    const response = await fetch(`${API_URL}/api/BettingAnalysis/dashboard?${queryParams.toString()}`);
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
  try {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
    if (filters.category) queryParams.append('category', filters.category);

    const response = await fetch(`${API_URL}/api/BettingAnalysis/history?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar histórico de apostas');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar histórico de apostas:', error);
    throw error;
  }
}

export async function getLiveBets(): Promise<LiveBet[]> {
  try {
    const response = await fetch(`${API_URL}/api/BettingAnalysis/live`);
    if (!response.ok) {
      throw new Error('Erro ao buscar apostas em tempo real');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar apostas em tempo real:', error);
    throw error;
  }
} 