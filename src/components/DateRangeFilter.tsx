'use client';

export interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onFilterChange: (newStartDate: string, newEndDate: string) => void;
}

export default function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
  const handleDateChange = (startDate: string, endDate: string) => {
    onFilterChange(startDate, endDate);
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-md mb-6">
      <div className="flex justify-end items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="text-sm text-gray-600">
            De:
          </label>
          <input
            type="date"
            id="startDate"
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
            onChange={(e) => handleDateChange(e.target.value, '')}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="endDate" className="text-sm text-gray-600">
            Até:
          </label>
          <input
            type="date"
            id="endDate"
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
            onChange={(e) => handleDateChange('', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
} 