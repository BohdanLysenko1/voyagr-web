import React from 'react';
import { 
  Plane, 
  Building, 
  Map, 
  MapPin, 
  Search, 
  Settings, 
  Calendar, 
  Heart,
  Star,
  Camera,
  Navigation,
  Globe
} from 'lucide-react';

interface ButtonGridItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  ariaLabel: string;
  onClick: () => void;
  color?: string;
}

interface DrawerButtonGridProps {
  onTabChange?: (tab: string) => void;
  onPreferencesOpen?: () => void;
  onNewTrip?: () => void;
  className?: string;
}

export default function DrawerButtonGrid({ 
  onTabChange, 
  onPreferencesOpen, 
  onNewTrip,
  className = '' 
}: DrawerButtonGridProps) {
  
  const buttonItems: ButtonGridItem[] = [
    {
      id: 'search-flights',
      icon: Plane,
      label: 'Find Flights',
      ariaLabel: 'Search for flights and airline tickets',
      onClick: () => onTabChange?.('flights'),
      color: 'from-sky-500/20 to-blue-500/20 border-sky-300/40 text-sky-700 hover:from-sky-500/30 hover:to-blue-500/30'
    },
    {
      id: 'search-hotels',
      icon: Building,
      label: 'Find Hotels',
      ariaLabel: 'Search for hotels and accommodations',
      onClick: () => onTabChange?.('hotels'),
      color: 'from-orange-500/20 to-amber-500/20 border-orange-300/40 text-orange-700 hover:from-orange-500/30 hover:to-amber-500/30'
    },
    {
      id: 'travel-packages',
      icon: Map,
      label: 'Packages',
      ariaLabel: 'Browse travel packages and deals',
      onClick: () => onTabChange?.('packages'),
      color: 'from-purple-500/20 to-fuchsia-500/20 border-purple-300/40 text-purple-700 hover:from-purple-500/30 hover:to-fuchsia-500/30'
    },
    {
      id: 'map-planner',
      icon: MapPin,
      label: 'Map Out',
      ariaLabel: 'Plan your trip with interactive map',
      onClick: () => onTabChange?.('mapout'),
      color: 'from-green-500/20 to-lime-500/20 border-green-300/40 text-green-700 hover:from-green-500/30 hover:to-lime-500/30'
    },
    {
      id: 'trip-planner',
      icon: Search,
      label: 'Plan Trip',
      ariaLabel: 'Start planning a new trip',
      onClick: () => onTabChange?.('plan'),
      color: 'from-primary/20 to-purple-500/20 border-primary/40 text-primary hover:from-primary/30 hover:to-purple-500/30'
    },
    {
      id: 'preferences',
      icon: Settings,
      label: 'Settings',
      ariaLabel: 'Open travel preferences and settings',
      onClick: () => onPreferencesOpen?.(),
      color: 'from-gray-500/20 to-slate-500/20 border-gray-300/40 text-gray-700 hover:from-gray-500/30 hover:to-slate-500/30'
    }
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="px-4 py-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-4 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-primary to-purple-500 rounded-full"></div>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {buttonItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              aria-label={item.ariaLabel}
              className={`
                group relative overflow-hidden
                h-12 min-h-[48px] max-h-[56px] rounded-2xl
                border backdrop-blur-xl backdrop-saturate-150
                shadow-sm hover:shadow-lg
                transition-all duration-200 ease-out
                transform hover:scale-[1.01] active:scale-[0.99]
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 focus:ring-offset-white/50
                bg-gradient-to-br ${item.color || 'from-gray-100/50 to-gray-200/50 border-gray-300/40 text-gray-700'}
                flex items-center justify-center gap-2.5
                font-medium
              `}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-white/5 pointer-events-none" />
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-2.5">
                <item.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="text-[15px] font-semibold leading-tight">
                  {item.label}
                </span>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-2xl" />
              
              {/* Focus ring enhancement */}
              <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-200" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
