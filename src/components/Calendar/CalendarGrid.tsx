import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { DateUtils } from '@/utils/dateUtils';
import { EventUtils } from '@/utils/eventUtils';
import { EVENT_TYPE_CONFIG } from '@/config/eventTypes';

interface CalendarGridProps {
  currentMonth: Date;
  events: CalendarEvent[];
  onDateClick: (date: string, dayEvents: CalendarEvent[]) => void;
  onAddEvent: (date: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  isLoading?: boolean;
  deletingEventId?: string | null;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  events,
  onDateClick,
  onAddEvent: _onAddEvent, // Renamed to indicate it's intentionally unused in this component
  onEditEvent,
  onDeleteEvent,
  isLoading: _isLoading = false, // Renamed to indicate it's intentionally unused in this component  
  deletingEventId = null
}) => {
  const daysInMonth = DateUtils.getDaysInMonth(currentMonth);
  const firstDayOfMonth = DateUtils.getFirstDayOfMonth(currentMonth);
  const today = new Date();

  const renderCalendarDays = () => {
    const days = [];

    // Add empty cells only at the beginning to align with day headers
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[80px] sm:min-h-[120px]" />
      );
    }

    // Add actual days of the month
    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
      const dateString = DateUtils.formatDateString(date);
      const dayEvents = EventUtils.getEventsForDate(events, dateString);
      const isToday = DateUtils.isSameDay(date, today);

      days.push(
        <div
          key={dayNumber}
          className={`min-h-[80px] sm:min-h-[120px] border border-gray-200 p-1.5 sm:p-2 cursor-pointer hover:bg-gray-50 transition-colors group ${
            isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'
          }`}
          onClick={() => onDateClick(dateString, dayEvents)}
        >
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {dayNumber}
            </span>
          </div>
          
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => {
              const config = EVENT_TYPE_CONFIG[event.type];
              const Icon = config.icon;
              
              const isDeleting = deletingEventId === event.id;
              
              return (
                <div
                  key={event.id}
                  className={`${config.color} text-gray-700 text-xs p-0.5 sm:p-1 rounded flex items-center justify-between group hover:shadow-md transition-shadow ${
                    isDeleting ? 'opacity-50 pointer-events-none' : ''
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-0.5 sm:space-x-1 flex-1 min-w-0">
                    {isDeleting ? (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 border border-gray-700 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    ) : (
                      <Icon className="h-1.5 w-1.5 sm:h-2 sm:w-2 flex-shrink-0" />
                    )}
                    <span className="truncate text-xs">{event.title}</span>
                    {event.time && (
                      <span className="text-xs opacity-90 flex-shrink-0 hidden sm:inline">
                        {event.time}
                      </span>
                    )}
                  </div>
                  
                  <div className={`flex items-center space-x-0.5 transition-opacity ${
                    isDeleting ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(event);
                      }}
                      className="hover:bg-white/20 rounded p-0.5"
                      title="Edit event"
                      disabled={isDeleting}
                    >
                      <Edit2 className="h-2 w-2" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvent(event.id);
                      }}
                      className="hover:bg-white/20 rounded p-0.5"
                      title="Delete event"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-2 w-2" />
                    </button>
                  </div>
                </div>
              );
            })}
            
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 text-center py-1">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-0 border-b border-gray-200">
        {DateUtils.DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 group">
        {renderCalendarDays()}
      </div>
    </div>
  );
};