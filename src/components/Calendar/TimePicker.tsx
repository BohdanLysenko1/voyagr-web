import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { TimeUtils, TimeData } from '@/utils/timeUtils';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onClear: () => void;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  onChange, 
  onClear, 
  className = '' 
}) => {
  const timeData = TimeUtils.parseTime(value);
  
  const updateTime = (updates: Partial<TimeData>) => {
    const newTimeData = { ...timeData, ...updates };
    const formattedTime = TimeUtils.formatTime(newTimeData);
    onChange(formattedTime);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Hour Selector */}
      <div className="relative">
        <select
          value={timeData.hour}
          onChange={(e) => updateTime({ hour: parseInt(e.target.value) })}
          className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {TimeUtils.HOURS.map(hour => (
            <option key={hour} value={hour}>{hour}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      <span className="text-gray-500">:</span>

      {/* Minute Selector */}
      <div className="relative">
        <select
          value={timeData.minute}
          onChange={(e) => updateTime({ minute: parseInt(e.target.value) })}
          className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {TimeUtils.MINUTES.filter(m => m % 5 === 0).map(minute => (
            <option key={minute} value={minute}>
              {minute.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* AM/PM Selector */}
      <div className="relative">
        <select
          value={timeData.ampm}
          onChange={(e) => updateTime({ ampm: e.target.value as 'AM' | 'PM' })}
          className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Clear Button */}
      {value && (
        <button
          onClick={onClear}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Clear time"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};