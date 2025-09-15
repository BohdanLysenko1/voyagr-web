import { useRef, useCallback, useMemo } from 'react';
import type { KeyboardEvent } from 'react';
import { Flight, Hotel, Package } from '@/types/ai';
import SearchTripsSection from './SearchTripsSection';
import FlightSection from './FlightSection';
import HotelSection from './HotelSection';
import PackageSection from './PackageSection';
import MapOutSection from './MapOutSection';
import { Search, Settings, Plane, Building, Map, MapPin, X } from 'lucide-react';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'packages' | 'mapout';

interface RecentConversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface AISidebarProps {
  flights: Flight[];
  hotels: Hotel[];
  packages: Package[];
  onFlightHeartToggle: (id: number) => void;
  onHotelHeartToggle: (id: number) => void;
  onPackageHeartToggle: (id: number) => void;
  onNewTrip?: () => void;
  onSectionReset?: (targetTab: 'flights' | 'hotels' | 'packages' | 'mapout') => void;
  onPreferencesOpen?: () => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  isMobile?: boolean;
  onClose?: () => void;
  recentConversations?: RecentConversation[];
  onConversationSelect?: (conversation: RecentConversation) => void;
}

export default function AISidebar({
  flights,
  hotels,
  packages,
  onFlightHeartToggle,
  onHotelHeartToggle,
  onPackageHeartToggle,
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

  const handlePackageNewTrip = useCallback(() => {
    onSectionReset?.('packages');
  }, [onSectionReset]);

  const handleMapOutNewTrip = useCallback(() => {
    onSectionReset?.('mapout');
  }, [onSectionReset]);

  const tabsConfig = useMemo(() => [
    { key: 'plan' as TabKey, label: 'Plan', icon: Search },
    { key: 'flights' as TabKey, label: 'Flights', icon: Plane },
    { key: 'hotels' as TabKey, label: 'Hotels', icon: Building },
    { key: 'packages' as TabKey, label: 'Packages', icon: Map },
    { key: 'mapout' as TabKey, label: 'Map Out', icon: MapPin },
    { key: 'preferences' as TabKey, label: 'Preferences', icon: Settings },
  ], []);

  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    plan: null,
    preferences: null,
    flights: null,
    hotels: null,
    packages: null,
    mapout: null,
  });

  const focusTab = useCallback((key: TabKey) => {
    setTimeout(() => tabRefs.current[key]?.focus(), 0);
  }, []);

  const onTabsKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabsConfig.findIndex((t) => t.key === activeTab);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowRight') {
      const next = (currentIndex + 1) % tabsConfig.length;
      onTabChange(tabsConfig[next].key);
      focusTab(tabsConfig[next].key);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const prev = (currentIndex - 1 + tabsConfig.length) % tabsConfig.length;
      onTabChange(tabsConfig[prev].key);
      focusTab(tabsConfig[prev].key);
      e.preventDefault();
    } else if (e.key === 'Home') {
      onTabChange(tabsConfig[0].key);
      focusTab(tabsConfig[0].key);
      e.preventDefault();
    } else if (e.key === 'End') {
      onTabChange(tabsConfig[tabsConfig.length - 1].key);
      focusTab(tabsConfig[tabsConfig.length - 1].key);
      e.preventDefault();
    }
  }, [tabsConfig, activeTab, onTabChange, focusTab]);

  return (
    <div className={`${isMobile ? 'w-full h-full' : 'w-[480px] min-w-[480px] h-screen'} flex-shrink-0 ${isMobile ? 'p-0' : 'p-6 pt-0'} flex flex-col`}>
      <aside className={`w-full flex-1 min-h-0 ${isMobile ? 'mt-0' : 'mt-4'} flex flex-col overflow-hidden relative transition-all duration-300 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30 ${isMobile 
        ? 'bg-white border-r border-gray-200 shadow-lg rounded-none' 
        : 'bg-white/60 backdrop-blur-2xl backdrop-saturate-150 bg-clip-padding border border-white/40 shadow-[0_20px_50px_rgba(8,_112,_184,_0.18)] rounded-[2rem] before:content-[\'\'] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5'
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
            <h3 className="text-xl font-bold text-gray-800">Voyagr AI</h3>
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
      
      {/* Sticky header with segmented tabs */}
      <div className={`sticky ${isMobile ? 'top-[72px]' : 'top-0'} z-20 ${isMobile ? 'bg-white/90 backdrop-blur-md border-b border-white/50' : 'bg-white/50 backdrop-blur-2xl border-b border-white/40 rounded-t-[2rem]'}`}>
        <div
          role="tablist"
          aria-label="AI sidebar sections"
          aria-orientation="horizontal"
          onKeyDown={onTabsKeyDown}
          className={`${isMobile ? 'px-4 py-3' : 'px-2 pb-3 pt-4'} flex flex-wrap gap-2`}
        >
          {tabsConfig.map((t) => (
            <button
              key={t.key}
              type="button"
              ref={(el) => {
                tabRefs.current[t.key] = el;
              }}
              role="tab"
              id={`tab-${t.key}`}
              aria-controls={`panel-${t.key}`}
              aria-selected={activeTab === t.key}
              tabIndex={activeTab === t.key ? 0 : -1}
              onClick={() => {
                if (t.key === 'preferences') {
                  onPreferencesOpen?.();
                } else {
                  onTabChange(t.key);
                }
              }}
              className={`flex items-center gap-2 ${isMobile ? 'rounded-2xl px-4 py-3 text-sm min-h-[48px] flex-1' : 'rounded-xl px-3 py-2 text-sm'} font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${isMobile ? 'border-2 border-white/40 backdrop-blur-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]' : 'border border-white/30 backdrop-blur-md shadow-sm'} ${
                activeTab === t.key && t.key !== 'preferences'
                  ? isMobile ? 'bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border-primary/40 shadow-xl ring-2 ring-primary/30' : 'bg-white/60 text-primary ring-1 ring-primary/30 shadow-md'
                  : isMobile ? 'bg-white/70 text-gray-700 hover:bg-white/80 hover:text-gray-800' : 'bg-white/30 text-gray-700 hover:bg-white/40 hover:shadow'
              }`}
            >
              <t.icon className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} transition-transform duration-300 ${activeTab === t.key && isMobile ? 'scale-110' : ''}`} />
              <span className={`${isMobile ? 'text-sm font-semibold' : 'text-xs'} transition-all duration-300`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

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

        {/* Packages */}
        <div
          role="tabpanel"
          id="panel-packages"
          aria-labelledby="tab-packages"
          hidden={activeTab !== 'packages'}
          className="outline-none"
        >
          <PackageSection packages={packages} onHeartToggle={onPackageHeartToggle} onNewTrip={handlePackageNewTrip} />
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
    </div>
  );
}
