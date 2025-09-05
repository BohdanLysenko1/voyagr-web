import { useRef, useState } from 'react';
import type { ComponentType, KeyboardEvent } from 'react';
import { Flight, Hotel, Package } from '@/types/ai';
import SearchTripsSection from './SearchTripsSection';
import FlightSection from './FlightSection';
import HotelSection from './HotelSection';
import PackageSection from './PackageSection';
import AIPreferencesSection from './AIPreferencesSection';
import { Search, Settings, Plane, Building, Map } from 'lucide-react';

interface AISidebarProps {
  flights: Flight[];
  hotels: Hotel[];
  packages: Package[];
  onFlightStarToggle: (id: number) => void;
  onHotelStarToggle: (id: number) => void;
  onPackageStarToggle: (id: number) => void;
  onNewTrip?: () => void;
  onPreferencesOpen?: () => void;
}

export default function AISidebar({
  flights,
  hotels,
  packages,
  onFlightStarToggle,
  onHotelStarToggle,
  onPackageStarToggle,
  onNewTrip,
  onPreferencesOpen,
}: AISidebarProps) {
  type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'packages';
  const [activeTab, setActiveTab] = useState<TabKey>('plan');

  const tabs: { key: TabKey; label: string; icon: ComponentType<{ className?: string }> }[] = [
    { key: 'plan', label: 'Plan', icon: Search },
    { key: 'preferences', label: 'Preferences', icon: Settings },
    { key: 'flights', label: 'Flights', icon: Plane },
    { key: 'hotels', label: 'Hotels', icon: Building },
    { key: 'packages', label: 'Packages', icon: Map },
  ];

  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    plan: null,
    preferences: null,
    flights: null,
    hotels: null,
    packages: null,
  });

  const focusTab = (key: TabKey) => {
    setTimeout(() => tabRefs.current[key]?.focus(), 0);
  };

  const onTabsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex((t) => t.key === activeTab);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowRight') {
      const next = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[next].key);
      focusTab(tabs[next].key);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const prev = (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prev].key);
      focusTab(tabs[prev].key);
      e.preventDefault();
    } else if (e.key === 'Home') {
      setActiveTab(tabs[0].key);
      focusTab(tabs[0].key);
      e.preventDefault();
    } else if (e.key === 'End') {
      setActiveTab(tabs[tabs.length - 1].key);
      focusTab(tabs[tabs.length - 1].key);
      e.preventDefault();
    }
  };

  return (
    <div className="w-[480px] min-w-[480px] flex-shrink-0 p-8 pt-0 min-h-screen">
      <aside className="w-full h-full mt-6 overflow-y-auto relative bg-white/60 backdrop-blur-2xl backdrop-saturate-150 bg-clip-padding border border-white/40 shadow-[0_20px_50px_rgba(8,_112,_184,_0.18)] rounded-[2rem] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30 transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5 after:content-[''] after:absolute after:-top-10 after:-left-10 after:w-40 after:h-40 after:bg-white/20 after:rounded-full after:blur-3xl after:pointer-events-none">
      {/* Sticky header with segmented tabs */}
      <div className="sticky top-0 z-20 bg-white/50 backdrop-blur-2xl border-b border-white/40 rounded-t-[2rem]">
        <div
          role="tablist"
          aria-label="AI sidebar sections"
          aria-orientation="horizontal"
          onKeyDown={onTabsKeyDown}
          className="px-2 pb-3 pt-4 flex flex-wrap gap-2"
        >
          {tabs.map((t) => (
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
                  setActiveTab(t.key);
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 border border-white/30 backdrop-blur-md bg-white/30 shadow-sm ${
                activeTab === t.key && t.key !== 'preferences'
                  ? 'bg-white/60 text-primary ring-1 ring-primary/30 shadow-md'
                  : 'text-gray-700 hover:bg-white/40 hover:shadow'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Panels */}
      <div className="p-4 space-y-4">
        {/* Plan */}
        <div
          role="tabpanel"
          id="panel-plan"
          aria-labelledby="tab-plan"
          hidden={activeTab !== 'plan'}
          className="outline-none"
        >
          <SearchTripsSection onNewTrip={onNewTrip} />
        </div>


        {/* Flights */}
        <div
          role="tabpanel"
          id="panel-flights"
          aria-labelledby="tab-flights"
          hidden={activeTab !== 'flights'}
          className="outline-none"
        >
          <FlightSection flights={flights} onStarToggle={onFlightStarToggle} />
        </div>

        {/* Hotels */}
        <div
          role="tabpanel"
          id="panel-hotels"
          aria-labelledby="tab-hotels"
          hidden={activeTab !== 'hotels'}
          className="outline-none"
        >
          <HotelSection hotels={hotels} onStarToggle={onHotelStarToggle} />
        </div>

        {/* Packages */}
        <div
          role="tabpanel"
          id="panel-packages"
          aria-labelledby="tab-packages"
          hidden={activeTab !== 'packages'}
          className="outline-none"
        >
          <PackageSection packages={packages} onStarToggle={onPackageStarToggle} />
        </div>
      </div>
    </aside>
    </div>
  );
}
