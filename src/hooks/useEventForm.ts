import { useState, useCallback, useEffect } from 'react';
import { CalendarEvent, EventFormState } from '@/types/calendar';
import { EventUtils } from '@/utils/eventUtils';
import { DateUtils } from '@/utils/dateUtils';

const createInitialFormState = (): EventFormState => ({
  title: '',
  type: 'event',
  date: '',
  time: '',
  repeat: {
    frequency: 'never',
    interval: 1,
    endDate: '',
    count: 1
  }
});

export const useEventForm = (editingEvent?: CalendarEvent | null) => {
  const [formState, setFormState] = useState<EventFormState>(createInitialFormState);
  const [errors, setErrors] = useState<string[]>([]);

  // Update form when editing event changes
  useEffect(() => {
    if (editingEvent) {
      setFormState({
        title: editingEvent.title,
        type: editingEvent.type,
        date: editingEvent.date,
        time: editingEvent.time || '',
        repeat: editingEvent.repeat || {
          frequency: 'never',
          interval: 1,
          endDate: '',
          count: 1
        }
      });
    } else {
      setFormState(createInitialFormState());
    }
    setErrors([]);
  }, [editingEvent]);

  const updateField = useCallback(<K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [errors.length]);

  const updateRepeatField = useCallback(<K extends keyof EventFormState['repeat']>(
    field: K,
    value: EventFormState['repeat'][K]
  ) => {
    setFormState(prev => ({
      ...prev,
      repeat: { ...prev.repeat, [field]: value }
    }));
  }, []);

  const setDate = useCallback((date: string) => {
    updateField('date', date);
  }, [updateField]);

  const setTime = useCallback((time: string) => {
    updateField('time', time);
  }, [updateField]);

  const clearTime = useCallback(() => {
    updateField('time', '');
  }, [updateField]);

  const resetForm = useCallback(() => {
    setFormState(createInitialFormState());
    setErrors([]);
  }, []);

  const validateForm = useCallback((): boolean => {
    const validationErrors = EventUtils.validateEvent(formState);
    setErrors(validationErrors);
    return validationErrors.length === 0;
  }, [formState]);

  const createEvent = useCallback((): CalendarEvent => {
    return {
      id: editingEvent?.id || EventUtils.generateId(),
      title: formState.title.trim(),
      type: formState.type,
      date: formState.date,
      time: formState.time || undefined,
      repeat: formState.repeat.frequency !== 'never' ? formState.repeat : undefined
    };
  }, [formState, editingEvent]);

  const isFormValid = useCallback((): boolean => {
    return formState.title.trim() !== '' && 
           formState.date !== '' && 
           DateUtils.parseDate(formState.date) !== null;
  }, [formState]);

  const isDirty = useCallback((): boolean => {
    if (!editingEvent) {
      return formState.title !== '' || 
             formState.date !== '' || 
             formState.time !== '' || 
             formState.type !== 'event';
    }
    
    return formState.title !== editingEvent.title ||
           formState.type !== editingEvent.type ||
           formState.date !== editingEvent.date ||
           formState.time !== (editingEvent.time || '') ||
           JSON.stringify(formState.repeat) !== JSON.stringify(editingEvent.repeat || {
             frequency: 'never',
             interval: 1,
             endDate: '',
             count: 1
           });
  }, [formState, editingEvent]);

  return {
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
  };
};