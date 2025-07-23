import React from 'react';
import { EVENT_TYPE_CONFIG, EVENT_COLORS } from '@/config/eventTypes';
import { EventType } from '@/types/calendar';

interface EventTypeSelectorProps {
  value: EventType;
  onChange: (type: EventType) => void;
  className?: string;
}

export const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {EVENT_COLORS.map(({ type, color, label, icon: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
            value === type
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          <div className={`w-4 h-4 rounded ${color} flex-shrink-0`} />
          <Icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 truncate">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
};

interface EventTypeLegendProps {
  className?: string;
}

export const EventTypeLegend: React.FC<EventTypeLegendProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {EVENT_COLORS.map(({ type, color, label }) => (
        <div key={type} className="flex items-center space-x-2">
          <div className={`w-3 h-3 ${color} rounded`} />
          <span className="text-gray-600 text-sm">{label}</span>
        </div>
      ))}
    </div>
  );
};