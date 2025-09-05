'use client';

import { useState } from 'react';
import { useAIPageState } from '@/hooks/useAIPageState';
import { useFavorites } from '@/contexts/FavoritesContext';
import { SAMPLE_FLIGHTS, SAMPLE_HOTELS, SAMPLE_PACKAGES, SUGGESTED_PROMPTS, PLACEHOLDER_TEXT } from '@/constants/aiData';
import { Flight, Hotel, Package } from '@/types/ai';
import AISidebar from '@/components/AI/AISidebar';
import AIInterface from '@/components/AI/AIInterface';
import AIPreferencesModal from '@/components/AI/AIPreferencesModal';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'packages';

export default function AiPage() {
  const { inputValue, setInputValue, activeSection, setActiveSection, isTyping } = useAIPageState();
  const [activeTab, setActiveTab] = useState<TabKey>('plan');
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [preferences, setPreferences] = useState(null);
  
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
    setIsPreferencesModalOpen(true);
  };

  const handleSubmit = () => {
    console.log('Submitting AI request:', inputValue);
    // Future implementation for AI processing
  };

  const handlePreferencesOpen = () => {
    setIsPreferencesModalOpen(true);
  };

  const handlePreferencesSave = (newPreferences: any) => {
    setPreferences(newPreferences);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30">
      <div className="flex h-screen pt-0">
        <AISidebar
          flights={updatedFlights}
          hotels={updatedHotels}
          packages={updatedPackages}
          onFlightHeartToggle={toggleFlightHeart}
          onHotelHeartToggle={toggleHotelHeart}
          onPackageHeartToggle={togglePackageHeart}
          onNewTrip={handleNewTrip}
          onPreferencesOpen={handlePreferencesOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <AIInterface
          inputValue={inputValue}
          onInputChange={setInputValue}
          isTyping={isTyping}
          suggestedPrompts={SUGGESTED_PROMPTS}
          placeholderText={PLACEHOLDER_TEXT}
          onSubmit={handleSubmit}
          preferences={preferences}
          activeTab={activeTab}
        />
      </div>
      
      <AIPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        onSave={handlePreferencesSave}
      />
    </div>
  );
}