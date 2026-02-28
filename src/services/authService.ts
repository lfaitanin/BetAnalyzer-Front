const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7275';

export interface AuthUser {
    fullName: string;
    email: string;
    defaultStake: number;
    balance: number;
}

export interface LoginResponse {
    auth_token: string;
    fullName: string;
    email: string;
    defaultStake: number;
    balance: number;
    message: string;
}

export interface AuthResult {
    success: boolean;
    message: string;
}

const TOKEN_KEY = 'nba_auth_token';
const USER_KEY = 'nba_auth_user';

// ---------- Storage helpers ----------

export function saveSession(token: string, user: AuthUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Also set a cookie so Next.js middleware can read it (no httpOnly — client-side only)
    document.cookie = `nba_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
}

export function clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = 'nba_token=; path=/; max-age=0';
}

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

// ---------- API calls ----------

export async function login(email: string, password: string): Promise<AuthResult> {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Credenciais inválidas.' }));
            return { success: false, message: err.message || 'Erro ao fazer login.' };
        }

        const data: LoginResponse = await response.json();
        saveSession(data.auth_token, {
            fullName: data.fullName,
            email: data.email,
            defaultStake: data.defaultStake,
            balance: data.balance,
        });

        return { success: true, message: data.message };
    } catch (error) {
        console.error('[authService] login error:', error);
        return { success: false, message: 'Não foi possível conectar ao servidor.' };
    }
}

export async function register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
): Promise<AuthResult> {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, confirmPassword }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Erro ao criar conta.' }));
            return { success: false, message: err.message || 'Erro ao criar conta.' };
        }

        const data = await response.json();
        return { success: true, message: data.message };
    } catch (error) {
        console.error('[authService] register error:', error);
        return { success: false, message: 'Não foi possível conectar ao servidor.' };
    }
}

export function logout(): void {
    clearSession();
}
