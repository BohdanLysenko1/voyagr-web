import { CalendarEvent } from '@/types/calendar';
import { EventUtils } from '@/utils/eventUtils';

export interface CalendarServiceConfig {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class CalendarService {
  private config: CalendarServiceConfig;
  private isOnline: boolean = true;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor(config: CalendarServiceConfig = {}) {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: 10000,
      ...config,
    };

    // Listen for online/offline status
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => { this.isOnline = true; });
      window.addEventListener('offline', () => { this.isOnline = false; });
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}_${url}_${JSON.stringify(options.body || {})}`;

    // Check cache first for GET requests
    if ((!options.method || options.method === 'GET') && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cached.ttl) {
        return { data: cached.data, success: true };
      }
      this.cache.delete(cacheKey);
    }

    // Return cached data if offline
    if (!this.isOnline) {
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)!;
        return { data: cached.data, success: true, message: 'Offline - showing cached data' };
      }
      throw new Error('No internet connection and no cached data available');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout!);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        return {
          data: null as T,
          success: false,
          message: errorData.message || `HTTP ${response.status}`,
          errors: errorData.errors || []
        };
      }

      const result = await response.json();

      // Cache successful GET requests
      if (!options.method || options.method === 'GET') {
        this.cache.set(cacheKey, {
          data: result.data || result,
          timestamp: Date.now(),
          ttl: 5 * 60 * 1000 // 5 minutes
        });
      }

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  async getEvents(params: {
    startDate?: string;
    endDate?: string;
    type?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<CalendarEvent>>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = `/calendar/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<PaginatedResponse<CalendarEvent>>(endpoint);
  }

  async getEvent(id: string): Promise<ApiResponse<CalendarEvent>> {
    return this.makeRequest<CalendarEvent>(`/calendar/events/${id}`);
  }

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<ApiResponse<CalendarEvent>> {
    const validationErrors = EventUtils.validateEvent(event);
    if (validationErrors.length > 0) {
      return {
        data: null as any,
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      };
    }

    return this.makeRequest<CalendarEvent>('/calendar/events', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  }

  async updateEvent(id: string, event: Partial<CalendarEvent>): Promise<ApiResponse<CalendarEvent>> {
    const validationErrors = EventUtils.validateEvent(event);
    if (validationErrors.length > 0) {
      return {
        data: null as any,
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      };
    }

    return this.makeRequest<CalendarEvent>(`/calendar/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event)
    });
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/calendar/events/${id}`, {
      method: 'DELETE'
    });
  }

  async deleteMultipleEvents(ids: string[]): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('/calendar/events/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
  }

  // Mock data methods for development
  async getMockEvents(): Promise<CalendarEvent[]> {
    // This can be replaced with actual API calls
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Flight to Paris',
        type: 'departure',
        date: '2025-08-15',
        time: '10:00 AM'
      },
      {
        id: '2',
        title: 'Hotel Check-in',
        type: 'arrival',
        date: '2025-08-15',
        time: '3:00 PM'
      },
      {
        id: '3',
        title: 'Important Meeting',
        type: 'urgent',
        date: '2025-08-16',
        time: '9:00 AM'
      }
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents;
  }

  // Utility methods
  clearCache(): void {
    this.cache.clear();
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const calendarService = new CalendarService();