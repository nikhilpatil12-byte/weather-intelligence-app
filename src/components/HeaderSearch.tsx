import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass, Thermometer, Loader2, X, AlertCircle } from 'lucide-react';
import { GeocodingResult, TemperatureUnit } from '../types/weather';
import { searchCities } from '../services/weatherApi';

interface HeaderSearchProps {
  onSelectCity: (city: GeocodingResult | string) => void;
  onUseLocation: () => void;
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  isLoading: boolean;
  isLocationLoading: boolean;
}

const POPULAR_CITIES = [
  'New York',
  'London',
  'Tokyo',
  'Paris',
  'Sydney',
  'San Francisco',
];

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  onSelectCity,
  onUseLocation,
  unit,
  onToggleUnit,
  isLoading,
  isLocationLoading,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced geocoding search for autocomplete suggestions
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchCities(query);
        setSuggestions(res);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchError('Please enter a city name to search.');
      return;
    }
    setSearchError(null);
    setShowSuggestions(false);
    onSelectCity(trimmed);
  };

  const handleSelectSuggestion = (city: GeocodingResult) => {
    setQuery(city.name);
    setShowSuggestions(false);
    setSearchError(null);
    onSelectCity(city);
  };

  const handleQuickCityClick = (city: string) => {
    setQuery(city);
    setSearchError(null);
    onSelectCity(city);
  };

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Weather Intelligence
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Powered by Open-Meteo & AI
                </p>
              </div>
            </div>

            {/* Mobile unit toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => onToggleUnit(unit === 'C' ? 'F' : 'C')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Toggle Temperature Unit"
              >
                °{unit}
              </button>
            </div>
          </div>

          {/* Search Bar & Autocomplete */}
          <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
            <form onSubmit={handleFormSubmit} className="relative flex items-center">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="city-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                    if (searchError) setSearchError(null);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search city (e.g., Tokyo, London, Toronto)..."
                  className="w-full pl-10 pr-24 py-2.5 bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-xl border border-transparent focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition text-sm"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSuggestions([]);
                    }}
                    className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
                </button>
              </div>

              {/* GPS Geolocation button */}
              <button
                type="button"
                onClick={onUseLocation}
                disabled={isLocationLoading || isLoading}
                className="ml-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/40 dark:hover:text-sky-400 border border-transparent hover:border-sky-200 dark:hover:border-sky-800 transition disabled:opacity-50 flex items-center justify-center shrink-0"
                title="Use Current GPS Location"
                aria-label="Use Current GPS Location"
              >
                {isLocationLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </button>
            </form>

            {/* Error badge for empty search */}
            {searchError && (
              <div className="absolute left-0 right-0 top-full mt-1 px-3 py-2 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded-lg flex items-center gap-2 shadow-lg z-50">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Autocomplete Dropdown */}
            {showSuggestions && (suggestions.length > 0 || isSearching) && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                {isSearching && suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching cities...</span>
                  </div>
                ) : (
                  <ul className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                    {suggestions.map((item, idx) => (
                      <li key={`${item.id || item.name}-${idx}`}>
                        <button
                          type="button"
                          onClick={() => handleSelectSuggestion(item)}
                          className="w-full text-left px-4 py-3 hover:bg-sky-50 dark:hover:bg-slate-700/60 transition flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                            <div>
                              <span className="text-sm font-medium text-slate-800 dark:text-white">
                                {item.name}
                              </span>
                              {item.admin1 && (
                                <span className="text-xs text-slate-400 ml-1.5">
                                  {item.admin1}
                                </span>
                              )}
                            </div>
                          </div>
                          {item.country && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {item.country}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Unit Toggle & Quick Chips Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => onToggleUnit('C')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  unit === 'C'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                °C
              </button>
              <button
                type="button"
                onClick={() => onToggleUnit('F')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  unit === 'F'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                °F
              </button>
            </div>
          </div>
        </div>

        {/* Quick City Chips Bar */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-medium text-slate-400 shrink-0">Popular:</span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleQuickCityClick(c)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 transition whitespace-nowrap"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
