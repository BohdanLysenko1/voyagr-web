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
  const totalSpent = useMemo(() => {
    let total = 0;
    if (itinerary.flight?.price) total += itinerary.flight.price;
    if (itinerary.hotel?.pricePerNight && itinerary.dates) {
      const nights = Math.ceil(
        (itinerary.dates.endDate.getTime() - itinerary.dates.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      total += itinerary.hotel.pricePerNight * nights;
    }
    if (itinerary.selectedActivities) {
      total += itinerary.selectedActivities.reduce((sum, act) => sum + act.price, 0);
    }
    return total;
  }, [itinerary]);

  const budgetPercentage = useMemo(() => {
    if (!itinerary.budget?.total) return 0;
    return (totalSpent / itinerary.budget.total) * 100;
  }, [totalSpent, itinerary.budget]);

  const tripDuration = useMemo(() => {
    if (!itinerary.dates) return null;
    const days = Math.ceil(
      (itinerary.dates.endDate.getTime() - itinerary.dates.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  }, [itinerary.dates]);

  // Auto-scroll to newly added flight (within container only)
  useEffect(() => {
    if (itinerary.flight && flightRef.current && scrollContainerRef.current) {
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
  }, [itinerary.flight]);

  // Auto-scroll to newly added hotel (within container only)
  useEffect(() => {
    if (itinerary.hotel && hotelRef.current && scrollContainerRef.current) {
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
  }, [itinerary.hotel]);

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

      {/* Destination */}
      {itinerary.destination && (
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-4 animate-in fade-in slide-in-from-right duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Destination</p>
              <p className="text-base font-bold text-gray-900">
                {itinerary.destination.city}, {itinerary.destination.country}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trip Overview Grid */}
      <div className="grid grid-cols-2 gap-3">
        {itinerary.dates && (
          <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3 animate-in fade-in duration-300 delay-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-gray-600 font-medium">Dates</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {itinerary.dates.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
              {itinerary.dates.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            {tripDuration && (
              <p className="text-xs text-gray-500 mt-1">{tripDuration} days</p>
            )}
          </div>
        )}

        {itinerary.travelers && (
          <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3 animate-in fade-in duration-300 delay-150">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-gray-600 font-medium">Travelers</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {itinerary.travelers} {itinerary.travelers === 1 ? 'Person' : 'People'}
            </p>
          </div>
        )}
      </div>

      {/* Budget Tracker */}
      {itinerary.budget && (
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
            <span className="text-gray-600">of ${itinerary.budget.total.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Travel Preferences/Interests */}
      {itinerary.preferences?.interests && itinerary.preferences.interests.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-4 animate-in fade-in duration-300 delay-250">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Interests</h3>
            <span className="text-xs text-gray-600">
              {itinerary.preferences.interests.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {itinerary.preferences.interests.map((interest, index) => (
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
        {itinerary.flight && (
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
                  <p className="text-sm font-semibold text-gray-900">{itinerary.flight.airline}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">${itinerary.flight.price}</span>
            </div>
          </div>
        )}

        {itinerary.hotel && (
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
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{itinerary.hotel.name}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">
                ${itinerary.hotel.pricePerNight}/nt
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Daily Timeline */}
      {itinerary.dailyPlan && itinerary.dailyPlan.length > 0 && (
        <div className="space-y-3 animate-in fade-in duration-300 delay-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-gray-900">Day-by-Day Plan</h3>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
            {itinerary.dailyPlan.map((day, idx) => (
              <div
                key={idx}
                className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3"
              >
                <p className="text-xs font-semibold text-primary mb-2">
                  Day {idx + 1} - {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
      {itinerary.selectedActivities && itinerary.selectedActivities.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-4 animate-in fade-in duration-300 delay-450">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Activities</h3>
            <span className="text-xs text-gray-600">
              {itinerary.selectedActivities.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {itinerary.selectedActivities.slice(0, 5).map((activity) => (
              <span
                key={activity.id}
                className="px-2 py-1 rounded-lg text-xs font-medium
                           bg-purple-100 text-purple-700 border border-purple-200"
              >
                {activity.name}
              </span>
            ))}
            {itinerary.selectedActivities.length > 5 && (
              <span className="px-2 py-1 rounded-lg text-xs font-medium text-gray-600">
                +{itinerary.selectedActivities.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Trip Stats */}
      {(itinerary.budget || itinerary.selectedActivities) && (
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3 animate-in fade-in duration-300 delay-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary">Quick Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">{itinerary.selectedActivities?.length || 0}</p>
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
