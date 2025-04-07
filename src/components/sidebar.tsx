'use client';

// src/components/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  {
    title: 'Home',
    path: '/apostas',
    icon: 'home'
  },
  {
    title: 'Minhas Apostas',
    path: '/apostas/minhas-apostas',
    icon: 'person'
  },
  {
    title: 'Pontos',
    path: '/apostas/pontos',
    icon: 'sports_basketball'
  },
  {
    title: 'Rebotes',
    path: '/apostas/rebotes',
    icon: 'change_history'
  },
  {
    title: 'Assistências',
    path: '/apostas/assistencias',
    icon: 'people'
  },
  {
    title: 'Bolas de 3',
    path: '/apostas/tres-pontos',
    icon: 'track_changes'
  },
  {
    title: 'Apostas em Tempo Real',
    path: '/apostas/ao-vivo',
    icon: 'live_tv'
  },
  {
    title: 'Relatório',
    path: '/apostas/relatorio',
    icon: 'bar_chart'
  },
  {
    title: 'Perfil',
    path: '/apostas/perfil',
    icon: 'account_circle'
  }
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Overlay para dispositivos móveis */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Botão de toggle para dispositivos móveis */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white text-gray-900 p-2 rounded-lg shadow-lg"
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
          w-64 bg-white min-h-screen p-4 shadow-lg
        `}
      >
        <div className="flex items-center justify-between text-gray-900 mb-8 px-4">
          <div className="text-xl font-bold">BOT NBA</div>
          <button
            onClick={() => setIsExpanded(false)}
            className="md:hidden text-gray-500 hover:text-gray-900"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
            <div className="flex-shrink-0">
              <span className="material-icons text-gray-500">account_circle</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div> 
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsExpanded(false)}
                className={`flex items-center text-sm px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="material-icons text-xl mr-3">{item.icon}</span>
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex w-full px-1 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <span className="material-icons mr-3">logout</span>
              Sair
            </button>
          </div>
      </aside>
    </>
  );
}