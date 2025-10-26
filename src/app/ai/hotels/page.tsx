'use client';

import { useState, useCallback, useRef } from 'react';
import { useAIPageState } from '@/hooks/useAIPageState';
import AIInterface from '@/components/AI/AIInterface';
import AIPageWrapper from '@/components/AI/shared/AIPageWrapper';

export default function HotelsPage() {
  const { inputValue, setInputValue, isTyping } = useAIPageState();
  const [resetKey, setResetKey] = useState(0);
  const clearChatFunctionRef = useRef<(() => void) | null>(null);

  const registerClearChat = useCallback((fn: () => void) => {
    clearChatFunctionRef.current = fn;
  }, []);

  const handleSubmit = useCallback(() => {
    // Chat flow handled by AIInterface
  }, []);

  const hotelPrompts = [
    "Find luxury hotels in Paris",
    "Best budget hotels in Tokyo",
    "5-star hotels with ocean views in Bali",
    "Pet-friendly hotels in New York",
  ];

  return (
    <AIPageWrapper 
      title="Find Hotels" 
      subtitle="Hotel Search"
      showSidebar={true}
      showMobileNav={true}
    >
      <AIInterface
        key={resetKey}
        inputValue={inputValue}
        onInputChange={setInputValue}
        isTyping={isTyping}
        suggestedPrompts={hotelPrompts}
        placeholderText="What kind of accommodation are you looking for?"
        onSubmit={handleSubmit}
        preferences={null}
        activeTab="hotels"
        registerClearChat={registerClearChat}
        onFirstMessage={() => {}}
        onMessageSent={() => {}}
      />
    </AIPageWrapper>
  );
}
