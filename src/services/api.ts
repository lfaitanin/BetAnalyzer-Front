const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7275';

export interface MonthlyProfit {
  month: string;
  profit: number;
}

export interface DashboardData {
  totalProfit: number;
  winRate: number;
  roi: number;
  monthlyProfits: MonthlyProfit[];
}

export interface BetHistoryFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
}

export interface BetHistory {
  id: string;
  date: string;
  playerName: string;
  team: string;
  target: number;
  result: number;
  odds: number;
  stake: number;
  profit: number;
  status: 'GREEN' | 'RED' | 'PENDING';
}

export interface LiveBet {
  id: string;
  date: string;
  playerName: string;
  team: string;
  category: string;
  target: number;
  odds: number;
  stake: number;
  status: 'GREEN' | 'RED' | 'PENDING';
}

export async function getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData> {
  try {
    const response = await fetch(`${API_URL}/api/dashboard?startDate=${startDate}&endDate=${endDate}`);
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do dashboard');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    throw error;
  }
}

export async function getBetHistory(filters: BetHistoryFilters): Promise<BetHistory[]> {
  try {
    const queryParams = new URLSearchParams();
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.category) queryParams.append('category', filters.category);

    const response = await fetch(`${API_URL}/api/bets?${queryParams}`);
    if (!response.ok) {
      throw new Error('Erro ao carregar histórico de apostas');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao carregar histórico de apostas:', error);
    throw error;
  }
}

export async function getLiveBets(): Promise<LiveBet[]> {
  try {
    const response = await fetch(`${API_URL}/api/bets/live`);
    if (!response.ok) {
      throw new Error('Erro ao carregar apostas em tempo real');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao carregar apostas em tempo real:', error);
    throw error;
  }
} 