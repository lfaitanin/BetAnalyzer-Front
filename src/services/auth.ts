const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7275';

export interface User {
  id: string;
  fullName: string;
  email: string;
  defaultStake?: number;
  balance: number;
}

export interface AuthResponse {
  auth_token: string;
  message: string;
  fullName: string;
  email: string;
  defaultStake: number;
  balance: number;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdateProfileData {
  fullName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  defaultStake?: number;
  balance?: number;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar conta');
    }

    return response.json();
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer login');
    }

    return response.json();
  },

  async requestPasswordReset(data: ResetPasswordData): Promise<void> {
    const response = await fetch(`${API_URL}/api/Auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao solicitar recuperação de senha');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/Auth/reset-password-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao redefinir senha');
    }
  },

  async updateProfile(data: UpdateProfileData): Promise<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    const userString = localStorage.getItem('user');
    if (!userString) {
      throw new Error('Dados do usuário não encontrados no localStorage');
    }
  
    const user = JSON.parse(userString);
    const userId = user.id; 

    const response = await fetch(`${API_URL}/api/auth/update-profile?id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar perfil');
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  },

  setAuth(data: AuthResponse): void {
    try {
      localStorage.setItem('token', data.auth_token);
      const user: User = {
        id: JSON.parse(atob(data.auth_token.split('.')[1])).sub,
        fullName: data.fullName,
        email: data.email,
        defaultStake: data.defaultStake,  
        balance: data.balance 
      };

      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  },
}; 