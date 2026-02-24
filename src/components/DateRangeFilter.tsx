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
    <div className="glass p-3 md:p-4 rounded-xl shadow-lg border border-white/5">
      <div className="flex flex-col md:flex-row md:justify-end items-start md:items-center gap-3">
        <div className="w-full md:w-auto flex items-center gap-3">
          <label htmlFor="startDate" className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            De:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            className="w-full md:w-auto bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            onChange={(e) => handleDateChange(e.target.value, '')}
          />
        </div>
        <div className="w-full md:w-auto flex items-center gap-3">
          <label htmlFor="endDate" className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Até:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            className="w-full md:w-auto bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            onChange={(e) => handleDateChange('', e.target.value)}
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full md:w-auto h-[38px] px-6 flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-purple-500/25"
          title="Search"
        >
          <span className="material-icons text-sm mr-2">search</span>
          <span className="text-sm">Filtrar</span>
        </button>
      </div>
    </div>
  );
}