'use client';

import { useState, useCallback, useRef } from 'react';
import { useAIPageState } from '@/hooks/useAIPageState';
import AIInterface from '@/components/AI/AIInterface';
import AIPageWrapper from '@/components/AI/shared/AIPageWrapper';

export default function ItineraryPage() {
  const { inputValue, setInputValue, isTyping } = useAIPageState();
  const [resetKey, setResetKey] = useState(0);
  const clearChatFunctionRef = useRef<(() => void) | null>(null);

  const registerClearChat = useCallback((fn: () => void) => {
    clearChatFunctionRef.current = fn;
  }, []);

  const handleSubmit = useCallback(() => {
    // Chat flow handled by AIInterface
  }, []);

  const itineraryPrompts = [
    "Create a 5-day itinerary for Paris",
    "Plan a week-long trip to Japan",
    "Map out attractions in Rome",
    "Build an itinerary for my upcoming trip",
  ];

  return (
    <AIPageWrapper 
      title="Map & Itinerary" 
      subtitle="Trip Planning"
      showSidebar={true}
      showMobileNav={true}
    >
      <AIInterface
        key={resetKey}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isTyping={isTyping}
        suggestedPrompts={itineraryPrompts}
        placeholderText="Describe your trip and I'll help map it out..."
        onSubmit={handleSubmit}
        preferences={null}
        activeTab="mapout"
        registerClearChat={registerClearChat}
        onFirstMessage={() => {}}
        onMessageSent={() => {}}
      />
    </AIPageWrapper>
  );
}
