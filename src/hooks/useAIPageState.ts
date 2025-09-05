import { useState, useEffect } from 'react';
import { Flight, Hotel, Package } from '@/types/ai';

interface UseAIPageStateReturn {
  inputValue: string;
  setInputValue: (value: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isTyping: boolean;
}

export function useAIPageState(): UseAIPageStateReturn {
  const [inputValue, setInputValue] = useState('');
  const [activeSection, setActiveSection] = useState('flights');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (inputValue) {
      setIsTyping(true);
      timeout = setTimeout(() => setIsTyping(false), 1000);
    } else {
      setIsTyping(false);
    }
    return () => clearTimeout(timeout);
  }, [inputValue]);

  return {
    inputValue,
    setInputValue,
    activeSection,
    setActiveSection,
    isTyping,
  };
}

interface UseStarrableItemsReturn<T> {
  items: T[];
  toggleStar: (id: number) => void;
}

export function useStarrableItems<T extends { id: number; starred: boolean }>(
  initialItems: T[]
): UseStarrableItemsReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);

  const toggleStar = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );
  };

  return { items, toggleStar };
}
