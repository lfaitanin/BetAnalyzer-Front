'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark', // default to our current app style initially, or dark based on preference
    setTheme: () => null,
    toggleTheme: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load from local storage
        const savedTheme = localStorage.getItem('nba_betthor_theme') as Theme;
        if (savedTheme === 'light' || savedTheme === 'dark') {
            setThemeState(savedTheme);
        } else {
            // If nothing saved, default to dark to preserve existing look
            setThemeState('dark');
            localStorage.setItem('nba_betthor_theme', 'dark');
        }
    }, []);

    // Apply the class to the html tag when theme changes
    useEffect(() => {
        if (!mounted) return;
        const root = window.document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme, mounted]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('nba_betthor_theme', newTheme);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Prevent hydration mismatch by rendering invisible or dark-default until mounted
    // Actually, to avoid flicker, the optimal way is a small script in <head>, 
    // but React context handles it well if we just render children
    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            <div className={!mounted ? 'invisible' : 'visible'}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
