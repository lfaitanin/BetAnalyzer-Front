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
  monthlyProfits: MonthlyProfit[];
}

export interface BetHistoryFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  searchTerm?: string;
}

export interface BetHistory {
  id: string;
  date: string;
  createdAt: string;
  playerName: string;
  team: string;
  categoria: string;
  target: number;
  result: number;
  odds: number;
  stake: number;
  profit: number;
  status: 'Ganhou' | 'Perdeu' | 'Pendente';
}

export interface LiveBet {
  game: string;
  id: string;
  date: string;
  playerName: string;
  team: string;
  category: string;
  target: number;
  currentValue: number;
  remainingValue: number;
  remainingMinutes: number;
  requiredPacePerMinute: number;
  completionPercentage: number;
  odds: number;
  stake: number;
  potentialProfit: number;
  status: 'Meta Alcançada' | 'Meta Não Alcançada' | 'Meta Alcançada' | 'Risco' | 'Muito Provável' | 'Provável' | 'Possível' | 'Improvável'; 
}

export interface Bet {
  id: string;
  userId: string;
  gameId: string;
  gameDate: string;
  homeTeam: string;
  awayTeam: string;
  betType: string;
  betValue: string;
  stake: number;
  odds: number;
  result: 'win' | 'loss' | 'pending';
  createdAt: string;
}

export interface BetHistoryResponse {
  bets: BetHistory[];
  total: number;
  successRate: number;
  totalProfit: number;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData> {
  try 
  {
    const queryParams = new URLSearchParams();
     if (startDate) queryParams.append('startDate', startDate);
     if (endDate) queryParams.append('endDate', endDate);

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
    return response.json();
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

export const api = {
  async getUserBets(userId: string): Promise<BetHistoryResponse> {
    const response = await fetch(`${API_URL}/bets/history?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar histórico de apostas');
    }

    return response.json();
  },

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    const response = await fetch(`${API_URL}/api/Account/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Falha ao alterar senha');
    }
  },
}; 