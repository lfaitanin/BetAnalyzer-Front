'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

type Tab = 'gestao' | 'preferencias' | 'seguranca';

export default function SettingsPage() {
    const { t, lang, setLang } = useTranslation();

    const [activeTab, setActiveTab] = useState<Tab>('gestao');

    // Formulário simulado para banco de dados/API
    const [bankroll, setBankroll] = useState('1000');
    const [baseStake, setBaseStake] = useState('100');

    // Segurança
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleLang = () => {
        setLang(lang === 'PT' ? 'EN' : 'PT');
    };

    const handleSaveBankroll = (e: React.FormEvent) => {
        e.preventDefault();
        alert(t('saveBankroll') + " - (Backend wiring pending)");
    };

    const handleSaveSecurity = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert(t('passwordsDoNotMatch'));
            return;
        }
        alert(t('saveSecurity') + " - (Backend wiring pending)");
    };

    // Calculate password strength
    const getPasswordStrength = () => {
        if (!newPassword) return null;
        let score = 0;
        if (newPassword.length > 7) score += 1;
        if (/[A-Z]/.test(newPassword)) score += 1;
        if (/[0-9]/.test(newPassword)) score += 1;
        if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

        if (score <= 1) return { label: t('weak'), color: 'bg-red-500', width: 'w-1/4' };
        if (score === 2) return { label: t('fair'), color: 'bg-yellow-500', width: 'w-2/4' };
        if (score === 3) return { label: t('good'), color: 'bg-blue-500', width: 'w-3/4' };
        return { label: t('strong'), color: 'bg-emerald-500', width: 'w-full' };
    };

    const strength = getPasswordStrength();

    return (
        <div className="max-w-4xl w-full">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-8 animate-in slide-in-from-top-4 duration-500">
                {t('settings')}
            </h1>

            {/* Navigation Tabs */}
            <div className="flex space-x-6 border-b border-border mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('gestao')}
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'gestao'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <span className="material-icons text-sm">account_balance_wallet</span>
                    {t('bankroll')} & {t('stakes')}
                </button>
                <button
                    onClick={() => setActiveTab('preferencias')}
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'preferencias'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <span className="material-icons text-sm">tune</span>
                    {t('preferences')}
                </button>
                <button
                    onClick={() => setActiveTab('seguranca')}
                    className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'seguranca'
                        ? 'border-red-500 text-red-500'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <span className="material-icons text-sm">security</span>
                    {t('security')}
                </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm">

                {/* Gestão Tab */}
                {activeTab === 'gestao' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="space-y-4 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('totalBankroll')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                                    <input
                                        type="number"
                                        value={bankroll}
                                        onChange={(e) => setBankroll(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="Ex: 5000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('baseStake')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                                    <input
                                        type="number"
                                        value={baseStake}
                                        onChange={(e) => setBaseStake(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="Ex: 50"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground italic">
                                * {t('roiProjectionInfo')}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-border flex justify-end">
                            <button
                                onClick={handleSaveBankroll}
                                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2"
                            >
                                <span className="material-icons text-sm">save</span>
                                {t('saveBankroll')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Preferências Tab */}
                {activeTab === 'preferencias' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h3 className="text-lg font-medium text-foreground mb-4">{t('notifications')}</h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                                    <div>
                                        <p className="font-medium text-foreground">{t('telegramAlerts')}</p>
                                        <p className="text-sm text-muted-foreground">{t('receiveNewSignals')}</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6 rounded-full bg-primary">
                                        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform translate-x-6"></div>
                                    </div>
                                </label>
                                <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors opacity-50">
                                    <div>
                                        <p className="font-medium text-foreground">{t('dailySummary')}</p>
                                        <p className="text-sm text-muted-foreground">{t('resultsEndDay')}</p>
                                    </div>
                                    <div className="relative inline-block w-12 h-6 rounded-full bg-secondary">
                                        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-card transition-transform"></div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-foreground mb-4">{t('display')}</h3>
                            <div className="space-y-4 max-w-sm">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">{t('oddsFormat')}</label>
                                    <select className="w-full bg-background border border-border rounded-xl py-2 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none">
                                        <option>{t('decimal')} (2.50)</option>
                                        <option>{t('american')} (+150)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-end">
                            <button
                                onClick={handleSaveBankroll}
                                className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2"
                            >
                                <span className="material-icons text-sm">save</span>
                                {t('savePreferences')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Segurança Tab */}
                {activeTab === 'seguranca' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <form onSubmit={handleSaveSecurity} className="space-y-5 max-w-lg">

                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('currentPassword')}</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <span className="material-icons text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-border"></div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t('newPassword')}</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/50 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <span className="material-icons text-sm">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>

                                {/* Password Strength Meter */}
                                {strength && (
                                    <div className="mt-2 space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">{t('passwordStrength')}</span>
                                            <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{t('confirmPassword')}</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                    >
                                        <span className="material-icons text-sm">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-white/5">
                                <button
                                    type="submit"
                                    disabled={!password || !newPassword || !confirmPassword}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold transition-colors shadow-lg shadow-red-500/25"
                                >
                                    <span className="material-icons text-sm">shield</span>
                                    {t('saveSecurity')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
