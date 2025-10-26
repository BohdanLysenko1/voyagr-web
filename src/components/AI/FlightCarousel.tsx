import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plane, Clock, DollarSign, Users, Calendar, CheckCircle } from 'lucide-react';
import { FlightOption } from '@/types/flights';
import { DateUtils } from '@/utils/dateUtils';

interface FlightCarouselProps {
  flights: FlightOption[];
  onSelectFlight?: (flight: FlightOption) => void;
}

export default function FlightCarousel({ flights, onSelectFlight }: FlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? flights.length - 1 : prev - 1));
  }, [flights.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === flights.length - 1 ? 0 : prev + 1));
  }, [flights.length]);

  const handleSelect = useCallback((flight: FlightOption) => {
    setSelectedFlightId(flight.id);
    onSelectFlight?.(flight);
  }, [onSelectFlight]);

  if (flights.length === 0) return null;

  const currentFlight = flights[currentIndex];

  return (
    <div className="my-4 w-full max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-sky-600" />
          <span className="text-sm font-semibold text-gray-700">
            {flights.length} {flights.length === 1 ? 'flight' : 'flights'} found
          </span>
        </div>
        {flights.length > 1 && (
          <span className="text-xs text-gray-500">
            {currentIndex + 1} of {flights.length}
          </span>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        {flights.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2.5 rounded-full bg-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border border-gray-200"
              aria-label="Previous flight"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2.5 rounded-full bg-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border border-gray-200"
              aria-label="Next flight"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Flight Card */}
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl p-5 shadow-lg border border-blue-100/50 backdrop-blur-sm">
          {/* Airline Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {currentFlight.airline}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Flight {currentFlight.flightNumber}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-sky-600">
                ${Number(currentFlight.price).toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">{currentFlight.currency}</p>
            </div>
          </div>

          {/* Route Visualization */}
          <div className="mb-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="text-3xl font-bold text-gray-800">
                  {currentFlight.departure}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {DateUtils.formatFlightTime(currentFlight.departureTime)}
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="w-full h-0.5 bg-gradient-to-r from-sky-300 via-blue-500 to-sky-300 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Plane className="w-4 h-4 text-blue-600 rotate-90" />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 font-medium">
                  {currentFlight.duration}
                </div>
              </div>

              <div className="flex-1 text-right">
                <div className="text-3xl font-bold text-gray-800">
                  {currentFlight.arrival}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {DateUtils.formatFlightTime(currentFlight.arrivalTime)}
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-blue-50/50 rounded-lg py-2 px-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {DateUtils.formatFlightDate(currentFlight.departureTime)}
              </span>
            </div>
          </div>

          {/* Flight Details Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-semibold text-gray-600 uppercase">
                  Stops
                </span>
              </div>
              <div className="text-base font-bold text-gray-800">
                {currentFlight.stops === 0 ? 'Direct' : `${currentFlight.stops}`}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Users className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-semibold text-gray-600 uppercase">
                  Class
                </span>
              </div>
              <div className="text-base font-bold text-gray-800">
                {currentFlight.cabinClass}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-semibold text-gray-600 uppercase">
                  Seats
                </span>
              </div>
              <div className="text-base font-bold text-gray-800">
                {currentFlight.availableSeats || '9+'}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {currentFlight.stops === 0 && (
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                ✈️ Direct
              </span>
            )}
            {currentFlight.cabinClass === 'BUSINESS' && (
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                💼 Business
              </span>
            )}
            {Number(currentFlight.price) < 500 && (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                💰 Great Deal
              </span>
            )}
          </div>

          {/* Select Button */}
          <button
            onClick={() => handleSelect(currentFlight)}
            disabled={selectedFlightId === currentFlight.id}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              selectedFlightId === currentFlight.id
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {selectedFlightId === currentFlight.id ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Selected
              </>
            ) : (
              'Select This Flight'
            )}
          </button>
        </div>

        {/* Progress Dots */}
        {flights.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {flights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-sky-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to flight ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
