'use client';

import { useState, useCallback, useRef } from 'react';
import { useAIPageState } from '@/hooks/useAIPageState';
import AIInterface from '@/components/AI/AIInterface';
import AIPageWrapper from '@/components/AI/shared/AIPageWrapper';

export default function RestaurantsPage() {
  const { inputValue, setInputValue, isTyping } = useAIPageState();
  const [resetKey, setResetKey] = useState(0);
  const clearChatFunctionRef = useRef<(() => void) | null>(null);

  const registerClearChat = useCallback((fn: () => void) => {
    clearChatFunctionRef.current = fn;
  }, []);

  const handleSubmit = useCallback(() => {
    // Chat flow handled by AIInterface
  }, []);

  const restaurantPrompts = [
    "Best Italian restaurants in Rome",
    "Find authentic sushi in Tokyo",
    "Michelin-starred restaurants in Paris",
    "Vegan restaurants near me",
  ];

  return (
    <AIPageWrapper 
      title="Find Restaurants" 
      subtitle="Dining Discovery"
      showSidebar={true}
      showMobileNav={true}
    >
      <AIInterface
        key={resetKey}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isTyping={isTyping}
        suggestedPrompts={restaurantPrompts}
        placeholderText="What cuisine or restaurant are you craving?"
        onSubmit={handleSubmit}
        preferences={null}
        activeTab="restaurants"
        registerClearChat={registerClearChat}
        onFirstMessage={() => {}}
        onMessageSent={() => {}}
      />
    </AIPageWrapper>
  );
}
