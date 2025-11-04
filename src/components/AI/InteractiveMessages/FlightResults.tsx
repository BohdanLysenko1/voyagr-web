import React, { useState, useMemo, useCallback } from 'react';
import { Plane, Clock, ArrowRight, Filter, Check, Sparkles, ExternalLink } from 'lucide-react';
import { FlightOption } from '@/types/flights';
import { DateUtils } from '@/utils/dateUtils';

interface FlightResultsProps {
  flights: FlightOption[];
  onSelectFlight: (flight: FlightOption) => void;
  selectedFlightId?: string;
  onConfirm?: () => void;
}

type SortOption = 'price' | 'stops' | 'duration';

const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  onSelectFlight,
  selectedFlightId,
  onConfirm,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [directOnly, setDirectOnly] = useState(false);

  // Filter and sort flights
  const processedFlights = useMemo(() => {
    let filtered = [...flights];

    // Apply direct flights filter
    if (directOnly) {
      filtered = filtered.filter(flight => flight.stops === 0);
    }

    // Sort flights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return Number(a.price) - Number(b.price);
        case 'stops':
          return a.stops - b.stops;
        case 'duration':
          const aDuration = parseDuration(a.duration);
          const bDuration = parseDuration(b.duration);
          return aDuration - bDuration;
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, sortBy, directOnly]);

  // Find lowest price
  const lowestPrice = useMemo(() => {
    if (processedFlights.length === 0) return 0;
    return Math.min(...processedFlights.map(f => Number(f.price)));
  }, [processedFlights]);

  const handleSelectFlight = useCallback((flight: FlightOption) => {
    onSelectFlight(flight);
  }, [onSelectFlight]);

  const formatTime = useCallback((isoString: string) => {
    return DateUtils.formatFlightTime(isoString);
  }, []);

  const formatDate = useCallback((isoString: string) => {
    return DateUtils.formatFlightDateShort(isoString);
  }, []);

  const getStopsBadge = useCallback((stops: number) => {
    if (stops === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          Direct
        </span>
      );
    } else if (stops === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          1 Stop
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
          {stops} Stops
        </span>
      );
    }
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Filters Section */}
      <div className="glass-card rounded-xl p-4 border border-primary/20">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('price')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sortBy === 'price'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'glass-card text-gray-700 hover:bg-white/60 border border-gray-200'
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setSortBy('stops')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sortBy === 'stops'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'glass-card text-gray-700 hover:bg-white/60 border border-gray-200'
                }`}
              >
                Stops
              </button>
              <button
                onClick={() => setSortBy('duration')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sortBy === 'duration'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'glass-card text-gray-700 hover:bg-white/60 border border-gray-200'
                }`}
              >
                Duration
              </button>
            </div>
          </div>

          {/* Direct Flights Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setDirectOnly(!directOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                directOnly
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md'
                  : 'glass-card text-gray-700 hover:bg-white/60 border-gray-200'
              }`}
            >
              {directOnly && <Check className="h-4 w-4" />}
              Direct Only
            </button>
          </div>
        </div>
      </div>

      {/* Flight Results */}
      {processedFlights.length === 0 ? (
        <div className="glass-card rounded-xl p-8 border border-primary/20 text-center">
          <Plane className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No flights match your filters</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filter settings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {processedFlights.map((flight) => {
            const isSelected = selectedFlightId === flight.id;
            const isBestPrice = Number(flight.price) === lowestPrice;

            return (
              <div
                key={flight.id}
                onClick={() => handleSelectFlight(flight)}
                className={`relative glass-card rounded-xl p-5 border-2 transition-all duration-200 cursor-pointer group
                  ${isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-300 shadow-lg' 
                    : isBestPrice
                      ? 'border-blue-400 hover:border-blue-500 hover:shadow-lg'
                      : 'border-primary/20 hover:border-blue-300 hover:shadow-md'
                  }
                `}
              >
                {/* Best Price Badge */}
                {isBestPrice && !isSelected && (
                  <div className="absolute -top-2.5 left-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    BEST PRICE
                  </div>
                )}

                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute -top-2.5 left-4 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    SELECTED
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  {/* Flight Info */}
                  <div className="flex-1">
                    {/* Airline */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-gray-900">{flight.airline}</span>
                      <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                      {getStopsBadge(flight.stops)}
                    </div>

                    {/* Route and Times */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatTime(flight.departureTime)}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{flight.departure}</p>
                            <p className="text-xs text-gray-500">{formatDate(flight.departureTime)}</p>
                          </div>

                          <div className="flex-1 flex flex-col items-center">
                            <div className="flex items-center gap-2 text-gray-500">
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                              <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">{flight.duration}</span>
                              </div>
                              <ArrowRight className="h-4 w-4" />
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                            </div>
                            {flight.stops > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {flight.stops} {flight.stops === 1 ? 'stop' : 'stops'}
                              </p>
                            )}
                          </div>

                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatTime(flight.arrivalTime)}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{flight.arrival}</p>
                            <p className="text-xs text-gray-500">{formatDate(flight.arrivalTime)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md font-medium">
                        {flight.cabinClass}
                      </span>
                      {flight.availableSeats && (
                        <span className="text-gray-500">{flight.availableSeats} seats left</span>
                      )}
                    </div>
                  </div>

                  {/* Price and Booking */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ${Number(flight.price).toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{flight.currency} per person</p>
                    </div>
                    
                    {/* Book Flight Button */}
                    {flight.bookingUrl && (
                      <a
                        href={flight.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 
                          text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 
                          active:scale-95 transition-all duration-200 text-sm"
                      >
                        Book Flight
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Button */}
      {selectedFlightId && onConfirm && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium
              hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Parse duration string to minutes for sorting
 */
function parseDuration(duration: string): number {
  const hourMatch = duration.match(/(\d+)h/);
  const minuteMatch = duration.match(/(\d+)m/);
  
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
  
  return hours * 60 + minutes;
}

export default FlightResults;
