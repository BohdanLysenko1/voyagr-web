'use client';

import { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import { useFooterVisibility } from '@/contexts/FooterVisibilityContext';

export default function NavbarToggleButton() {
  const { setNavbarVisible } = useNavbarVisibility();
  const { setFooterVisible } = useFooterVisibility();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai-fullscreen-mode');
    const shouldBeFullscreen = saved === 'true';
    setIsFullscreen(shouldBeFullscreen);
    
    if (shouldBeFullscreen) {
      setNavbarVisible(false);
      setFooterVisible(false);
    }
  }, [setNavbarVisible, setFooterVisible]);

  const toggleFullscreen = () => {
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    
    // Save preference
    localStorage.setItem('ai-fullscreen-mode', String(newState));
    
    // Update navbar and footer
    setNavbarVisible(!newState);
    setFooterVisible(!newState);
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-2 px-3 py-2
                 glass-card border border-white/40 rounded-xl
                 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]
                 transition-all duration-300 group"
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      title={isFullscreen ? 'Show navbar & footer' : 'Hide navbar & footer'}
    >
      {isFullscreen ? (
        <>
          <Minimize2 className="w-4 h-4 text-gray-700 group-hover:text-primary transition-colors" />
          <span className="hidden sm:inline text-xs font-medium text-gray-700 group-hover:text-primary transition-colors">
            Exit Fullscreen
          </span>
        </>
      ) : (
        <>
          <Maximize2 className="w-4 h-4 text-gray-700 group-hover:text-primary transition-colors" />
          <span className="hidden sm:inline text-xs font-medium text-gray-700 group-hover:text-primary transition-colors">
            Fullscreen
          </span>
        </>
      )}
    </button>
  );
}
