import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';

export const useModalState = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());

  const openDayModal = useCallback((date: string, dayEvents: CalendarEvent[]) => {
    setSelectedDate(date);
    setSelectedDayEvents(dayEvents.sort((a, b) => (a.time || '').localeCompare(b.time || '')));
    setShowDayModal(true);
    setIsMultiSelectMode(false);
    setSelectedEvents(new Set());
  }, []);

  const openAddEventModal = useCallback((date?: string) => {
    setEditingEvent(null);
    if (date) {
      setSelectedDate(date);
    }
    setShowDayModal(false);
    setShowEventModal(true);
  }, []);

  const openEditEventModal = useCallback((event: CalendarEvent) => {
    setEditingEvent(event);
    setShowDayModal(false);
    setShowEventModal(true);
  }, []);

  const closeAllModals = useCallback(() => {
    setShowEventModal(false);
    setShowDayModal(false);
    setEditingEvent(null);
    setSelectedDayEvents([]);
    setIsMultiSelectMode(false);
    setSelectedEvents(new Set());
  }, []);

  const toggleEventSelection = useCallback((eventId: string) => {
    setSelectedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  }, []);

  const selectAllEvents = useCallback((eventIds: string[]) => {
    setSelectedEvents(new Set(eventIds));
  }, []);

  const clearEventSelection = useCallback(() => {
    setSelectedEvents(new Set());
  }, []);

  const toggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(prev => !prev);
    if (isMultiSelectMode) {
      setSelectedEvents(new Set());
    }
  }, [isMultiSelectMode]);

  return {
    // Modal states
    showEventModal,
    showDayModal,
    selectedDate,
    selectedDayEvents,
    editingEvent,
    isMultiSelectMode,
    selectedEvents,
    
    // Modal actions
    openDayModal,
    openAddEventModal,
    openEditEventModal,
    closeAllModals,
    
    // Multi-select actions
    toggleEventSelection,
    selectAllEvents,
    clearEventSelection,
    toggleMultiSelectMode,
    
    // Direct state setters (for edge cases)
    setShowEventModal,
    setShowDayModal,
    setSelectedDate,
    setSelectedDayEvents,
    setEditingEvent,
    setIsMultiSelectMode,
    setSelectedEvents
  };
};