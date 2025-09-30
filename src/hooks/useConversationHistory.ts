import { useState, useEffect, useCallback } from 'react';

export interface RecentConversation {
  id: string;
  title: string;
  timestamp: Date;
}

const STORAGE_KEY = 'voyagr-conversation-history';
const MAX_CONVERSATIONS = 10;

/**
 * Custom hook to manage conversation history with localStorage persistence
 */
export function useConversationHistory() {
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);

  // Load conversation history from localStorage on mount
  useEffect(() => {
    const loadConversationHistory = () => {
      try {
        const savedConversations = localStorage.getItem(STORAGE_KEY);
        if (savedConversations) {
          const parsed = JSON.parse(savedConversations);
          const conversations = parsed.map((conv: RecentConversation) => ({
            ...conv,
            timestamp: new Date(conv.timestamp),
          }));
          setRecentConversations(conversations);
        }
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    };

    loadConversationHistory();
  }, []);

  // Save conversation history to localStorage
  const saveConversationHistory = useCallback((conversations: RecentConversation[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      setRecentConversations(conversations);
    } catch (error) {
      console.error('Failed to save conversation history:', error);
    }
  }, []);

  // Add a new conversation to history
  const addConversation = useCallback(
    (firstMessage: string) => {
      const newConversation: RecentConversation = {
        id: Date.now().toString(),
        title: firstMessage.length > 50 ? `${firstMessage.substring(0, 50)}...` : firstMessage,
        timestamp: new Date(),
      };

      const updatedConversations = [
        newConversation,
        ...recentConversations.slice(0, MAX_CONVERSATIONS - 1),
      ];
      saveConversationHistory(updatedConversations);
    },
    [recentConversations, saveConversationHistory]
  );

  return {
    recentConversations,
    addConversation,
    saveConversationHistory,
  };
}