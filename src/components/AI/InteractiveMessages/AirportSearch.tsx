import React, { useState, useEffect, useCallback } from 'react';
import { Airport } from '@/types/flights';
import { Search, Loader2, MapPin } from 'lucide-react';

interface AirportSearchProps {
  onSelect: (airport: Airport) => void;
  placeholder?: string;
  label?: string;
  defaultValue?: Airport;
}

export default function AirportSearch({
  onSelect,
  placeholder = 'Search airports...',
  label = 'Airport',
  defaultValue,
}: AirportSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(defaultValue || null);

  const searchAirports = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/flights/airports?keyword=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Airport search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedAirport) return; // Don't search if already selected

    const debounce = setTimeout(() => {
      searchAirports(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, searchAirports, selectedAirport]);

  const handleSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    onSelect(airport);
    setQuery(`${airport.name} (${airport.iataCode})`);
    setShowResults(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedAirport(null);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (!selectedAirport && results.length > 0) {
              setShowResults(true);
            }
          }}
          onBlur={() => {
            // Delay to allow click on results
            setTimeout(() => setShowResults(false), 200);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 glass-input rounded-xl border border-white/60
                     focus:outline-none focus:ring-2 focus:ring-primary/50 neon-glow
                     text-gray-900 placeholder-gray-500 transition-all"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary animate-spin pointer-events-none" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 glass-panel rounded-xl border border-white/60 shadow-xl max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
          {results.map((airport) => (
            <button
              key={airport.iataCode}
              onClick={() => handleSelect(airport)}
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur
              className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors
                         flex items-start gap-3 border-b border-white/20 last:border-0"
            >
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {airport.name}
                </p>
                <p className="text-xs text-gray-600">
                  {airport.city}, {airport.country} ({airport.iataCode})
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
