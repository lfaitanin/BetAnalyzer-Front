'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authService from '@/services/authService';
import { AuthUser } from '@/services/authService';

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadFromStorage = useCallback(() => {
        const storedToken = authService.getToken();
        const storedUser = authService.getUser();
        setToken(storedToken);
        setUser(storedUser);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    const logout = useCallback(() => {
        authService.logout();
        setToken(null);
        setUser(null);
    }, []);

    const refreshUser = useCallback(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return ctx;
}
