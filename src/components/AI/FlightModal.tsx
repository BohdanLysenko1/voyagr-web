import React, { useState, useMemo, useCallback } from 'react';
import { X, Plane, Clock, DollarSign, MapPin, ArrowRight, Filter, Check, ExternalLink } from 'lucide-react';
import { FlightOption } from '@/types/flights';
import { DateUtils } from '@/utils/dateUtils';

interface FlightModalProps {
  flights: FlightOption[];
  isOpen: boolean;
  onClose: () => void;
  onSelectFlight: (flight: FlightOption) => void;
}

type SortOption = 'price' | 'stops' | 'duration';

const FlightModal: React.FC<FlightModalProps> = ({
  flights,
  isOpen,
  onClose,
  onSelectFlight,
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
    onClose();
  }, [onSelectFlight, onClose]);

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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          {stops} Stops
        </span>
      );
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl max-h-[70vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Available Flights</h2>
                <p className="text-xs text-blue-100">
                  {processedFlights.length} flight{processedFlights.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Filters and Sort */}
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
            <div className="flex flex-wrap items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('price')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'price'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Price
                  </button>
                  <button
                    onClick={() => setSortBy('stops')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'stops'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    Stops
                  </button>
                  <button
                    onClick={() => setSortBy('duration')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'duration'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                    directOnly
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                  }`}
                >
                  {directOnly && <Check className="h-4 w-4" />}
                  Direct Flights Only
                </button>
              </div>
            </div>
          </div>

          {/* Flight List */}
          <div className="flex-1 overflow-y-auto p-4">
            {processedFlights.length === 0 ? (
              <div className="text-center py-12">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No flights match your filters</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filter settings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {processedFlights.map((flight) => {
                  const price = Number(flight.price) || 0;
                  const isBestPrice = price === lowestPrice && price > 0;
                  
                  return (
                  <div
                    key={flight.id}
                    className={`group relative glass-card border-2 rounded-xl p-3 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${
                      isBestPrice
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50/50 to-indigo-50/50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {/* Best Price Badge */}
                    {isBestPrice && (
                      <div className="absolute -top-2.5 -right-2.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg z-10">
                        ⚡ BEST DEAL
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-6">
                      {/* Left: Airline & Route */}
                      <div className="flex-1">
                        {/* Airline Info */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                            {flight.airline.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{flight.airline}</p>
                            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                          </div>
                          {getStopsBadge(flight.stops)}
                        </div>

                        {/* Route */}
                        <div className="flex items-center gap-3">
                          {/* Departure */}
                          <div className="flex-shrink-0">
                            <p className="text-lg font-bold text-gray-900">
                              {formatTime(flight.departureTime)}
                            </p>
                            <p className="text-xs text-gray-600 font-semibold">{flight.departure}</p>
                            <p className="text-xs text-gray-500">{formatDate(flight.departureTime)}</p>
                          </div>

                          {/* Journey Line */}
                          <div className="flex-1 flex flex-col items-center justify-center min-w-[120px]">
                            <div className="w-full flex items-center">
                              <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-400 to-indigo-400" />
                              <Plane className="h-4 w-4 text-blue-500 mx-2 rotate-90" />
                              <div className="h-0.5 flex-1 bg-gradient-to-r from-indigo-400 to-purple-400" />
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 px-2 py-0.5 bg-gray-100 rounded-full">
                              <Clock className="h-3 w-3 text-gray-600" />
                              <span className="text-xs font-medium text-gray-700">{flight.duration}</span>
                            </div>
                          </div>

                          {/* Arrival */}
                          <div className="flex-shrink-0 text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatTime(flight.arrivalTime)}
                            </p>
                            <p className="text-xs text-gray-600 font-semibold">{flight.arrival}</p>
                            <p className="text-xs text-gray-500">{formatDate(flight.arrivalTime)}</p>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 font-medium rounded">
                            {flight.cabinClass}
                          </span>
                          {flight.availableSeats && flight.availableSeats < 10 && (
                            <span className="text-xs text-orange-600 font-medium">
                              ⚠️ Only {flight.availableSeats} seats left
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Price & Action */}
                      <div className="flex flex-col items-end justify-center gap-2 pl-4 border-l-2 border-gray-200">
                        <div className="text-right">
                          {price > 0 ? (
                            <>
                              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                ${price.toFixed(0)}
                              </p>
                              <p className="text-xs text-gray-500 font-medium">per person</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 font-medium">Price unavailable</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 w-full min-w-[180px]">
                          <button
                            onClick={() => handleSelectFlight(flight)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
                          >
                            Select Flight
                          </button>

                          {/* Book Flight Button */}
                          {flight.bookingUrl && (
                            <div className="relative group/tooltip">
                              <a
                                href={flight.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap group"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                                <span className="text-xs">View on Google Flights</span>
                              </a>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-xl z-50">
                                See similar flights & booking options
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
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

export default FlightModal;
