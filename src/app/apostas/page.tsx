'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DashboardData, getDashboardData } from '@/services/api';
import { Line } from 'react-chartjs-2';
import DateRangeFilter from '@/components/DateRangeFilter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const loadDashboardData = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const dashboardData = await getDashboardData(start, end);
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
      
      loadDashboardData();
    }, [isLoading, isAuthenticated, router]);
      
  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    loadDashboardData(newStartDate, newEndDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const chartData = {
    labels: data.monthlyProfits.map(item => item.month).reverse(),
    datasets: [
      {
        label: 'Lucro Mensal',
        data: data.monthlyProfits.map(item => item.profit).reverse(),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolução do Lucro Mensal'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-2 p-2 md:p-6 bg-gray-50">      
      <DateRangeFilter 
        onFilterChange={handleDateChange} 
        startDate={startDate}
        endDate={endDate}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Lucro Mensal</h3>
          <p className={`mt-2 text-2xl md:text-3xl font-semibold ${
            data.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            R$ {data.monthlyProfit.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Lucro Total</h3>
          <p className={`mt-2 text-2xl md:text-3xl font-semibold ${
            data.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            R$ {data.totalProfit.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Taxa de Acerto</h3>
          <p className="mt-2 text-2xl md:text-3xl font-semibold text-gray-900">
            {data.successRate.toFixed(2)}%
          </p>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Total de Apostas</h3>
          <p className="mt-2 text-2xl md:text-3xl font-semibold text-gray-900">
            {data.totalBets}
          </p>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-gray-500">ROI</h3>
          <p className={`mt-2 text-2xl md:text-3xl font-semibold ${
            data.roi >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data.roi.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="bg-white p-2 rounded-lg shadow-md">
        <div className="h-[665px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}