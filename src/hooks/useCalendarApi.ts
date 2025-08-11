import { useState, useEffect, useCallback, useMemo } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { CalendarService } from '@/services/calendarService';

export interface UseCalendarApiState {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  hasMore: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface UseCalendarApiActions {
  loadEvents: (params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    page?: number;
    limit?: number;
    append?: boolean;
  }) => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent | null>;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<CalendarEvent | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  deleteMultipleEvents: (ids: string[]) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
  clearError: () => void;
  loadMockData: () => Promise<void>;
}

export const useCalendarApi = (initialLoad = true): [UseCalendarApiState, UseCalendarApiActions] => {
  const service = useMemo(() => new CalendarService(), []);
  const [state, setState] = useState<UseCalendarApiState>({
    events: [],
    loading: false,
    error: null,
    isOffline: false,
    hasMore: true,
    pagination: {
      page: 1,
      limit: 50,
      total: 0
    }
  });

  // Check online status
  useEffect(() => {
    const updateOnlineStatus = () => {
      const offline = typeof navigator !== 'undefined' ? !navigator.onLine : false;
      setState(prev => ({ ...prev, isOffline: offline }));
    };
    
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [service]);

  const loadEvents = useCallback(async (params: {
    startDate?: string;
    endDate?: string;
    type?: string;
    page?: number;
    limit?: number;
    append?: boolean;
  } = {}) => {
    const { append = false, ...apiParams } = params;

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      ...(append ? {} : { events: [] })
    }));

    try {
      const response = await service.getEvents({
        page: 1,
        limit: 50,
        ...apiParams
      });

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          events: append ? [...prev.events, ...response.data.data] : response.data.data,
          pagination: {
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total
          },
          hasMore: response.data.pagination.hasNext,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to load events',
          loading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false
      }));
    }
  }, [service]);

  const createEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await service.createEvent(eventData);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          events: [...prev.events, response.data],
          loading: false
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to create event',
          loading: false
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false
      }));
      return null;
    }
  }, [service]);

  const updateEvent = useCallback(async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await service.updateEvent(id, eventData);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          events: prev.events.map(event => 
            event.id === id ? response.data : event
          ),
          loading: false
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to update event',
          loading: false
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false
      }));
      return null;
    }
  }, [service]);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await service.deleteEvent(id);

      if (response.success) {
        setState(prev => ({
          ...prev,
          events: prev.events.filter(event => event.id !== id),
          loading: false
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to delete event',
          loading: false
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false
      }));
      return false;
    }
  }, [service]);

  const deleteMultipleEvents = useCallback(async (ids: string[]): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await service.deleteMultipleEvents(ids);

      if (response.success) {
        setState(prev => ({
          ...prev,
          events: prev.events.filter(event => !ids.includes(event.id)),
          loading: false
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to delete events',
          loading: false
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false
      }));
      return false;
    }
  }, [service]);

  const refreshEvents = useCallback(async () => {
    service.clearCache();
    await loadEvents();
  }, [service, loadEvents]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const loadMockData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const mockEvents = await service.getMockEvents();
      setState(prev => ({
        ...prev,
        events: mockEvents,
        loading: false,
        pagination: {
          page: 1,
          limit: mockEvents.length,
          total: mockEvents.length
        },
        hasMore: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load mock data',
        loading: false
      }));
    }
  }, [service]);

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      loadMockData(); // Use mock data for now
      // loadEvents(); // Use this for real API
    }
  }, [initialLoad, loadMockData]);

  const actions: UseCalendarApiActions = {
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    deleteMultipleEvents,
    refreshEvents,
    clearError,
    loadMockData
  };

  return [state, actions];
};