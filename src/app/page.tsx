// src/app/page.tsx
'use client';

import { useState } from 'react';
import { getDashboardData, DashboardData } from '@/services/api';
import DateRangeFilter from '@/components/DateRangeFilter';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDates, setStartDate] = useState<string>('');
  const [endDates, setEndDate] = useState<string>('');

  const loadDashboardData = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      const dashboardData = await getDashboardData(startDate, endDate);
      setData(dashboardData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
      console.log(startDates + endDates)
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <DateRangeFilter onFilterChange={handleDateChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Lucro Total</h2>
          <p className={`text-2xl font-bold ${
            data?.totalProfit && data.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            R$ {data?.totalProfit.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Taxa de Acerto</h2>
          <p className="text-2xl font-bold text-gray-900">
            {data?.winRate.toFixed(2) || '0.00'}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-sm font-medium text-gray-500 mb-2">ROI</h2>
          <p className={`text-2xl font-bold ${
            data?.roi && data.roi >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {data?.roi.toFixed(2) || '0.00'}%
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Lucro Mensal</h2>
        <div className="space-y-4">
          {data?.monthlyProfits.map((month) => (
            <div key={month.month} className="flex justify-between items-center">
              <span className="text-gray-600">{month.month}</span>
              <span className={`font-medium ${
                month.profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                R$ {month.profit.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}