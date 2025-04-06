'use client';

// src/components/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    title: 'Dashboard',
    path: '/',
    icon: 'dashboard'
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
  // {
  //   title: 'Live',
  //   path: '/apostas/tempo-real',
  //   icon: 'streetview'
  // }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 min-h-screen p-4">
      <div className="text-white text-xl font-bold mb-8 px-4">BOT NBA</div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center text-sm px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="material-icons text-xl mr-3">{item.icon}</span>
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}