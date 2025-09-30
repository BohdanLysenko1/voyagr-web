import { useEffect } from 'react';

/**
 * Custom hook to manage viewport height CSS custom properties
 * Handles dynamic viewport changes on mobile devices, especially iOS
 * Sets --app-height and --app-viewport-offset CSS variables
 */
export function useViewportHeight(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewportMetrics = () => {
      const viewport = window.visualViewport;
      const height = viewport ? viewport.height : window.innerHeight;
      const offsetTop = viewport ? viewport.offsetTop : 0;

      document.documentElement.style.setProperty('--app-height', `${height}px`);
      document.documentElement.style.setProperty('--app-viewport-offset', `${offsetTop}px`);
    };

    updateViewportMetrics();

    window.addEventListener('resize', updateViewportMetrics);
    window.addEventListener('orientationchange', updateViewportMetrics);

    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', updateViewportMetrics);
    viewport?.addEventListener('scroll', updateViewportMetrics);

    return () => {
      window.removeEventListener('resize', updateViewportMetrics);
      window.removeEventListener('orientationchange', updateViewportMetrics);
      viewport?.removeEventListener('resize', updateViewportMetrics);
      viewport?.removeEventListener('scroll', updateViewportMetrics);
      document.documentElement.style.removeProperty('--app-height');
      document.documentElement.style.removeProperty('--app-viewport-offset');
    };
  }, []);
}