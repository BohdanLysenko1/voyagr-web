'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Menu, Home, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useAIPageState } from '@/hooks/useAIPageState';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { useFooterVisibility } from '@/contexts/FooterVisibilityContext';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { useConversationHistory, type RecentConversation } from '@/hooks/useConversationHistory';
import { SUGGESTED_PROMPTS, PLACEHOLDER_TEXT } from '@/constants/aiData';
import AISidebar from '@/components/AI/AISidebar';
import AIInterface from '@/components/AI/AIInterface';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { TripPlanningProvider } from '@/contexts/TripPlanningContext';

export default function ChatPage() {
  const { inputValue, setInputValue, isTyping } = useAIPageState();
  const { setNavbarVisible } = useNavbarVisibility();
  const { setFooterVisible } = useFooterVisibility();
  const { isMobile, isIOSDevice } = useDeviceDetection();
  const { recentConversations, addConversation } = useConversationHistory();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentConversationMessages, setCurrentConversationMessages] = useState<string[]>([]);
  const clearChatFunctionRef = useRef<(() => void) | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Use viewport height hook
  useViewportHeight();

  // Lock body scroll so only the chat surface scrolls (mobile only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    // Only lock scroll on mobile
    if (isMobile) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isMobile]);

  // Lock scroll when sidebar is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isSidebarOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    document.body.classList.add('voyagr-no-scroll');

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.classList.remove('voyagr-no-scroll');
    };
  }, [isSidebarOpen]);

  // Manage navbar and footer visibility
  useEffect(() => {
    if (isMobile) {
      // Mobile: navbar visible only when sidebar closed, footer always hidden
      setNavbarVisible(!isSidebarOpen);
      setFooterVisible(false);
    } else {
      // Desktop: navbar toggles with sidebar, footer always visible
      setNavbarVisible(!isSidebarOpen);
      setFooterVisible(true);
    }
  }, [isSidebarOpen, isMobile, setNavbarVisible, setFooterVisible]);

  // Close sidebar with Escape key
  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isSidebarOpen]);

  // Restore navbar and footer visibility when component unmounts
  useEffect(() => {
    return () => {
      setNavbarVisible(true);
      setFooterVisible(true);
    };
  }, [setNavbarVisible, setFooterVisible]);

  const registerClearChat = useCallback((fn: () => void) => {
    clearChatFunctionRef.current = fn;
  }, []);

  const handleNewChat = useCallback(() => {
    // Save current conversation to recent conversations if there are messages
    if (currentConversationMessages.length > 0) {
      const firstMessage = currentConversationMessages[0];
      addConversation(firstMessage);
    }

    setInputValue('');
    setCurrentConversationMessages([]);
    clearChatFunctionRef.current?.();
    setResetKey(prev => prev + 1);
    setIsSidebarOpen(false);
  }, [currentConversationMessages, addConversation, setInputValue]);

  const handleFirstMessage = useCallback((firstMessage: string) => {
    setCurrentConversationMessages([firstMessage]);
  }, []);

  const handleMessageSent = useCallback((message: string) => {
    setCurrentConversationMessages(prev => [...prev, message]);
  }, []);

  const handleConversationSelect = useCallback((conversation: RecentConversation) => {
    setInputValue(conversation.title);
  }, [setInputValue]);

  const handleSubmit = useCallback(() => {
    // The actual chat flow is handled entirely by AIInterface's handleSendMessage
    // This is just a callback for any additional parent-level logic if needed
  }, []);

  return (
    <ProtectedRoute>
      <TripPlanningProvider>
        <div
          className={`relative flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 ${isIOSDevice ? 'ios-scroll-container' : ''}`}
          style={{
            touchAction: isMobile ? 'pan-y' : 'auto',
            overscrollBehaviorX: 'none',
            overscrollBehaviorY: 'contain',
            WebkitOverflowScrolling: 'touch',
            minHeight: '100vh',
            maxHeight: isMobile ? '100vh' : 'none',
            overflow: 'hidden',
            paddingTop: isMobile ? '0' : 'calc(var(--safe-area-top) + var(--app-viewport-offset, 0px))',
            paddingBottom: 'var(--safe-area-bottom)',
            transform: isIOSDevice ? 'translateZ(0)' : undefined,
          }}
        >
          <div className="aurora-ambient" aria-hidden="true" />

        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/60 bg-white/85 px-4 py-3 backdrop-blur-xl shadow-sm">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span>Menu</span>
          </button>
          <div className="flex flex-1 flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Voyagr AI</span>
            <span className="text-base font-semibold text-gray-900">Quick Chat</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Go to home"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleNewChat}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>New Chat</span>
            </button>
          </div>
        </header>

        <div className={`relative flex flex-1 flex-col lg:flex-row lg:gap-6 lg:px-10 lg:pb-6 lg:pt-6 ${isIOSDevice ? 'ios-scroll-smooth' : ''}`} style={{ paddingLeft: isMobile ? '0' : '1rem', paddingRight: isMobile ? '0' : '1rem', paddingBottom: isMobile ? '0' : '1.5rem', minHeight: 0, height: isMobile ? 'calc(100dvh - 64px)' : 'auto', overflow: 'visible' }}>
          <div className="hidden lg:flex lg:flex-shrink-0 lg:sticky lg:top-6" style={{ alignSelf: 'flex-start' }}>
            <AISidebar
              flights={[]}
              hotels={[]}
              restaurants={[]}
              onFlightHeartToggle={() => {}}
              onHotelHeartToggle={() => {}}
              onRestaurantHeartToggle={() => {}}
              onNewTrip={handleNewChat}
              onSectionReset={() => {}}
              activeTab="chat"
              onTabChange={() => {}}
              recentConversations={recentConversations}
              onConversationSelect={handleConversationSelect}
              variant="desktop"
              hideTabsAndSections
            />
          </div>
          <main className="relative flex-1 flex flex-col" style={{ minHeight: 0, height: isMobile ? '100%' : 'auto' }}>
            <AIInterface
              key={resetKey}
              inputValue={inputValue}
              onInputChange={setInputValue}
              isTyping={isTyping}
              suggestedPrompts={SUGGESTED_PROMPTS}
              placeholderText={PLACEHOLDER_TEXT}
              onSubmit={handleSubmit}
              preferences={null}
              activeTab="chat"
              registerClearChat={registerClearChat}
              onFirstMessage={handleFirstMessage}
              onMessageSent={handleMessageSent}
              isMobile={isMobile}
              isSidebarOpen={isSidebarOpen}
              hideActionButtons
            />
          </main>
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="relative z-10 max-h-[calc(var(--app-height,100dvh)-88px)] overflow-y-auto rounded-t-3xl border border-white/50 bg-white/95 pb-safe shadow-2xl">
              <AISidebar
                flights={[]}
                hotels={[]}
                restaurants={[]}
                onFlightHeartToggle={() => {}}
                onHotelHeartToggle={() => {}}
                onRestaurantHeartToggle={() => {}}
                onNewTrip={handleNewChat}
                onSectionReset={() => {}}
                activeTab="chat"
                onTabChange={() => setIsSidebarOpen(false)}
                recentConversations={recentConversations}
                onConversationSelect={(conversation) => {
                  handleConversationSelect(conversation);
                  setIsSidebarOpen(false);
                }}
                variant="mobile"
                onClose={() => setIsSidebarOpen(false)}
                hideTabsAndSections
              />
            </div>
          </div>
        )}
        </div>
      </TripPlanningProvider>
    </ProtectedRoute>
  );
}
