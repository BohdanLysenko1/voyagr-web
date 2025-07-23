import { CalendarEvent, NextUpEvent, EventType } from '@/types/calendar';
import { EVENT_TYPE_CONFIG } from '@/config/eventTypes';
import { DateUtils } from './dateUtils';
import { TimeUtils } from './timeUtils';

export class EventUtils {
  static generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getEventsForDate(events: CalendarEvent[], dateString: string): CalendarEvent[] {
    return events.filter(event => event.date === dateString);
  }

  static sortEventsByTime(events: CalendarEvent[]): CalendarEvent[] {
    return [...events].sort((a, b) => {
      const timeA = a.time || '11:59 PM';
      const timeB = b.time || '11:59 PM';
      
      const minutesA = TimeUtils.convertTo24Hour(TimeUtils.parseTime(timeA));
      const minutesB = TimeUtils.convertTo24Hour(TimeUtils.parseTime(timeB));
      
      return minutesA - minutesB;
    });
  }

  static getFutureEvents(events: CalendarEvent[]): CalendarEvent[] {
    return events.filter(event => DateUtils.isFuture(event.date));
  }

  static getUpcomingEvents(events: CalendarEvent[], limit: number = 3): CalendarEvent[] {
    const futureEvents = this.getFutureEvents(events);
    const sortedEvents = futureEvents.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      
      const timeA = a.time || '11:59 PM';
      const timeB = b.time || '11:59 PM';
      return TimeUtils.convertTo24Hour(TimeUtils.parseTime(timeA)) - 
             TimeUtils.convertTo24Hour(TimeUtils.parseTime(timeB));
    });
    
    return sortedEvents.slice(0, limit);
  }

  static convertToNextUpEvent(event: CalendarEvent): NextUpEvent {
    const config = EVENT_TYPE_CONFIG[event.type];
    
    return {
      id: event.id,
      title: event.title,
      time: event.time || '12:00 PM',
      location: config.location,
      type: event.type,
      date: event.date
    };
  }

  static convertToNextUpEvents(events: CalendarEvent[]): NextUpEvent[] {
    return events.map(this.convertToNextUpEvent);
  }

  static getEventTypeConfig(type: EventType) {
    return EVENT_TYPE_CONFIG[type];
  }

  static validateEvent(event: Partial<CalendarEvent>): string[] {
    const errors: string[] = [];
    
    if (!event.title?.trim()) {
      errors.push('Event title is required');
    }
    
    if (!event.date) {
      errors.push('Event date is required');
    } else if (!DateUtils.parseDate(event.date)) {
      errors.push('Invalid event date');
    }
    
    if (event.time && !TimeUtils.isValidTimeString(event.time)) {
      errors.push('Invalid time format');
    }
    
    if (!event.type || !Object.keys(EVENT_TYPE_CONFIG).includes(event.type)) {
      errors.push('Valid event type is required');
    }
    
    return errors;
  }

  static createEmptyEvent(): Partial<CalendarEvent> {
    return {
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
    };
  }

  static formatEventDisplay(event: CalendarEvent): {
    dateDisplay: string;
    timeDisplay: string;
    typeDisplay: string;
  } {
    return {
      dateDisplay: DateUtils.formatShortDate(event.date),
      timeDisplay: event.time ? TimeUtils.formatTimeForDisplay(event.time) : 'All day',
      typeDisplay: EVENT_TYPE_CONFIG[event.type].label
    };
  }

  static generateRepeatedEvents(baseEvent: CalendarEvent): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    
    // If no repeat settings or frequency is 'never', return just the base event
    if (!baseEvent.repeat || baseEvent.repeat.frequency === 'never') {
      return [baseEvent];
    }

    const { frequency, interval, endDate, count } = baseEvent.repeat;
    const startDate = DateUtils.parseDate(baseEvent.date);
    
    if (!startDate) {
      return [baseEvent];
    }

    let currentDate = new Date(startDate);
    let occurrenceCount = 0;
    const hasCountLimit = count && count > 0;
    const hasEndDate = endDate && endDate !== '';
    const endDateTime = hasEndDate ? DateUtils.parseDate(endDate) : null;
    
    // If no end conditions are set, generate events for the next 2 years to be reasonable
    const maxOccurrences = hasCountLimit ? count : (!hasEndDate ? 104 : 1000); // 2 years of weekly events = 104

    while (occurrenceCount < maxOccurrences) {
      // Check if we've exceeded the end date
      if (endDateTime && currentDate > endDateTime) {
        break;
      }

      // Create event for current date
      const eventDate = DateUtils.formatDateString(currentDate);
      events.push({
        ...baseEvent,
        id: `${baseEvent.id}_${occurrenceCount}`,
        date: eventDate,
        repeat: occurrenceCount === 0 ? baseEvent.repeat : undefined // Only keep repeat info on first event
      });

      occurrenceCount++;

      // Calculate next date based on frequency and interval
      switch (frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + (interval * 7));
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + interval);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + interval);
          break;
        case 'custom':
          currentDate.setDate(currentDate.getDate() + interval);
          break;
        default:
          break;
      }
    }

    return events;
  }
}