'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X } from 'lucide-react';
import { CalendarEvent } from '@/app/reserved/page';

interface CalendarProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export default function Calendar({ events, setEvents }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7, 1)); // August 2025
  const [loading, setLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'event' as 'departure' | 'arrival' | 'event',
    date: '',
    time: ''
  });

  // Placeholder for Google Calendar API integration
  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      // This component now receives events as props from the parent Reserved page
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [currentMonth]);

  // Event management functions
  const openAddEventModal = (date: string) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setEventForm({ title: '', type: 'event', date, time: '' });
    setShowEventModal(true);
  };

  const openEditEventModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventForm({ title: event.title, type: event.type, date: event.date, time: event.time || '' });
    setShowEventModal(true);
  };

  const openDayModal = (date: string, dayEvents: CalendarEvent[]) => {
    setSelectedDate(date);
    setSelectedDayEvents(dayEvents.sort((a, b) => (a.time || '').localeCompare(b.time || '')));
    setShowDayModal(true);
  };

  const closeModal = () => {
    setShowEventModal(false);
    setShowDayModal(false);
    setEditingEvent(null);
    setSelectedDayEvents([]);
    setEventForm({ title: '', type: 'event', date: '', time: '' });
  };

  const saveEvent = () => {
    if (!eventForm.title.trim()) return;

    const eventColor = eventForm.type === 'departure' ? 'bg-green-500' : 
                      eventForm.type === 'arrival' ? 'bg-blue-500' : 'bg-yellow-500';

    if (editingEvent) {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...event, title: eventForm.title, type: eventForm.type, color: eventColor, time: eventForm.time }
          : event
      ));
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventForm.title,
        type: eventForm.type,
        date: eventForm.date,
        color: eventColor,
        time: eventForm.time
      };
      setEvents(prev => [...prev, newEvent]);
    }
    closeModal();
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (day: number) => {
    const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Filter events for the specific date and only show future events
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return event.date === dateString && eventDate >= today;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 h-20"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentMonth.getMonth() && 
                     new Date().getFullYear() === currentMonth.getFullYear();

      days.push(
        <div
          key={day}
          className={`p-2 border border-gray-200 h-20 relative overflow-hidden group cursor-pointer ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
          }`}
          onClick={() => openDayModal(dateString, dayEvents)}
          title={`Click to view all events for ${new Date(dateString).toLocaleDateString()}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {/* Add event button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openAddEventModal(dateString);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
              title="Add event"
            >
              <Plus className="h-3 w-3 text-gray-500" />
            </button>
          </div>
          
          {/* Event indicators */}
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div
                key={event.id}
                className={`${event.color} text-white text-xs px-1 py-0.5 rounded truncate flex justify-between items-center group/event`}
                title={`${event.title}${event.time ? ` at ${event.time}` : ''}`}
              >
                <div className="truncate flex-1 flex flex-col">
                  <span className="truncate">
                    {event.title.length > 6 ? `${event.title.substring(0, 6)}...` : event.title}
                  </span>
                  {event.time && (
                    <span className="text-xs opacity-75">
                      {event.time}
                    </span>
                  )}
                </div>
                <div className="flex space-x-1 opacity-0 group-hover/event:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditEventModal(event);
                    }}
                    className="hover:bg-white/20 rounded p-0.5"
                    title="Edit event"
                  >
                    <Edit2 className="h-2 w-2" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEvent(event.id);
                    }}
                    className="hover:bg-white/20 rounded p-0.5"
                    title="Delete event"
                  >
                    <Trash2 className="h-2 w-2" />
                  </button>
                </div>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 w-full text-left">
                +{dayEvents.length - 2} more events
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="text-lg font-semibold min-w-[140px] text-center text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center font-semibold text-gray-600 border-b">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Departure</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Arrival</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span className="text-gray-600">Argentina</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <span className="text-gray-600">France</span>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); saveEvent(); }} className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                  autoFocus
                />
              </div>
              
              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time (optional)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        if (eventForm.time) {
                          const [hours, minutes] = eventForm.time.split(':');
                          let hour = parseInt(hours);
                          if (hour >= 12) {
                            hour = hour === 12 ? 12 : hour - 12;
                          } else {
                            hour = hour === 0 ? 12 : hour;
                          }
                          const newTime = `${hour.toString().padStart(2, '0')}:${minutes}`;
                          setEventForm(prev => ({ ...prev, time: newTime }));
                        }
                      }}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (eventForm.time) {
                          const [hours, minutes] = eventForm.time.split(':');
                          let hour = parseInt(hours);
                          if (hour < 12) {
                            hour = hour === 12 ? 0 : hour + 12;
                          }
                          const newTime = `${hour.toString().padStart(2, '0')}:${minutes}`;
                          setEventForm(prev => ({ ...prev, time: newTime }));
                        }
                      }}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors border-l border-gray-300"
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as 'departure' | 'arrival' | 'event' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="event">General Event</option>
                  <option value="departure">Departure</option>
                  <option value="arrival">Arrival</option>
                </select>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expandable Day View Modal */}
      {showDayModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Events for {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Events List */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {selectedDayEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No events for this day</p>
                ) : (
                  selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`${event.color} text-white p-3 rounded-lg flex justify-between items-start`}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="text-sm opacity-90 mt-1">
                          <span className="capitalize">{event.type}</span>
                          {event.time && (
                            <span className="ml-2">• {event.time}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-3">
                        <button
                          onClick={() => {
                            openEditEventModal(event);
                            setShowDayModal(false);
                          }}
                          className="hover:bg-white/20 rounded p-1 transition-colors"
                          title="Edit event"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="hover:bg-white/20 rounded p-1 transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Add Event Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    openAddEventModal(selectedDate);
                    setShowDayModal(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
