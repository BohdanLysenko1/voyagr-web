'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useConversationHistory } from '@/hooks/useConversationHistory';
import { SAMPLE_FLIGHTS, SAMPLE_HOTELS, SAMPLE_RESTAURANTS } from '@/constants/aiData';
import AISidebar from '@/components/AI/AISidebar';
import AIMobileNav from '@/components/AI/AIMobileNav';
import AIPageHeader from './AIPageHeader';

interface AIPageWrapperProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showSidebar?: boolean;
  showMobileNav?: boolean;
}

export default function AIPageWrapper({ 
  children, 
  title,
  subtitle,
  showSidebar = true,
  showMobileNav = true
}: AIPageWrapperProps) {
  const pathname = usePathname();
  const { isMobile, isIOSDevice } = useDeviceDetection();
  const { recentConversations } = useConversationHistory();
  const { isAIItemFavorite, toggleAIItemFavorite } = useFavorites();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname?.includes('/flights')) return 'flights';
    if (pathname?.includes('/hotels')) return 'hotels';
    if (pathname?.includes('/restaurants')) return 'restaurants';
    if (pathname?.includes('/itinerary')) return 'mapout';
    if (pathname?.includes('/plan')) return 'plan';
    return 'plan';
  };

  const activeTab = getActiveTab();

  // Update flights with favorite status
  const updatedFlights = SAMPLE_FLIGHTS.map(flight => ({
    ...flight,
    isHearted: isAIItemFavorite(flight.id),
  }));

  // Update hotels with favorite status
  const updatedHotels = SAMPLE_HOTELS.map(hotel => ({
    ...hotel,
    isHearted: isAIItemFavorite(hotel.id),
  }));

  // Update restaurants with favorite status
  const updatedRestaurants = SAMPLE_RESTAURANTS.map(restaurant => ({
    ...restaurant,
    isHearted: isAIItemFavorite(restaurant.id),
  }));

  // Toggle favorites
  const toggleFlightHeart = (id: number) => {
    const flight = SAMPLE_FLIGHTS.find(f => f.id === id);
    if (flight) toggleAIItemFavorite(flight, 'flight');
  };
  
  const toggleHotelHeart = (id: number) => {
    const hotel = SAMPLE_HOTELS.find(h => h.id === id);
    if (hotel) toggleAIItemFavorite(hotel, 'hotel');
  };
  
  const toggleRestaurantHeart = (id: number) => {
    const restaurant = SAMPLE_RESTAURANTS.find(r => r.id === id);
    if (restaurant) toggleAIItemFavorite(restaurant, 'restaurant');
  };

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

  return (
    <>
      <AIPageHeader 
        title={title}
        subtitle={subtitle}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div 
        className={`relative flex flex-1 flex-col lg:flex-row lg:gap-6 lg:px-6 lg:pb-6 lg:pt-6 ${isIOSDevice ? 'ios-scroll-smooth' : ''}`}
        style={{ 
          paddingLeft: isMobile ? '0' : undefined,
          paddingRight: isMobile ? '0' : undefined,
          paddingBottom: isMobile ? '0' : undefined,
          minHeight: 0,
          height: isMobile ? 'calc(100dvh - 64px)' : 'auto',
          overflow: 'visible'
        }}
      >
        {/* Desktop Sidebar */}
        {showSidebar && (
          <div className="hidden lg:flex lg:flex-shrink-0 lg:sticky lg:top-24 z-30" style={{ alignSelf: 'flex-start' }}>
            <AISidebar
              flights={updatedFlights}
              hotels={updatedHotels}
              restaurants={updatedRestaurants}
              onFlightHeartToggle={toggleFlightHeart}
              onHotelHeartToggle={toggleHotelHeart}
              onRestaurantHeartToggle={toggleRestaurantHeart}
              activeTab={activeTab}
              recentConversations={recentConversations}
              variant="desktop"
            />
          </div>
        )}

        {/* Main Content */}
        <main className="relative flex-1 flex flex-col lg:rounded-xl lg:overflow-hidden overflow-y-auto" style={{ minHeight: 0, height: isMobile ? '100%' : 'auto' }}>
          {children}
        </main>
      </div>

      {/* Mobile Nav */}
      {showMobileNav && isMobile && <AIMobileNav activeTab={activeTab} />}

      {/* Mobile Sidebar */}
      {isSidebarOpen && isMobile && (
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
              activeTab={activeTab}
              recentConversations={recentConversations}
              variant="mobile"
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
