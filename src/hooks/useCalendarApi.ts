import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { calendarService, ApiResponse, PaginatedResponse } from '@/services/calendarService';
import { EventUtils } from '@/utils/eventUtils';

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
      setState(prev => ({ ...prev, isOffline: calendarService.isOffline() }));
    };
    
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const loadEvents = useCallback(async (params: {
    startDate?: string;
    endDate?: string;
    type?: string;
    page?: number;
    limit?: number;
    append?: boolean;
  } = {}) => {
    const { append = false, ...apiParams } = params;\n    \n    setState(prev => ({ \n      ...prev, \n      loading: true, \n      error: null,\n      ...(append ? {} : { events: [] })\n    }));\n\n    try {\n      const response = await calendarService.getEvents({\n        page: 1,\n        limit: 50,\n        ...apiParams\n      });\n\n      if (response.success && response.data) {\n        setState(prev => ({\n          ...prev,\n          events: append ? [...prev.events, ...response.data.data] : response.data.data,\n          pagination: {\n            page: response.data.pagination.page,\n            limit: response.data.pagination.limit,\n            total: response.data.pagination.total\n          },\n          hasMore: response.data.pagination.hasNext,\n          loading: false\n        }));\n      } else {\n        setState(prev => ({\n          ...prev,\n          error: response.message || 'Failed to load events',\n          loading: false\n        }));\n      }\n    } catch (error) {\n      setState(prev => ({\n        ...prev,\n        error: error instanceof Error ? error.message : 'Unknown error occurred',\n        loading: false\n      }));\n    }\n  }, []);\n\n  const createEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {\n    setState(prev => ({ ...prev, loading: true, error: null }));\n\n    try {\n      const response = await calendarService.createEvent(eventData);\n      \n      if (response.success && response.data) {\n        setState(prev => ({\n          ...prev,\n          events: [...prev.events, response.data],\n          loading: false\n        }));\n        return response.data;\n      } else {\n        setState(prev => ({\n          ...prev,\n          error: response.message || 'Failed to create event',\n          loading: false\n        }));\n        return null;\n      }\n    } catch (error) {\n      setState(prev => ({\n        ...prev,\n        error: error instanceof Error ? error.message : 'Unknown error occurred',\n        loading: false\n      }));\n      return null;\n    }\n  }, []);\n\n  const updateEvent = useCallback(async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {\n    setState(prev => ({ ...prev, loading: true, error: null }));\n\n    try {\n      const response = await calendarService.updateEvent(id, eventData);\n      \n      if (response.success && response.data) {\n        setState(prev => ({\n          ...prev,\n          events: prev.events.map(event => \n            event.id === id ? response.data : event\n          ),\n          loading: false\n        }));\n        return response.data;\n      } else {\n        setState(prev => ({\n          ...prev,\n          error: response.message || 'Failed to update event',\n          loading: false\n        }));\n        return null;\n      }\n    } catch (error) {\n      setState(prev => ({\n        ...prev,\n        error: error instanceof Error ? error.message : 'Unknown error occurred',\n        loading: false\n      }));\n      return null;\n    }\n  }, []);\n\n  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {\n    setState(prev => ({ ...prev, loading: true, error: null }));\n\n    try {\n      const response = await calendarService.deleteEvent(id);\n      \n      if (response.success) {\n        setState(prev => ({\n          ...prev,\n          events: prev.events.filter(event => event.id !== id),\n          loading: false\n        }));\n        return true;\n      } else {\n        setState(prev => ({\n          ...prev,\n          error: response.message || 'Failed to delete event',\n          loading: false\n        }));\n        return false;\n      }\n    } catch (error) {\n      setState(prev => ({\n        ...prev,\n        error: error instanceof Error ? error.message : 'Unknown error occurred',\n        loading: false\n      }));\n      return false;\n    }\n  }, []);\n\n  const deleteMultipleEvents = useCallback(async (ids: string[]): Promise<boolean> => {\n    setState(prev => ({ ...prev, loading: true, error: null }));\n\n    try {\n      const response = await calendarService.deleteMultipleEvents(ids);\n      \n      if (response.success) {\n        setState(prev => ({\n          ...prev,\n          events: prev.events.filter(event => !ids.includes(event.id)),\n          loading: false\n        }));\n        return true;\n      } else {\n        setState(prev => ({\n          ...prev,\n          error: response.message || 'Failed to delete events',\n          loading: false\n        }));\n        return false;\n      }\n    } catch (error) {\n      setState(prev => ({\n        ...prev,\n        error: error instanceof Error ? error.message : 'Unknown error occurred',\n        loading: false\n      }));\n      return false;\n    }\n  }, []);\n\n  const refreshEvents = useCallback(async () => {\n    calendarService.clearCache();\n    await loadEvents();\n  }, [loadEvents]);\n\n  const clearError = useCallback(() => {\n    setState(prev => ({ ...prev, error: null }));\n  }, []);\n\n  const loadMockData = useCallback(async () => {\n    setState(prev => ({ ...prev, loading: true, error: null }));\n    \n    try {\n      const mockEvents = await calendarService.getMockEvents();\n      setState(prev => ({\n        ...prev,\n        events: mockEvents,\n        loading: false,\n        pagination: {\n          page: 1,\n          limit: mockEvents.length,\n          total: mockEvents.length\n        },\n        hasMore: false\n      }));\n    } catch (error) {\n      setState(prev => ({\n        ...prev,\n        error: error instanceof Error ? error.message : 'Failed to load mock data',\n        loading: false\n      }));\n    }\n  }, []);\n\n  // Initial load\n  useEffect(() => {\n    if (initialLoad) {\n      loadMockData(); // Use mock data for now\n      // loadEvents(); // Use this for real API\n    }\n  }, [initialLoad, loadMockData]);\n\n  const actions: UseCalendarApiActions = {\n    loadEvents,\n    createEvent,\n    updateEvent,\n    deleteEvent,\n    deleteMultipleEvents,\n    refreshEvents,\n    clearError,\n    loadMockData\n  };\n\n  return [state, actions];\n};