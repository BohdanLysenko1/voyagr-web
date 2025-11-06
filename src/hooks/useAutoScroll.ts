import { useCallback, useRef, useEffect } from 'react';
import { SCROLL_THRESHOLDS, ANIMATION_DURATIONS } from '@/constants/travelConstants';

interface UseAutoScrollOptions {
  isMobile?: boolean;
  onScrollComplete?: () => void;
}

export function useAutoScroll({ isMobile = false, onScrollComplete }: UseAutoScrollOptions = {}) {
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const isUserScrollingRef = useRef(false);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user is near the bottom of the scroll container
  const isNearBottom = useCallback((threshold: number = SCROLL_THRESHOLDS.NEAR_BOTTOM) => {
    const container = scrollContainerRef.current;
    if (!container) return true;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom <= threshold;
  }, []);

  // Robust scroll to bottom
  const scrollToBottom = useCallback((force = false) => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }

    if (!force && !isNearBottom(SCROLL_THRESHOLDS.NEAR_BOTTOM)) {
      return;
    }

    const performScroll = () => {
      const container = scrollContainerRef.current;

      if (!container) {
        if (messagesEndRef.current) {
          try {
            messagesEndRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
              inline: 'nearest',
            });
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('ScrollIntoView fallback failed', error);
            }
          }
        }
        return;
      }

      const maxScroll = container.scrollHeight - container.clientHeight;

      try {
        container.scrollTo({
          top: maxScroll,
          behavior: 'smooth',
        });
      } catch {
        container.scrollTop = maxScroll;
      }

      const focusDelay = isMobile ? ANIMATION_DURATIONS.FOCUS_DELAY_MOBILE : ANIMATION_DURATIONS.FOCUS_DELAY_DESKTOP;
      autoScrollTimeoutRef.current = setTimeout(() => {
        onScrollComplete?.();
      }, focusDelay);
    };

    if (isMobile) {
      requestAnimationFrame(() => {
        requestAnimationFrame(performScroll);
      });
    } else {
      requestAnimationFrame(performScroll);
    }
  }, [isMobile, isNearBottom, onScrollComplete]);

  // Track user scrolling behavior
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      isUserScrollingRef.current = true;

      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (isNearBottom(50)) {
          isUserScrollingRef.current = false;
        }
      }, ANIMATION_DURATIONS.SCROLL_TIMEOUT);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isNearBottom]);

  const handleScrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    scrollContainerRef.current = node ?? null;
  }, []);

  return {
    scrollToBottom,
    isNearBottom,
    messagesEndRef,
    handleScrollContainerRef,
    isUserScrollingRef,
  };
}
