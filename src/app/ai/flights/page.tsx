'use client';

import { useState, useCallback, useRef } from 'react';
import { useAIPageState } from '@/hooks/useAIPageState';
import { SUGGESTED_PROMPTS } from '@/constants/aiData';
import AIInterface from '@/components/AI/AIInterface';
import AIPageWrapper from '@/components/AI/shared/AIPageWrapper';

export default function FlightsPage() {
  const { inputValue, setInputValue, isTyping } = useAIPageState();
  const [resetKey, setResetKey] = useState(0);
  const clearChatFunctionRef = useRef<(() => void) | null>(null);

  const registerClearChat = useCallback((fn: () => void) => {
    clearChatFunctionRef.current = fn;
  }, []);

  const handleSubmit = useCallback(() => {
    // Chat flow handled by AIInterface
  }, []);

  const flightPrompts = [
    "Find me flights from New York to Paris",
    "Show me the cheapest flights to Tokyo",
    "Business class flights to London next month",
    "Round-trip flights to Bali in December",
  ];

  return (
    <AIPageWrapper 
      title="Find Flights" 
      subtitle="Flight Search"
      showSidebar={true}
      showMobileNav={true}
    >
      <AIInterface
        key={resetKey}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isTyping={isTyping}
        suggestedPrompts={flightPrompts}
        placeholderText="Where would you like to fly? (e.g., 'Flights from NYC to Paris')"
        onSubmit={handleSubmit}
        preferences={null}
        activeTab="flights"
        registerClearChat={registerClearChat}
        onFirstMessage={() => {}}
        onMessageSent={() => {}}
      />
    </AIPageWrapper>
  );
}
