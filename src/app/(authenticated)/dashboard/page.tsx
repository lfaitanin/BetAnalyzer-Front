'use client';

import { useState } from 'react';
import { getDashboardData, getTopCategories, getLiveBets, getBetHistory } from '@/services/api';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from '@/hooks/useTranslation';
import useSWR from 'swr';
import { Skeleton } from '@/components/Skeleton';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper component for Growth Trends
function TrendIndicator({ value }: { value: number }) {
  if (value === 0) return <span className="text-gray-400 text-xs font-semibold">0% vs prev</span>;
  const isPositive = value > 0;
  return (
    <span className={`text-xs font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
      <span className="material-icons text-[14px]">{isPositive ? 'arrow_upward' : 'arrow_downward'}</span>
      {Math.abs(value).toFixed(1)}% vs prev
    </span>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<string>('weekly');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString();
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString());
  const [pickedOnly, setPickedOnly] = useState<boolean>(false);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    const end = new Date();
    const start = new Date();
    if (newPeriod === 'daily') start.setDate(end.getDate() - 30);
    else if (newPeriod === 'weekly') start.setDate(end.getDate() - 90);
    else if (newPeriod === 'monthly') start.setDate(end.getDate() - 365);
    setStartDate(start.toISOString());
    setEndDate(end.toISOString());
  };

  const { data: dashData, isLoading: isLoadingDash } = useSWR(
    ['dashboard', startDate, endDate, pickedOnly],
    () => getDashboardData(startDate, endDate, pickedOnly ? '1' : undefined)
  );

  const { data: topCategories, isLoading: isLoadingTop } = useSWR(
    ['topCategories', startDate, endDate, pickedOnly],
    () => getTopCategories(startDate, endDate, pickedOnly ? '1' : undefined)
  );

  const { data: liveBets, isLoading: isLoadingLive } = useSWR(
    ['liveBets'], // Live bets generally don't use the historical date filter
    () => getLiveBets()
  );

  const { data: recentHistory, isLoading: isLoadingHistory } = useSWR(
    ['recentHistory', startDate, endDate],
    () => getBetHistory({ startDate, endDate })
  );

  const isLoading = isLoadingDash || isLoadingTop || isLoadingLive || isLoadingHistory;

  if (isLoading || !dashData) {
    return (
      <div className="space-y-6 md:space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto bg-background min-h-screen">
        <Skeleton variant="rectangular" className="w-full h-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton variant="rectangular" className="w-full h-[400px] rounded-xl" />
      </div>
    );
  }

  const chartData = {
    labels: dashData.monthlyProfits.map(item => item.month),
    datasets: [
      {
        label: t('monthlyProfit') || 'Monthly Profit',
        data: dashData.monthlyProfits.map(item => item.profit),
        backgroundColor: dashData.monthlyProfits.map(item => item.profit >= 0 ? '#0d9488' : '#e11d48'), // Teal 600 or Rose 600
        borderRadius: 4,
        barPercentage: 0.6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b', // Slate 800
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        bodyFont: { size: 14, weight: 'bold' as const },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.1)', drawBorder: false }, // Slate 400 with opacity
        ticks: {
          color: '#64748b', // Slate 500
          callback: function (value: any) {
            return 'R$ ' + value;
          }
        },
        border: { display: false }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#64748b', font: { weight: 'bold' as const } },
        border: { display: false }
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto bg-background text-foreground min-h-screen pb-24">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-icons text-[16px]">chevron_right</span>
            <span className="text-foreground">Overview</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
          <label className="flex items-center gap-3 cursor-pointer bg-card border border-border px-4 h-[42px] rounded-lg shadow-sm hover:bg-muted/50 transition-colors">
            <span className="text-sm font-bold text-foreground">Mostrar Minhas Apostas</span>
            <input
              type="checkbox"
              checked={pickedOnly}
              onChange={(e) => setPickedOnly(e.target.checked)}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
          </label>
          <button className="h-[42px] flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap">
            <span className="material-icons text-[18px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">{t('totalProfit') || 'Total Earnings'}</h3>
            <span className="material-icons text-muted-foreground text-[20px]">account_balance_wallet</span>
          </div>
          <div>
            <p className="text-3xl font-bold mb-2">R$ {dashData.totalProfit.toFixed(2)}</p>
            <TrendIndicator value={dashData.totalProfitGrowth} />
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">{t('winRate') || 'Win Rate'}</h3>
            <span className="material-icons text-muted-foreground text-[20px]">emoji_events</span>
          </div>
          <div>
            <p className="text-3xl font-bold mb-2">{dashData.successRate.toFixed(1)}%</p>
            <TrendIndicator value={dashData.successRateGrowth} />
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">{t('totalBets') || 'Total Bets'}</h3>
            <span className="material-icons text-muted-foreground text-[20px]">receipt_long</span>
          </div>
          <div>
            <p className="text-3xl font-bold mb-2">{dashData.totalBets}</p>
            <TrendIndicator value={dashData.totalBetsGrowth} />
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION - CHARTS & CATEGORIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">Performance</h3>
              <p className="text-sm text-muted-foreground">Profit progression over selected period</p>
            </div>
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="bg-background border border-border text-foreground text-sm rounded-lg px-3 py-2 outline-none font-medium cursor-pointer hover:border-primary/50 transition-colors"
            >
              <option value="daily">{t('daily') || 'Diário'}</option>
              <option value="weekly">{t('weekly') || 'Semanal'}</option>
              <option value="monthly">{t('monthly') || 'Mensal'}</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg mb-1">Top Categories</h3>
          <p className="text-sm text-muted-foreground mb-6">Best performing bet types</p>

          <div className="space-y-6 flex-1">
            {topCategories?.slice(0, 5).map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="font-bold text-sm">{cat.category}</p>
                    <p className="text-xs text-muted-foreground">{cat.totalBets} Bets</p>
                  </div>
                  <p className="font-bold text-sm">R$ {cat.profit.toFixed(2)}</p>
                </div>
                {/* Segmented Progress Bar */}
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden flex" title={`Win Rate: ${cat.winRate.toFixed(1)}%`}>
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${Math.max(0, Math.min(100, cat.winRate))}%` }}
                    title={`Wins: ${cat.winRate.toFixed(1)}%`}
                  ></div>
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${100 - Math.max(0, Math.min(100, cat.winRate))}%` }}
                    title={`Losses: ${(100 - cat.winRate).toFixed(1)}%`}
                  ></div>
                </div>
              </div>
            ))}
            {!topCategories?.length && (
              <div className="text-center text-muted-foreground text-sm mt-10">
                No category data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Transactions (Pending Signals) */}
        <div className="lg:col-span-2 bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-lg mb-1">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground mb-6">Latest active signals sent to the system</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-lg">Player</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Target</th>
                  <th className="px-4 py-3 font-semibold text-right rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {liveBets?.slice(0, 6).map((bet, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 font-medium">{bet.playerName}</td>
                    <td className="px-4 py-4 text-muted-foreground">{bet.betType} {bet.category}</td>
                    <td className="px-4 py-4 font-bold">{bet.target}</td>
                    <td className="px-4 py-4 text-right">
                      <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        In Progress
                      </span>
                    </td>
                  </tr>
                ))}
                {!liveBets?.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No active signals right now.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity (Resolved Bets) */}
        <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground mb-6">Latest resolved events</p>

          <div className="space-y-6">
            {recentHistory?.filter(b => b.status !== 'Pendente').sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5).map((bet, idx) => {
              const isWin = bet.status === 'Ganhou';
              return (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-foreground">{bet.playerName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {bet.underOver === 'Under' ? 'U ' : bet.underOver === 'Over' ? 'O ' : ''}{bet.target} {bet.categoria} • {bet.team}
                    </p>
                  </div>
                  <div className="flex flex-col items-end whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                          ${isWin ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}
                    >
                      {isWin ? 'Delivered' : 'Lost'}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1 font-medium">
                      {new Date(bet.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              );
            })}
            {!recentHistory?.length && (
              <div className="text-center text-muted-foreground text-sm mt-10">
                No recent activity.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}