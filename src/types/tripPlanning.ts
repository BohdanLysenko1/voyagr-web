// Trip Planning Types

export interface TripDestination {
  city: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface TripDates {
  startDate: Date;
  endDate: Date;
}

export interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TripBudget {
  total: number;
  currency: string;
  breakdown: {
    flights: number;
    accommodation: number;
    activities: number;
    food: number;
    other: number;
  };
}

export interface TripActivity {
  id: string;
  name: string;
  description: string;
  category: 'adventure' | 'culture' | 'food' | 'relaxation' | 'nightlife' | 'shopping';
  price: number;
  duration: string;
  image?: string;
  selected: boolean;
}

export interface FlightOption {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  selected: boolean;
}

export interface HotelOption {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  image?: string;
  selected: boolean;
}

export interface ItineraryDay {
  date: Date;
  activities: {
    time: string;
    title: string;
    description: string;
    location?: string;
    price?: number;
  }[];
}

export interface TripItinerary {
  origin?: TripDestination;
  destination: TripDestination;
  dates: TripDates;
  travelers: number;
  budget: TripBudget;
  flight?: FlightOption;
  hotel?: HotelOption;
  selectedActivities: TripActivity[];
  dailyPlan: ItineraryDay[];
  preferences: {
    travelStyle: string;
    pace: 'relaxed' | 'moderate' | 'packed';
    interests: string[];
  };
}

export type WizardStep =
  | 'destination'
  | 'dates'
  | 'travelers'
  | 'budget'
  | 'preferences'
  | 'flights'
  | 'hotels'
  | 'activities'
  | 'review';

export interface InteractiveMessageData {
  type: 'quick-reply' | 'calendar' | 'carousel' | 'grid' | 'slider' | 'confirmation';
  step: WizardStep;
  data: any;
}
