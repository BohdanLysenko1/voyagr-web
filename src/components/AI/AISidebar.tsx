import { useRef, useState } from 'react';
import type { ComponentType, KeyboardEvent } from 'react';
import { Flight, Hotel, Package } from '@/types/ai';
import SearchTripsSection from './SearchTripsSection';
import FlightSection from './FlightSection';
import HotelSection from './HotelSection';
import PackageSection from './PackageSection';
import AIPreferencesSection from './AIPreferencesSection';
import { Search, Settings, Plane, Building, Map } from 'lucide-react';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'packages';

interface AISidebarProps {
  flights: Flight[];
  hotels: Hotel[];
  packages: Package[];
  onFlightHeartToggle: (id: number) => void;
  onHotelHeartToggle: (id: number) => void;
  onPackageHeartToggle: (id: number) => void;
  onNewTrip?: () => void;
  onPreferencesOpen?: () => void;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export default function AISidebar({
  flights,
  hotels,
  packages,
  onFlightHeartToggle,
  onHotelHeartToggle,
  onPackageHeartToggle,
  onNewTrip,
  onPreferencesOpen,
  activeTab,
  onTabChange,
}: AISidebarProps) {

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
      onTabChange(tabs[next].key);
      focusTab(tabs[next].key);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const prev = (currentIndex - 1 + tabs.length) % tabs.length;
      onTabChange(tabs[prev].key);
      focusTab(tabs[prev].key);
      e.preventDefault();
    } else if (e.key === 'Home') {
      onTabChange(tabs[0].key);
      focusTab(tabs[0].key);
      e.preventDefault();
    } else if (e.key === 'End') {
      onTabChange(tabs[tabs.length - 1].key);
      focusTab(tabs[tabs.length - 1].key);
      e.preventDefault();
    }
  };

  return (
    <div className="w-[480px] min-w-[480px] flex-shrink-0 p-6 pt-0 h-screen flex flex-col">
      <aside className="w-full flex-1 min-h-0 mt-4 flex flex-col overflow-hidden relative bg-white/60 backdrop-blur-2xl backdrop-saturate-150 bg-clip-padding border border-white/40 shadow-[0_20px_50px_rgba(8,_112,_184,_0.18)] rounded-[2rem] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30 transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5">
        {/* Background decorative orbs */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/3 -left-6 w-20 h-20 bg-cyan-200/20 rounded-full blur-lg pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-10 w-16 h-16 bg-pink-200/25 rounded-full blur-lg pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-16 left-8 w-18 h-18 bg-amber-200/25 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute top-10 left-16 w-14 h-14 bg-emerald-200/20 rounded-full blur-lg pointer-events-none"></div>
        <div className="absolute top-1/2 -left-8 w-26 h-26 bg-violet-200/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-3/4 left-20 w-16 h-16 bg-lime-200/25 rounded-full blur-lg pointer-events-none"></div>
        <div className="absolute bottom-20 left-4 w-12 h-12 bg-slate-200/25 rounded-full blur-md pointer-events-none"></div>
        <div className="absolute bottom-1/3 -left-4 w-24 h-24 bg-green-200/30 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute top-60 left-12 w-6 h-6 bg-yellow-200/25 rounded-full blur-sm pointer-events-none animate-pulse"></div>
        <div className="absolute top-5 left-8 w-10 h-10 bg-purple-300/35 rounded-full blur-md pointer-events-none"></div>
        <div className="absolute top-48 -left-2 w-12 h-12 bg-pink-300/25 rounded-full blur-md pointer-events-none"></div>
        <div className="absolute top-72 left-6 w-20 h-20 bg-teal-300/25 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute top-96 left-14 w-6 h-6 bg-rose-300/30 rounded-full blur-sm pointer-events-none"></div>
        <div className="absolute bottom-48 -left-6 w-22 h-22 bg-violet-300/25 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute bottom-28 left-10 w-16 h-16 bg-orange-300/30 rounded-full blur-lg pointer-events-none"></div>
        <div className="absolute top-24 left-2 w-8 h-8 bg-fuchsia-300/40 rounded-full blur-sm pointer-events-none"></div>
        <div className="absolute top-64 left-18 w-14 h-14 bg-green-300/30 rounded-full blur-md pointer-events-none"></div>
        <div className="absolute bottom-52 left-2 w-8 h-8 bg-purple-400/35 rounded-full blur-sm pointer-events-none"></div>
        <div className="absolute bottom-32 left-16 w-6 h-6 bg-pink-400/40 rounded-full blur-sm pointer-events-none"></div>
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
                  onTabChange(t.key);
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          <FlightSection flights={flights} onHeartToggle={onFlightHeartToggle} />
        </div>

        {/* Hotels */}
        <div
          role="tabpanel"
          id="panel-hotels"
          aria-labelledby="tab-hotels"
          hidden={activeTab !== 'hotels'}
          className="outline-none"
        >
          <HotelSection hotels={hotels} onHeartToggle={onHotelHeartToggle} />
        </div>

        {/* Packages */}
        <div
          role="tabpanel"
          id="panel-packages"
          aria-labelledby="tab-packages"
          hidden={activeTab !== 'packages'}
          className="outline-none"
        >
          <PackageSection packages={packages} onHeartToggle={onPackageHeartToggle} />
        </div>
      </div>
    </aside>
    </div>
  );
}
