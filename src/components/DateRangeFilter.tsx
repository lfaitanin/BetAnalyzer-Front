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
    <div className="bg-white p-2 md:p-3 rounded-lg shadow-md mb-4 md:mb-6">
      <div className="flex flex-col md:flex-row md:justify-end items-start md:items-center gap-2 md:gap-4">
        <div className="w-full md:w-auto flex items-center gap-2">
          <label htmlFor="startDate" className="text-sm text-gray-600 min-w-[30px]">
            De:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            className="w-full md:w-auto px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
            onChange={(e) => handleDateChange(e.target.value, '')}
          />
        </div>
        <div className="w-full md:w-auto flex items-center gap-2">
          <label htmlFor="endDate" className="text-sm text-gray-600 min-w-[30px]">
            Até:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            className="w-full md:w-auto px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
            onChange={(e) => handleDateChange('', e.target.value)}
          />
        </div>
        <button 
          onClick={handleSearch}
          className="w-full md:w-auto h-[30px] px-4 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Pesquisar"
        >
          <span className="material-icons text-base mr-1">search</span>
          <span className="text-sm">Pesquisar</span>
        </button>
      </div>
    </div>
  );
}