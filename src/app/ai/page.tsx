'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAIPageState } from '@/hooks/useAIPageState';
import { useFavorites } from '@/contexts/FavoritesContext';
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
  const router = useRouter();
  const { inputValue, setInputValue, activeSection, setActiveSection, isTyping } = useAIPageState();
  const [activeTab, setActiveTab] = useState<TabKey>('plan');
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [currentConversationMessages, setCurrentConversationMessages] = useState<string[]>([]);
  
  // Load conversation history from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('voyagr-conversation-history');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        // Convert timestamp strings back to Date objects
        const conversations = parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        }));
        setRecentConversations(conversations);
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    }
  }, []);

  // Save conversation history to localStorage whenever it changes
  const saveConversationHistory = (conversations: RecentConversation[]) => {
    localStorage.setItem('voyagr-conversation-history', JSON.stringify(conversations));
    setRecentConversations(conversations);
  };
  
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

  const toggleFlightHeart = (id: number) => {
    const flight = SAMPLE_FLIGHTS.find((f: Flight) => f.id === id);
    if (flight) toggleAIItemFavorite(flight, 'flight');
  };

  const toggleHotelHeart = (id: number) => {
    const hotel = SAMPLE_HOTELS.find((h: Hotel) => h.id === id);
    if (hotel) toggleAIItemFavorite(hotel, 'hotel');
  };

  const togglePackageHeart = (id: number) => {
    const pkg = SAMPLE_PACKAGES.find((p: Package) => p.id === id);
    if (pkg) toggleAIItemFavorite(pkg, 'package');
  };

  const handleNewTrip = () => {
    // Save current conversation to recent conversations if there are messages
    if (currentConversationMessages.length > 0) {
      const firstMessage = currentConversationMessages[0];
      const newConversation: RecentConversation = {
        id: Date.now().toString(),
        title: firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage,
        timestamp: new Date()
      };

      const updatedConversations = [newConversation, ...recentConversations.slice(0, 9)]; // Keep only the 10 most recent
      saveConversationHistory(updatedConversations);
    }
    
    // Reset the state to start a fresh conversation
    setInputValue('');
    setCurrentConversationMessages([]);
    setActiveTab('plan');
    setIsSidebarOpen(false);
    
    // Refresh the page to ensure a clean state
    window.location.reload();
  };

  // Section-specific reset handlers that don't reload the page
  const [clearChatFunction, setClearChatFunction] = useState<(() => void) | null>(null);
  const [resetKey, setResetKey] = useState(0);
  
  const handleSectionReset = (targetTab: 'flights' | 'hotels' | 'packages' | 'mapout') => {
    // Clear input and reset interface to section-specific welcome screen
    setInputValue('');
    
    // Clear chat immediately
    if (clearChatFunction) {
      clearChatFunction();
    }
    
    // Force interface reset by changing key
    setResetKey(prev => prev + 1);
    setActiveTab(targetTab);
    
    console.log('Section reset to:', targetTab, 'with key:', resetKey + 1);
  };

  const handleFirstMessage = (firstMessage: string) => {
    // Add the first message to current conversation
    setCurrentConversationMessages([firstMessage]);
  };

  // Function to track all messages in the current conversation
  const handleMessageSent = (message: string) => {
    setCurrentConversationMessages(prev => [...prev, message]);
  };

  const handleConversationSelect = (conversation: RecentConversation) => {
    // For now, just set the input value to the conversation title
    // In a real implementation, this would load the full conversation
    setInputValue(conversation.title);
    setActiveTab('plan');
  };

  const handleSubmit = () => {
    // The actual chat flow is handled entirely by AIInterface's handleSendMessage
    // This is just a callback for any additional parent-level logic if needed
    console.log('Trip planning conversation started');
  };

  const handlePreferencesOpen = () => {
    setIsPreferencesModalOpen(true);
  };

  const handlePreferencesSave = (newPreferences: any) => {
    setPreferences(newPreferences);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full relative pt-16 pb-safe">
        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar - Slide from Left */}
        <div className={`transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50 bg-white/95 backdrop-blur-xl border-r border-white/40 shadow-2xl overflow-hidden`}>
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
      <div className="hidden lg:flex h-full">
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
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <AIPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        onSave={handlePreferencesSave}
      />
    </div>
  );
}