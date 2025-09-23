'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import MainWrapper from './MainWrapper';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAIRoute = pathname.startsWith('/ai');

  return (
    <>
      {/* Navbar or minimal header container */}
      {isAIRoute ? (
        // For AI routes: show navbar on desktop, hide on mobile
        <>
          {/* Desktop navbar - visible */}
          <div className="hidden lg:block">
            <Navbar />
          </div>
          {/* Mobile - minimal header container with height 0 */}
          <div className="lg:hidden">
            <header className="h-0 w-full overflow-hidden" style={{ minHeight: 0 }} />
          </div>
        </>
      ) : (
        // For non-AI routes: show navbar on all devices
        <Navbar />
      )}
      
      {/* Main content */}
      <MainWrapper>{children}</MainWrapper>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
