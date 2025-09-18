import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, Send, Bot, User, Menu, ArrowRight, Settings } from 'lucide-react';
import Image from 'next/image';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'packages' | 'mapout';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIInterfaceProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  isTyping: boolean;
  suggestedPrompts: (string | { text: string; emoji: string })[];
  placeholderText: string;
  onSubmit?: () => void;
  preferences?: any;
  activeTab: TabKey;
  isMobile?: boolean;
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
  onNewTrip?: () => void;
  registerClearChat?: (fn: () => void) => void;
  onFirstMessage?: (firstMessage: string) => void;
  onMessageSent?: (message: string) => void;
  onPreferencesOpen?: () => void;
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
  isMobile = false,
  onSidebarToggle,
  isSidebarOpen = false,
  onNewTrip,
  registerClearChat,
  onFirstMessage,
  onMessageSent,
  onPreferencesOpen
}: AIInterfaceProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const globeFieldRef = useRef<HTMLDivElement>(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const isSnappingRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const isScrollingDownRef = useRef(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const isUserScrollingRef = useRef(false);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  // Keep input focused for quick subsequent typing
  const focusInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    try {
      // preventScroll keeps the viewport stable when focusing
      (el as any).focus({ preventScroll: true });
    } catch {
      el.focus();
    }
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
  }, []);

  // Animated globe nodes with slight randomization at mount
  const globeNodes = useMemo(() => {
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
          ['--xStart' as any]: `${xStart}vw`,
          ['--yStart' as any]: `${yStart}vh`,
          ['--xEnd' as any]: `${xEnd}vw`,
          ['--yEnd' as any]: `${yEnd}vh`,
          animationDuration: `${n.dur}s`,
        },
        spriteStyle: {
          ['--size' as any]: `${n.size}px`,
          ['--opacity' as any]: `${n.opacity}`,
          animationDuration: `${n.spin}s`,
        },
      };
    });
  }, []);


  // Clear chat messages to return to welcome screen
  const clearChat = useCallback(() => {
    setChatMessages([]);
    setIsAITyping(false);
  }, []);
  
  // Also clear chat when activeTab changes to ensure clean state
  useEffect(() => {
    setChatMessages([]);
    setIsAITyping(false);
  }, [activeTab]);

  // Expose clearChat function to parent component
  useEffect(() => {
    registerClearChat?.(clearChat);
  }, [registerClearChat, clearChat]);

  // Check if user is near the bottom of the scroll container
  const isNearBottom = useCallback((threshold = 100) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Smooth scroll to bottom with better UX handling
  const scrollToBottom = useCallback((force = false) => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }

    // Only auto-scroll if user is near bottom or force is true
    if (!force && !isNearBottom()) {
      return;
    }

    let scrollContainer = scrollContainerRef.current;
    
    // Fallback: try to find scroll container if not set
    if (!scrollContainer && messagesEndRef.current) {
      scrollContainer = messagesEndRef.current.parentElement;
      scrollContainerRef.current = scrollContainer;
    }
    
    if (!scrollContainer) return;

    // Use requestAnimationFrame for smooth scrolling
    const smoothScroll = () => {
      if (!scrollContainer) return;
      
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
      
      // Focus input after scrolling animation completes
      autoScrollTimeoutRef.current = setTimeout(() => {
        focusInput();
      }, 300); // Give time for smooth scroll to complete
    };

    // Delay scroll slightly to allow DOM updates to complete
    requestAnimationFrame(() => {
      requestAnimationFrame(smoothScroll);
    });
  }, [isNearBottom, focusInput]);


  // Auto-scroll on new messages with improved logic
  useEffect(() => {
    if (chatMessages.length === 0) return;
    
    // Wait for DOM updates, then check if we should scroll
    const scrollTimeout = setTimeout(() => {
      // Don't auto-scroll if user is actively scrolling up to read history
      if (isUserScrollingRef.current && !isNearBottom(300)) return;
      
      // Force scroll to new messages - be more aggressive for new content
      scrollToBottom(true);
    }, 100); // Slightly longer delay to ensure DOM rendering is complete
    
    return () => clearTimeout(scrollTimeout);
  }, [chatMessages, scrollToBottom, isNearBottom]);

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
      packages: [
        `Fantastic! For your package request "${userMessage}", I can create comprehensive travel deals that include flights, hotels, and activities all in one bundle.`,
        `Great idea! Based on "${userMessage}", I'll design complete travel packages that save you time and money. These packages can include transportation, accommodation, meals, and experiences.`,
        `Perfect! For "${userMessage}", I can bundle everything together - flights, hotels, transfers, and activities. Package deals often provide better value than booking separately.`
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
    const userMessage: ChatMessage = {
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
      const aiResponse: ChatMessage = {
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
  }, [inputValue, chatMessages.length, onInputChange, onFirstMessage, onMessageSent, generateAIResponse, onSubmit]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    const ke = e as unknown as KeyboardEvent;
    const isEnter =
      e.key === 'Enter' ||
      (ke.code ? (ke.code === 'Enter' || ke.code === 'NumpadEnter') : false) ||
      // Fallbacks for edge cases / older browsers
      // @ts-ignore deprecated
      e.keyCode === 13 ||
      // @ts-ignore deprecated
      e.which === 13;
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
          placeholder: 'Tell me about your flight preferences: destinations, dates, budget, seat class...',
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
          placeholder: 'Describe your ideal hotel: location, amenities, budget, check-in dates...',
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
      case 'packages':
        return {
          title: 'Package Deals',
          description: 'Complete travel packages tailored just for you',
          placeholder: 'Tell me about your dream vacation package: destination, duration, activities, group size...',
          prompts: [
            { text: '7-day Italy tour with flights & hotels', emoji: '🍝', color: 'from-red-400/20 to-orange-400/20 hover:from-red-400/30 hover:to-orange-400/30 border-red-300/40' },
            { text: 'All-inclusive Caribbean cruise', emoji: '🚢', color: 'from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border-blue-300/40' },
            { text: 'Adventure package to Costa Rica', emoji: '🦜', color: 'from-green-400/20 to-emerald-400/20 hover:from-green-400/30 hover:to-emerald-400/30 border-green-300/40' },
            { text: 'Romantic honeymoon in Bali', emoji: '💕', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
            { text: 'Family Disney World vacation', emoji: '🎢', color: 'from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40' },
            { text: 'Cultural tour of Southeast Asia', emoji: '🕌', color: 'from-amber-400/20 to-yellow-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 border-amber-300/40' },
          ],
          gradientColors: 'from-purple-500/30 to-pink-500/30',
          accentColor: 'text-purple-600'
        };
      case 'mapout':
        return {
          title: 'Map Out Planner',
          description: 'Create detailed day-by-day itineraries with optimal routing',
          placeholder: 'Describe your trip details: destinations, duration, preferred activities, travel pace...',
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
          placeholder: placeholderText || 'Describe your dream trip and I\'ll help plan it...',
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
  const showChat = chatMessages.length > 0 || isAITyping;

  // Initialize scroll container ref
  useEffect(() => {
    const updateScrollContainer = () => {
      if (messagesEndRef.current?.parentElement) {
        scrollContainerRef.current = messagesEndRef.current.parentElement;
      }
    };
    
    updateScrollContainer();
    
    // Also update on resize or DOM changes
    const observer = new MutationObserver(updateScrollContainer);
    if (messagesEndRef.current) {
      observer.observe(messagesEndRef.current, { childList: true, subtree: true });
    }
    
    return () => observer.disconnect();
  }, [showChat]);

  // Handle user scrolling detection
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      isUserScrollingRef.current = true;
      
      // Clear existing timeout
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      // Reset user scrolling flag after a delay
      scrollTimeout = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1000);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [showChat]);

  const globeTint = useMemo(() => {
    switch (activeTab) {
      case 'flights':
        return { from: 'rgba(14,165,233,0.40)', to: 'rgba(56,189,248,0.35)', opacity: '0.32' }; // sky blue
      case 'hotels':
        return { from: 'rgba(251,146,60,0.40)', to: 'rgba(245,158,11,0.35)', opacity: '0.32' }; // orange/amber
      case 'packages':
        return { from: 'rgba(168,85,247,0.40)', to: 'rgba(217,70,239,0.35)', opacity: '0.32' }; // purple/fuchsia
      case 'mapout':
        return { from: 'rgba(34,197,94,0.40)', to: 'rgba(132,204,22,0.35)', opacity: '0.32' }; // green/lime
      default:
        return { from: 'rgba(82,113,255,0.40)', to: 'rgba(139,92,246,0.35)', opacity: '0.30' }; // primary/violet
    }
  }, [activeTab]);

  useEffect(() => {
    if (showChat && !isAITyping) {
      // Defer to the next tick to ensure elements are mounted
      const t = setTimeout(() => focusInput(), 0);
      return () => clearTimeout(t);
    }
  }, [showChat, isAITyping, chatMessages.length, focusInput]);

  // Global fallback: if user starts typing anywhere in chat view, focus the input.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!showChat || isAITyping) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName?.toLowerCase();
        const isEditable = (target as any).isContentEditable;
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
    window.addEventListener('mousemove', onMove, { passive: true } as any);
    return () => window.removeEventListener('mousemove', onMove as any);
  }, []);

  // Track scroll direction for snap behavior
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      isScrollingDownRef.current = y > lastScrollYRef.current;
      lastScrollYRef.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    return () => window.removeEventListener('scroll', onScroll as any);
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
            // If on mobile and scrolling down and not already snapping, finish scroll to footer top
            if (isMobile && isScrollingDownRef.current && !isSnappingRef.current) {
              isSnappingRef.current = true;
              const footerTop = window.scrollY + entry.boundingClientRect.top;
              window.scrollTo({ top: footerTop, behavior: 'smooth' });
              // release the snapping lock shortly after
              setTimeout(() => { isSnappingRef.current = false; }, 500);
            }
          }
        }
        if (!anyVisible) setIsFooterVisible(false);
      },
      { root: null, threshold: 0.01, rootMargin: '0px 0px -60%' }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <div className={`flex-1 relative ${isMobile ? 'min-h-full flex flex-col' : 'h-full flex flex-col min-h-0'} ${showChat ? 'max-h-[calc(100vh-100px)]' : ''}`}>
      
      {/* Mobile Floating Menu Button */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={onSidebarToggle}
          className="fixed top-24 left-4 z-50 p-3 rounded-full bg-white/95 border border-gray-200 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}
      
      {/* Animated Globe Background */}
      <div
        className="globe-field"
        ref={globeFieldRef}
        data-force-motion="true"
        style={{ ['--tintFrom' as any]: globeTint.from, ['--tintTo' as any]: globeTint.to, ['--tintOpacity' as any]: globeTint.opacity }}
      >
        {globeNodes.map((n, idx) => (
          <div key={idx} className="globe-node" style={n.nodeStyle as any}>
            <div className="globe-sprite" style={n.spriteStyle as any} />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Chat Interface or Welcome Screen */}
        {showChat ? (
        /* Chat Mode */
        <div className={`relative flex flex-col min-h-0 ${isMobile ? 'h-[calc(100vh-100px)] p-4 pt-0' : 'h-[calc(100vh-100px)] p-6 pt-0'} overflow-hidden`}>
          
          <div className={`${isMobile ? 'w-full' : 'max-w-4xl w-full mx-auto'} ${isMobile ? 'mt-2' : 'mt-6'} h-full min-h-0 flex flex-col relative`}>
            {/* Chat Header - Desktop only */}
            {!isMobile && (
              <div className="glass-card border-b-0 rounded-t-[2rem] p-6 text-center transition-all duration-700 ease-in-out">
                <div className="flex items-center justify-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${content.gradientColors} border border-white/40`}>
                    <Sparkles className={`w-6 h-6 ${content.accentColor}`} />
                  </div>
                  <h2 className={`text-2xl font-bold ${content.accentColor}`}>
                    {content.title}
                  </h2>
                </div>
              </div>
            )}

            {/* Messages Container */}
            <div className={`flex-1 min-h-0 relative overflow-hidden ${isMobile ? 'mt-4' : 'glass-panel rounded-b-[2rem] max-h-[calc(100vh-180px)]'}`}>
              <div className={`h-full overflow-y-auto overscroll-contain ${isMobile ? 'p-4 pb-[calc(env(safe-area-inset-bottom)+100px)]' : 'p-6 pb-28'} ${isMobile ? 'space-y-6' : 'space-y-5'} scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 scroll-smooth`}>
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start ${isMobile ? 'gap-4' : 'gap-3'} ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-primary/20 border-2 border-primary/30' 
                        : `bg-gradient-to-br ${content.gradientColors} border-2 border-white/40`
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-5 h-5 text-primary" />
                      ) : (
                        <Bot className={`w-5 h-5 ${content.accentColor}`} />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`w-fit max-w-[calc(100%_-_4rem)] sm:max-w-[70ch] lg:max-w-[80ch] overflow-hidden ${
                      message.sender === 'user' 
                        ? 'bg-primary/15 border border-primary/30 rounded-2xl rounded-tr-md backdrop-blur-md'
                        : 'bg-white/20 border border-white/30 rounded-2xl rounded-tl-md backdrop-blur-md'
                    } px-5 py-4 md:px-4 shadow-lg`}>
                      <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
                        {message.content}
                      </p>
                      <div className="text-xs text-gray-600 mt-2.5 md:mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* AI Typing Indicator */}
                {isAITyping && (
                  <div className={`flex items-start ${isMobile ? 'gap-4' : 'gap-3'}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${content.gradientColors} border-2 border-white/40`}>
                      <Bot className={`w-5 h-5 ${content.accentColor}`} />
                    </div>
                    <div className="w-fit max-w-[calc(100%_-_4rem)] sm:max-w-[70ch] lg:max-w-[80ch] bg-white/20 border border-white/30 rounded-2xl rounded-tl-md backdrop-blur-md p-4 shadow-lg overflow-hidden">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className={`w-2 h-2 rounded-full animate-bounce ${content.accentColor.replace('text-', 'bg-')}`}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce delay-100 ${content.accentColor.replace('text-', 'bg-')}`}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce delay-200 ${content.accentColor.replace('text-', 'bg-')}`}></div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Compact Chat Input */}
            <div className={`${isMobile ? 'fixed left-4 right-4 bottom-[calc(env(safe-area-inset-bottom)+16px)]' : 'absolute bottom-6 left-0 right-0'} z-20 transition-all duration-300 ${isFooterVisible ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
              <div className={`glass-input glow-ring ${
                activeTab === 'flights' ? 'neon-glow-flights' :
                activeTab === 'hotels' ? 'neon-glow-hotels' :
                activeTab === 'packages' ? 'neon-glow-packages' :
                activeTab === 'mapout' ? 'neon-glow-mapout' :
                'neon-glow'
              } rounded-3xl hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center gap-3 p-4">
                  <div className="flex-1 relative">
                    <textarea id="ai-compact-input"
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask anything..."
                      autoFocus
                      enterKeyHint="send"
                      className="w-full bg-transparent border-none resize-none focus:outline-none focus:ring-0 focus:border-transparent text-gray-800 placeholder-gray-500 text-base leading-6 h-6 py-0 max-h-6 overflow-hidden"
                      rows={1}
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
                    className={`flex-shrink-0 w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center ${
                      inputValue.trim() && !isAITyping
                        ? 'bg-gray-800 hover:bg-gray-700 text-white scale-100'
                        : 'bg-gray-200 text-gray-400 scale-95'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        ) : (
        /* Welcome Mode */
        <div className={`relative z-10 ${isMobile ? 'w-full p-4 pt-0 min-h-full' : 'max-w-5xl w-full mx-auto p-10 pt-0'} `} data-force-motion="true">
          <div className={`${isMobile ? 'p-3 pt-0 pb-8 min-h-full' : 'p-8 pt-0'}`}>
          <div className={`${isMobile ? 'w-full min-h-full' : 'max-w-4xl w-full'} ${isMobile ? 'mt-0' : 'mt-4'} ${isMobile ? 'space-y-2' : 'space-y-3'}`}>
          
          {/* Compact Preferences Display */}
          {preferences && (
            <div className={`glass-card rounded-xl ${isMobile ? 'p-2' : 'p-4'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700`}>Trip Preferences</h3>
                <div className="flex flex-wrap gap-1">
                    {preferences.travelStyle && (
                      <span className={`px-2 py-1 bg-primary/10 text-primary ${isMobile ? 'text-xs' : 'text-xs'} font-medium rounded-full border border-primary/20`}>
                        {preferences.travelStyle.charAt(0).toUpperCase() + preferences.travelStyle.slice(1)}
                      </span>
                    )}
                    {preferences.budget && (
                      <span className={`px-2 py-1 bg-green-100 text-green-700 ${isMobile ? 'text-xs' : 'text-xs'} font-medium rounded-full border border-green-200`}>
                        {preferences.budget.includes('-') ? preferences.budget.split('-')[0] + '+' : preferences.budget}
                      </span>
                    )}
                    {preferences.groupSize && (
                      <span className={`px-2 py-1 bg-blue-100 text-blue-700 ${isMobile ? 'text-xs' : 'text-xs'} font-medium rounded-full border border-blue-200`}>
                        {preferences.groupSize}
                      </span>
                    )}
                    {preferences.activities && preferences.activities.length > 0 && (
                      <span className={`px-2 py-1 bg-purple-100 text-purple-700 ${isMobile ? 'text-xs' : 'text-xs'} font-medium rounded-full border border-purple-200`}>
                        {preferences.activities.length} Activities
                      </span>
                    )}
                  </div>
                </div>
            </div>
          )}
            {/* Main AI Card with Enhanced Glassmorphism */}
            <div className={`glass-panel glow-ring ${isMobile ? (preferences ? 'rounded-2xl p-3' : 'rounded-2xl p-4') : 'rounded-[2rem] p-12'} text-center transition-all duration-700 ease-in-out`}>
              <div className="relative z-10">
              {/* Logo and Dynamic Title */}
              <div className={`flex items-center justify-center gap-4 ${isMobile ? (preferences ? 'mb-1' : 'mb-2') : 'mb-6'} transition-all duration-700 ease-in-out`}>
                {activeTab === 'plan' && (
                  <div className="relative">
                    <Image
                      src="/images/AIPage/VoyagrAI logo.png"
                      alt="VoyagrAI Logo"
                      width={isMobile ? 60 : 80}
                      height={isMobile ? 60 : 80}
                      className="object-contain"
                      priority
                    />
                  </div>
                )}
                <h1 className={`${isMobile ? (preferences ? 'text-2xl' : 'text-3xl') : 'text-6xl'} font-bold leading-tight md:leading-[1.1] transition-all duration-700 ${
                  activeTab === 'flights' ? 'gradient-text-flights' :
                  activeTab === 'hotels' ? 'gradient-text-hotels' :
                  activeTab === 'packages' ? 'gradient-text-packages' :
                  activeTab === 'mapout' ? 'gradient-text-mapout' :
                  'gradient-text'
                } drop-shadow-sm pb-0.5`}>
                  {content.title}
                </h1>
              </div>

              {/* Dynamic Description */}
              <div className={isMobile ? (preferences ? 'mb-0' : 'mb-2') : 'mb-6'}>
                <p className={`${isMobile ? (preferences ? 'text-xs' : 'text-sm') : 'text-lg'} text-gray-700 font-medium transition-all duration-500`}>
                  {content.description}
                </p>
              </div>


              {/* Input Section */}
              <div className={isMobile ? (preferences ? 'mb-4' : 'mb-4') : 'mb-10'}>
                <div className="relative max-w-3xl mx-auto">
                  <div className={`glass-input ${
                    activeTab === 'flights' ? 'neon-glow-flights' :
                    activeTab === 'hotels' ? 'neon-glow-hotels' :
                    activeTab === 'packages' ? 'neon-glow-packages' :
                    activeTab === 'mapout' ? 'neon-glow-mapout' :
                    'neon-glow'
                  } rounded-2xl`}>
                    <textarea
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={content.placeholder}
                      className={`w-full ${isMobile ? (preferences ? 'p-4 text-base h-[80px] max-h-[80px]' : 'p-5 text-lg h-[100px] max-h-[100px]') : 'p-6 text-lg h-[120px] max-h-[120px]'} bg-transparent resize-none focus:outline-none focus:ring-0 focus:border-transparent border-0 transition-all duration-300 placeholder-gray-500 text-gray-800 relative z-10 overflow-y-auto`}
                      rows={4}
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
                  <div className={`${isMobile ? 'mt-4 flex flex-col gap-2 w-full' : 'absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4'}`}>
                    {/* Preferences Button */}
                    <button 
                      onClick={() => {
                        onPreferencesOpen?.();
                      }}
                      className={`relative overflow-hidden ${isMobile ? 'px-6 py-3 text-base w-full' : 'px-8 py-4 text-lg'} bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white rounded-2xl font-bold shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5 min-h-[48px]`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
                        <Settings className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                        Preferences
                      </span>
                    </button>

                    {/* Start Planning Button */}
                    <button 
                      onClick={() => {
                        if (inputValue.trim()) {
                          // If user has entered text, start search with their input immediately
                          handleSendMessage(inputValue);
                        } else {
                          // If no input, start with a default planning prompt immediately
                          const defaultPrompt = "Help me plan my next trip";
                          handleSendMessage(defaultPrompt);
                        }
                      }}
                      className={`relative overflow-hidden ${isMobile ? 'px-6 py-3 text-base w-full' : 'px-8 py-4 text-lg'} bg-gradient-to-r ${
                        activeTab === 'flights' ? 'from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400' :
                        activeTab === 'hotels' ? 'from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400' :
                        activeTab === 'packages' ? 'from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400' :
                        activeTab === 'mapout' ? 'from-green-500 to-lime-500 hover:from-green-400 hover:to-lime-400' :
                        'from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'
                      } text-white rounded-2xl font-bold shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5 min-h-[48px]`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
                        <Sparkles className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                        Start Planning
                        <ArrowRight className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

              {/* Dynamic Suggested Prompts */}
              <div className={isMobile ? (preferences ? 'mt-2' : 'mt-3') : 'mt-6'}>
                <p className={`text-gray-600 font-medium ${isMobile ? (preferences ? 'mb-2 text-xs' : 'mb-3 text-sm') : 'mb-4 text-base'} text-center transition-all duration-500`}>
                  {activeTab === 'flights' ? 'Popular flight searches:' : 
                   activeTab === 'hotels' ? 'Find your perfect accommodation:' :
                   activeTab === 'packages' ? 'Discover amazing packages:' :
                   'Get inspired with these travel ideas:'}
                </p>
                
                <div className={`grid ${isMobile ? (preferences ? 'grid-cols-1 gap-3' : 'grid-cols-1 gap-4') : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'} ${isMobile ? 'pb-8' : ''}`}>
                  {content.prompts.map((prompt, index) => {
                    // Handle both string and object prompt types
                    const promptText = typeof prompt === 'string' ? prompt : prompt.text;
                    const promptEmoji = typeof prompt === 'string' ? '✨' : prompt.emoji;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(promptText)}
                        className={`group relative overflow-hidden ${isMobile ? (preferences ? 'p-3 min-h-[52px]' : 'p-4 min-h-[56px]') : 'p-4'} rounded-xl border border-white/40 transition-all duration-300 text-left transform hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] bg-white/60 backdrop-blur-xl backdrop-saturate-150 bg-clip-padding shadow-[0_8px_32px_rgba(8,_112,_184,_0.12)] hover:shadow-[0_12px_40px_rgba(8,_112,_184,_0.18)] hover:bg-white/70 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5`}
                      >
                        <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-3'} relative z-10`}>
                          <span className={`${isMobile ? 'text-2xl' : 'text-2xl'} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>{promptEmoji}</span>
                          <span className={`${isMobile ? (preferences ? 'text-sm leading-relaxed' : 'text-sm leading-relaxed') : 'text-sm'} font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-relaxed`}>
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
