import React, { useState, useMemo, useCallback } from 'react';
import { Plane, Clock, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { FlightOption } from '@/types/flights';
import { DateUtils } from '@/utils/dateUtils';

interface FlightListProps {
  flights: FlightOption[];
  onSelectFlight?: (flight: FlightOption) => void;
  selectedFlightId?: string;
}

const FlightList: React.FC<FlightListProps> = ({
  flights,
  onSelectFlight,
  selectedFlightId,
}) => {
  const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');

  // Sort flights
  const sortedFlights = useMemo(() => {
    const sorted = [...flights];
    sorted.sort((a, b) => {
      if (sortBy === 'price') {
        return Number(a.price) - Number(b.price);
      } else {
        const aDuration = parseDuration(a.duration);
        const bDuration = parseDuration(b.duration);
        return aDuration - bDuration;
      }
    });
    return sorted;
  }, [flights, sortBy]);

  const handleSelectFlight = useCallback((flight: FlightOption) => {
    onSelectFlight?.(flight);
  }, [onSelectFlight]);

  if (flights.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-600">No flights found. Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Header with sort */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">
            {flights.length} {flights.length === 1 ? 'Flight' : 'Flights'} Available
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setSortBy('price')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              sortBy === 'price'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Best Price
          </button>
          <button
            onClick={() => setSortBy('duration')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              sortBy === 'duration'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Shortest
          </button>
        </div>
      </div>

      {/* Flight List */}
      <div className="space-y-2.5">
        {sortedFlights.map((flight, index) => {
          const isSelected = selectedFlightId === flight.id;
          const isBestPrice = index === 0 && sortBy === 'price';
          
          return (
            <div
              key={flight.id}
              className={`relative p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50/50'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              {isBestPrice && (
                <div className="absolute -top-2 left-3 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                  BEST DEAL
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                {/* Flight Info */}
                <div className="flex-1 min-w-0">
                  {/* Airline */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      {flight.airline.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {flight.airline}
                      </p>
                      <p className="text-xs text-gray-500">{flight.flightNumber}</p>
                    </div>
                    {flight.stops === 0 ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                        Direct
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                        {flight.stops} Stop{flight.stops > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900">
                        {DateUtils.formatFlightTime(flight.departureTime)}
                      </span>
                      <span className="text-xs text-gray-600">{flight.departure}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ArrowRight className="w-3 h-3" />
                      <Clock className="w-3 h-3" />
                      <span>{flight.duration}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900">
                        {DateUtils.formatFlightTime(flight.arrivalTime)}
                      </span>
                      <span className="text-xs text-gray-600">{flight.arrival}</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-gray-500">
                      {DateUtils.formatFlightDateShort(flight.departureTime)}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{flight.cabinClass}</span>
                    {flight.availableSeats && flight.availableSeats < 10 && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-orange-600 font-medium">
                          Only {flight.availableSeats} seats left
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex flex-col items-end gap-2.5 pl-4 border-l border-gray-200 min-w-[140px]">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${Number(flight.price).toFixed(0)}
                    </div>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  
                  {isSelected ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 rounded text-sm font-semibold w-full justify-center">
                      <Check className="w-4 h-4" />
                      Selected
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelectFlight(flight)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors w-full"
                    >
                      Select
                    </button>
                  )}
                  
                  {flight.bookingUrl && (
                    <a
                      href={flight.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition-colors w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Book
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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

export default FlightList;
