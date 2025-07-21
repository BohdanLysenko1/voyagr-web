'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { useModalState } from '@/hooks/useModalState';
import { DateUtils } from '@/utils/dateUtils';
import { EventUtils } from '@/utils/eventUtils';
import { CalendarGrid } from './Calendar/CalendarGrid';
import { EventFormModal } from './Calendar/EventFormModal';
import { DayEventsModal } from './Calendar/DayEventsModal';
import { EventTypeLegend } from './Calendar/EventTypeSelector';

interface CalendarProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  editingEvent?: CalendarEvent | null;
  onEditingEventHandled?: () => void;
  isLoading?: boolean;
}

export default function Calendar({ events, setEvents, editingEvent, onEditingEventHandled, isLoading = false }: CalendarProps) {
  const modalState = useModalState();
  const [currentMonth, setCurrentMonth] = React.useState(new Date(2025, 7, 1)); // August 2025
  const [savingEvent, setSavingEvent] = React.useState(false);
  const [deletingEvent, setDeletingEvent] = React.useState<string | null>(null);


  // Handle external editing requests (e.g., from NextUp component)
  React.useEffect(() => {
    if (editingEvent) {
      modalState.openEditEventModal(editingEvent);
      onEditingEventHandled?.();
    }
  }, [editingEvent, modalState, onEditingEventHandled]);

  const handleSaveEvent = async (event: CalendarEvent) => {
    setSavingEvent(true);
    try {
      // Simulate API call delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (modalState.editingEvent) {
        // For editing, just update the single event (don't regenerate repeats)
        setEvents(prev => prev.map(e => e.id === event.id ? event : e));
      } else {
        // For new events, generate repeated events if needed
        const eventsToAdd = EventUtils.generateRepeatedEvents(event);
        setEvents(prev => [...prev, ...eventsToAdd]);
      }
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setDeletingEvent(eventId);
    try {
      // Simulate API call delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setEvents(prev => prev.filter(e => e.id !== eventId));
      // Also clear the event from modal selection if it was selected
      if (modalState.selectedEvents.has(eventId)) {
        modalState.toggleEventSelection(eventId);
      }
    } finally {
      setDeletingEvent(null);
    }
  };

  const handleDeleteMultiple = async (eventIds: string[]) => {
    // Set multiple events as deleting
    eventIds.forEach(id => setDeletingEvent(id));
    try {
      // Simulate API call delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEvents(prev => prev.filter(e => !eventIds.includes(e.id)));
      // Clear all deleted events from selection
      modalState.clearEventSelection();
    } finally {
      setDeletingEvent(null);
    }
  };

  const handleDateClick = (date: string, dayEvents: CalendarEvent[]) => {
    modalState.openDayModal(date, dayEvents);
  };

  const handleAddEvent = (date?: string) => {
    modalState.openAddEventModal(date);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    modalState.openEditEventModal(event);
  };

  const handleSelectAllEvents = () => {
    const currentDayEvents = events.filter(e => e.date === modalState.selectedDate);
    const allEventIds = currentDayEvents.map(e => e.id);
    modalState.selectAllEvents(allEventIds);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => DateUtils.addMonths(prev, direction === 'next' ? 1 : -1));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
            {DateUtils.getMonthYear(currentMonth)}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <button
          onClick={() => handleAddEvent()}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Event Type Legend */}
      <EventTypeLegend className="mb-6 p-4 bg-gray-50 rounded-lg" />

      {/* Calendar Grid */}
      <CalendarGrid
        currentMonth={currentMonth}
        events={events}
        onDateClick={handleDateClick}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        isLoading={isLoading}
        deletingEventId={deletingEvent}
      />

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={modalState.showEventModal}
        onClose={modalState.closeAllModals}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        editingEvent={modalState.editingEvent}
        initialDate={modalState.selectedDate}
        isSaving={savingEvent}
        isDeleting={deletingEvent === modalState.editingEvent?.id}
      />

      {/* Day Events Modal */}
      <DayEventsModal
        isOpen={modalState.showDayModal}
        onClose={modalState.closeAllModals}
        selectedDate={modalState.selectedDate}
        events={events.filter(e => e.date === modalState.selectedDate).sort((a, b) => (a.time || '').localeCompare(b.time || ''))}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        onDeleteMultiple={handleDeleteMultiple}
        onAddEvent={handleAddEvent}
        isMultiSelectMode={modalState.isMultiSelectMode}
        onToggleMultiSelect={modalState.toggleMultiSelectMode}
        selectedEvents={modalState.selectedEvents}
        onToggleEventSelection={modalState.toggleEventSelection}
        onSelectAll={handleSelectAllEvents}
        onClearSelection={modalState.clearEventSelection}
      />
    </div>
  );
}