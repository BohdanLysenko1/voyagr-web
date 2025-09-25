import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Flight, Hotel, Restaurant } from '@/types/ai';
import SearchTripsSection from './SearchTripsSection';
import FlightSection from './FlightSection';
import HotelSection from './HotelSection';
import RestaurantSection from './RestaurantSection';
import MapOutSection from './MapOutSection';
import DrawerButtonGrid from './DrawerButtonGrid';
import NotificationModal from '@/components/Notifications/NotificationModal';
import type { NotificationItem } from '@/components/Notifications/NotificationModal';
import { X, Home, Bell } from 'lucide-react';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'restaurants' | 'mapout';

interface RecentConversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface AISidebarProps {
  flights: Flight[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  onFlightHeartToggle: (id: number) => void;
  onHotelHeartToggle: (id: number) => void;
  onRestaurantHeartToggle: (id: number) => void;
  onNewTrip?: () => void;
  onSectionReset?: (targetTab: 'flights' | 'hotels' | 'restaurants' | 'mapout') => void;
  onPreferencesOpen?: () => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  isMobile?: boolean;
  onClose?: () => void;
  recentConversations?: RecentConversation[];
  onConversationSelect?: (conversation: RecentConversation) => void;
  onSendMessage?: (message: string) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export default function AISidebar({
  flights,
  hotels,
  restaurants,
  onFlightHeartToggle,
  onHotelHeartToggle,
  onRestaurantHeartToggle,
  onNewTrip,
  onSectionReset,
  onPreferencesOpen,
  activeTab,
  onTabChange,
  isMobile = false,
  onClose,
  recentConversations,
  onConversationSelect,
}: AISidebarProps) {
  // Section-specific new trip handlers
  const handleFlightNewTrip = useCallback(() => {
    onSectionReset?.('flights');
  }, [onSectionReset]);

  const handleHotelNewTrip = useCallback(() => {
    onSectionReset?.('hotels');
  }, [onSectionReset]);


  const handleRestaurantNewTrip = useCallback(() => {
    onSectionReset?.('restaurants');
  }, [onSectionReset]);

  const handleMapOutNewTrip = useCallback(() => {
    onSectionReset?.('mapout');
  }, [onSectionReset]);

  // Notification state and data
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  
  // Sample notification data
  const notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'New Deal Alert!',
      message: 'Amazing 50% off flights to Europe this weekend only',
      time: '2 minutes ago',
      type: 'deal',
      unread: true
    },
    {
      id: 2,
      title: 'Trip Reminder',
      message: 'Your flight to Tokyo departs in 3 days',
      time: '1 hour ago',
      type: 'reminder',
      unread: true
    },
    {
      id: 3,
      title: 'Welcome to Voyagr!',
      message: 'Complete your profile to get personalized recommendations',
      time: '1 day ago',
      type: 'welcome',
      unread: false
    }
  ];

  return (
    <div className={`${isMobile ? 'w-full h-full' : 'w-[480px] min-w-[480px] h-[calc(100vh-100px)]'} flex-shrink-0 ${isMobile ? 'p-0' : 'p-6 pt-0'} flex flex-col`}>
      <aside className={`w-full flex-1 min-h-0 ${isMobile ? 'mt-0' : 'mt-4'} flex flex-col overflow-hidden relative transition-all duration-300 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30 ${isMobile 
        ? 'bg-white border-r border-gray-200 shadow-lg rounded-none' 
        : 'glass-panel rounded-[2rem]'
      }`} style={{overscrollBehavior: 'contain'}}>
        {/* Background decorative orbs - reduced for mobile */}
        {!isMobile && (
          <>
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
            <div className="absolute top-1/3 -left-6 w-20 h-20 bg-cyan-200/20 rounded-full blur-lg pointer-events-none"></div>
            <div className="absolute bottom-1/4 -left-10 w-16 h-16 bg-pink-200/25 rounded-full blur-lg pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-16 left-8 w-18 h-18 bg-amber-200/25 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute top-10 left-16 w-14 h-14 bg-emerald-200/20 rounded-full blur-lg pointer-events-none"></div>
            <div className="absolute top-1/2 -left-8 w-26 h-26 bg-violet-200/30 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-3/4 left-20 w-16 h-16 bg-lime-200/25 rounded-full blur-lg pointer-events-none"></div>
          </>
        )}
        
      {/* Mobile header with close button */}
      {isMobile && onClose && (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-white/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25 border border-white/20">
                Voyagr AI
              </h3>
              <div className="flex items-center gap-2">
                <Link href="/" className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <Home className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </Link>
                <button 
                  onClick={() => setIsNotificationModalOpen(!isNotificationModalOpen)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
                >
                  <Bell className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  {/* Notification badge */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl hover:bg-white/80 text-gray-600 hover:text-gray-800 transition-all duration-300 border border-white/60 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      {/* Button Grid - Quick Actions */}
      <DrawerButtonGrid 
        onTabChange={(tab) => {
          if (tab === 'preferences') {
            onPreferencesOpen?.();
          } else {
            onTabChange(tab as TabKey);
          }
        }}
        onPreferencesOpen={onPreferencesOpen}
        onNewTrip={onNewTrip}
        className={`${isMobile ? 'border-b border-white/30' : ''}`}
      />
      

      {/* Panels */}
      <div className={`flex-1 overflow-y-scroll ${isMobile ? 'p-4' : 'p-4'} space-y-4`} style={{overscrollBehavior: 'contain'}}>
        {/* Plan */}
        <div
          role="tabpanel"
          id="panel-plan"
          aria-labelledby="tab-plan"
          hidden={activeTab !== 'plan'}
          className="outline-none"
        >
          <SearchTripsSection 
            onNewTrip={onNewTrip} 
            recentConversations={recentConversations}
            onConversationSelect={onConversationSelect}
          />
        </div>


        {/* Flights */}
        <div
          role="tabpanel"
          id="panel-flights"
          aria-labelledby="tab-flights"
          hidden={activeTab !== 'flights'}
          className="outline-none"
        >
          <FlightSection flights={flights} onHeartToggle={onFlightHeartToggle} onNewTrip={handleFlightNewTrip} />
        </div>

        {/* Hotels */}
        <div
          role="tabpanel"
          id="panel-hotels"
          aria-labelledby="tab-hotels"
          hidden={activeTab !== 'hotels'}
          className="outline-none"
        >
          <HotelSection hotels={hotels} onHeartToggle={onHotelHeartToggle} onNewTrip={handleHotelNewTrip} />
        </div>

        {/* Restaurants */}
        <div
          role="tabpanel"
          id="panel-restaurants"
          aria-labelledby="tab-restaurants"
          hidden={activeTab !== 'restaurants'}
          className="outline-none"
        >
          <RestaurantSection restaurants={restaurants} onHeartToggle={onRestaurantHeartToggle} onNewTrip={handleRestaurantNewTrip} />
        </div>

        {/* Map Out */}
        <div
          role="tabpanel"
          id="panel-mapout"
          aria-labelledby="tab-mapout"
          hidden={activeTab !== 'mapout'}
          className="outline-none"
        >
          <MapOutSection onNewTrip={handleMapOutNewTrip} />
        </div>
      </div>
    </aside>
    
    {/* Notification Modal */}
    <NotificationModal
      open={isNotificationModalOpen}
      notifications={notifications}
      onClose={() => setIsNotificationModalOpen(false)}
    />
    </div>
  );
}
