import { useState, useCallback } from 'react';
import { TripItinerary, WizardStep } from '@/types/tripPlanning';

export interface UseTripPlanningReturn {
  itinerary: Partial<TripItinerary>;
  currentStep: WizardStep;
  updateItinerary: (step: WizardStep, data: any) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetItinerary: () => void;
}

const WIZARD_STEPS: WizardStep[] = [
  'destination',
  'dates',
  'travelers',
  'budget',
  'preferences',
  'flights',
  'hotels',
  'activities',
  'review'
];

export function useTripPlanning(): UseTripPlanningReturn {
  const [itinerary, setItinerary] = useState<Partial<TripItinerary>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const updateItinerary = useCallback((step: WizardStep, data: any) => {
    setItinerary(prev => {
      const updated = { ...prev };

      switch (step) {
        case 'destination':
          updated.destination = {
            city: data.city,
            country: data.country || '',
          };
          break;

        case 'dates':
          updated.dates = {
            startDate: data.startDate,
            endDate: data.endDate,
          };
          break;

        case 'travelers':
          updated.travelers = data.count;
          break;

        case 'budget':
          updated.budget = {
            total: data.total,
            currency: 'USD',
            breakdown: {
              flights: data.breakdown?.find((c: any) => c.id === 'flights')?.amount || 0,
              accommodation: data.breakdown?.find((c: any) => c.id === 'accommodation')?.amount || 0,
              activities: data.breakdown?.find((c: any) => c.id === 'activities')?.amount || 0,
              food: data.breakdown?.find((c: any) => c.id === 'food')?.amount || 0,
              other: data.breakdown?.find((c: any) => c.id === 'other')?.amount || 0,
            }
          };
          break;

        case 'preferences':
          updated.preferences = {
            travelStyle: data.travelStyle || 'balanced',
            pace: data.pace || 'moderate',
            interests: data.interests || [],
          };
          break;

        case 'flights':
          // In production, fetch full flight data from API
          updated.flight = {
            id: data.flightId,
            airline: 'Selected Airline',
            departure: 'DEP',
            arrival: 'ARR',
            duration: '8h',
            price: 850,
            stops: 0,
            selected: true,
          };
          break;

        case 'hotels':
          // In production, fetch full hotel data from API
          updated.hotel = {
            id: data.hotelId,
            name: 'Selected Hotel',
            rating: 4.5,
            pricePerNight: 200,
            amenities: [],
            selected: true,
          };
          break;

        case 'activities':
          // In production, fetch full activity data from API
          updated.selectedActivities = (data.activityIds || []).map((id: string) => ({
            id,
            name: 'Activity ' + id,
            description: '',
            category: 'adventure' as const,
            price: 50,
            duration: '2h',
            selected: true,
          }));
          break;

        default:
          break;
      }

      return updated;
    });
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const resetItinerary = useCallback(() => {
    setItinerary({});
    setCurrentStepIndex(0);
  }, []);

  return {
    itinerary,
    currentStep: WIZARD_STEPS[currentStepIndex],
    updateItinerary,
    nextStep,
    previousStep,
    resetItinerary,
  };
}
