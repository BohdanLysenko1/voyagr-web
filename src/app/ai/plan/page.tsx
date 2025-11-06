'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useAIPageState } from '@/hooks/useAIPageState';
import { useTripPlanningContext } from '@/contexts/TripPlanningContext';
import { SUGGESTED_PROMPTS, PLACEHOLDER_TEXT } from '@/constants/aiData';
import { WizardStep, TripItinerary } from '@/types/tripPlanning';
import AIInterface from '@/components/AI/AIInterface';
import AIPageWrapper from '@/components/AI/shared/AIPageWrapper';
import LiveItineraryPanel from '@/components/AI/LiveItineraryPanel';

export default function PlanPage() {
  const router = useRouter();
  const { isMobile } = useDeviceDetection();
  const { inputValue, setInputValue, isTyping } = useAIPageState();
  const {
    itinerary,
    currentStep,
    isWizardActive,
    updateItinerary,
    setCurrentStep,
    startWizard,
    endWizard,
  } = useTripPlanningContext();

  const [resetKey, setResetKey] = useState(0);
  const clearChatFunctionRef = useRef<(() => void) | null>(null);

  // Start the wizard when the component mounts
  useEffect(() => {
    if (!isWizardActive) {
      startWizard();
    }
  }, [isWizardActive, startWizard]);

  const WIZARD_STEPS: WizardStep[] = useMemo(() => [
    'destination',
    'dates',
    'travelers',
    'budget',
    'preferences',
    'flights',
    'hotels',
    'activities',
    'review'
  ], []);

  const registerClearChat = useCallback((fn: () => void) => {
    clearChatFunctionRef.current = fn;
  }, []);

  const handleWizardStepComplete = useCallback((step: WizardStep, data: any) => {
    updateItinerary(data);

    // For destination step, only advance if we have both origin AND destination with BOTH city and country
    if (step === 'destination') {
      // Check if this update includes full destination (both city and country)
      if (data.destination?.city && data.destination?.country) {
        // We have full destination, so we can advance to next step
        const currentIndex = WIZARD_STEPS.indexOf(step);
        const nextIndex = currentIndex + 1;
        if (nextIndex < WIZARD_STEPS.length) {
          const nextStep = WIZARD_STEPS[nextIndex];
          setCurrentStep(nextStep);
        }
      }
      // If only origin or only country is being set, don't advance - stay on destination step
      return;
    }

    // For all other steps, advance normally
    const currentIndex = WIZARD_STEPS.indexOf(step);
    const nextIndex = currentIndex + 1;

    if (nextIndex < WIZARD_STEPS.length) {
      const nextStep = WIZARD_STEPS[nextIndex];
      setCurrentStep(nextStep);
    }
  }, [updateItinerary, setCurrentStep, WIZARD_STEPS]);

  const handleTripConfirm = useCallback((finalItinerary: TripItinerary) => {
    endWizard();
    console.log('Trip confirmed:', finalItinerary);
    // Navigate to itinerary page or show success
    router.push('/ai/itinerary');
  }, [endWizard, router]);

  const handleSubmit = useCallback(() => {
    // Chat flow handled by AIInterface
  }, []);

  return (
    <AIPageWrapper 
      title={isWizardActive ? 'Trip Planner' : 'Plan Your Trip'}
      subtitle="Voyagr AI"
      showSidebar={!isWizardActive}
      showMobileNav={!isWizardActive}
    >
      <div className="flex flex-1 gap-6">
        {/* Main Chat Interface */}
        <div className="flex-1">
          <AIInterface
            key={resetKey}
            inputValue={inputValue}
            onInputChange={setInputValue}
            isTyping={isTyping}
            suggestedPrompts={SUGGESTED_PROMPTS}
            placeholderText={PLACEHOLDER_TEXT}
            onSubmit={handleSubmit}
            preferences={null}
            activeTab="plan"
            registerClearChat={registerClearChat}
            onFirstMessage={() => {}}
            onMessageSent={() => {}}
            onWizardStepComplete={handleWizardStepComplete}
            onTripConfirm={handleTripConfirm}
            hideActionButtons={true}
          />
        </div>

        {/* Live Itinerary Panel - Desktop Only */}
        {isWizardActive && !isMobile && (
          <aside className="hidden xl:block xl:w-96 xl:flex-shrink-0">
            <div className="sticky top-6" style={{ height: 'calc(100vh - 12rem)' }}>
              <LiveItineraryPanel 
                itinerary={itinerary} 
                isVisible={isWizardActive} 
              />
            </div>
          </aside>
        )}
      </div>
    </AIPageWrapper>
  );
}
