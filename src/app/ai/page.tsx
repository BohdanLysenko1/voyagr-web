'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, Plus, Home } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAIPageState } from '@/hooks/useAIPageState';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { useFooterVisibility } from '@/contexts/FooterVisibilityContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useConversationHistory, type RecentConversation } from '@/hooks/useConversationHistory';
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

interface Preferences {
  travelStyle?: string;
  budget?: string;
  groupSize?: string;
  activities?: string[];
}

export default function AiPage() {
  const { inputValue, setInputValue, isTyping } = useAIPageState();
  const { setNavbarVisible } = useNavbarVisibility();
  const { setFooterVisible } = useFooterVisibility();
  const { isMobile, isIOSDevice } = useDeviceDetection();
  const { recentConversations, addConversation } = useConversationHistory();

  const [activeTab, setActiveTab] = useState<TabKey>('plan');
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentConversationMessages, setCurrentConversationMessages] = useState<string[]>([]);
  const clearChatFunctionRef = useRef<(() => void) | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Use viewport height hook
  useViewportHeight();

  // Lock body scroll so only the chat surface scrolls (mobile only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    // Only lock scroll on mobile
    if (isMobile) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isMobile]);

  // Lock scroll when sidebar is open
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

  // Close sidebar with Escape key
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
      addConversation(firstMessage);
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
  }, [activeTab, currentConversationMessages, handleSectionReset, addConversation, setInputValue]);

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

  const handlePreferencesSave = useCallback((newPreferences: Preferences) => {
    setPreferences(newPreferences);
  }, []);

  return (
    <div
      className={`relative flex flex-col ${isMobile ? 'overflow-hidden' : 'overflow-y-auto'} bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 ${isIOSDevice ? 'ios-scroll-container' : ''}`}
      style={{
        touchAction: isMobile ? 'pan-y' : 'auto',
        overscrollBehaviorX: 'none',
        overscrollBehaviorY: 'contain',
        WebkitOverflowScrolling: 'touch',
        minHeight: '100vh',
        paddingTop: isMobile ? '0' : 'calc(var(--safe-area-top) + var(--app-viewport-offset, 0px))',
        paddingBottom: 'var(--safe-area-bottom)',
        transform: isIOSDevice ? 'translateZ(0)' : undefined,
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

      <div className={`relative flex flex-1 flex-col gap-4 ${isMobile ? 'overflow-hidden' : ''} pt-4 sm:px-6 lg:flex-row lg:gap-6 lg:px-10 lg:pb-6 lg:pt-6 ${isIOSDevice ? 'ios-scroll-smooth' : ''}`} style={{ paddingLeft: isMobile ? '0' : '1rem', paddingRight: isMobile ? '0' : '1rem', paddingBottom: isMobile ? '0' : '1.5rem', minHeight: isMobile ? 0 : 'auto' }}>
        <div className="hidden lg:flex lg:flex-shrink-0 lg:sticky lg:top-6" style={{ alignSelf: 'flex-start' }}>
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
        <main className="relative flex-1 flex flex-col" style={{ minHeight: isMobile ? 0 : 'auto' }}>
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