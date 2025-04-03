'use client';

interface DateRangeFilterProps {
  onFilterChange: (startDate: string, endDate: string) => void;
  startDate: string;
  endDate: string;
}

export default function DateRangeFilter({ onFilterChange, startDate, endDate }: DateRangeFilterProps) {
  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    if (newStartDate) onFilterChange(newStartDate, endDate);
    if (newEndDate) onFilterChange(startDate, newEndDate);
  };

  const handleSearch = () => {
    if (startDate && endDate) {
      onFilterChange(startDate, endDate);
    }
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
            value={startDate}
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
            value={endDate}
            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
            onChange={(e) => handleDateChange('', e.target.value)}
          />
        </div>
        <button 
          onClick={handleSearch}
          className="h-[30px] w-[30px] flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Pesquisar"
        >
          <span className="material-icons text-base">search</span>
        </button>
      </div>
    </div>
  );
}