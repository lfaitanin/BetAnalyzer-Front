'use client';

import { BetHistoryFilters } from '@/services/api';
import { useState, useEffect, useRef } from 'react';

interface BetsFilterProps {
  onFilterChange: (filters: BetHistoryFilters) => void;
  suggestions?: string[]; // Lista de sugestões para o autocomplete
}

export default function BetsFilter({ onFilterChange, suggestions = [] }: BetsFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filtra as sugestões baseado no termo de busca
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fecha as sugestões quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    onFilterChange({
      searchTerm,
      startDate,
      endDate
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    onFilterChange({
      searchTerm: suggestion,
      startDate,
      endDate
    });
  };

  return (
    <div className="glass p-3 md:p-4 rounded-xl shadow-lg mb-6 border border-white/5">
      <div className="flex flex-col md:flex-row md:justify-end items-start md:items-center gap-3">
        <div ref={searchRef} className="w-full md:w-auto flex items-center gap-3 relative">
          <label htmlFor="search" className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">
            Pesquisar:
          </label>
          <div className="relative w-full">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Jogador ou Time..."
              className="w-full md:w-64 bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-[#18181b] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-white/5 cursor-pointer text-sm text-gray-300"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-auto flex items-center gap-3">
          <label htmlFor="startDate" className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">
            De:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full md:w-auto bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="w-full md:w-auto flex items-center gap-3">
          <label htmlFor="endDate" className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">
            Até:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full md:w-auto bg-black/40 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
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