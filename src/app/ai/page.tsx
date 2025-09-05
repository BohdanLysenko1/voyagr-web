'use client';

import { useState } from 'react';
import { useAIPageState, useStarrableItems } from '@/hooks/useAIPageState';
import { SAMPLE_FLIGHTS, SAMPLE_HOTELS, SAMPLE_PACKAGES, SUGGESTED_PROMPTS, PLACEHOLDER_TEXT } from '@/constants/aiData';
import AISidebar from '@/components/AI/AISidebar';
import AIInterface from '@/components/AI/AIInterface';
import AIPreferencesModal from '@/components/AI/AIPreferencesModal';

export default function AiPage() {
  const { inputValue, setInputValue, activeSection, setActiveSection, isTyping } = useAIPageState();
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [preferences, setPreferences] = useState(null);
  
  const { items: flights, toggleStar: toggleFlightStar } = useStarrableItems(SAMPLE_FLIGHTS);
  const { items: hotels, toggleStar: toggleHotelStar } = useStarrableItems(SAMPLE_HOTELS);
  const { items: packages, toggleStar: togglePackageStar } = useStarrableItems(SAMPLE_PACKAGES);

  const handleNewTrip = () => {
    setIsPreferencesModalOpen(true);
  };

  const handleSubmit = () => {
    console.log('Submitting AI request:', inputValue);
    // Future implementation for AI processing
  };

  const handlePreferencesOpen = () => {
    setIsPreferencesModalOpen(true);
  };

  const handlePreferencesSave = (newPreferences: any) => {
    setPreferences(newPreferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30">
      <div className="flex min-h-screen pt-0">
        <AISidebar
          flights={flights}
          hotels={hotels}
          packages={packages}
          onFlightStarToggle={toggleFlightStar}
          onHotelStarToggle={toggleHotelStar}
          onPackageStarToggle={togglePackageStar}
          onNewTrip={handleNewTrip}
          onPreferencesOpen={handlePreferencesOpen}
        />
        <AIInterface
          inputValue={inputValue}
          onInputChange={setInputValue}
          isTyping={isTyping}
          suggestedPrompts={SUGGESTED_PROMPTS}
          placeholderText={PLACEHOLDER_TEXT}
          onSubmit={handleSubmit}
          preferences={preferences}
        />
      </div>
      
      <AIPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        onSave={handlePreferencesSave}
      />
    </div>
  );
}