import { useState, useCallback } from 'react';
import { CalendarEvent, CalendarModalState } from '@/types/calendar';
import { DateUtils } from '@/utils/dateUtils';

export const useCalendarState = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7, 1)); // August 2025
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => DateUtils.addMonths(prev, direction === 'next' ? 1 : -1));
  }, []);

  const addEvent = useCallback((event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const updateEvent = useCallback((updatedEvent: CalendarEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  }, []);

  const deleteMultipleEvents = useCallback((eventIds: string[]) => {
    setEvents(prev => prev.filter(event => !eventIds.includes(event.id)));
  }, []);

  return {
    currentMonth,
    setCurrentMonth,
    navigateMonth,
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteMultipleEvents,
    loading,
    setLoading
  };
};