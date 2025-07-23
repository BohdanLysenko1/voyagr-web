export type EventType = 'departure' | 'arrival' | 'event' | 'urgent' | 'meeting';

export interface RepeatOptions {
  frequency: 'never' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  endDate: string;
  count: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time?: string;
  repeat?: RepeatOptions;
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