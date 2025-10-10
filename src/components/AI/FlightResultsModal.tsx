import React, { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Plane, Clock, DollarSign, Users, Calendar } from 'lucide-react';
import { FlightOption } from '@/types/flights';

interface FlightResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flights: FlightOption[];
  onSelectFlight?: (flight: FlightOption) => void;
}

export default function FlightResultsModal({
  isOpen,
  onClose,
  flights,
  onSelectFlight
}: FlightResultsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? flights.length - 1 : prev - 1));
  }, [flights.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === flights.length - 1 ? 0 : prev + 1));
  }, [flights.length]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrevious, handleNext, onClose]);

  const handleSelect = useCallback(() => {
    if (onSelectFlight && flights[currentIndex]) {
      onSelectFlight(flights[currentIndex]);
      onClose();
    }
  }, [currentIndex, flights, onSelectFlight, onClose]);

  if (!isOpen || flights.length === 0) return null;

  const currentFlight = flights[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl backdrop-blur-2xl bg-white/95 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Flight Results</h2>
                <p className="text-sm text-white/80 mt-1">
                  {flights.length} {flights.length === 1 ? 'flight' : 'flights'} found
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {flights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Flight Card Content */}
        <div className="p-8">
          <div className="relative">
            {/* Navigation Arrows */}
            {flights.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}

            {/* Flight Card */}
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 shadow-lg border border-blue-100">
              {/* Airline Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
                    <Plane className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {currentFlight.airline}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Flight {currentFlight.flightNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-sky-600">
                    ${currentFlight.price.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{currentFlight.currency}</p>
                </div>
              </div>

              {/* Route Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="text-4xl font-bold text-gray-800">
                      {currentFlight.departure}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(currentFlight.departureTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-0.5 bg-gradient-to-r from-sky-300 via-blue-500 to-sky-300 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Plane className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 font-medium">
                      {currentFlight.duration}
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <div className="text-4xl font-bold text-gray-800">
                      {currentFlight.arrival}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(currentFlight.arrivalTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-lg py-2 px-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(currentFlight.departureTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Flight Details Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-sky-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Stops
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {currentFlight.stops === 0 ? 'Direct' : `${currentFlight.stops} stop${currentFlight.stops > 1 ? 's' : ''}`}
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-sky-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Class
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {currentFlight.cabinClass}
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-sky-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Seats
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {currentFlight.availableSeats || 'Available'}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentFlight.stops === 0 && (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    ✈️ Direct Flight
                  </span>
                )}
                {currentFlight.cabinClass === 'BUSINESS' && (
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    💼 Business Class
                  </span>
                )}
                {currentFlight.price < 500 && (
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    💰 Great Deal
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSelect}
                  className="flex-1 py-3.5 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Select Flight
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Hint */}
          {flights.length > 1 && (
            <p className="text-center text-xs text-gray-500 mt-6">
              Use arrow keys ← → to navigate flights
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
