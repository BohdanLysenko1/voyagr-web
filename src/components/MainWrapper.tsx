'use client';

import { usePathname } from 'next/navigation';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';

interface MainWrapperProps {
  children: React.ReactNode;
}

export default function MainWrapper({ children }: MainWrapperProps) {
  const pathname = usePathname();
  const { isNavbarVisible } = useNavbarVisibility();
  const isHomePage = pathname === '/';
  const isAIRoute = pathname.startsWith('/ai');

  // Only reserve space for the global navbar/footer when they are actually rendered.
  const shouldOffsetNavbar = !isHomePage && !isAIRoute && isNavbarVisible;
  const shouldOffsetAINavbar = isAIRoute && isNavbarVisible;

  return (
    <main className={`flex-1 ${shouldOffsetNavbar ? 'pt-20' : ''} ${shouldOffsetAINavbar ? 'lg:pt-20' : ''}`}>
      {children}
    </main>
  );
}
