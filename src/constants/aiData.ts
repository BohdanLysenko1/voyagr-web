import { Flight, Hotel, Restaurant } from '@/types/ai';
import { 
  Plane,
  Building,
  UtensilsCrossed
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

export const SAMPLE_RESTAURANTS: Restaurant[] = [
  { id: 1, name: 'Le Bernardin', cuisine: 'French Seafood', location: 'New York, NY', hearted: true },
  { id: 2, name: 'Osteria Francescana', cuisine: 'Italian', location: 'Modena, Italy', hearted: false },
  { id: 3, name: 'Sukiyabashi Jiro', cuisine: 'Sushi', location: 'Tokyo, Japan', hearted: false },
  { id: 4, name: 'Noma', cuisine: 'Nordic', location: 'Copenhagen, Denmark', hearted: false },
];

export const SUGGESTED_PROMPTS = [
  { text: "Plan a 2-week honeymoon in the Maldives with $5,000 budget", emoji: "💕" },
  { text: "Best time to visit Japan? I want cherry blossoms and good weather", emoji: "🌸" },
  { text: "Family trip to Europe - 3 kids under 10, which cities are best?", emoji: "👨‍👩‍👧‍👦" },
  { text: "Solo backpacking Southeast Asia for 3 months on $15/day", emoji: "🎒" },
  { text: "Luxury safari in Tanzania or Kenya? Need hotel recommendations", emoji: "🦁" },
  { text: "Weekend getaway from NYC - somewhere unique under $1,000", emoji: "✈️" }
];

export const PLACEHOLDER_TEXT = "";

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
  restaurants: {
    title: 'Find Restaurants',
    icon: UtensilsCrossed,
    gradientFrom: 'from-purple-100',
    gradientTo: 'to-violet-100',
    iconColor: 'text-purple-600'
  }
};
