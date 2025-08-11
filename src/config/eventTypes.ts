import { Plane, PlaneTakeoff, PlaneLanding, MapPin, Calendar, AlertTriangle, Users } from 'lucide-react';
import { EventType } from '@/types/calendar';

export const EVENT_TYPE_CONFIG = {
  departure: {
    color: 'event-departure',
    textColor: 'text-departure',
    label: 'Departure',
    icon: PlaneTakeoff,
    location: 'Terminal A, Gate 12'
  },
  arrival: {
    color: 'event-arrival',
    textColor: 'text-arrival',
    label: 'Arrival',
    icon: PlaneLanding,
    location: 'Terminal B, Gate 8'
  },
  event: {
    color: 'event-event',
    textColor: 'text-event',
    label: 'Event',
    icon: Calendar,
    location: 'Conference Room'
  },
  urgent: {
    color: 'event-urgent',
    textColor: 'text-urgent',
    label: 'Urgent',
    icon: AlertTriangle,
    location: 'Office'
  },
  meeting: {
    color: 'event-meeting',
    textColor: 'text-meeting',
    label: 'Meeting',
    icon: Users,
    location: 'Meeting Room'
  }
} as const satisfies Record<EventType, {
  color: string;
  textColor: string;
  label: string;
  icon: any;
  location: string;
}>;

export const EVENT_COLORS = Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => ({
  type: type as EventType,
  ...config
}));