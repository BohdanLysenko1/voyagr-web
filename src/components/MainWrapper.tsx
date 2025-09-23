'use client';

import { usePathname } from 'next/navigation';

interface MainWrapperProps {
  children: React.ReactNode;
}

export default function MainWrapper({ children }: MainWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isAIRoute = pathname.startsWith('/ai');

  // For AI routes: add padding on desktop (where navbar is visible), no padding on mobile
  // For other routes: add padding everywhere except homepage
  const shouldAddPadding = isHomePage ? false : 
                          isAIRoute ? false : // AI routes handle their own spacing
                          true;

  return (
    <main className={`flex-1 ${shouldAddPadding ? 'pt-20' : ''} ${isAIRoute ? 'lg:pt-20' : ''}`}>
      {children}
    </main>
  );
}
