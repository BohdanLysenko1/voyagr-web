import { useCallback, useState } from 'react';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Flight, Hotel, Restaurant } from '@/types/ai';
import SearchTripsSection from './SearchTripsSection';
import DrawerButtonGrid from './DrawerButtonGrid';
import NotificationModal from '@/components/Notifications/NotificationModal';
import type { NotificationItem } from '@/components/Notifications/NotificationModal';
import LoadingSpinner from './LoadingSpinner';
import type { FlightSectionProps } from './FlightSection';
import type { HotelSectionProps } from './HotelSection';
import type { RestaurantSectionProps } from './RestaurantSection';
import type { MapOutSectionProps } from './MapOutSection';

const FlightSection = dynamic<FlightSectionProps>(() => import('./FlightSection'), {
  loading: () => <LoadingSpinner size="md" />,
  ssr: false,
});

const HotelSection = dynamic<HotelSectionProps>(() => import('./HotelSection'), {
  loading: () => <LoadingSpinner size="md" />,
  ssr: false,
});

const RestaurantSection = dynamic<RestaurantSectionProps>(() => import('./RestaurantSection'), {
  loading: () => <LoadingSpinner size="md" />,
  ssr: false,
});

const MapOutSection = dynamic<MapOutSectionProps>(() => import('./MapOutSection'), {
  loading: () => <LoadingSpinner size="md" />,
  ssr: false,
});

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
  recentConversations?: RecentConversation[];
  onConversationSelect?: (conversation: RecentConversation) => void;
  onSendMessage?: (message: string) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  variant?: 'desktop' | 'mobile';
  onClose?: () => void;
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
  recentConversations,
  onConversationSelect,
  variant = 'desktop',
  onClose,
}: AISidebarProps) {
  const isMobileVariant = variant === 'mobile';
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
    <div
      className={`flex flex-col flex-shrink-0 ${
        isMobileVariant
          ? 'w-full max-w-full p-4 pb-6 sm:p-6 overflow-y-auto'
          : 'w-full max-w-[480px] lg:w-[460px] xl:w-[500px] min-w-[320px] p-4 pr-2 lg:p-6 lg:pt-0'
      }`}
    >
      <aside
        className={`w-full mt-3 flex flex-col ${
          isMobileVariant ? 'overflow-y-auto flex-1 min-h-0' : ''
        } relative transition-all duration-300 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30 glass-panel rounded-[2rem] ${
          isMobileVariant ? 'backdrop-blur-lg border-white/50 shadow-xl' : ''
        }`}
        style={{ overscrollBehavior: 'contain', maxHeight: isMobileVariant ? undefined : 'calc(100vh - 140px)' }}
      >
        {/* Background decorative orbs */}
        {!isMobileVariant && (
          <>
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl pointer-events-none animate-pulse" />
            <div className="absolute top-1/3 -left-6 w-20 h-20 bg-cyan-200/20 rounded-full blur-lg pointer-events-none" />
            <div className="absolute bottom-1/4 -right-4 w-16 h-16 bg-purple-200/25 rounded-full blur-lg pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-pink-200/20 rounded-full blur-sm pointer-events-none" />
            <div className="absolute top-10 left-16 w-14 h-14 bg-emerald-200/20 rounded-full blur-lg pointer-events-none" />
            <div className="absolute top-1/2 -left-8 w-26 h-26 bg-violet-200/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-3/4 left-20 w-16 h-16 bg-lime-200/25 rounded-full blur-lg pointer-events-none" />
          </>
        )}

        {isMobileVariant && (
          <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 bg-white/70 backdrop-blur-xl border-b border-white/60">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Voyagr AI</span>
              <span className="text-base font-semibold text-gray-900">Quick Planner</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Close planner menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
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
            if (isMobileVariant) {
              onClose?.();
            }
          }}
          onPreferencesOpen={() => {
            onPreferencesOpen?.();
            if (isMobileVariant) {
              onClose?.();
            }
          }}
          onNewTrip={() => {
            onNewTrip?.();
            if (isMobileVariant) {
              onClose?.();
            }
          }}
          className="pt-4"
        />


        {/* Panels */}
        <div className={`${isMobileVariant ? 'flex-1' : ''} overflow-y-auto p-4 pb-6 space-y-4 ${isMobileVariant ? 'pt-2' : ''}`} style={{ overscrollBehavior: 'contain' }}>
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
        {activeTab === 'flights' && (
          <div
            role="tabpanel"
            id="panel-flights"
            aria-labelledby="tab-flights"
            className="outline-none"
          >
            <FlightSection flights={flights} onHeartToggle={onFlightHeartToggle} onNewTrip={handleFlightNewTrip} />
          </div>
        )}

        {/* Hotels */}
        {activeTab === 'hotels' && (
          <div
            role="tabpanel"
            id="panel-hotels"
            aria-labelledby="tab-hotels"
            className="outline-none"
          >
            <HotelSection hotels={hotels} onHeartToggle={onHotelHeartToggle} onNewTrip={handleHotelNewTrip} />
          </div>
        )}

        {/* Restaurants */}
        {activeTab === 'restaurants' && (
          <div
            role="tabpanel"
            id="panel-restaurants"
            aria-labelledby="tab-restaurants"
            className="outline-none"
          >
            <RestaurantSection restaurants={restaurants} onHeartToggle={onRestaurantHeartToggle} onNewTrip={handleRestaurantNewTrip} />
          </div>
        )}

        {/* Map Out */}
        {activeTab === 'mapout' && (
          <div
            role="tabpanel"
            id="panel-mapout"
            aria-labelledby="tab-mapout"
            className="outline-none"
          >
            <MapOutSection onNewTrip={handleMapOutNewTrip} />
          </div>
        )}
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
