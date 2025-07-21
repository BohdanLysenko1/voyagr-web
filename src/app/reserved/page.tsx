'use client';

import { useState, useRef } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import ReservedTrips from '@/components/ReservedTrips';
import Calendar from '@/components/Calendar';
import NextUp from '@/components/NextUp';
import { CalendarEvent } from '@/types/calendar';
import { EVENT_TYPE_CONFIG } from '@/config/eventTypes';

// Empty initial events - user will add their own
const initialEvents: CalendarEvent[] = [];

export default function ReservedPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [editingEventFromNextUp, setEditingEventFromNextUp] = useState<CalendarEvent | null>(null);
  const [deletingFromModal, setDeletingFromModal] = useState<string | null>(null);

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEventFromNextUp(event);
    // Close the all events modal if open
    setShowAllEventsModal(false);
    // Scroll to calendar section for better UX
    document.getElementById('calendar-heading')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    setDeletingFromModal(eventId);
    try {
      // Simulate API call delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 300));
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } finally {
      setDeletingFromModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">Reserved Trips</h1>
        
        {/* Reserved Trips Section */}
        <section className="mb-8 sm:mb-12" aria-labelledby="reserved-trips-heading">
          <ReservedTrips />
        </section>
        
        {/* Calendar and Next Up Section */}
        <section aria-labelledby="calendar-heading">
          <h2 id="calendar-heading" className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-800">Calendar</h2>
          
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* NextUp appears first on mobile for quick access */}
            <div className="order-2 lg:order-2 lg:col-span-1">
              <div className="lg:sticky lg:top-4">
                <NextUp 
                  events={events} 
                  onViewAllEvents={() => setShowAllEventsModal(true)}
                  onEditEvent={handleEditEvent}
                  maxEvents={3}
                />
              </div>
            </div>
            
            {/* Calendar appears second on mobile */}
            <div className="order-1 lg:order-1 lg:col-span-2">
              <Calendar 
                events={events} 
                setEvents={setEvents} 
                editingEvent={editingEventFromNextUp}
                onEditingEventHandled={() => setEditingEventFromNextUp(null)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* View All Events Modal */}
      {showAllEventsModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setShowAllEventsModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-2 sm:mx-4 max-h-[90vh] sm:max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">All Events</h3>
                <button
                  onClick={() => setShowAllEventsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              
              <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto space-y-3">
                {events.filter(event => new Date(event.date) >= new Date()).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No upcoming events found</p>
                ) : (
                  events
                    .filter(event => new Date(event.date) >= new Date()) // Only show future events
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((event) => {
                      const isDeleting = deletingFromModal === event.id;
                      
                      return (
                        <div
                          key={event.id}
                          className={`${EVENT_TYPE_CONFIG[event.type].color} text-gray-700 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center group hover:shadow-lg transition-all duration-200 space-y-3 sm:space-y-0 ${
                            isDeleting ? 'opacity-75' : ''
                          }`}
                        >
                          <div 
                            className={`flex-1 cursor-pointer ${isDeleting ? 'pointer-events-none' : ''}`}
                            onClick={() => handleEditEvent(event)}
                          >
                            <h4 className="font-medium text-base sm:text-lg">{event.title}</h4>
                            <div className="text-sm opacity-90 mt-1 flex flex-wrap gap-2">
                              <span className="capitalize">{EVENT_TYPE_CONFIG[event.type].label}</span>
                              <span>• {new Date(event.date).toLocaleDateString()}</span>
                              {event.time && (
                                <span>• {event.time}</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center justify-end space-x-3 sm:space-x-2 sm:ml-4">
                            <button
                              onClick={() => handleEditEvent(event)}
                              disabled={isDeleting}
                              className="flex items-center space-x-2 px-3 py-2 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit event"
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="text-sm sm:hidden">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id, event.title)}
                              disabled={isDeleting}
                              className="flex items-center space-x-2 px-3 py-2 sm:p-2 bg-white/20 hover:bg-red-500/80 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete event"
                            >
                              {isDeleting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              <span className="text-sm sm:hidden">
                                {isDeleting ? 'Deleting...' : 'Delete'}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}