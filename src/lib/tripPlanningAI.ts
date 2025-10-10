import { api } from './apiClient';
import {
  WizardStep,
  TripItinerary,
  FlightOption,
  HotelOption,
  TripActivity
} from '@/types/tripPlanning';

export interface TripPlanningContext {
  currentStep: WizardStep;
  itinerary: Partial<TripItinerary>;
  userMessage: string;
}

export interface AITripSuggestion {
  message: string;
  suggestions?: {
    destinations?: string[];
    activities?: TripActivity[];
    flightOptions?: FlightOption[];
    hotelOptions?: HotelOption[];
  };
  nextStep?: WizardStep;
}

/**
 * Generate conversational AI response for trip planning wizard
 */
export async function generateTripPlanningResponse(
  context: TripPlanningContext
): Promise<AITripSuggestion> {
  try {
    const response = await api.post<{
      success: boolean;
      data: AITripSuggestion;
      message: string;
    }>('/api/ai/trip-planning', {
      currentStep: context.currentStep,
      itinerary: context.itinerary,
      userMessage: context.userMessage,
    });

    return response.data;
  } catch (error) {
    console.error('Error generating trip planning response:', error);

    // Fallback responses based on current step
    return getFallbackResponse(context.currentStep);
  }
}

/**
 * Get smart suggestions for destinations based on preferences
 */
export async function getDestinationSuggestions(
  preferences?: string[]
): Promise<string[]> {
  try {
    const response = await api.post<{
      success: boolean;
      data: { destinations: string[] };
    }>('/api/ai/suggest-destinations', {
      preferences: preferences || [],
    });

    return response.data.destinations;
  } catch (error) {
    console.error('Error getting destination suggestions:', error);
    return ['Paris', 'Tokyo', 'New York', 'Bali', 'Rome', 'Dubai'];
  }
}

/**
 * Get flight options using AI
 */
export async function getFlightSuggestions(params: {
  destination: string;
  dates: { from: Date; to: Date };
  travelers: number;
  budget: number;
}): Promise<FlightOption[]> {
  try {
    const response = await api.post<{
      success: boolean;
      data: { flights: FlightOption[] };
    }>('/api/ai/suggest-flights', params);

    return response.data.flights;
  } catch (error) {
    console.error('Error getting flight suggestions:', error);
    return [];
  }
}

/**
 * Get hotel suggestions using AI
 */
export async function getHotelSuggestions(params: {
  destination: string;
  dates: { from: Date; to: Date };
  travelers: number;
  budget: number;
  preferences?: string[];
}): Promise<HotelOption[]> {
  try {
    const response = await api.post<{
      success: boolean;
      data: { hotels: HotelOption[] };
    }>('/api/ai/suggest-hotels', params);

    return response.data.hotels;
  } catch (error) {
    console.error('Error getting hotel suggestions:', error);
    return [];
  }
}

/**
 * Get activity suggestions using AI
 */
export async function getActivitySuggestions(params: {
  destination: string;
  interests: string[];
  budget: number;
}): Promise<TripActivity[]> {
  try {
    const response = await api.post<{
      success: boolean;
      data: { activities: TripActivity[] };
    }>('/api/ai/suggest-activities', params);

    return response.data.activities;
  } catch (error) {
    console.error('Error getting activity suggestions:', error);
    return [];
  }
}

/**
 * Generate day-by-day itinerary using AI
 */
export async function generateDailyItinerary(
  itinerary: Partial<TripItinerary>
): Promise<TripItinerary['dailyPlan']> {
  try {
    const response = await api.post<{
      success: boolean;
      data: { dailyPlan: TripItinerary['dailyPlan'] };
    }>('/api/ai/generate-itinerary', {
      itinerary,
    });

    return response.data.dailyPlan;
  } catch (error) {
    console.error('Error generating daily itinerary:', error);
    return [];
  }
}

/**
 * Fallback responses when API is unavailable
 */
function getFallbackResponse(step: WizardStep): AITripSuggestion {
  const responses: Record<WizardStep, AITripSuggestion> = {
    destination: {
      message: "Great! Let's start planning your trip. Where would you like to go? I can suggest popular destinations based on your interests!",
      nextStep: 'dates',
    },
    dates: {
      message: "Perfect choice! When are you planning to travel? Select your dates and I'll find the best options for you.",
      nextStep: 'travelers',
    },
    travelers: {
      message: "Got it! How many people will be traveling? This helps me find the right accommodations and activities.",
      nextStep: 'budget',
    },
    budget: {
      message: "Now let's talk budget. What's your total budget for this trip? I'll help you allocate it wisely across flights, hotels, and activities.",
      nextStep: 'preferences',
    },
    preferences: {
      message: "What kind of experiences interest you? Select your preferences so I can personalize your trip!",
      nextStep: 'flights',
    },
    flights: {
      message: "Here are some great flight options I found for you! Choose the one that fits your schedule and budget.",
      nextStep: 'hotels',
    },
    hotels: {
      message: "Now let's find the perfect place to stay! Here are accommodations that match your style and budget.",
      nextStep: 'activities',
    },
    activities: {
      message: "Let's make your trip memorable! Select the activities you'd love to experience.",
      nextStep: 'review',
    },
    review: {
      message: "Amazing! Here's your complete trip itinerary. Review everything and confirm when you're ready!",
    },
  };

  return responses[step] || {
    message: "I'm here to help plan your perfect trip! Let's get started.",
    nextStep: 'destination',
  };
}
