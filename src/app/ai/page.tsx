'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, Plus, Home } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAIPageState } from '@/hooks/useAIPageState';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { useFooterVisibility } from '@/contexts/FooterVisibilityContext';
import { SAMPLE_FLIGHTS, SAMPLE_HOTELS, SAMPLE_RESTAURANTS, SUGGESTED_PROMPTS, PLACEHOLDER_TEXT } from '@/constants/aiData';
import { Flight, Hotel, Restaurant } from '@/types/ai';
import AISidebar from '@/components/AI/AISidebar';
import AIInterface from '@/components/AI/AIInterface';
import AIMobileNav from '@/components/AI/AIMobileNav';

const AIPreferencesModal = dynamic(() => import('@/components/AI/AIPreferencesModal'), {
  ssr: false,
  loading: () => null,
});

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'restaurants' | 'mapout';

const isSectionTab = (tab: TabKey): tab is 'flights' | 'hotels' | 'restaurants' | 'mapout' =>
  tab === 'flights' || tab === 'hotels' || tab === 'restaurants' || tab === 'mapout';

interface RecentConversation {
  id: string;
  title: string;
  timestamp: Date;
}

export default function AiPage() {
  const { inputValue, setInputValue, isTyping } = useAIPageState();
  const { setNavbarVisible } = useNavbarVisibility();
  const { setFooterVisible } = useFooterVisibility();
  const [activeTab, setActiveTab] = useState<TabKey>('plan');
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [currentConversationMessages, setCurrentConversationMessages] = useState<string[]>([]);
  const clearChatFunctionRef = useRef<(() => void) | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  // Detect mobile and iOS devices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || 
                         window.innerWidth <= 768;
      const iOSCheck = /ipad|iphone|ipod/.test(userAgent) || (navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent));
      
      setIsMobile(mobileCheck);
      setIsIOSDevice(iOSCheck);
      
      // Add iOS-specific body classes for CSS targeting
      if (iOSCheck) {
        document.body.classList.add('ios-device');
      }
      if (mobileCheck) {
        document.body.classList.add('mobile-device');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
      document.body.classList.remove('ios-device', 'mobile-device');
    };
  }, []);

  // iOS keyboard detection and viewport handling
  useEffect(() => {
    if (typeof window === 'undefined' || !isIOSDevice) return;

    const handleKeyboardShow = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;
      
      const keyboardHeight = window.innerHeight - viewport.height;
      setKeyboardOffset(keyboardHeight);
      
      // Add iOS keyboard active class
      document.body.classList.add('ios-keyboard-active');
      
      // Prevent viewport zoom on focus
      const viewportMeta = document.querySelector('meta[name=viewport]') as HTMLMetaElement;
      if (viewportMeta) {
        const originalContent = viewportMeta.content;
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        
        // Restore after keyboard hides
        setTimeout(() => {
          if (viewportMeta) {
            viewportMeta.content = originalContent;
          }
        }, 500);
      }
    };

    const handleKeyboardHide = () => {
      setKeyboardOffset(0);
      document.body.classList.remove('ios-keyboard-active');
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleKeyboardShow);
      window.addEventListener('resize', handleKeyboardHide);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleKeyboardShow);
        window.removeEventListener('resize', handleKeyboardHide);
      }
      document.body.classList.remove('ios-keyboard-active');
    };
  }, [isIOSDevice]);

  // Keep a CSS custom property in sync with the real viewport height to avoid 100vh jumps on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewportMetrics = () => {
      const viewport = window.visualViewport;
      const height = viewport ? viewport.height : window.innerHeight;
      const offsetTop = viewport ? viewport.offsetTop : 0;
      document.documentElement.style.setProperty('--app-height', `${height}px`);
      document.documentElement.style.setProperty('--app-viewport-offset', `${offsetTop}px`);
    };

    updateViewportMetrics();
    window.addEventListener('resize', updateViewportMetrics);
    window.addEventListener('orientationchange', updateViewportMetrics);
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', updateViewportMetrics);
    viewport?.addEventListener('scroll', updateViewportMetrics);

    return () => {
      window.removeEventListener('resize', updateViewportMetrics);
      window.removeEventListener('orientationchange', updateViewportMetrics);
      viewport?.removeEventListener('resize', updateViewportMetrics);
      viewport?.removeEventListener('scroll', updateViewportMetrics);
      document.documentElement.style.removeProperty('--app-height');
      document.documentElement.style.removeProperty('--app-viewport-offset');
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isSidebarOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    document.body.classList.add('voyagr-no-scroll');

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.classList.remove('voyagr-no-scroll');
    };
  }, [isSidebarOpen]);
  
  // Manage navbar and footer visibility 
  useEffect(() => {
    if (isMobile) {
      // Mobile: navbar visible only when sidebar closed, footer always hidden
      setNavbarVisible(!isSidebarOpen);
      setFooterVisible(false);
    } else {
      // Desktop: navbar toggles with sidebar, footer always visible
      setNavbarVisible(!isSidebarOpen);
      setFooterVisible(true);
    }
  }, [isSidebarOpen, isMobile, setNavbarVisible, setFooterVisible]);


  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isSidebarOpen]);


  // Restore navbar and footer visibility when component unmounts
  useEffect(() => {
    return () => {
      setNavbarVisible(true);
      setFooterVisible(true);
    };
  }, [setNavbarVisible, setFooterVisible]);

  // Load conversation history from localStorage on mount
  useEffect(() => {
    const loadConversationHistory = () => {
      try {
        const savedConversations = localStorage.getItem('voyagr-conversation-history');
        if (savedConversations) {
          const parsed = JSON.parse(savedConversations);
          const conversations = parsed.map((conv: any) => ({
            ...conv,
            timestamp: new Date(conv.timestamp)
          }));
          setRecentConversations(conversations);
        }
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    };
    
    loadConversationHistory();
  }, []);

  // Save conversation history to localStorage whenever it changes
  const saveConversationHistory = useCallback((conversations: RecentConversation[]) => {
    try {
      localStorage.setItem('voyagr-conversation-history', JSON.stringify(conversations));
      setRecentConversations(conversations);
    } catch (error) {
      console.error('Failed to save conversation history:', error);
    }
  }, []);
  
  const { toggleAIItemFavorite, isAIItemFavorite } = useFavorites();

  // Update hearted status based on favorites context
  const updatedFlights = SAMPLE_FLIGHTS.map((flight: Flight) => ({
    ...flight,
    hearted: isAIItemFavorite(flight.id)
  }));
  
  const updatedHotels = SAMPLE_HOTELS.map((hotel: Hotel) => ({
    ...hotel,
    hearted: isAIItemFavorite(hotel.id)
  }));
  
  
  const updatedRestaurants = SAMPLE_RESTAURANTS.map((restaurant: Restaurant) => ({
    ...restaurant,
    hearted: isAIItemFavorite(restaurant.id)
  }));

  const toggleFlightHeart = useCallback((id: number) => {
    const flight = SAMPLE_FLIGHTS.find((f: Flight) => f.id === id);
    if (flight) toggleAIItemFavorite(flight, 'flight');
  }, [toggleAIItemFavorite]);

  const toggleHotelHeart = useCallback((id: number) => {
    const hotel = SAMPLE_HOTELS.find((h: Hotel) => h.id === id);
    if (hotel) toggleAIItemFavorite(hotel, 'hotel');
  }, [toggleAIItemFavorite]);


  const toggleRestaurantHeart = useCallback((id: number) => {
    const restaurant = SAMPLE_RESTAURANTS.find((r: Restaurant) => r.id === id);
    if (restaurant) toggleAIItemFavorite(restaurant, 'restaurant');
  }, [toggleAIItemFavorite]);

  const registerClearChat = useCallback((fn: () => void) => {
    clearChatFunctionRef.current = fn;
  }, []);
  
  const handleSectionReset = useCallback((targetTab: 'flights' | 'hotels' | 'restaurants' | 'mapout') => {
    setInputValue('');
    
    if (clearChatFunctionRef.current) {
      clearChatFunctionRef.current();
    }
    
    setResetKey(prev => prev + 1);
    setActiveTab(targetTab);
  }, [setInputValue]);

  const handleNewTrip = useCallback(() => {
    // Save current conversation to recent conversations if there are messages
    if (currentConversationMessages.length > 0) {
      const firstMessage = currentConversationMessages[0];
      const newConversation: RecentConversation = {
        id: Date.now().toString(),
        title: firstMessage.length > 50 ? `${firstMessage.substring(0, 50)}...` : firstMessage,
        timestamp: new Date()
      };

      const updatedConversations = [newConversation, ...recentConversations.slice(0, 9)];
      saveConversationHistory(updatedConversations);
    }

    setInputValue('');
    setCurrentConversationMessages([]);
    clearChatFunctionRef.current?.();
    setResetKey(prev => prev + 1);

    if (isSectionTab(activeTab)) {
      handleSectionReset(activeTab);
    } else {
      setActiveTab('plan');
    }

    setIsSidebarOpen(false);
  }, [activeTab, currentConversationMessages, handleSectionReset, recentConversations, saveConversationHistory, setInputValue]);

  const handleFirstMessage = useCallback((firstMessage: string) => {
    setCurrentConversationMessages([firstMessage]);
  }, []);

  const handleMessageSent = useCallback((message: string) => {
    setCurrentConversationMessages(prev => [...prev, message]);
  }, []);

  const handleConversationSelect = useCallback((conversation: RecentConversation) => {
    setInputValue(conversation.title);
    setActiveTab('plan');
  }, [setInputValue]);

  const handleSubmit = useCallback(() => {
    // The actual chat flow is handled entirely by AIInterface's handleSendMessage
    // This is just a callback for any additional parent-level logic if needed
  }, []);

  const handlePreferencesOpen = useCallback(() => {
    setIsPreferencesModalOpen(true);
  }, []);

  const handlePreferencesSave = useCallback((newPreferences: any) => {
    setPreferences(newPreferences);
  }, []);

  return (
    <div
      className="relative flex min-h-[var(--app-height,100dvh)] flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30"
      style={{
        touchAction: isMobile ? 'pan-y' : 'auto',
        overscrollBehaviorX: 'none',
        overscrollBehaviorY: isMobile ? 'contain' : 'auto',
        WebkitOverflowScrolling: isMobile ? 'touch' : 'auto',
        paddingTop: 'calc(var(--safe-area-top) + var(--app-viewport-offset, 0px))',
        paddingBottom: isIOSDevice ? `calc(var(--safe-area-bottom) + ${keyboardOffset}px)` : 'var(--safe-area-bottom)',
        transform: isIOSDevice && keyboardOffset > 0 ? `translateY(-${Math.min(keyboardOffset / 4, 50)}px)` : 'none',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <div className="aurora-ambient" aria-hidden="true" />

      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/60 bg-white/85 px-4 py-3 backdrop-blur-xl shadow-sm">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span>Menu</span>
        </button>
        <div className="flex flex-1 flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Voyagr AI</span>
          <span className="text-base font-semibold text-gray-900">Travel Copilot</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Go to home"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={handleNewTrip}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>New Trip</span>
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 min-h-0 flex-col gap-4 overflow-hidden px-4 pb-24 pt-4 sm:px-6 lg:flex-row lg:gap-6 lg:px-10 lg:pb-6 lg:pt-6">
        <div className="hidden lg:flex lg:flex-shrink-0">
          <AISidebar
            flights={updatedFlights}
            hotels={updatedHotels}
            restaurants={updatedRestaurants}
            onFlightHeartToggle={toggleFlightHeart}
            onHotelHeartToggle={toggleHotelHeart}
            onRestaurantHeartToggle={toggleRestaurantHeart}
            onNewTrip={handleNewTrip}
            onSectionReset={handleSectionReset}
            onPreferencesOpen={handlePreferencesOpen}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            recentConversations={recentConversations}
            onConversationSelect={handleConversationSelect}
            variant="desktop"
          />
        </div>
        <main className="relative flex-1 min-h-0">
          <AIInterface
            key={resetKey}
            inputValue={inputValue}
            onInputChange={setInputValue}
            isTyping={isTyping}
            suggestedPrompts={SUGGESTED_PROMPTS}
            placeholderText={PLACEHOLDER_TEXT}
            onSubmit={handleSubmit}
            preferences={preferences}
            activeTab={activeTab}
            registerClearChat={registerClearChat}
            onNewTrip={handleNewTrip}
            onFirstMessage={handleFirstMessage}
            onMessageSent={handleMessageSent}
            onPreferencesOpen={handlePreferencesOpen}
            isMobile={isMobile}
            isIOSDevice={isIOSDevice}
            isSidebarOpen={isSidebarOpen}
          />
        </main>
      </div>

      <AIMobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative z-10 max-h-[calc(var(--app-height,100dvh)-88px)] overflow-y-auto rounded-t-3xl border border-white/50 bg-white/95 pb-safe shadow-2xl">
            <AISidebar
              flights={updatedFlights}
              hotels={updatedHotels}
              restaurants={updatedRestaurants}
              onFlightHeartToggle={toggleFlightHeart}
              onHotelHeartToggle={toggleHotelHeart}
              onRestaurantHeartToggle={toggleRestaurantHeart}
              onNewTrip={handleNewTrip}
              onSectionReset={handleSectionReset}
              onPreferencesOpen={handlePreferencesOpen}
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsSidebarOpen(false);
              }}
              recentConversations={recentConversations}
              onConversationSelect={(conversation) => {
                handleConversationSelect(conversation);
                setIsSidebarOpen(false);
              }}
              variant="mobile"
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <AIPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        onSave={handlePreferencesSave}
      />
    </div>
  );
}
