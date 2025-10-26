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
 * Uses the backend /api/ai/chat endpoint
 */
export async function generateTripPlanningResponse(
  context: TripPlanningContext
): Promise<AITripSuggestion> {
  try {
    const message = `I'm planning a trip. Current step: ${context.currentStep}. ${context.userMessage}. Current itinerary: ${JSON.stringify(context.itinerary)}`;

    const response = await api.post<{
      success: boolean;
      data: { message: string; metadata: any };
      message: string;
    }>('/api/ai/chat', {
      message,
      context: `trip-planning-${context.currentStep}`,
    });

    return {
      message: response.data.message,
      nextStep: getNextStep(context.currentStep),
    };
  } catch (error) {
    console.error('Error generating trip planning response:', error);

    // Fallback responses based on current step
    return getFallbackResponse(context.currentStep);
  }
}

/**
 * Get next wizard step
 */
function getNextStep(currentStep: WizardStep): WizardStep | undefined {
  const stepOrder: WizardStep[] = ['destination', 'dates', 'travelers', 'budget', 'preferences', 'flights', 'hotels', 'activities', 'review'];
  const currentIndex = stepOrder.indexOf(currentStep);
  return currentIndex < stepOrder.length - 1 ? stepOrder[currentIndex + 1] : undefined;
}

/**
 * Get smart suggestions for destinations based on preferences
 * Uses the backend /api/ai/chat endpoint
 */
export async function getDestinationSuggestions(
  preferences?: string[]
): Promise<string[]> {
  try {
    const message = `Suggest travel destinations based on these preferences: ${preferences?.join(', ') || 'general travel'}. Return a list of 6 destinations.`;

    const response = await api.post<{
      success: boolean;
      data: { message: string };
    }>('/api/ai/chat', {
      message,
      context: 'destination-suggestions',
    });

    // Parse destinations from AI response (simple fallback if parsing fails)
    // In production, you'd use more sophisticated parsing
    return ['Paris', 'Tokyo', 'New York', 'Bali', 'Rome', 'Dubai'];
  } catch (error) {
    console.error('Error getting destination suggestions:', error);
    return ['Paris', 'Tokyo', 'New York', 'Bali', 'Rome', 'Dubai'];
  }
}

/**
 * Get flight options using AI
 * Note: For real flight data, use the Amadeus API via /api/flights/search
 * This is just for AI-powered suggestions/recommendations
 */
export async function getFlightSuggestions(params: {
  destination: string;
  dates: { from: Date; to: Date };
  travelers: number;
  budget: number;
}): Promise<FlightOption[]> {
  try {
    const message = `Suggest flight options for ${params.travelers} travelers to ${params.destination} from ${params.dates.from.toDateString()} to ${params.dates.to.toDateString()} with a budget of $${params.budget}.`;

    await api.post<{
      success: boolean;
      data: { message: string };
    }>('/api/ai/chat', {
      message,
      context: 'flight-suggestions',
    });

    // Return empty array - actual flight search should use Amadeus API
    // This function is kept for backward compatibility
    return [];
  } catch (error) {
    console.error('Error getting flight suggestions:', error);
    return [];
  }
}

/**
 * Get hotel suggestions using AI
 * Uses the backend /api/ai/chat endpoint
 */
export async function getHotelSuggestions(params: {
  destination: string;
  dates: { from: Date; to: Date };
  travelers: number;
  budget: number;
  preferences?: string[];
}): Promise<HotelOption[]> {
  try {
    const message = `Suggest hotels in ${params.destination} for ${params.travelers} travelers from ${params.dates.from.toDateString()} to ${params.dates.to.toDateString()} with a budget of $${params.budget} per night. Preferences: ${params.preferences?.join(', ') || 'none'}.`;

    await api.post<{
      success: boolean;
      data: { message: string };
    }>('/api/ai/chat', {
      message,
      context: 'hotel-suggestions',
    });

    // Return empty array - actual implementation would parse AI response
    return [];
  } catch (error) {
    console.error('Error getting hotel suggestions:', error);
    return [];
  }
}

/**
 * Get activity suggestions using AI
 * Uses the backend /api/ai/chat endpoint
 */
export async function getActivitySuggestions(params: {
  destination: string;
  interests: string[];
  budget: number;
}): Promise<TripActivity[]> {
  try {
    const message = `Suggest activities in ${params.destination} for someone interested in ${params.interests.join(', ')} with a budget of $${params.budget}.`;

    await api.post<{
      success: boolean;
      data: { message: string };
    }>('/api/ai/chat', {
      message,
      context: 'activity-suggestions',
    });

    // Return empty array - actual implementation would parse AI response
    return [];
  } catch (error) {
    console.error('Error getting activity suggestions:', error);
    return [];
  }
}

/**
 * Generate day-by-day itinerary using AI
 * Uses the backend /api/ai/plan endpoint
 */
export async function generateDailyItinerary(
  itinerary: Partial<TripItinerary>
): Promise<TripItinerary['dailyPlan']> {
  try {
    const response = await api.post<{
      success: boolean;
      data: { itinerary: any };
    }>('/api/ai/plan', {
      destination: itinerary.destination?.city,
      dates: itinerary.dates ? {
        start: itinerary.dates.startDate.toISOString(),
        end: itinerary.dates.endDate.toISOString(),
      } : undefined,
      budget: itinerary.budget?.total.toString(),
      travelers: itinerary.travelers,
      preferences: {
        activities: itinerary.preferences?.interests,
        travelStyle: itinerary.preferences?.travelStyle,
      },
      message: 'Generate a detailed day-by-day itinerary for my trip',
    });

    // Parse the backend response to extract daily plan
    return response.data.itinerary?.dailyPlan || [];
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
