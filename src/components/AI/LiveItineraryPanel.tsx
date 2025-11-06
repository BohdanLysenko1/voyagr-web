import React, { useMemo, useRef, useEffect } from 'react';
import { MapPin, Calendar, Users, DollarSign, Plane, Building2, Clock, TrendingUp } from 'lucide-react';
import { TripItinerary } from '@/types/tripPlanning';

interface LiveItineraryPanelProps {
  itinerary: Partial<TripItinerary>;
  isVisible?: boolean;
}

export default function LiveItineraryPanel({ itinerary, isVisible = true }: LiveItineraryPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const hotelRef = useRef<HTMLDivElement>(null);

  // Validate and normalize itinerary data
  const normalizedItinerary = useMemo(() => {
    if (!itinerary) return {};

    const normalized: Partial<TripItinerary> = { ...itinerary };

    // Normalize dates if they exist
    if (normalized.dates) {
      try {
        if (normalized.dates.startDate && !(normalized.dates.startDate instanceof Date)) {
          normalized.dates = {
            ...normalized.dates,
            startDate: new Date(normalized.dates.startDate as any)
          };
        }
        if (normalized.dates.endDate && !(normalized.dates.endDate instanceof Date)) {
          normalized.dates = {
            ...normalized.dates,
            endDate: new Date(normalized.dates.endDate as any)
          };
        }
      } catch (error) {
        console.error('Error normalizing dates:', error);
        delete normalized.dates;
      }
    }

    return normalized;
  }, [itinerary]);

  const totalSpent = useMemo(() => {
    let total = 0;
    if (normalizedItinerary.flight?.price) {
      const flightPrice = typeof normalizedItinerary.flight.price === 'object'
        ? (normalizedItinerary.flight.price as any).amount || 0
        : normalizedItinerary.flight.price;
      total += flightPrice;
    }
    if (normalizedItinerary.hotel?.pricePerNight && normalizedItinerary.dates?.startDate && normalizedItinerary.dates?.endDate) {
      const hotelPrice = typeof normalizedItinerary.hotel.pricePerNight === 'object'
        ? (normalizedItinerary.hotel.pricePerNight as any).amount || 0
        : normalizedItinerary.hotel.pricePerNight;
      try {
        const startTime = normalizedItinerary.dates.startDate.getTime();
        const endTime = normalizedItinerary.dates.endDate.getTime();
        const nights = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
        total += hotelPrice * nights;
      } catch (error) {
        console.error('Error calculating hotel nights:', error);
      }
    }
    if (normalizedItinerary.selectedActivities) {
      total += normalizedItinerary.selectedActivities.reduce((sum, act) => sum + (act.price || 0), 0);
    }
    return total;
  }, [normalizedItinerary]);

  const budgetPercentage = useMemo(() => {
    // Handle case where budget might be {amount, currency} or {total, ...}
    const budgetTotal = typeof normalizedItinerary.budget === 'object'
      ? (normalizedItinerary.budget as any).total || (normalizedItinerary.budget as any).amount || 0
      : 0;
    if (!budgetTotal) return 0;
    return (totalSpent / budgetTotal) * 100;
  }, [totalSpent, normalizedItinerary.budget]);

  const tripDuration = useMemo(() => {
    if (!normalizedItinerary.dates?.startDate || !normalizedItinerary.dates?.endDate) return null;
    try {
      const startTime = normalizedItinerary.dates.startDate.getTime();
      const endTime = normalizedItinerary.dates.endDate.getTime();
      const days = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
      return days;
    } catch (error) {
      console.error('Error calculating trip duration:', error);
      return null;
    }
  }, [normalizedItinerary.dates]);

  // Auto-scroll to newly added flight (within container only)
  useEffect(() => {
    if (normalizedItinerary.flight && flightRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const element = flightRef.current;
        if (container && element) {
          const elementTop = element.offsetTop;
          const containerHeight = container.clientHeight;
          const elementHeight = element.clientHeight;
          const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);

          container.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
    }
  }, [normalizedItinerary.flight]);

  // Auto-scroll to newly added hotel (within container only)
  useEffect(() => {
    if (normalizedItinerary.hotel && hotelRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const element = hotelRef.current;
        if (container && element) {
          const elementTop = element.offsetTop;
          const containerHeight = container.clientHeight;
          const elementHeight = element.clientHeight;
          const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);

          container.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
    }
  }, [normalizedItinerary.hotel]);

  if (!isVisible) return null;

  return (
    <div className="glass-panel rounded-3xl border border-white/40 shadow-xl
                    animate-in slide-in-from-right duration-500 flex flex-col
                    h-full overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-4 border-b border-white/30">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Live Itinerary</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-primary">Building...</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-6 pt-5 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30 pr-4"
        style={{ scrollBehavior: 'smooth', minHeight: 0 }}>

      {/* Route: Origin to Destination */}
      {(normalizedItinerary.origin || normalizedItinerary.destination) && (
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-4 animate-in fade-in slide-in-from-right duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Plane className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              {normalizedItinerary.origin && normalizedItinerary.destination ? (
                <>
                  <p className="text-xs text-gray-600 font-medium mb-1">Route</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-gray-900">
                      {normalizedItinerary.origin.city}
                    </p>
                    <span className="text-gray-400">→</span>
                    <p className="text-base font-bold text-gray-900">
                      {normalizedItinerary.destination.city}
                    </p>
                  </div>
                </>
              ) : normalizedItinerary.origin ? (
                <>
                  <p className="text-xs text-gray-600 font-medium">Origin</p>
                  <p className="text-base font-bold text-gray-900">
                    {normalizedItinerary.origin.city}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-600 font-medium">Destination</p>
                  <p className="text-base font-bold text-gray-900">
                    {normalizedItinerary.destination?.city}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trip Overview Grid */}
      <div className="grid grid-cols-2 gap-3">
        {normalizedItinerary.dates?.startDate && normalizedItinerary.dates?.endDate && (
          <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3 animate-in fade-in duration-300 delay-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-600 font-medium">Dates</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {(normalizedItinerary.dates.startDate instanceof Date
                ? normalizedItinerary.dates.startDate
                : new Date(normalizedItinerary.dates.startDate)
              ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
              {(normalizedItinerary.dates.endDate instanceof Date
                ? normalizedItinerary.dates.endDate
                : new Date(normalizedItinerary.dates.endDate)
              ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            {tripDuration && (
              <p className="text-xs text-gray-500 mt-1">{tripDuration} days</p>
            )}
          </div>
        )}

        {normalizedItinerary.travelers && (
          <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3 animate-in fade-in duration-300 delay-150">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-gray-600 font-medium">Travelers</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {normalizedItinerary.travelers} {normalizedItinerary.travelers === 1 ? 'Person' : 'People'}
            </p>
          </div>
        )}
      </div>

      {/* Budget Tracker */}
      {normalizedItinerary.budget && (
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-4 animate-in fade-in duration-300 delay-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600 font-medium">Budget</span>
            </div>
            <span className="text-xs font-semibold text-gray-600">
              {budgetPercentage.toFixed(0)}% used
            </span>
          </div>

          {/* Budget Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-500 rounded-full ${
                budgetPercentage > 90
                  ? 'bg-red-500'
                  : budgetPercentage > 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-gray-900">${totalSpent.toLocaleString()}</span>
            <span className="text-gray-600">
              of ${((normalizedItinerary.budget as any).total || (normalizedItinerary.budget as any).amount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Travel Preferences/Interests */}
      {normalizedItinerary.preferences?.interests && normalizedItinerary.preferences.interests.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-4 animate-in fade-in duration-300 delay-250">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Interests</h3>
            <span className="text-xs text-gray-600">
              {normalizedItinerary.preferences.interests.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {normalizedItinerary.preferences.interests.map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-lg text-xs font-medium
                           bg-primary/10 text-primary border border-primary/20 capitalize"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Flight & Hotel Summary */}
      <div className="space-y-3">
        {normalizedItinerary.flight && (
          <div
            ref={flightRef}
            className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3 animate-in fade-in duration-300 delay-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Plane className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Flight</p>
                  <p className="text-sm font-semibold text-gray-900">{normalizedItinerary.flight.airline}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">
                ${typeof normalizedItinerary.flight.price === 'object'
                  ? (normalizedItinerary.flight.price as any).amount || 0
                  : normalizedItinerary.flight.price}
              </span>
            </div>
          </div>
        )}

        {normalizedItinerary.hotel && (
          <div
            ref={hotelRef}
            className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3 animate-in fade-in duration-300 delay-350">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Hotel</p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{normalizedItinerary.hotel.name}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">
                ${typeof normalizedItinerary.hotel.pricePerNight === 'object'
                  ? (normalizedItinerary.hotel.pricePerNight as any).amount || 0
                  : normalizedItinerary.hotel.pricePerNight}/nt
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Daily Timeline */}
      {normalizedItinerary.dailyPlan && normalizedItinerary.dailyPlan.length > 0 && (
        <div className="space-y-3 animate-in fade-in duration-300 delay-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-gray-900">Day-by-Day Plan</h3>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
            {normalizedItinerary.dailyPlan.map((day, idx) => (
              <div
                key={idx}
                className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3"
              >
                <p className="text-xs font-semibold text-primary mb-2">
                  Day {idx + 1} - {day.date
                    ? (day.date instanceof Date
                        ? day.date
                        : new Date(day.date)
                      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : ''}
                </p>
                <div className="space-y-2">
                  {day.activities.slice(0, 3).map((activity, actIdx) => (
                    <div key={actIdx} className="flex items-start gap-2">
                      <span className="text-xs text-gray-500 font-medium w-12">{activity.time}</span>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900">{activity.title}</p>
                        {activity.location && (
                          <p className="text-xs text-gray-500">{activity.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Activities */}
      {normalizedItinerary.selectedActivities && normalizedItinerary.selectedActivities.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-4 animate-in fade-in duration-300 delay-450">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Activities</h3>
            <span className="text-xs text-gray-600">
              {normalizedItinerary.selectedActivities.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {normalizedItinerary.selectedActivities.slice(0, 5).map((activity) => (
              <span
                key={activity.id}
                className="px-2 py-1 rounded-lg text-xs font-medium
                           bg-purple-100 text-purple-700 border border-purple-200"
              >
                {activity.name}
              </span>
            ))}
            {normalizedItinerary.selectedActivities.length > 5 && (
              <span className="px-2 py-1 rounded-lg text-xs font-medium text-gray-600">
                +{normalizedItinerary.selectedActivities.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Trip Stats */}
      {(normalizedItinerary.budget || normalizedItinerary.selectedActivities) && (
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3 animate-in fade-in duration-300 delay-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Quick Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">{normalizedItinerary.selectedActivities?.length || 0}</p>
              <p className="text-xs text-gray-600">Activities</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{tripDuration || 0}</p>
              <p className="text-xs text-gray-600">Days</p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
