import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, Send, ArrowRight, Settings } from 'lucide-react';
import Image from 'next/image';
import { KeyboardState, subscribeToKeyboardState, isIOS as detectIOS } from '@/utils/mobileKeyboard';
import { isNearBottom as evaluateNearBottom, shouldAutoScroll } from '@/utils/scrollLock';
import ChatMessage, { type ChatMessageData } from './ChatMessage';
import TypingIndicator from './TypingIndicator';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'restaurants' | 'mapout';

interface Preferences {
  travelStyle?: string;
  budget?: string;
  groupSize?: string;
  activities?: string[];
}

interface AIInterfaceProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  isTyping: boolean;
  suggestedPrompts: (string | { text: string; emoji: string })[];
  placeholderText: string;
  onSubmit?: () => void;
  preferences?: Preferences | null;
  activeTab: TabKey;
  registerClearChat?: (fn: () => void) => void;
  onFirstMessage?: (firstMessage: string) => void;
  onMessageSent?: (message: string) => void;
  onPreferencesOpen?: () => void;
  isMobile?: boolean;
  isIOSDevice?: boolean;
  isSidebarOpen?: boolean;
}

export default function AIInterface({
  inputValue,
  onInputChange,
  isTyping,
  suggestedPrompts,
  placeholderText,
  onSubmit,
  preferences,
  activeTab,
  registerClearChat,
  onFirstMessage,
  onMessageSent,
  onPreferencesOpen,
  isMobile = false,
  isIOSDevice: isIOSDeviceProp = false,
  isSidebarOpen = false
}: AIInterfaceProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const globeFieldRef = useRef<HTMLDivElement>(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const isUserScrollingRef = useRef(false);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const composerWrapperRef = useRef<HTMLDivElement | null>(null);
  const [composerHeight, setComposerHeight] = useState(0);
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isOpen: false,
    height: 0,
    viewportHeight: 0,
  });
  const [resolvedIsIOS, setResolvedIsIOS] = useState(isIOSDeviceProp);
  const iosDevice = resolvedIsIOS;
  const [scrollNode, setScrollNode] = useState<HTMLElement | null>(null);
  const handleScrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    scrollContainerRef.current = node ?? null;
    setScrollNode(node);
  }, []);

  // Track mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isIOSDeviceProp) {
      setResolvedIsIOS(true);
      return;
    }
    setResolvedIsIOS(detectIOS());
  }, [isIOSDeviceProp]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const unsubscribe = subscribeToKeyboardState((state) => {
      setKeyboardState((prev) => {
        if (
          prev.isOpen === state.isOpen &&
          prev.height === state.height &&
          prev.viewportHeight === state.viewportHeight
        ) {
          return prev;
        }
        return state;
      });
    });
    return unsubscribe;
  }, []);
  // Auto-grow the compact composer
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = 120;
    const nextHeight = Math.max(Math.min(el.scrollHeight, maxHeight), 24);
    el.style.height = `${nextHeight}px`;
  }, []);

  const showChat = chatMessages.length > 0 || isAITyping;

  // Keep input focused for quick subsequent typing and ensure the height matches content
  const focusInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Use preventScroll to avoid viewport jumps on both mobile and desktop
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
    }

    adjustTextareaHeight();
    // Place caret at the end
    const len = el.value.length;
    try { el.setSelectionRange(len, len); } catch {}
    if (process.env.NODE_ENV !== 'production') {
      setTimeout(() => {
        const focused = typeof document !== 'undefined' && document.activeElement === el;
        if (!focused) {
          // eslint-disable-next-line no-console
          console.debug('[AIInterface] focusInput: focus attempt did not stick');
        }
      }, 0);
    }
  }, [adjustTextareaHeight]);


  // Animated globe nodes with slight randomization at mount (client-side only)
  const globeNodes = useMemo(() => {
    // Only generate on client to prevent hydration mismatch
    if (!isMounted) return [];
    
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    type NodeCfg = {
      pos: { top: string; left?: string; right?: string };
      xStart: number; yStart: number; xEnd: number; yEnd: number;
      dur: number; size: number; opacity: number; spin: number;
    };
    const base: NodeCfg[] = [
      { pos: { top: '8%', left: '5%' }, xStart: -6, yStart: -4, xEnd: 10, yEnd: 6, dur: rand(20, 26), size: 140, opacity: 0.08, spin: 120 },
      { pos: { top: '20%', right: '8%' }, xStart: 5, yStart: -3, xEnd: -8, yEnd: 4, dur: rand(24, 30), size: 120, opacity: 0.07, spin: 110 },
      { pos: { top: '60%', left: '10%' }, xStart: 0, yStart: 0, xEnd: 12, yEnd: -6, dur: rand(18, 24), size: 90, opacity: 0.09, spin: 90 },
      { pos: { top: '68%', right: '12%' }, xStart: -10, yStart: 2, xEnd: 8, yEnd: -8, dur: rand(20, 26), size: 100, opacity: 0.06, spin: 95 },
      { pos: { top: '35%', left: '40%' }, xStart: -6, yStart: 6, xEnd: 6, yEnd: -6, dur: rand(16, 22), size: 60, opacity: 0.08, spin: 70 },
      { pos: { top: '78%', left: '46%' }, xStart: 4, yStart: -4, xEnd: -6, yEnd: 6, dur: rand(14, 20), size: 50, opacity: 0.07, spin: 60 },
      { pos: { top: '15%', left: '65%' }, xStart: 2, yStart: 4, xEnd: -8, yEnd: -4, dur: rand(18, 22), size: 70, opacity: 0.07, spin: 80 },
    ];
    return base.map((n) => {
      // small random offsets to path
      const jitter = (v: number, j: number) => v + rand(-j, j);
      const xStart = jitter(n.xStart, 2);
      const yStart = jitter(n.yStart, 2);
      const xEnd = jitter(n.xEnd, 2);
      const yEnd = jitter(n.yEnd, 2);
      return {
        nodeStyle: {
          top: n.pos.top,
          left: n.pos.left,
          right: n.pos.right,
          '--xStart': `${xStart}vw`,
          '--yStart': `${yStart}vh`,
          '--xEnd': `${xEnd}vw`,
          '--yEnd': `${yEnd}vh`,
          animationDuration: `${n.dur}s`,
        } as React.CSSProperties,
        spriteStyle: {
          '--size': `${n.size}px`,
          '--opacity': `${n.opacity}`,
          animationDuration: `${n.spin}s`,
        } as React.CSSProperties,
      };
    });
  }, [isMounted]);


  // Clear chat messages to return to welcome screen
  const clearChat = useCallback(() => {
    setChatMessages([]);
    setIsAITyping(false);
  }, []);
  
  // Also clear chat when activeTab changes to ensure clean state
  useEffect(() => {
    if (!isMounted) return; // Only run after component is mounted
    
    // Use requestAnimationFrame to ensure this runs after render cycle
    requestAnimationFrame(() => {
      setChatMessages([]);
      setIsAITyping(false);
    });
  }, [activeTab, isMounted]);

  // Expose clearChat function to parent component
  useEffect(() => {
    if (!isMounted) return; // Only run after component is mounted
    
    // Use requestAnimationFrame to ensure this runs after render cycle
    requestAnimationFrame(() => {
      registerClearChat?.(clearChat);
    });
  }, [registerClearChat, clearChat, isMounted]);


  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  useEffect(() => {
    const node = composerWrapperRef.current;
    if (!node) return;

    const updateHeight = () => {
      const rect = node.getBoundingClientRect();
      setComposerHeight(rect.height);
    };

    updateHeight();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [showChat]);


  // Check if user is near the bottom of the scroll container
  const isNearBottom = useCallback((threshold = 100) => {
    const container = scrollContainerRef.current;
    if (!container) return true;
    return evaluateNearBottom(
      {
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight,
      },
      threshold,
      isMobile,
    );
  }, [isMobile]);

  // Robust scroll to bottom
  const scrollToBottom = useCallback((force = false) => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }

    if (!force && !isNearBottom(100)) {
      return;
    }

    const performScroll = () => {
      const container = scrollContainerRef.current;

      if (!container) {
        if (messagesEndRef.current) {
          try {
            messagesEndRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest',
            });
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('ScrollIntoView fallback failed', error);
            }
          }
        }
        return;
      }

      const maxScroll = container.scrollHeight - container.clientHeight;

      try {
        container.scrollTo({
          top: maxScroll,
          behavior: 'smooth',
        });
      } catch {
        container.scrollTop = maxScroll;
      }

      const focusDelay = isMobile ? 25 : 250;
      autoScrollTimeoutRef.current = setTimeout(() => {
        focusInput();
      }, focusDelay);
    };

    if (isMobile) {
      requestAnimationFrame(() => {
        requestAnimationFrame(performScroll);
      });
    } else {
      requestAnimationFrame(performScroll);
    }
  }, [focusInput, isMobile, isNearBottom]);


  // Auto-scroll on new messages with improved logic
  useEffect(() => {
    if (chatMessages.length === 0) return;
    
    // Wait for DOM updates, then check if we should scroll - faster on mobile
    const scrollDelay = isMobile ? 10 : 100;
    const scrollTimeout = setTimeout(() => {
      const container = scrollContainerRef.current;
      const metrics = container
        ? {
            scrollTop: container.scrollTop,
            scrollHeight: container.scrollHeight,
            clientHeight: container.clientHeight,
          }
        : undefined;

      const allowAutoScroll = metrics
        ? shouldAutoScroll({
            metrics,
            threshold: 300,
            isMobile,
            userInitiated: !isUserScrollingRef.current,
          })
        : true;

      if (!allowAutoScroll) return;

      scrollToBottom(true);
    }, scrollDelay);
    
    return () => clearTimeout(scrollTimeout);
  }, [chatMessages, scrollToBottom, isMobile]);

  // Auto-scroll when AI starts typing
  useEffect(() => {
    if (isAITyping) {
      // Give AI typing a moment to render, then scroll
      const typingScrollTimeout = setTimeout(() => {
        scrollToBottom(true); // Force scroll when AI starts typing
      }, 150);
      
      return () => clearTimeout(typingScrollTimeout);
    }
  }, [isAITyping, scrollToBottom]);



  const generateAIResponse = useCallback((userMessage: string): string => {
    const responses: Record<string, string[]> = {
      flights: [
        `I'd be happy to help you find the perfect flights! Based on "${userMessage}", I can suggest some great options. Let me search for flights that match your preferences for dates, destinations, and budget.`,
        `Great choice! For your flight search "${userMessage}", I recommend checking both direct and connecting flights to get the best deals. Would you like me to focus on specific airlines or departure times?`,
        `Perfect! I'll help you with "${userMessage}". I can find flights with various price points and schedules. Do you have any preference for morning, afternoon, or evening departures?`
      ],
      hotels: [
        `Excellent! For "${userMessage}", I can recommend some amazing accommodations. Let me find hotels that match your style, budget, and location preferences.`,
        `I love helping with hotel searches! Based on "${userMessage}", I can suggest properties with great amenities and reviews. Are you looking for luxury, boutique, or budget-friendly options?`,
        `Perfect request! For "${userMessage}", I'll find accommodations that offer the best value and experience. Would you like properties with specific amenities like pools, spas, or business centers?`
      ],
      restaurants: [
        `Excellent choice! For your restaurant request "${userMessage}", I can recommend amazing dining experiences that match your taste preferences and location.`,
        `Perfect! Based on "${userMessage}", I'll find restaurants with exceptional cuisine, great ambiance, and stellar reviews. Are you looking for fine dining, casual spots, or specific cuisines?`,
        `Great taste! For "${userMessage}", I can suggest restaurants that offer authentic flavors, memorable experiences, and excellent value for your dining preferences.`
      ],
      plan: [
        `I'm excited to help plan your trip! Based on "${userMessage}", I can create a detailed itinerary with recommendations for flights, accommodations, activities, and dining.`,
        `Wonderful! For "${userMessage}", I'll craft a personalized travel plan that includes the best attractions, local experiences, and practical tips for your journey.`,
        `Great travel idea! From "${userMessage}", I can design a complete trip plan with day-by-day activities, restaurant suggestions, and insider tips to make your trip unforgettable.`
      ],
      preferences: [
        `Thanks for sharing your preferences! Based on "${userMessage}", I can now provide more personalized recommendations for your trip planning.`,
        `Perfect! Your preferences for "${userMessage}" will help me tailor the best travel suggestions for you.`,
        `Excellent! With your preferences about "${userMessage}", I can create more targeted recommendations for your perfect trip.`
      ]
    };

    const categoryResponses = responses[activeTab] || responses.plan;
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    return randomResponse;
  }, [activeTab]);

  const handleSendMessage = useCallback(async (messageOverride?: string) => {
    const textToSend = messageOverride ? messageOverride.trim() : inputValue.trim();
    if (!textToSend) return;

    // Check if this is the first message in the conversation
    const isFirstMessage = chatMessages.length === 0;

    // Add user message
    const userMessage: ChatMessageData = {
      id: Date.now().toString(),
      content: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    // Clear the input box regardless of where the text came from
    onInputChange('');
    // Keep focus in the compact input so user can continue typing immediately
    focusInput();
    requestAnimationFrame(() => adjustTextareaHeight());
    
    // Immediately scroll to show the user's message
    setTimeout(() => scrollToBottom(true), 50);
    
    // If this is the first message, save it to recent conversations
    if (isFirstMessage) {
      onFirstMessage?.(textToSend);
    }
    
    // Track all messages for conversation history
    onMessageSent?.(textToSend);
    
    // Show AI typing indicator
    setIsAITyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: ChatMessageData = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(textToSend),
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsAITyping(false);
      // After AI finishes, refocus the input on the next frame
      requestAnimationFrame(() => focusInput());
    }, 600 + Math.random() * 1000);

    onSubmit?.();
  }, [inputValue, chatMessages.length, onInputChange, onFirstMessage, onMessageSent, generateAIResponse, onSubmit, focusInput, adjustTextareaHeight, scrollToBottom]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    const ke = e as unknown as KeyboardEvent;
    const isEnter =
      e.key === 'Enter' ||
      (ke.code ? (ke.code === 'Enter' || ke.code === 'NumpadEnter') : false);

    if (isEnter && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  // Dynamic content based on active tab
  const getContentByTab = () => {
    switch (activeTab) {
      case 'flights':
        return {
          title: 'Flight Search',
          description: 'Find the perfect flights for your journey',
          placeholder: '',
          prompts: [
            { text: 'Round-trip to London for 2 weeks', emoji: '🇬🇧', color: 'from-blue-400/20 to-indigo-400/20 hover:from-blue-400/30 hover:to-indigo-400/30 border-blue-300/40' },
            { text: 'Business class to Tokyo in March', emoji: '🛩️', color: 'from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40' },
            { text: 'Budget flights to Europe this summer', emoji: '💰', color: 'from-green-400/20 to-emerald-400/20 hover:from-green-400/30 hover:to-emerald-400/30 border-green-300/40' },
            { text: 'Multi-city trip: NYC → Paris → Rome', emoji: '🌍', color: 'from-orange-400/20 to-red-400/20 hover:from-orange-400/30 hover:to-red-400/30 border-orange-300/40' },
            { text: 'One-way ticket to Australia', emoji: '🦘', color: 'from-yellow-400/20 to-amber-400/20 hover:from-yellow-400/30 hover:to-amber-400/30 border-yellow-300/40' },
            { text: 'Weekend getaway to Miami', emoji: '🏖️', color: 'from-cyan-400/20 to-blue-400/20 hover:from-cyan-400/30 hover:to-blue-400/30 border-cyan-300/40' },
          ],
          gradientColors: 'from-blue-500/30 to-indigo-500/30',
          accentColor: 'text-blue-600'
        };
      case 'hotels':
        return {
          title: 'Hotel Search',
          description: 'Discover amazing accommodations for your stay',
          placeholder: '',
          prompts: [
            { text: 'Luxury resort in Maldives', emoji: '🏝️', color: 'from-teal-400/20 to-cyan-400/20 hover:from-teal-400/30 hover:to-cyan-400/30 border-teal-300/40' },
            { text: 'Boutique hotel in Paris', emoji: '🏨', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
            { text: 'Budget-friendly hostel in Bangkok', emoji: '💸', color: 'from-green-400/20 to-lime-400/20 hover:from-green-400/30 hover:to-lime-400/30 border-green-300/40' },
            { text: 'Ski resort in Swiss Alps', emoji: '⛷️', color: 'from-blue-400/20 to-slate-400/20 hover:from-blue-400/30 hover:to-slate-400/30 border-blue-300/40' },
            { text: 'Beachfront villa in Santorini', emoji: '🏖️', color: 'from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border-blue-300/40' },
            { text: 'Historic inn in Kyoto', emoji: '🏯', color: 'from-purple-400/20 to-indigo-400/20 hover:from-purple-400/30 hover:to-indigo-400/30 border-purple-300/40' },
          ],
          gradientColors: 'from-emerald-500/30 to-teal-500/30',
          accentColor: 'text-emerald-600'
        };
      case 'restaurants':
        return {
          title: 'Restaurant Finder',
          description: 'Discover amazing dining experiences worldwide',
          placeholder: '',
          prompts: [
            { text: 'Best sushi restaurants in Tokyo', emoji: '🍣', color: 'from-red-400/20 to-orange-400/20 hover:from-red-400/30 hover:to-orange-400/30 border-red-300/40' },
            { text: 'Romantic dinner spots in Paris', emoji: '🥂', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
            { text: 'Authentic Italian trattorias in Rome', emoji: '🍝', color: 'from-green-400/20 to-emerald-400/20 hover:from-green-400/30 hover:to-emerald-400/30 border-green-300/40' },
            { text: 'Michelin-starred restaurants in NYC', emoji: '⭐', color: 'from-yellow-400/20 to-amber-400/20 hover:from-yellow-400/30 hover:to-amber-400/30 border-amber-300/40' },
            { text: 'Vegetarian-friendly cafes in London', emoji: '🥗', color: 'from-green-400/20 to-lime-400/20 hover:from-green-400/30 hover:to-lime-400/30 border-green-300/40' },
            { text: 'Street food gems in Bangkok', emoji: '🍜', color: 'from-orange-400/20 to-red-400/20 hover:from-orange-400/30 hover:to-red-400/30 border-orange-300/40' },
          ],
          gradientColors: 'from-purple-500/30 to-violet-500/30',
          accentColor: 'text-purple-600'
        };
      case 'mapout':
        return {
          title: 'Map Out Planner',
          description: 'Create detailed day-by-day itineraries with optimal routing',
          placeholder: '',
          prompts: [
            { text: '5-day New York City itinerary', emoji: '🗽', color: 'from-blue-400/20 to-indigo-400/20 hover:from-blue-400/30 hover:to-indigo-400/30 border-blue-300/40' },
            { text: 'Weekend food tour in Paris', emoji: '🥐', color: 'from-amber-400/20 to-orange-400/20 hover:from-amber-400/30 hover:to-orange-400/30 border-amber-300/40' },
            { text: 'Cultural exploration of Rome', emoji: '🏛️', color: 'from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40' },
            { text: 'Island hopping in Greece', emoji: '🏝️', color: 'from-cyan-400/20 to-blue-400/20 hover:from-cyan-400/30 hover:to-blue-400/30 border-cyan-300/40' },
            { text: 'Adventure route through Iceland', emoji: '🌋', color: 'from-slate-400/20 to-gray-400/20 hover:from-slate-400/30 hover:to-gray-400/30 border-slate-300/40' },
            { text: 'Cherry blossom tour in Japan', emoji: '🌸', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
          ],
          gradientColors: 'from-emerald-500/30 to-cyan-500/30',
          accentColor: 'text-emerald-600'
        };
      default: // 'plan'
        return {
          title: 'Voyagr',
          description: 'Plan your perfect trip with assistance',
          placeholder: '',
          prompts: suggestedPrompts || [
            { text: "Romantic weekend in Paris", emoji: "💕", color: "from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40" },
            { text: "Adventure trip to New Zealand", emoji: "🏔️", color: "from-emerald-400/20 to-green-400/20 hover:from-emerald-400/30 hover:to-green-400/30 border-emerald-300/40" },
            { text: "Food tour through Italy", emoji: "🍝", color: "from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/30 hover:to-orange-400/30 border-yellow-300/40" },
            { text: "Beach relaxation in Maldives", emoji: "🏝️", color: "from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border-blue-300/40" },
            { text: "Cultural exploration in Japan", emoji: "🏯", color: "from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40" },
            { text: "Safari adventure in Kenya", emoji: "🦁", color: "from-amber-400/20 to-yellow-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 border-amber-300/40" },
          ],
          gradientColors: 'from-primary/30 to-purple-500/30',
          accentColor: 'text-primary'
        };
    }
  };

  const content = getContentByTab();

  const keyboardOffset = keyboardState.isOpen ? Math.max(0, Math.round(keyboardState.height)) : 0;
  const composerHeightValue = Math.max(0, Math.round(composerHeight));

  const composerWrapperStyle = useMemo(() => {
    // On mobile, ensure the composer stays above the mobile nav bar (64px)
    const mobileNavHeight = isMobile ? 64 : 0;
    // Only apply keyboard offset on mobile when keyboard is actually open
    const totalOffset = isMobile && keyboardState.isOpen && keyboardOffset > 0 ? keyboardOffset : 0;
    return {
      paddingBottom: isMobile ? `calc(env(safe-area-inset-bottom) + ${mobileNavHeight}px + 16px)` : 'calc(env(safe-area-inset-bottom) + 24px)',
      transform: totalOffset > 0 ? `translateY(-${totalOffset}px)` : 'translateY(0)',
      transition: 'transform 0.15s ease-out',
      willChange: keyboardState.isOpen ? 'transform' : 'auto',
      position: 'relative' as const,
      zIndex: 35,
      marginBottom: isMobile ? '0' : undefined,
    };
  }, [keyboardOffset, keyboardState.isOpen, isMobile]);

  const messageContainerStyle = useMemo(() => {
    // Add padding to ensure messages don't get hidden behind the input composer
    return {
      touchAction: iosDevice ? 'pan-y' : 'auto',
      overscrollBehavior: 'contain' as const,
      WebkitOverflowScrolling: 'touch' as const,
      scrollBehavior: 'smooth' as const,
      position: 'relative' as const,
      zIndex: 1,
      '--composer-height': `${composerHeightValue}px`,
      paddingBottom: isMobile ? '24px' : `calc(env(safe-area-inset-bottom) + 12px)`,
    } as React.CSSProperties;
  }, [iosDevice, composerHeightValue, isMobile]);
  const messageSpacingClass = isMobile ? 'space-y-6 p-6' : 'space-y-5 p-4 sm:p-6';

  useEffect(() => {
    const container = scrollNode;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      isUserScrollingRef.current = true;

      if (scrollTimeout) clearTimeout(scrollTimeout);

      const resetDelay = isMobile ? 1000 : 1500;
      scrollTimeout = setTimeout(() => {
        const currentContainer = scrollContainerRef.current;
        if (currentContainer) {
          const { scrollTop, scrollHeight, clientHeight } = currentContainer;
          const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
          const tolerance = isMobile ? 50 : 20;
          if (distanceFromBottom <= tolerance) {
            isUserScrollingRef.current = false;
          }
        } else {
          isUserScrollingRef.current = false;
        }
      }, resetDelay);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollNode, isMobile]);

  const globeTint = useMemo(() => {
    switch (activeTab) {
      case 'flights':
        return { from: 'rgba(14,165,233,0.40)', to: 'rgba(56,189,248,0.35)', opacity: '0.32' }; // sky blue
      case 'hotels':
        return { from: 'rgba(251,146,60,0.40)', to: 'rgba(245,158,11,0.35)', opacity: '0.32' }; // orange/amber
      case 'restaurants':
        return { from: 'rgba(168,85,247,0.40)', to: 'rgba(139,92,246,0.35)', opacity: '0.32' }; // purple/violet
      case 'mapout':
        return { from: 'rgba(34,197,94,0.40)', to: 'rgba(132,204,22,0.35)', opacity: '0.32' }; // green/lime
      default:
        return { from: 'rgba(82,113,255,0.40)', to: 'rgba(139,92,246,0.35)', opacity: '0.30' }; // primary/violet
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isMounted) return; // Only run after component is mounted
    
    if (showChat && !isAITyping) {
      // Use requestAnimationFrame to ensure this runs after render cycle
      requestAnimationFrame(() => focusInput());
    }
  }, [showChat, isAITyping, chatMessages.length, focusInput, isMounted]);

  // Global fallback: if user starts typing anywhere in chat view, focus the input.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!showChat || isAITyping) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName?.toLowerCase();
        const isEditable = target.isContentEditable;
        if (tag === 'input' || tag === 'textarea' || isEditable) return;
      }
      const el = textareaRef.current;
      if (!el) return;
      // Focus input on printable characters or editing keys
      const printable = e.key.length === 1;
      if (printable || e.key === 'Backspace' || e.key === 'Delete') {
        focusInput();
      }
      // Allow Enter to send even if input is not focused
      if ((e.key === 'Enter' || e.key === 'NumpadEnter') && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showChat, isAITyping, focusInput, handleSendMessage]);

  // Animated globe parallax
  useEffect(() => {
    const el = globeFieldRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = ((e.clientX / w) - 0.5) * 24; // px parallax
      const y = ((e.clientY / h) - 0.5) * 16;
      el.style.setProperty('--px', `${x}px`);
      el.style.setProperty('--py', `${y}px`);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Detect when the global footer enters the viewport to hide the floating input
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let anyVisible = false;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            anyVisible = true;
            setIsFooterVisible(true);
          }
        }
        if (!anyVisible) setIsFooterVisible(false);
      },
      { root: null, threshold: 0.01, rootMargin: '0px 0px -60%' }
    );
    observer.observe(footer);

    return () => {
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      className="flex-1 relative flex flex-col"
      style={{
        touchAction: isMobile ? 'pan-y' : 'auto',
        overscrollBehaviorX: 'none',
        overscrollBehaviorY: 'contain',
        height: isMobile ? 'calc(100dvh - 64px)' : 'auto',
        maxHeight: isMobile ? 'calc(100dvh - 64px)' : 'none',
        overflow: 'visible',
        WebkitOverflowScrolling: iosDevice ? 'touch' : undefined,
      }}
    >
      
      
      {/* Animated Globe Background */}
      <div
        className="globe-field"
        ref={globeFieldRef}
        data-force-motion="true"
        style={{ '--tintFrom': globeTint.from, '--tintTo': globeTint.to, '--tintOpacity': globeTint.opacity } as React.CSSProperties}
      >
        {isMounted && globeNodes.map((n, idx) => (
          <div key={idx} className="globe-node" style={n.nodeStyle}>
            <div className="globe-sprite" style={n.spriteStyle} />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col" style={{ height: '100%', flex: '1 1 auto', minHeight: 0 }}>
        {/* Chat Interface or Welcome Screen */}
        {showChat ? (
        /* Chat Mode */
        <div className="relative flex flex-col px-4 pb-0 pt-0 sm:px-6" style={{ height: isMobile ? '100%' : 'auto', maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="mx-auto flex w-full max-w-4xl flex-col" style={{ marginTop: isMobile ? '12px' : '0.75rem', flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Hide title card on mobile to save space, show on desktop */}
            {!isMobile && (
              <div className="glass-card border-b-0 rounded-3xl p-6 text-center shadow-[0_22px_45px_rgba(15,23,42,0.12)] transition-all duration-700 ease-in-out">
                <div className="flex items-center justify-center gap-3">
                  <div className={`rounded-xl border border-white/40 bg-gradient-to-br ${content.gradientColors} p-2`}>
                    <Sparkles className={`h-6 w-6 ${content.accentColor}`} />
                  </div>
                  <h2 className={`text-2xl font-bold ${content.accentColor}`}>
                    {content.title}
                  </h2>
                </div>
              </div>
            )}

            {/* Chat container with fixed sizing */}
            <div className="glass-panel flex flex-col overflow-hidden" style={{
              borderRadius: isMobile ? '1.5rem' : '2rem',
              minHeight: 0,
              flex: '1 1 auto',
              // Mobile: viewport - (header 64px + mobile nav 64px + input composer ~100px + margins ~40px)
              // Desktop: viewport - (title ~80px + input ~100px + margins + padding ~100px) = ~280px
              maxHeight: isMobile ? 'calc(100dvh - 280px)' : 'calc(100vh - 320px)',
              height: isMobile ? 'calc(100dvh - 280px)' : 'auto'
            }}>
              <div
                ref={handleScrollContainerRef}
                data-scroll-container="true"
                className={`${messageSpacingClass} flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400`}
                style={messageContainerStyle}
              >
                {chatMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isMobile={isMobile}
                    isSidebarOpen={isSidebarOpen}
                    gradientColors={content.gradientColors}
                    accentColor={content.accentColor}
                  />
                ))}

                {isAITyping && (
                  <TypingIndicator
                    isMobile={isMobile}
                    isSidebarOpen={isSidebarOpen}
                    gradientColors={content.gradientColors}
                    accentColor={content.accentColor}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          <div
            ref={composerWrapperRef}
            className={`mx-auto flex w-full max-w-4xl flex-col gap-3 transition-opacity duration-300 ${
              isFooterVisible ? 'opacity-0 lg:opacity-100' : 'opacity-100'
            }`}
            style={{
              ...composerWrapperStyle,
              paddingTop: isMobile ? '0.75rem' : '1rem',
              flex: '0 0 auto',
            }}
          >
            <div
              className={`glass-input glow-ring ${
                activeTab === 'flights'
                  ? 'neon-glow-flights'
                  : activeTab === 'hotels'
                    ? 'neon-glow-hotels'
                    : activeTab === 'restaurants'
                      ? 'neon-glow-restaurants'
                      : activeTab === 'mapout'
                        ? 'neon-glow-mapout'
                        : 'neon-glow'
              } rounded-3xl transition-all duration-300 hover:shadow-xl`}
            >
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <div className="relative flex-1">
                  <label htmlFor="ai-compact-input" className="sr-only">
                    Message Voyagr AI
                  </label>
                  <textarea
                    id="ai-compact-input"
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Share what you need and press send"
                    enterKeyHint="send"
                    className="w-full resize-none border-none bg-transparent py-0 text-base leading-6 text-gray-800 placeholder-gray-500 focus:border-none focus:outline-none focus:ring-0 sm:text-lg"
                    rows={1}
                    style={{ maxHeight: '120px', fontSize: '16px' }}
                  />
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                  onClick={() => {
                    const currentInput = inputValue;
                    handleSendMessage(currentInput);
                  }}
                  disabled={!inputValue.trim() || isAITyping}
                  className={`inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    inputValue.trim() && !isAITyping
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        ) : (
        /* Welcome Mode */
        <div
          className="relative mx-auto w-full max-w-5xl overflow-x-hidden flex-1"
          data-force-motion="true"
          style={{
            touchAction: 'pan-y',
            overscrollBehaviorX: 'none',
            overscrollBehaviorY: 'contain',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: isMobile ? 'calc(64px + env(safe-area-inset-bottom) + 1rem)' : '0',
            paddingTop: isMobile ? '0.5rem' : '0',
            height: '100%',
            minHeight: 0,
          }}
        >
          <div className={`${isMobile ? 'px-4 sm:px-8 lg:px-10' : ''} ${isMobile ? 'pb-4' : ''} flex flex-col h-full min-h-0`}>
          <div className={`w-full max-w-4xl space-y-3 ${isMobile ? '' : 'mt-3 pb-6'} flex flex-col h-full min-h-0`}>
          
          {/* Compact Preferences Display */}
          {preferences && (
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Trip Preferences</h3>
                <div className="flex flex-wrap gap-1">
                    {preferences.travelStyle && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                        {preferences.travelStyle.charAt(0).toUpperCase() + preferences.travelStyle.slice(1)}
                      </span>
                    )}
                    {preferences.budget && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                        {preferences.budget.includes('-') ? preferences.budget.split('-')[0] + '+' : preferences.budget}
                      </span>
                    )}
                    {preferences.groupSize && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                        {preferences.groupSize}
                      </span>
                    )}
                    {preferences.activities && preferences.activities.length > 0 && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                        {preferences.activities.length} Activities
                      </span>
                    )}
                  </div>
                </div>
            </div>
          )}
            {/* Main AI Card with Enhanced Glassmorphism */}
            <div className={`glass-panel glow-ring rounded-[1.75rem] text-center transition-all duration-700 ease-in-out ${isMobile ? 'px-5 py-6' : 'px-6 py-8 sm:px-10 sm:py-12'}`}>
              <div className="relative z-10">
              {/* Logo and Dynamic Title */}
              <div className={`flex items-center justify-center gap-3 transition-all duration-700 ease-in-out sm:gap-4 ${isMobile ? 'mb-4' : 'mb-6'}`}>
                {activeTab === 'plan' && (
                  <div className="relative">
                    <Image
                      src="/images/AIPage/VoyagrAI logo.png"
                      alt="VoyagrAI Logo"
                      width={80}
                      height={80}
                      className="object-contain"
                      priority
                    />
                  </div>
                )}
                <h1 className={`text-3xl font-bold leading-tight transition-all duration-700 sm:text-4xl md:leading-[1.1] lg:text-6xl ${
                  activeTab === 'flights' ? 'gradient-text-flights' :
                  activeTab === 'hotels' ? 'gradient-text-hotels' :
                  activeTab === 'restaurants' ? 'gradient-text-restaurants' :
                  activeTab === 'mapout' ? 'gradient-text-mapout' :
                  'gradient-text'
                } drop-shadow-sm pb-0.5`}>
                  {content.title}
                </h1>
              </div>

              {/* Dynamic Description */}
              <div className={isMobile ? 'mb-4' : 'mb-6'}>
                <p className={`font-medium text-gray-700 transition-all duration-500 ${isMobile ? 'text-sm' : 'text-base sm:text-lg'}`}>
                  {content.description}
                </p>
              </div>


              {/* Input Section */}
              <div className={isMobile ? 'mb-6' : 'mb-10'}>
                <div className="relative max-w-3xl mx-auto">
                  <div className={`glass-input ${
                    activeTab === 'flights' ? 'neon-glow-flights' :
                    activeTab === 'hotels' ? 'neon-glow-hotels' :
                    activeTab === 'restaurants' ? 'neon-glow-restaurants' :
                    activeTab === 'mapout' ? 'neon-glow-mapout' :
                    'neon-glow'
                  } rounded-2xl`}>
                    <textarea
                      id="ai-welcome-input"
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={placeholderText || 'Tell Voyagr AI about your next adventure'}
                      className={`relative z-10 w-full resize-none border-0 bg-transparent text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-0 ${isMobile ? 'p-3 text-sm' : 'p-4 text-base sm:text-lg sm:p-6'}`}
                      rows={isMobile ? 3 : 4}
                      style={{ minHeight: isMobile ? '56px' : '72px', maxHeight: isMobile ? '100px' : '140px' }}
                    />
                  </div>
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="absolute bottom-4 right-4 flex items-center text-primary">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Preferences and Start Planning Buttons */}
                  <div className={`flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 ${isMobile ? 'mt-4' : 'mt-6'}`}>
                    {/* Preferences Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onPreferencesOpen?.();
                      }}
                      className={`relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-gray-500 to-gray-600 font-semibold text-white shadow-xl transition-all duration-300 hover:from-gray-400 hover:to-gray-500 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isMobile ? 'px-5 py-2.5 text-sm' : 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg'}`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
                        <Settings className={isMobile ? 'h-4 w-4' : 'h-5 w-5 sm:h-6 sm:w-6'} />
                        Preferences
                      </span>
                    </button>

                    {/* Start Planning Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        // Prevent iOS zoom on button tap
                        if (iosDevice) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                        
                        if (inputValue.trim()) {
                          // If user has entered text, start search with their input immediately
                          handleSendMessage(inputValue);
                        } else {
                          // If no input, start with a default planning prompt immediately
                          const defaultPrompt = "Help me plan my next trip";
                          handleSendMessage(defaultPrompt);
                        }
                      }}
                      className={`relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r font-semibold text-white shadow-xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isMobile ? 'px-5 py-2.5 text-sm' : 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg'} ${
                        activeTab === 'flights' ? 'from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400' :
                        activeTab === 'hotels' ? 'from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400' :
                        activeTab === 'restaurants' ? 'from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400' :
                        activeTab === 'mapout' ? 'from-green-500 to-lime-500 hover:from-green-400 hover:to-lime-400' :
                        'from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
                        <Sparkles className={isMobile ? 'h-4 w-4' : 'h-5 w-5 sm:h-6 sm:w-6'} />
                        Start Planning
                        <ArrowRight className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

              {/* Dynamic Suggested Prompts */}
              <div
                className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent ${isMobile ? 'mt-4' : 'mt-6'}`}
                style={{
                  maxHeight: isMobile ? 'calc(100dvh - 420px)' : '60vh',
                  minHeight: isMobile ? '200px' : 'auto',
                  WebkitOverflowScrolling: 'touch',
                  paddingRight: '2px',
                  touchAction: 'pan-y',
                }}
              >
                <p className={`text-gray-600 font-medium text-center transition-all duration-500 ${isMobile ? 'mb-3 text-sm' : 'mb-4 text-base'}`}>
                  {activeTab === 'flights' ? 'Popular flight searches:' : 
                   activeTab === 'hotels' ? 'Find your perfect accommodation:' :
                   activeTab === 'restaurants' ? 'Find perfect dining spots:' :
                   'Get inspired with these travel ideas:'}
                </p>
                
                <div className={`grid gap-3 pr-1 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`} style={{ scrollbarGutter: 'stable' }}>
                  {content.prompts.map((prompt, index) => {
                    // Handle both string and object prompt types
                    const promptText = typeof prompt === 'string' ? prompt : prompt.text;
                    const promptEmoji = typeof prompt === 'string' ? '✨' : prompt.emoji;
                    return (
                      <button
                        key={index}
                        onClick={(e) => {
                          // Prevent iOS zoom on button tap
                          if (iosDevice) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                          handleSendMessage(promptText);
                        }}
                        className={`group relative overflow-hidden rounded-xl border border-white/40 transition-all duration-300 text-left transform hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] bg-white/60 backdrop-blur-xl backdrop-saturate-150 bg-clip-padding shadow-[0_8px_32px_rgba(8,_112,_184,_0.12)] hover:shadow-[0_12px_40px_rgba(8,_112,_184,_0.18)] hover:bg-white/70 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5 ${isMobile ? 'p-3' : 'p-4'}`}
                      >
                        <div className={`flex items-center relative z-10 ${isMobile ? 'gap-2' : 'gap-3'}`}>
                          <span className={`group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ${isMobile ? 'text-xl' : 'text-2xl'}`}>{promptEmoji}</span>
                          <span className={`font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {promptText}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
                        <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        )}
      </div>
    </div>
  );
}
