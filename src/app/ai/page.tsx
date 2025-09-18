'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAIPageState } from '@/hooks/useAIPageState';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { useFooterVisibility } from '@/contexts/FooterVisibilityContext';
import { SAMPLE_FLIGHTS, SAMPLE_HOTELS, SAMPLE_PACKAGES, SUGGESTED_PROMPTS, PLACEHOLDER_TEXT } from '@/constants/aiData';
import { Flight, Hotel, Package } from '@/types/ai';
import AISidebar from '@/components/AI/AISidebar';
import AIInterface from '@/components/AI/AIInterface';
import AIPreferencesModal from '@/components/AI/AIPreferencesModal';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'packages' | 'mapout';

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
  
  const updatedPackages = SAMPLE_PACKAGES.map((pkg: Package) => ({
    ...pkg,
    hearted: isAIItemFavorite(pkg.id)
  }));

  const toggleFlightHeart = useCallback((id: number) => {
    const flight = SAMPLE_FLIGHTS.find((f: Flight) => f.id === id);
    if (flight) toggleAIItemFavorite(flight, 'flight');
  }, [toggleAIItemFavorite]);

  const toggleHotelHeart = useCallback((id: number) => {
    const hotel = SAMPLE_HOTELS.find((h: Hotel) => h.id === id);
    if (hotel) toggleAIItemFavorite(hotel, 'hotel');
  }, [toggleAIItemFavorite]);

  const togglePackageHeart = useCallback((id: number) => {
    const pkg = SAMPLE_PACKAGES.find((p: Package) => p.id === id);
    if (pkg) toggleAIItemFavorite(pkg, 'package');
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
  const [clearChatFunction, setClearChatFunction] = useState<(() => void) | null>(null);
  const [resetKey, setResetKey] = useState(0);
  
  const handleSectionReset = useCallback((targetTab: 'flights' | 'hotels' | 'packages' | 'mapout') => {
    setInputValue('');
    
    if (clearChatFunction) {
      clearChatFunction();
    }
    
    setResetKey(prev => prev + 1);
    setActiveTab(targetTab);
  }, [clearChatFunction, setInputValue]);

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
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30">
      <div className="aurora-ambient" />
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full min-h-0 relative pt-20 max-h-screen">
        
        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar - Slide from Left */}
        <div className={`transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-40 bg-white border-r border-gray-200 shadow-2xl overflow-hidden`}>
          <AISidebar
            flights={updatedFlights}
            hotels={updatedHotels}
            packages={updatedPackages}
            onFlightHeartToggle={toggleFlightHeart}
            onHotelHeartToggle={toggleHotelHeart}
            onPackageHeartToggle={togglePackageHeart}
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
        </div>
        
        {/* Mobile Main Interface */}
        <div className="flex-1 min-h-0 pb-safe overflow-y-auto overscroll-contain">
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
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            registerClearChat={setClearChatFunction}
            onFirstMessage={handleFirstMessage}
            onMessageSent={handleMessageSent}
            onPreferencesOpen={handlePreferencesOpen}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full min-h-0 max-h-screen overflow-hidden">
        <AISidebar
          flights={updatedFlights}
          hotels={updatedHotels}
          packages={updatedPackages}
          onFlightHeartToggle={toggleFlightHeart}
          onHotelHeartToggle={toggleHotelHeart}
          onPackageHeartToggle={togglePackageHeart}
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
            registerClearChat={setClearChatFunction}
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