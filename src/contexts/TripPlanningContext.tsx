import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TripItinerary, WizardStep } from '@/types/tripPlanning';

type DestinationPhase = 'origin' | 'country' | 'city';

interface TripPlanningContextType {
  itinerary: Partial<TripItinerary>;
  currentStep: WizardStep;
  isWizardActive: boolean;
  destinationPhase: DestinationPhase;
  updateItinerary: (data: Partial<TripItinerary>) => void;
  setCurrentStep: (step: WizardStep) => void;
  setDestinationPhase: (phase: DestinationPhase) => void;
  startWizard: () => void;
  endWizard: () => void;
  resetItinerary: () => void;
}

const TripPlanningContext = createContext<TripPlanningContextType | undefined>(undefined);

export function TripPlanningProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItinerary] = useState<Partial<TripItinerary>>({});
  const [currentStep, setCurrentStep] = useState<WizardStep>('destination');
  const [isWizardActive, setIsWizardActive] = useState(false);
  const [destinationPhase, setDestinationPhase] = useState<DestinationPhase>('origin');

  const updateItinerary = useCallback((data: Partial<TripItinerary>) => {
    setItinerary(prev => ({
      ...prev,
      ...data,
    }));
  }, []);

  const startWizard = useCallback(() => {
    setIsWizardActive(true);
    setCurrentStep('destination');
  }, []);

  const endWizard = useCallback(() => {
    setIsWizardActive(false);
  }, []);

  const resetItinerary = useCallback(() => {
    setItinerary({});
    setCurrentStep('destination');
    setDestinationPhase('origin');
    setIsWizardActive(false);
  }, []);

  return (
    <TripPlanningContext.Provider
      value={{
        itinerary,
        currentStep,
        isWizardActive,
        destinationPhase,
        updateItinerary,
        setCurrentStep,
        setDestinationPhase,
        startWizard,
        endWizard,
        resetItinerary,
      }}
    >
      {children}
    </TripPlanningContext.Provider>
  );
}

export function useTripPlanningContext() {
  const context = useContext(TripPlanningContext);
  if (context === undefined) {
    throw new Error('useTripPlanningContext must be used within a TripPlanningProvider');
  }
  return context;
}
