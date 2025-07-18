'use client';

import { Plane, MapPin, Calendar, Clock } from 'lucide-react';
import { CalendarEvent } from '@/app/reserved/page';

interface NextUpProps {
  events: CalendarEvent[];
  onViewAllEvents: () => void;
}

interface NextUpEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  type: 'flight' | 'activity' | 'accommodation';
  icon: React.ReactNode;
  bgColor: string;
}

// Helper function to convert calendar events to NextUp format
const convertToNextUpEvents = (calendarEvents: CalendarEvent[]): NextUpEvent[] => {
  return calendarEvents
    .filter(event => new Date(event.date) >= new Date()) // Only future events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3) // Show only next 3 events
    .map(event => {
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const formattedTime = event.time ? 
        new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }) : '12:00 PM';
      
      let icon: React.ReactNode;
      let bgColor: string;
      let location: string;
      
      switch (event.type) {
        case 'departure':
          icon = <Plane className="h-6 w-6 text-white" />;
          bgColor = 'from-green-500 to-emerald-600';
          location = 'Airport';
          break;
        case 'arrival':
          icon = <Plane className="h-6 w-6 text-white" />;
          bgColor = 'from-blue-500 to-indigo-600';
          location = 'Destination';
          break;
        default:
          icon = <MapPin className="h-6 w-6 text-white" />;
          bgColor = 'from-purple-500 to-violet-600';
          location = 'Location';
      }
      
      return {
        id: event.id,
        title: event.title,
        location,
        date: formattedDate,
        time: formattedTime,
        type: event.type === 'departure' || event.type === 'arrival' ? 'flight' : 'activity',
        icon,
        bgColor
      };
    });
};

export default function NextUp({ events, onViewAllEvents }: NextUpProps) {
  const nextUpEvents = convertToNextUpEvents(events);
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Next Up</h2>
        <Calendar className="h-6 w-6 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {nextUpEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming events</p>
          </div>
        ) : (
          nextUpEvents.map((event: NextUpEvent, index: number) => (
            <div
              key={event.id}
              className={`p-4 rounded-xl bg-gradient-to-br ${event.bgColor} text-white flex items-center gap-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]`}
              role="button"
              tabIndex={0}
              aria-label={`${event.title} at ${event.location} on ${event.date} at ${event.time}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  // Handle event selection
                  console.log(`Selected event: ${event.title}`);
                }
              }}
            >
            {/* Icon */}
            <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
              {event.icon}
            </div>
            
            {/* Content */}
            <div className="flex-grow min-w-0">
              <p className="font-bold text-base truncate">{event.title}</p>
              <p className="text-xs opacity-90 truncate">{event.location}</p>
            </div>
            
            {/* Time */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3" />
                <p className="font-bold text-sm">{event.time}</p>
              </div>
              <p className="text-xs opacity-90">{event.date}</p>
            </div>
            </div>
          ))
        )}
      </div>
      
      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
          onClick={onViewAllEvents}
        >
          View All Events
        </button>
      </div>
    </div>
  );
}
