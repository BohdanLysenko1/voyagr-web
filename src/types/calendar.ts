export type EventType = 'departure' | 'arrival' | 'event' | 'urgent' | 'meeting';

export type RepeatFrequency = 'never' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface RepeatOptions {
  frequency: RepeatFrequency;
  interval: number;
  endDate: string;
  count: number;
}

export interface CalendarEvent {
  id: string;
  userId?: string; // Added to match backend
  title: string;
  type: EventType;
  date: string;
  time?: string;
  repeat?: RepeatOptions;
  createdAt?: string; // Added to match backend
  updatedAt?: string; // Added to match backend
}

export interface EventFormState {
  title: string;
  type: EventType;
  date: string;
  time: string;
  repeat: RepeatOptions;
}

export interface NextUpEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  type: EventType;
  date: string;
}

export interface CalendarModalState {
  showEventModal: boolean;
  showDayModal: boolean;
  selectedDate: string;
  selectedDayEvents: CalendarEvent[];
  editingEvent: CalendarEvent | null;
  isMultiSelectMode: boolean;
  selectedEvents: Set<string>;
}