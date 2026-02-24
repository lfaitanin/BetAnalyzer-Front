'use client';

import { useState, useEffect, createContext, useContext } from 'react';

type Language = 'PT' | 'EN';

type Translations = {
    [key in Language]: {
        // Dashboard
        dashboard: string;
        points: string;
        rebounds: string;
        assists: string;
        threes: string;
        liveBets: string;
        preGame: string;
        report: string;
        monthlyProfit: string;
        totalProfit: string;
        winRate: string;
        totalBets: string;
        roi: string;
        filterFrom: string;
        filterTo: string;
        applyFilter: string;
        daily: string;
        weekly: string;
        monthly: string;
        quarterly: string;
        yearly: string;
        themeDesc: string;
        stakes: string;
        totalBankroll: string;
        roiProjectionInfo: string;
        notifications: string;
        telegramAlerts: string;
        receiveNewSignals: string;
        dailySummary: string;
        resultsEndDay: string;
        display: string;
        oddsFormat: string;
        decimal: string;
        american: string;
        savePreferences: string;
        search: string;
        welcome: string;
        systemOnline: string;
        chartTitle: string;
        settings: string;
        logout: string;
        language: string;
        password: string;
        changePassword: string;
        save: string;
        subscription: string;
        bankroll: string;
        baseStake: string;

        // New Settings Page
        bankrollManagement: string;
        bankrollInfo: string;
        preferences: string;
        security: string;
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
        passwordStrength: string;
        weak: string;
        fair: string;
        good: string;
        strong: string;
        activePlan: string;
        saveSecurity: string;
        saveBankroll: string;
        passwordsDoNotMatch: string;
    };
};

const translations: Translations = {
    PT: {
        dashboard: 'Dashboard',
        points: 'Pontos',
        rebounds: 'Rebotes',
        assists: 'Assistências',
        threes: 'Bolas de 3',
        liveBets: 'Apostas em Tempo Real',
        preGame: 'Previsões Pré-Jogo',
        report: 'Relatório',
        monthlyProfit: 'Lucro Mensal',
        totalProfit: 'Lucro Total',
        winRate: 'Taxa de Acerto',
        totalBets: 'Total de Apostas',
        roi: 'ROI',
        filterFrom: 'De',
        filterTo: 'Até',
        applyFilter: 'Aplicar',
        daily: 'Diário',
        weekly: 'Semanal',
        monthly: 'Mensal',
        quarterly: 'Trimestral',
        yearly: 'Anual',
        themeDesc: 'Personalize a aparência do sistema',
        stakes: 'Stakes',
        totalBankroll: 'Banca Total',
        roiProjectionInfo: 'Informação usada nos relatórios para projeção de ROI',
        notifications: 'Notificações',
        telegramAlerts: 'Alertas no Telegram',
        receiveNewSignals: 'Receba novos sinais instantaneamente',
        dailySummary: 'Resumo Diário',
        resultsEndDay: 'Resultados no fim do dia',
        display: 'Exibição',
        oddsFormat: 'Formato de Odds',
        decimal: 'Decimal',
        american: 'Americano',
        savePreferences: 'Salvar Preferências',
        search: 'Buscar...',
        welcome: 'Bem-vindo ao futuro das apostas.',
        systemOnline: 'Sistema Online',
        chartTitle: 'Evolução do Lucro Mensal',
        settings: 'Configurações',
        logout: 'Sair',
        language: 'Idioma',
        password: 'Senha',
        changePassword: 'Mudar Senha',
        save: 'Salvar Configurações',
        subscription: 'Assinatura',
        bankroll: 'Banca Total',
        baseStake: 'Stake Base (Unit)',

        // New Settings Page
        bankrollManagement: 'Banca & Gestão',
        bankrollInfo: '* Informações usadas no painel de relatórios para projeção de ROI',
        preferences: 'Preferências',
        security: 'Segurança',
        currentPassword: 'Senha Atual',
        newPassword: 'Nova Senha',
        confirmPassword: 'Confirmar Nova Senha',
        passwordStrength: 'Força da Senha',
        weak: 'Fraca',
        fair: 'Razoável',
        good: 'Boa',
        strong: 'Forte',
        activePlan: 'Plano ativo até 31/12/2026',
        saveSecurity: 'Salvar Segurança',
        saveBankroll: 'Salvar Gestão',
        passwordsDoNotMatch: 'As senhas não coincidem'
    },
    EN: {
        dashboard: 'Dashboard',
        points: 'Points',
        rebounds: 'Rebounds',
        assists: 'Assists',
        threes: '3-Pointers',
        liveBets: 'Live Bets',
        preGame: 'Pre-Game Predictions',
        report: 'Report',
        monthlyProfit: 'Monthly Profit',
        totalProfit: 'Total Profit',
        winRate: 'Win Rate',
        totalBets: 'Total Bets',
        roi: 'ROI',
        filterFrom: 'From',
        filterTo: 'To',
        applyFilter: 'Apply',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        yearly: 'Yearly',
        themeDesc: 'Customize system appearance',
        stakes: 'Stakes',
        totalBankroll: 'Total Bankroll',
        roiProjectionInfo: 'Information used in reports for ROI projection',
        notifications: 'Notifications',
        telegramAlerts: 'Telegram Alerts',
        receiveNewSignals: 'Receive new signals instantly',
        dailySummary: 'Daily Summary',
        resultsEndDay: 'Results at the end of the day',
        display: 'Display',
        oddsFormat: 'Odds Format',
        decimal: 'Decimal',
        american: 'American',
        savePreferences: 'Save Preferences',
        search: 'Search...',
        welcome: 'Welcome to the future of betting.',
        systemOnline: 'System Online',
        chartTitle: 'Monthly Profit Evolution',
        settings: 'Settings',
        logout: 'Logout',
        language: 'Language',
        password: 'Password',
        changePassword: 'Change Password',
        save: 'Save Settings',
        subscription: 'Subscription Plan',
        bankroll: 'Total Bankroll',
        baseStake: 'Base Stake (Unit)',

        // New Settings Page
        bankrollManagement: 'Bankroll & Stakes',
        bankrollInfo: '* Information used in reports for ROI projection',
        preferences: 'Preferences',
        security: 'Security',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        passwordStrength: 'Password Strength',
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong',
        activePlan: 'Plan active until 12/31/2026',
        saveSecurity: 'Save Security',
        saveBankroll: 'Save Bankroll',
        passwordsDoNotMatch: 'Passwords do not match'
    }
};

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: keyof Translations['PT' | 'EN']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('PT');

    useEffect(() => {
        // Run only on client side
        const savedLang = localStorage.getItem('nba_betthor_lang') as Language;
        if (savedLang === 'PT' || savedLang === 'EN') {
            setLangState(savedLang);
        } else {
            // Auto detect browser language
            const browserLang = navigator.language || (navigator as any).userLanguage;
            if (browserLang && !browserLang.toLowerCase().startsWith('pt')) {
                setLangState('EN');
            }
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('nba_betthor_lang', newLang);
    };

    const t = (key: keyof Translations['PT' | 'EN']) => {
        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
