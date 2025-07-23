'use client';

import { Calendar, Clock } from 'lucide-react';
import { CalendarEvent, NextUpEvent } from '@/types/calendar';
import { EventUtils } from '@/utils/eventUtils';
import { DateUtils } from '@/utils/dateUtils';
import { EVENT_TYPE_CONFIG } from '@/config/eventTypes';

interface NextUpProps {
  events: CalendarEvent[];
  onViewAllEvents: () => void;
  onEventSelect?: (event: CalendarEvent) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  maxEvents?: number;
  isLoading?: boolean;
}

interface NextUpEventDisplay extends NextUpEvent {
  icon: React.ReactNode;
  bgColor: string;
  dateDisplay: string;
  timeDisplay: string;
}

const convertToNextUpEvents = (calendarEvents: CalendarEvent[], maxEvents: number = 3): NextUpEventDisplay[] => {
  const upcomingEvents = EventUtils.getUpcomingEvents(calendarEvents, maxEvents);
  
  return upcomingEvents.map(event => {
    const config = EVENT_TYPE_CONFIG[event.type];
    const Icon = config.icon;
    const { dateDisplay, timeDisplay } = EventUtils.formatEventDisplay(event);
    
    return {
      ...EventUtils.convertToNextUpEvent(event),
      icon: <Icon className="h-6 w-6 text-gray-700" />,
      bgColor: config.color,
      dateDisplay,
      timeDisplay
    };
  });
};

export default function NextUp({ 
  events, 
  onViewAllEvents, 
  onEventSelect,
  onEditEvent,
  maxEvents = 3,
  isLoading = false
}: NextUpProps) {
  const nextUpEvents = convertToNextUpEvents(events, maxEvents);
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 h-fit">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Next Up</h2>
        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
            <p>Loading events...</p>
          </div>
        ) : nextUpEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming events</p>
          </div>
        ) : (
          nextUpEvents.map((event: NextUpEventDisplay) => {
            const originalEvent = events.find(e => e.id === event.id);
            
            const handleClick = () => {
              if (originalEvent) {
                // Prioritize edit action if available, otherwise fall back to select
                if (onEditEvent) {
                  onEditEvent(originalEvent);
                } else if (onEventSelect) {
                  onEventSelect(originalEvent);
                }
              }
            };
            
            return (
              <div
                key={event.id}
                className={`${event.bgColor} text-gray-700 rounded-lg p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]`}
                role="button"
                tabIndex={0}
                aria-label={`${event.title}, ${EVENT_TYPE_CONFIG[originalEvent?.type || event.type]?.label || event.type} on ${event.dateDisplay} at ${event.timeDisplay}. Click to edit.`}
                onClick={handleClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                  }
                }}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                  {event.icon}
                </div>
              
                {/* Content */}
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-sm sm:text-base truncate">{event.title}</p>
                  <p className="text-xs opacity-90 truncate capitalize">{EVENT_TYPE_CONFIG[originalEvent?.type || event.type]?.label || event.type}</p>
                </div>
                
                {/* Time */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3" />
                    <p className="font-bold text-xs sm:text-sm">{event.timeDisplay}</p>
                  </div>
                  <p className="text-xs opacity-90">{event.dateDisplay}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* View All Button */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
        <button
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base"
          onClick={onViewAllEvents}
        >
          View All Events
        </button>
      </div>
    </div>
  );
}
