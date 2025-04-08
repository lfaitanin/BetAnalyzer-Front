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
  betId: string;
  date?: string;
  playerName: string;
  team?: string;
  category: string;
  target: number;
  currentValue: number;
  remainingValue: number;
  remainingMinutes: number;
  requiredPacePerMinute: number;
  completionPercentage: number;
  odds: number;
  stake?: number;
  potentialProfit: number;
  status: 'Meta Alcançada' | 'Meta Não Alcançada' | 'Meta Alcançada' | 'Risco' | 'Muito Provável' | 'Provável' | 'Possível' | 'Improvável';
  check?: boolean;
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

type ApiStatus = 'Ganhou' | 'Perdeu' | 'Pendente';
type BetStatus = 'win' | 'loss' | 'pending';

export interface UserBetData {
  id: string;
  userId: string;
  betId: string;
  betTitle: string;
  date: string;
  odd: number;
  stake: number;
  meta: number;
  status: string;
}

export interface UserBet {
  id: string;
  userId: string;
  betId: string;
  betTitle: string;
  odd: number;
  stake: number;
  meta: number;
  createdAt: string;
  status: 'win' | 'loss' | 'pending';
}

export interface UserReport {
  percAcerto: number;
  totalProfit: number;
  totalUnits: number;
  saldoTotal: number;
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

export async function getLiveBets(userId?: string): Promise<LiveBet[]> {
  try {
    const url = `${API_URL}/api/BettingAnalysis/live?userId=${userId}`;
      console.log(url);
    const response = await fetch(url);
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
    const response = await fetch(`${API_URL}/BettingAnalysis/history?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar histórico de apostas');
    }

    const data = await response.json();
    return data;
  },

  async getUserBetsByDateRange(userId: string, startDate: string, endDate: string): Promise<UserBetData[]> {
    const response = await fetch(`${API_URL}/api/UserBets/minhas-bets?userId=${userId}&startDate=${startDate}&endDate=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar apostas');
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

  addUserBet: async (data: UserBetData): Promise<any> => {
    console.log('Sending bet data:', data);
    const response = await fetch(`${API_URL}/api/UserBets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error response:', errorData);
      throw new Error('Erro ao adicionar aposta');
    }

    return response.json();
  },

  async getUserStats(userId: string): Promise<UserReport> {
    const response = await fetch(`${API_URL}/api/UserBets/meu-saldo?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas');
    }

    return response.json();
  },
}; 