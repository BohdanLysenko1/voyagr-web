'use client';

import React, { createContext, useContext, useState } from 'react';

interface NavbarVisibilityContextType {
  isNavbarVisible: boolean;
  setNavbarVisible: (visible: boolean) => void;
}

const NavbarVisibilityContext = createContext<NavbarVisibilityContextType | undefined>(undefined);

export function NavbarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const setNavbarVisible = (visible: boolean) => {
    setIsNavbarVisible(visible);
  };

  return (
    <NavbarVisibilityContext.Provider value={{ isNavbarVisible, setNavbarVisible }}>
      {children}
    </NavbarVisibilityContext.Provider>
  );
}

export function useNavbarVisibility() {
  const context = useContext(NavbarVisibilityContext);
  if (context === undefined) {
    throw new Error('useNavbarVisibility must be used within a NavbarVisibilityProvider');
  }
  return context;
}
