'use client';

// src/components/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/hooks/useTheme';

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, lang, setLang } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    {
      title: t('dashboard'),
      path: '/dashboard',
      icon: 'dashboard'
    },
    {
      title: t('points'),
      path: '/apostas/pontos',
      icon: 'sports_basketball'
    },
    {
      title: t('rebounds'),
      path: '/apostas/rebotes',
      icon: 'change_history'
    },
    {
      title: t('assists'),
      path: '/apostas/assistencias',
      icon: 'people'
    },
    {
      title: t('threes'),
      path: '/apostas/tres-pontos',
      icon: 'track_changes'
    },
    {
      title: t('liveBets'),
      path: '/apostas/ao-vivo',
      icon: 'live_tv'
    },
    {
      title: t('preGame') || 'Pré-Jogo',
      path: '/apostas/pre-jogo',
      icon: 'online_prediction'
    },
    {
      title: t('report'),
      path: '/apostas/relatorio',
      icon: 'bar_chart'
    },
    {
      title: t('settings') || 'Configurações',
      path: '/settings',
      icon: 'settings'
    }
  ];

  return (
    <>
      {/* Overlay para dispositivos móveis */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Botão de toggle para dispositivos móveis */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-4 left-4 z-50 md:hidden glass text-foreground p-2 rounded-lg shadow-lg border border-white/10"
      >
        <span className="material-icons">
          {isExpanded ? 'close' : 'menu'}
        </span>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full z-50
          transition-transform duration-300 ease-in-out
          ${isExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          w-64 glass border-r border-white/5 min-h-screen p-4 flex flex-col
          z-[60] md:z-auto
        `}
      >
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            NBA-BETTHOR
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <nav className="space-y-2 flex-1 scrollbar-hide overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsExpanded(false)}
                className={`flex items-center text-sm px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className={`material-icons text-xl mr-3 ${isActive ? 'text-neon-purple' : ''}`}>
                  {item.icon}
                </span>
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Theme & Logout Section */}
        <div className="px-4 pb-4 mt-auto pt-4 border-t border-white/5 space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold text-gray-300 transition-colors border border-white/10"
          >
            <div className="flex items-center gap-2">
              <span className="material-icons text-sm">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <span className="material-icons text-sm text-gray-500">sync_alt</span>
          </button>

          <button
            onClick={() => {
              // Implementação futura do logout
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm font-bold text-red-500 dark:text-red-400 transition-colors border border-red-500/20"
          >
            <span className="material-icons text-sm">logout</span>
            {t('logout') || 'Sair'}
          </button>
        </div>
      </aside>
    </>
  );
}