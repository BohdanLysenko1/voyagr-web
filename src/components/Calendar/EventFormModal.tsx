import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { CalendarEvent, EventFormState } from '@/types/calendar';
import { useEventForm } from '@/hooks/useEventForm';
import { TimePicker } from './TimePicker';
import { EventTypeSelector } from './EventTypeSelector';
import { RepeatOptions } from './RepeatOptions';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  editingEvent?: CalendarEvent | null;
  initialDate?: string;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingEvent,
  initialDate,
  isSaving = false,
  isDeleting = false
}) => {
  const {
    formState,
    errors,
    updateField,
    updateRepeatField,
    setDate,
    setTime,
    clearTime,
    resetForm,
    validateForm,
    createEvent,
    isFormValid,
    isDirty
  } = useEventForm(editingEvent);

  // Set initial date when modal opens for new events
  React.useEffect(() => {
    if (isOpen && !editingEvent && initialDate && formState.date !== initialDate) {
      setDate(initialDate);
    }
  }, [isOpen, editingEvent, initialDate, formState.date, setDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const event = createEvent();
    onSave(event);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDelete = () => {
    if (editingEvent && onDelete) {
      onDelete(editingEvent.id);
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Error Display */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <ul className="text-sm text-red-600">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter event title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <EventTypeSelector
              value={formState.type}
              onChange={(type) => updateField('type', type)}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formState.date}
              onChange={(e) => updateField('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time (optional)
            </label>
            <TimePicker
              value={formState.time}
              onChange={setTime}
              onClear={clearTime}
            />
            {!formState.time && (
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for all-day event
              </p>
            )}
          </div>

          {/* Repeat Options */}
          <RepeatOptions
            value={formState.repeat}
            onChange={updateRepeatField}
          />

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving || isDeleting}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            {editingEvent && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete this event"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span>Delete</span>
              </button>
            )}
            
            <button
              type="submit"
              disabled={!isFormValid() || isSaving || isDeleting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingEvent ? 'Update Event' : 'Create Event'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};