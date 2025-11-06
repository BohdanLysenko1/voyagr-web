import React, { useCallback } from 'react';
import { Plus, Check } from 'lucide-react';

export interface Activity {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  emoji?: string;
  image?: string;
}

interface ActivityGridProps {
  activities: Activity[];
  onActivityToggle: (activityId: string) => void;
  selectedActivityIds: string[];
  maxSelections?: number;
  onConfirm?: () => void;
}

export default function ActivityGrid({
  activities,
  onActivityToggle,
  selectedActivityIds,
  maxSelections = 5,
  onConfirm
}: ActivityGridProps) {
  const handleToggle = useCallback((activityId: string) => {
    const isSelected = selectedActivityIds.includes(activityId);
    if (!isSelected && maxSelections && selectedActivityIds.length >= maxSelections) {
      return; // Max selections reached
    }
    onActivityToggle(activityId);
  }, [onActivityToggle, selectedActivityIds, maxSelections]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-600">
          Select up to {maxSelections} activities ({selectedActivityIds.length}/{maxSelections} selected)
        </p>
        {selectedActivityIds.length > 0 && (
          <p className="text-xs font-medium text-primary">
            {selectedActivityIds.length} selected
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {activities.map((activity) => {
          const isSelected = selectedActivityIds.includes(activity.id);
          const isDisabled = !isSelected && !!maxSelections && selectedActivityIds.length >= maxSelections;

          return (
            <button
              key={activity.id}
              onClick={() => handleToggle(activity.id)}
              disabled={isDisabled}
              className={`
                group relative overflow-hidden rounded-xl p-3 text-left
                transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                ${
                  isSelected
                    ? 'glass-panel border-2 border-primary/50 shadow-lg'
                    : 'glass-card border border-white/40 hover:border-primary/30 hover:shadow-md'
                }
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
              `}
            >
              {/* Background Image */}
              {activity.image && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Selection Indicator */}
              <div className="absolute top-2 right-2 z-10">
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center
                                  shadow-md animate-in zoom-in duration-200">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm
                                  border border-gray-200 flex items-center justify-center
                                  opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10">
                {activity.emoji && (
                  <div className="text-2xl mb-2">{activity.emoji}</div>
                )}
                <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                  {activity.name}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {activity.category}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-gray-600">{activity.duration}</span>
                  <span className="font-semibold text-primary">
                    ${typeof activity.price === 'object'
                      ? (activity.price as any).amount || 0
                      : activity.price}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirm Button */}
      {onConfirm && (
        <button
          onClick={onConfirm}
          disabled={selectedActivityIds.length === 0}
          className="w-full mt-4 px-6 py-3 text-base font-semibold text-white bg-primary rounded-xl
                   hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                   flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Done ({selectedActivityIds.length} {selectedActivityIds.length === 1 ? 'activity' : 'activities'} selected)
        </button>
      )}
    </div>
  );
}
