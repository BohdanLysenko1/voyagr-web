import { Building2, Map, Plane, Sparkles, UtensilsCrossed } from 'lucide-react';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'restaurants' | 'mapout';

interface AIMobileNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  className?: string;
}

export default function AIMobileNav({
  activeTab,
  onTabChange,
  className = '',
}: AIMobileNavProps) {
  const navItems: Array<{
    key: TabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: 'plan', label: 'Plan', icon: Sparkles },
    { key: 'flights', label: 'Flights', icon: Plane },
    { key: 'hotels', label: 'Hotels', icon: Building2 },
    { key: 'restaurants', label: 'Food', icon: UtensilsCrossed },
    { key: 'mapout', label: 'Map', icon: Map },
  ];

  return (
    <nav
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-gray-200/70 bg-white/95 backdrop-blur-xl ${className}`}
      aria-label="Voyagr AI navigation"
    >
      <div className="mx-auto grid max-w-xl grid-cols-5 items-center gap-1 px-2 pb-[max(env(safe-area-inset-bottom),0px)] pt-2">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onTabChange(key)}
              className={`flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isActive ? 'text-primary' : 'text-gray-500'
              } ${isActive ? 'bg-primary/10 shadow-inner' : 'hover:bg-gray-100/80'}`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-gray-500'}`} aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
