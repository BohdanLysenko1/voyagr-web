import React from 'react';
import { CheckCircle2, MapPin, Calendar, Users, DollarSign, Plane, Building2 } from 'lucide-react';
import { TripItinerary } from '@/types/tripPlanning';

interface ConfirmationCardProps {
  itinerary: TripItinerary;
  onConfirm: () => void;
  onEdit: () => void;
  gradientColors?: string;
}

export default function ConfirmationCard({
  itinerary,
  onConfirm,
  onEdit,
  gradientColors = 'from-primary/30 to-purple-500/30'
}: ConfirmationCardProps) {
  return (
    <div className="mt-4 glass-panel rounded-2xl p-5 space-y-4 border border-white/40 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/40">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${gradientColors}`}>
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Your Trip Summary</h3>
          <p className="text-sm text-gray-600">Review and confirm your itinerary</p>
        </div>
      </div>

      {/* Destination */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Destination</h4>
            <p className="text-base font-bold text-gray-800">
              {itinerary.destination.city}, {itinerary.destination.country}
            </p>
          </div>
        </div>
      </div>

      {/* Trip Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Dates */}
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-gray-600">Dates</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {itinerary.dates.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
            {itinerary.dates.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>

        {/* Travelers */}
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-gray-600">Travelers</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {itinerary.travelers} {itinerary.travelers === 1 ? 'Person' : 'People'}
          </p>
        </div>

        {/* Budget */}
        <div className="glass-card rounded-xl p-3 col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-gray-600">Total Budget</span>
          </div>
          <p className="text-lg font-bold text-primary">
            ${(typeof itinerary.budget.total === 'object'
              ? (itinerary.budget.total as any).amount || 0
              : itinerary.budget.total
            ).toLocaleString()} {itinerary.budget.currency}
          </p>
        </div>
      </div>

      {/* Flight & Hotel */}
      {(itinerary.flight || itinerary.hotel) && (
        <div className="space-y-2">
          {itinerary.flight && (
            <div className="glass-card rounded-xl p-3 border border-white/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Plane className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{itinerary.flight.airline}</p>
                    <p className="text-xs text-gray-600">
                      {itinerary.flight.departure} → {itinerary.flight.arrival}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  ${typeof itinerary.flight.price === 'object'
                    ? (itinerary.flight.price as any).amount || 0
                    : itinerary.flight.price}
                </span>
              </div>
            </div>
          )}

          {itinerary.hotel && (
            <div className="glass-card rounded-xl p-3 border border-white/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{itinerary.hotel.name}</p>
                    <p className="text-xs text-gray-600">
                      ⭐ {itinerary.hotel.rating} · ${typeof itinerary.hotel.pricePerNight === 'object'
                        ? (itinerary.hotel.pricePerNight as any).amount || 0
                        : itinerary.hotel.pricePerNight}/night
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activities */}
      {itinerary.selectedActivities.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Selected Activities ({itinerary.selectedActivities.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {itinerary.selectedActivities.map((activity) => (
              <span
                key={activity.id}
                className="px-3 py-1 rounded-full text-xs font-medium
                           bg-primary/10 text-primary border border-primary/20"
              >
                {activity.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700
                     bg-white/80 border border-gray-200 hover:bg-white
                     transition-all duration-300 hover:shadow-md"
        >
          Edit Details
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white
                     bg-gradient-to-r ${gradientColors.replace('/30', '').replace('/30', '')}
                     bg-primary hover:shadow-lg
                     transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                     flex items-center justify-center gap-2`}
        >
          <CheckCircle2 className="w-5 h-5" />
          Confirm Trip
        </button>
      </div>
    </div>
  );
}
