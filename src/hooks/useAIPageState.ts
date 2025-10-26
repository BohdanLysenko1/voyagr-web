import { useState, useEffect } from 'react';

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

interface UseHeartableItemsReturn<T> {
  items: T[];
  toggleHeart: (id: number) => void;
}

export function useHeartableItems<T extends { id: number; hearted: boolean }>(
  initialItems: T[]
): UseHeartableItemsReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);

  const toggleHeart = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, hearted: !item.hearted } : item
      )
    );
  };

  return { items, toggleHeart };
}

// Backward compatibility alias
export function useStarrableItems<T extends { id: number; hearted: boolean }>(
  initialItems: T[]
): { items: T[]; toggleStar: (id: number) => void } {
  const { items, toggleHeart } = useHeartableItems(initialItems);
  return { items, toggleStar: toggleHeart };
}
