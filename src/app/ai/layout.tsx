'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TripPlanningProvider } from '@/contexts/TripPlanningContext';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { useFooterVisibility } from '@/contexts/FooterVisibilityContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import RouteProgressBar from '@/components/Navigation/RouteProgressBar';
import NavbarToggleButton from '@/components/AI/shared/NavbarToggleButton';

export default function AILayout({ children }: { children: React.ReactNode }) {
  const { setNavbarVisible } = useNavbarVisibility();
  const { setFooterVisible } = useFooterVisibility();
  const { isMobile, isIOSDevice } = useDeviceDetection();
  const pathname = usePathname();
  
  // Use viewport height hook
  useViewportHeight();

  // Hide footer on AI pages to prevent it from covering the mobile nav
  useEffect(() => {
    setFooterVisible(false);

    return () => {
      setFooterVisible(true);
    };
  }, [setFooterVisible]);

  // Lock body scroll on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    if (isMobile) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isMobile]);

  return (
    <ProtectedRoute>
      <TripPlanningProvider>
        {/* Route transition progress bar */}
        <RouteProgressBar />
        
        {/* Fullscreen toggle button */}
        <NavbarToggleButton />
        
        <div
          className={`relative flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 ${isIOSDevice ? 'ios-scroll-container' : ''}`}
          style={{
            touchAction: isMobile ? 'pan-y' : 'auto',
            overscrollBehaviorX: 'none',
            overscrollBehaviorY: 'contain',
            WebkitOverflowScrolling: 'touch',
            minHeight: '100dvh',
            height: isMobile ? '100dvh' : 'auto',
            paddingTop: isMobile ? '0' : 'calc(var(--safe-area-top) + var(--app-viewport-offset, 0px))',
            paddingBottom: 'var(--safe-area-bottom)',
            transform: isIOSDevice ? 'translateZ(0)' : undefined,
          }}
        >
          <div className="aurora-ambient" aria-hidden="true" />
          {children}
        </div>
      </TripPlanningProvider>
    </ProtectedRoute>
  );
}
