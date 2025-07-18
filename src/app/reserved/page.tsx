'use client';

import { useState } from 'react';
import ReservedTrips from '@/components/ReservedTrips';
import Calendar from '@/components/Calendar';
import NextUp from '@/components/NextUp';

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'departure' | 'arrival' | 'event';
  date: string;
  color: string;
  time?: string;
}

// Future events data - only upcoming events
const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Flight to Argentina',
    type: 'departure',
    date: '2025-08-19',
    color: 'bg-green-500',
    time: '14:30'
  },
  {
    id: '2',
    title: 'Arrival in Buenos Aires',
    type: 'arrival',
    date: '2025-08-20',
    color: 'bg-blue-500',
    time: '06:45'
  },
  {
    id: '3',
    title: 'Hotel Check-in',
    type: 'event',
    date: '2025-08-20',
    color: 'bg-yellow-500',
    time: '15:00'
  },
  {
    id: '4',
    title: 'Flight to France',
    type: 'departure',
    date: '2025-09-15',
    color: 'bg-green-500',
    time: '10:15'
  },
  {
    id: '5',
    title: 'Arrival in Paris',
    type: 'arrival',
    date: '2025-09-16',
    color: 'bg-blue-500',
    time: '08:30'
  }
];

export default function ReservedPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Reserved Trips</h1>
        
        {/* Reserved Trips Section */}
        <section className="mb-12" aria-labelledby="reserved-trips-heading">
          <ReservedTrips />
        </section>
        
        {/* Calendar and Next Up Section */}
        <section aria-labelledby="calendar-heading">
          <h2 id="calendar-heading" className="text-2xl font-bold text-center mb-8 text-gray-800">Calendar</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Calendar events={events} setEvents={setEvents} />
            </div>
            <div className="lg:col-span-1">
              <NextUp 
                events={events} 
                onViewAllEvents={() => setShowAllEventsModal(true)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* View All Events Modal */}
      {showAllEventsModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAllEventsModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">All Events</h3>
                <button
                  onClick={() => setShowAllEventsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-3">
                {events.filter(event => new Date(event.date) >= new Date()).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No upcoming events found</p>
                ) : (
                  events
                    .filter(event => new Date(event.date) >= new Date()) // Only show future events
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`${event.color} text-white p-4 rounded-lg flex justify-between items-center`}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{event.title}</h4>
                          <div className="text-sm opacity-90 mt-1">
                            <span className="capitalize">{event.type}</span>
                            <span className="ml-2">• {new Date(event.date).toLocaleDateString()}</span>
                            {event.time && (
                              <span className="ml-2">• {event.time}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}