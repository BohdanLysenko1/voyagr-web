import React from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { DateUtils } from '@/utils/dateUtils';
import { EventUtils } from '@/utils/eventUtils';
import { EVENT_TYPE_CONFIG } from '@/config/eventTypes';

interface DayEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onDeleteMultiple: (eventIds: string[]) => void;
  onAddEvent: (date: string) => void;
  isMultiSelectMode: boolean;
  onToggleMultiSelect: () => void;
  selectedEvents: Set<string>;
  onToggleEventSelection: (eventId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export const DayEventsModal: React.FC<DayEventsModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  events,
  onEditEvent,
  onDeleteEvent,
  onDeleteMultiple,
  onAddEvent,
  isMultiSelectMode,
  onToggleMultiSelect,
  selectedEvents,
  onToggleEventSelection,
  onSelectAll,
  onClearSelection
}) => {
  const sortedEvents = EventUtils.sortEventsByTime(events);
  const dateDisplay = DateUtils.formatDisplayDate(selectedDate);

  const handleDeleteSelected = () => {
    if (selectedEvents.size === 0) return;
    
    const count = selectedEvents.size;
    const confirm = window.confirm(
      `Are you sure you want to delete ${count} event${count > 1 ? 's' : ''}?`
    );
    
    if (confirm) {
      onDeleteMultiple(Array.from(selectedEvents));
      onClearSelection();
    }
  };

  const handleDeleteSingle = (eventId: string, eventTitle: string) => {
    const confirm = window.confirm(`Are you sure you want to delete "${eventTitle}"?`);
    if (confirm) {
      onDeleteEvent(eventId);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Events for {dateDisplay}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Multi-select Controls */}
        <div className="mb-4 pb-3 border-b">
          <div className="flex items-center justify-between">
            <button
              onClick={onToggleMultiSelect}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isMultiSelectMode 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isMultiSelectMode ? '✓ Multi-Select Active' : 'Select Multiple'}
            </button>
            
            {isMultiSelectMode && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={selectedEvents.size === sortedEvents.length ? onClearSelection : onSelectAll}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded transition-colors"
                >
                  {selectedEvents.size === sortedEvents.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            )}
          </div>
          
          {isMultiSelectMode && selectedEvents.size > 0 && (
            <div className="mt-3 flex items-center justify-between bg-red-50 border border-red-200 rounded-md p-3">
              <span className="text-sm text-red-700 font-medium">
                {selectedEvents.size} event{selectedEvents.size > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No events for this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedEvents.map((event) => {
                const config = EVENT_TYPE_CONFIG[event.type];
                const Icon = config.icon;
                const isSelected = selectedEvents.has(event.id);
                
                return (
                  <div
                    key={event.id}
                    className={`p-3 border rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[0.98]' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {isMultiSelectMode && (
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => onToggleEventSelection(event.id)}
                              className="w-4 h-4 text-blue-600 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className={`w-3 h-3 ${config.color} rounded flex-shrink-0`} />
                        <Icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {event.time ? EventUtils.formatEventDisplay(event).timeDisplay : 'All day'} • {config.label}
                          </p>
                        </div>
                      </div>

                      {!isMultiSelectMode && (
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            onClick={() => onEditEvent(event)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit event"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(event.id, event.title)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Event Button */}
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => {
              onAddEvent(selectedDate);
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>
    </div>
  );
};