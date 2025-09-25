'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAIPageState } from '@/hooks/useAIPageState';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { useFooterVisibility } from '@/contexts/FooterVisibilityContext';
import { SAMPLE_FLIGHTS, SAMPLE_HOTELS, SAMPLE_RESTAURANTS, SUGGESTED_PROMPTS, PLACEHOLDER_TEXT } from '@/constants/aiData';
import { Flight, Hotel, Restaurant } from '@/types/ai';
import AISidebar from '@/components/AI/AISidebar';
import AIInterface from '@/components/AI/AIInterface';
import AIPreferencesModal from '@/components/AI/AIPreferencesModal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'restaurants' | 'mapout';

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

  // Keep a CSS custom property in sync with the real viewport height to avoid 100vh jumps on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewportHeight = () => {
      const viewport = window.visualViewport;
      const height = viewport ? viewport.height : window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${height}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', updateViewportHeight);
    viewport?.addEventListener('scroll', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      viewport?.removeEventListener('resize', updateViewportHeight);
      viewport?.removeEventListener('scroll', updateViewportHeight);
      document.documentElement.style.removeProperty('--app-height');
    };
  }, []);
  
  // Manage navbar and footer visibility based on device type and sidebar state
  useEffect(() => {
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    
    if (isMobile) {
      // Mobile: navbar always visible, footer always hidden (set once)
      setNavbarVisible(true);
      setFooterVisible(false);
    } else {
      // Desktop: navbar toggles with sidebar, footer always visible
      setNavbarVisible(!isSidebarOpen);
      setFooterVisible(true);
    }
  }, [isSidebarOpen, setNavbarVisible, setFooterVisible]);

  // Handle window resize separately to avoid conflicting with sidebar toggles
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
          setNavbarVisible(true);
          setFooterVisible(false);
        } else {
          setNavbarVisible(!isSidebarOpen);
          setFooterVisible(true);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [isSidebarOpen, setNavbarVisible, setFooterVisible]);

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
    
    // Reset the state to start a fresh conversation
    setInputValue('');
    setCurrentConversationMessages([]);
    setActiveTab('plan');
    setIsSidebarOpen(false);
    
    // Refresh the page to ensure a clean state
    window.location.reload();
  }, [currentConversationMessages, recentConversations, saveConversationHistory, setInputValue]);

  // Section-specific reset handlers that don't reload the page
  const clearChatFunctionRef = useRef<(() => void) | null>(null);
  const [resetKey, setResetKey] = useState(0);
  
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
      className="relative overflow-hidden overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30"
      style={{ touchAction: 'pan-y', overscrollBehaviorX: 'none', minHeight: 'var(--app-height, 100vh)' }}
    >
      <div className="aurora-ambient" />
      {/* Mobile Layout */}
      <div
        className="lg:hidden flex flex-col min-h-0 pt-16"
        style={{ minHeight: 'calc(var(--app-height, 100vh) - 4rem)' }}
      >
        
        {/* Mobile Sidebar using Sheet */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 border-0 bg-white/95 backdrop-blur-xl backdrop-saturate-150 border-r border-white/40 z-50">
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
              isMobile={true}
              onClose={() => setIsSidebarOpen(false)}
              recentConversations={recentConversations}
              onConversationSelect={handleConversationSelect}
            />
          </SheetContent>
          
          {/* Mobile Main Interface with SheetTrigger */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain relative"
            style={{ touchAction: 'pan-y', overscrollBehaviorX: 'none', zIndex: 1 }}
          >
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
              isMobile={true}
              onSidebarOpen={() => setIsSidebarOpen(true)}
              isSidebarOpen={isSidebarOpen}
              registerClearChat={registerClearChat}
              onFirstMessage={handleFirstMessage}
              onMessageSent={handleMessageSent}
              onPreferencesOpen={handlePreferencesOpen}
              renderMenuTrigger={(triggerProps: { children: React.ReactNode; onClick?: () => void }) => (
                <SheetTrigger asChild>
                  <button
                    type="button"
                    onClick={triggerProps.onClick}
                    className="fixed top-4 left-4 z-[70] p-3 rounded-full bg-white/95 backdrop-blur-md border border-white/40 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px] flex items-center justify-center glass-morphism"
                  >
                    {triggerProps.children}
                  </button>
                </SheetTrigger>
              )}
            />
          </div>
        </Sheet>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full min-h-0 max-h-screen overflow-hidden">
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
          isMobile={false}
          recentConversations={recentConversations}
          onConversationSelect={handleConversationSelect}
        />
        <div className="flex-1 h-full">
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
            isMobile={false}
            registerClearChat={registerClearChat}
            onNewTrip={handleNewTrip}
            onFirstMessage={handleFirstMessage}
            onMessageSent={handleMessageSent}
            onPreferencesOpen={handlePreferencesOpen}
          />
        </div>
      </div>
      
      
      <AIPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        onSave={handlePreferencesSave}
      />
    </div>
  );
}
