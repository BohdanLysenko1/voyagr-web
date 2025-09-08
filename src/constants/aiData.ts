import { Flight, Hotel, Package } from '@/types/ai';
import { 
  Plane,
  Building,
  Map
} from 'lucide-react';

export const SAMPLE_FLIGHTS: Flight[] = [
  { id: 1, route: 'New York → Paris', date: 'May 15', hearted: true },
  { id: 2, route: 'Toronto → Rome', date: 'May 28', hearted: false },
  { id: 3, route: 'Bangkok → Sydney', date: 'Aug 12', hearted: false },
];

export const SAMPLE_HOTELS: Hotel[] = [
  { id: 1, name: 'The Ritz-Carlton Belfast', location: 'Ireland', hearted: true },
  { id: 2, name: 'Grand Hotel Belfast', location: 'Ireland', hearted: false },
  { id: 3, name: 'Casa del Sol Resort', location: 'Spain', hearted: false },
  { id: 4, name: 'Aurora Haven Lodge', location: 'Norway', hearted: false },
];

export const SAMPLE_PACKAGES: Package[] = [
  { id: 1, name: 'Soul of Japan', duration: 'Jan 1 - Jan 8', hearted: true },
  { id: 2, name: 'Soul of Japan', duration: 'Jun 16 - Jun 27', hearted: false },
  { id: 3, name: 'Tokyo Drift', duration: 'Mar 21 - Mar 25', hearted: false },
  { id: 4, name: 'Midnight in Paris', duration: 'Sep 1 - Sep 8', hearted: false },
];

export const SUGGESTED_PROMPTS = [
  { text: "Relaxing honeymoon in October", emoji: "💕" },
  { text: "Nature retreat, camping, and hiking", emoji: "🏕️" },
  { text: "Affordable solo trip to South America", emoji: "💰" },
  { text: "10-day Italy excursion with food", emoji: "🍝" },
  { text: "Cultural exploration in Japan", emoji: "🏯" },
  { text: "Safari adventure in Kenya", emoji: "🦁" }
];

export const PLACEHOLDER_TEXT = "Write your heart out! From 'Europe in May' to 'Best foodie cities in Asia'... Say what you're in the mood for - I'll take care of the rest.";

export const SIDEBAR_SECTIONS = {
  flights: {
    title: 'Flights',
    icon: Plane,
    gradientFrom: 'from-blue-100',
    gradientTo: 'to-sky-100',
    iconColor: 'text-blue-600'
  },
  hotels: {
    title: 'Hotels',
    icon: Building,
    gradientFrom: 'from-emerald-100',
    gradientTo: 'to-green-100',
    iconColor: 'text-emerald-600'
  },
  packages: {
    title: 'Packages',
    icon: Map,
    gradientFrom: 'from-purple-100',
    gradientTo: 'to-pink-100',
    iconColor: 'text-purple-600'
  }
};
