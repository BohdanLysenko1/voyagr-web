import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Search, MapPin, CheckCircle2, X, Loader2 } from 'lucide-react';

interface Country {
  id: string;
  name: string;
  emoji: string;
  value: string;
  code: string;
}

interface CountrySearchProps {
  onSelect: (value: string) => void;
  selectedValue?: string;
  gradientColors?: string;
}

// Utility to convert country code to flag emoji
const getFlagEmoji = (countryCode: string): string => {
  return countryCode
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
};

export default function CountrySearch({
  onSelect,
  selectedValue = '',
  gradientColors = 'from-primary/30 to-purple-500/30'
}: CountrySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch countries from REST Countries API on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,cca2,flag'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }

        const data = await response.json();
        
        // Transform API data to our Country format
        const formattedCountries: Country[] = data
          .map((country: any, index: number) => ({
            id: String(index + 1),
            name: country.name.common,
            emoji: country.flag || getFlagEmoji(country.cca2),
            value: country.name.common.toLowerCase().replace(/\s+/g, '-'),
            code: country.cca2,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name)); // Sort alphabetically

        setCountries(formattedCountries);
        setError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const query = searchQuery.toLowerCase();
    return countries.filter(country =>
      country.name.toLowerCase().includes(query) ||
      country.value.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query)
    );
  }, [searchQuery, countries]);

  const handleSelect = useCallback((value: string, name: string) => {
    onSelect(value);
    setSearchQuery(name);
    setIsOpen(false);
  }, [onSelect]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setIsOpen(true);
  }, []);

  const selectedCountry = useMemo(() => {
    return countries.find((c: Country) => c.value === selectedValue);
  }, [selectedValue, countries]);

  return (
    <div className="mt-3 relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary z-10">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={isLoading ? "Loading countries..." : "Search for a country..."}
          disabled={isLoading || !!error}
          className="glass-card border border-white/40 rounded-xl px-4 py-3 pl-11 pr-10 w-full text-sm font-medium text-gray-700
                     hover:border-primary/30 hover:shadow-md transition-all duration-300
                     focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40
                     placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {searchQuery && !isLoading && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-2 p-3 glass-card border-2 border-red-400/40 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {selectedCountry && !isOpen && (
        <div className="mt-2 p-3 glass-card border-2 border-primary/40 rounded-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-2xl">{selectedCountry.emoji}</span>
            <span className="text-sm font-medium text-gray-900">{selectedCountry.name}</span>
            <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
          </div>
        </div>
      )}

      {isOpen && !isLoading && filteredCountries.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[9999] glass-panel rounded-2xl shadow-xl border border-white/40 
                        backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[280px] overflow-hidden">
          <div className="p-2 overflow-y-auto max-h-[280px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {filteredCountries.map((country) => {
              const isSelected = selectedValue === country.value;
              return (
                <button
                  key={country.id}
                  onClick={() => handleSelect(country.value, country.name)}
                  className={`group w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3
                    ${isSelected ? `bg-gradient-to-r ${gradientColors} border-2 border-primary/40 shadow-md` : 'hover:bg-white/40 border-2 border-transparent'}`}
                >
                  <span className="text-2xl flex-shrink-0">{country.emoji}</span>
                  <span className={`text-sm font-medium flex-1 ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {country.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isOpen && !isLoading && searchQuery && filteredCountries.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[9999] glass-panel rounded-2xl shadow-xl border border-white/40 
                        backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 p-6 text-center">
          <p className="text-gray-600 text-sm">No countries found matching "{searchQuery}"</p>
          <button onClick={handleClearSearch} className="mt-3 text-primary text-sm font-medium hover:underline">
            Clear search
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
