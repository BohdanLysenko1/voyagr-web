'use client';

import { Home, X, Plus, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AIPageHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  showNewTrip?: boolean;
  onNewTrip?: () => void;
}

export default function AIPageHeader({ 
  title, 
  subtitle = 'Voyagr AI',
  onMenuClick,
  showNewTrip = true,
  onNewTrip
}: AIPageHeaderProps) {
  const router = useRouter();

  const handleNewTrip = () => {
    if (onNewTrip) {
      onNewTrip();
    } else {
      router.push('/ai');
    }
  };

  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/60 bg-white/85 px-4 py-3 backdrop-blur-xl shadow-sm">
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
        <span>Menu</span>
      </button>

      <div className="flex flex-1 flex-col items-center text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{subtitle}</span>
        <span className="text-base font-semibold text-gray-900">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Go to home"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
        </Link>

        {showNewTrip && (
          <button
            type="button"
            onClick={handleNewTrip}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>New Trip</span>
          </button>
        )}
      </div>
    </header>
  );
}
