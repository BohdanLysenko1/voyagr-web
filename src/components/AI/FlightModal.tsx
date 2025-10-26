import React, { useState, useMemo, useCallback } from 'react';
import { X, Plane, Clock, DollarSign, MapPin, ArrowRight, Filter, Check } from 'lucide-react';
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
        <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Available Flights</h2>
                <p className="text-sm text-blue-100">
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
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
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
          <div className="flex-1 overflow-y-auto p-6">
            {processedFlights.length === 0 ? (
              <div className="text-center py-12">
                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No flights match your filters</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filter settings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {processedFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className={`relative bg-white border-2 rounded-xl p-5 transition-all hover:shadow-lg hover:border-blue-400 ${
                      Number(flight.price) === lowestPrice
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Best Price Badge */}
                    {Number(flight.price) === lowestPrice && (
                      <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                        BEST PRICE
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
                                  <div className="h-px flex-1 bg-gray-300" />
                                  <div className="flex items-center gap-1 text-xs">
                                    <Clock className="h-3 w-3" />
                                    <span>{flight.duration}</span>
                                  </div>
                                  <ArrowRight className="h-4 w-4" />
                                  <div className="h-px flex-1 bg-gray-300" />
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
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {flight.cabinClass}
                          </span>
                          {flight.availableSeats && (
                            <span>{flight.availableSeats} seats left</span>
                          )}
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-600">
                            ${Number(flight.price).toFixed(0)}
                          </p>
                          <p className="text-xs text-gray-500">{flight.currency} per person</p>
                        </div>
                        <button
                          onClick={() => handleSelectFlight(flight)}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                          Select Flight
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
