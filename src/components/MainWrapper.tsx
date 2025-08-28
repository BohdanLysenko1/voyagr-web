'use client';

import { usePathname } from 'next/navigation';

interface MainWrapperProps {
  children: React.ReactNode;
}

export default function MainWrapper({ children }: MainWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <main className={`flex-1 ${isHomePage ? '' : 'pt-20'}`}>
      {children}
    </main>
  );
}
