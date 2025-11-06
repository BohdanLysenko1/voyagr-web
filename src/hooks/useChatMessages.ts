import { useState, useCallback } from 'react';
import { ChatMessageData } from '@/components/AI/ChatMessage';
import { api } from '@/lib/apiClient';
import { FlightOption } from '@/types/flights';

interface UseChatMessagesOptions {
  onFirstMessage?: (message: string) => void;
  onMessageSent?: (message: string) => void;
  onFlightSelect?: (flight: FlightOption) => void;
}

export function useChatMessages({
  onFirstMessage,
  onMessageSent,
  onFlightSelect,
}: UseChatMessagesOptions = {}) {
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);

  const addUserMessage = useCallback((content: string) => {
    const userMessage: ChatMessageData = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    return userMessage;
  }, []);

  const addAIMessage = useCallback((content: string, interactive?: any) => {
    const aiMessage: ChatMessageData = {
      id: (Date.now() + 1).toString(),
      content,
      sender: 'ai',
      timestamp: new Date(),
      interactive,
    };
    setChatMessages(prev => [...prev, aiMessage]);
    return aiMessage;
  }, []);

  const clearMessages = useCallback(() => {
    setChatMessages([]);
    setIsAITyping(false);
  }, []);

  const sendMessageToAI = useCallback(async (
    message: string,
    context?: string,
    itinerary?: any
  ) => {
    const isFirstMessage = chatMessages.length === 0;
    
    // Track messages
    if (isFirstMessage) {
      onFirstMessage?.(message);
    }
    onMessageSent?.(message);

    setIsAITyping(true);

    try {
      // Prepare chat history for API
      const chatHistory = chatMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'model' as const,
        content: msg.content
      }));

      // Build context
      let contextParts: string[] = [];
      
      if (context) {
        contextParts.push(context);
      }
      
      // Add trip planning context if available
      if (itinerary) {
        if (itinerary.destination?.city) {
          contextParts.push(`Destination: ${itinerary.destination.city}`);
        }
        if (itinerary.dates) {
          const startDate = new Date(itinerary.dates.startDate).toLocaleDateString();
          const endDate = new Date(itinerary.dates.endDate).toLocaleDateString();
          contextParts.push(`Dates: ${startDate} - ${endDate}`);
        }
        if (itinerary.travelers) {
          contextParts.push(`Travelers: ${itinerary.travelers}`);
        }
      }
      
      const finalContext = contextParts.length > 0 ? contextParts.join(', ') : undefined;

      // Call the backend API
      const response = await api.post<{
        success: boolean;
        data: { message: string; flights?: any[]; interactive?: any; metadata: any };
        message: string;
      }>('/api/ai/chat', {
        message,
        chatHistory,
        context: finalContext
      });

      const aiMessage: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        content: response.data.message,
        sender: 'ai',
        timestamp: new Date()
      };

      // Check if the AI response includes flight results
      if (response.data.flights || response.data.interactive?.flights) {
        const flightData = response.data.flights || response.data.interactive?.flights || [];
        
        if (flightData.length > 0) {
          aiMessage.interactive = {
            type: 'flight-results',
            flights: flightData,
            onSelectFlight: onFlightSelect
          };
        }
      }

      setChatMessages(prev => [...prev, aiMessage]);
      setIsAITyping(false);
      
      return aiMessage;
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsAITyping(false);
      throw error;
    }
  }, [chatMessages, onFirstMessage, onMessageSent, onFlightSelect]);

  return {
    chatMessages,
    setChatMessages,
    isAITyping,
    setIsAITyping,
    addUserMessage,
    addAIMessage,
    clearMessages,
    sendMessageToAI,
  };
}
