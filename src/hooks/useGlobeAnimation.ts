import { useMemo, useEffect, useRef } from 'react';

type TabKey = 'plan' | 'chat' | 'preferences' | 'flights' | 'hotels' | 'restaurants' | 'mapout';

type NodeConfig = {
  pos: { top: string; left?: string; right?: string };
  xStart: number; 
  yStart: number; 
  xEnd: number; 
  yEnd: number;
  dur: number; 
  size: number; 
  opacity: number; 
  spin: number;
};

export function useGlobeAnimation(activeTab: TabKey, isMounted: boolean) {
  const globeFieldRef = useRef<HTMLDivElement>(null);

  // Generate animated globe nodes with randomization
  const globeNodes = useMemo(() => {
    // Only generate on client to prevent hydration mismatch
    if (!isMounted) return [];
    
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    
    const base: NodeConfig[] = [
      { pos: { top: '8%', left: '5%' }, xStart: -6, yStart: -4, xEnd: 10, yEnd: 6, dur: rand(20, 26), size: 140, opacity: 0.08, spin: 120 },
      { pos: { top: '20%', right: '8%' }, xStart: 5, yStart: -3, xEnd: -8, yEnd: 4, dur: rand(24, 30), size: 120, opacity: 0.07, spin: 110 },
      { pos: { top: '60%', left: '10%' }, xStart: 0, yStart: 0, xEnd: 12, yEnd: -6, dur: rand(18, 24), size: 90, opacity: 0.09, spin: 90 },
      { pos: { top: '68%', right: '12%' }, xStart: -10, yStart: 2, xEnd: 8, yEnd: -8, dur: rand(20, 26), size: 100, opacity: 0.06, spin: 95 },
      { pos: { top: '35%', left: '40%' }, xStart: -6, yStart: 6, xEnd: 6, yEnd: -6, dur: rand(16, 22), size: 60, opacity: 0.08, spin: 70 },
      { pos: { top: '78%', left: '46%' }, xStart: 4, yStart: -4, xEnd: -6, yEnd: 6, dur: rand(14, 20), size: 50, opacity: 0.07, spin: 60 },
      { pos: { top: '15%', left: '65%' }, xStart: 2, yStart: 4, xEnd: -8, yEnd: -4, dur: rand(18, 22), size: 70, opacity: 0.07, spin: 80 },
    ];
    
    return base.map((n) => {
      // small random offsets to path
      const jitter = (v: number, j: number) => v + rand(-j, j);
      const xStart = jitter(n.xStart, 2);
      const yStart = jitter(n.yStart, 2);
      const xEnd = jitter(n.xEnd, 2);
      const yEnd = jitter(n.yEnd, 2);
      return {
        nodeStyle: {
          top: n.pos.top,
          left: n.pos.left,
          right: n.pos.right,
          '--xStart': `${xStart}vw`,
          '--yStart': `${yStart}vh`,
          '--xEnd': `${xEnd}vw`,
          '--yEnd': `${yEnd}vh`,
          animationDuration: `${n.dur}s`,
        } as React.CSSProperties,
        spriteStyle: {
          '--size': `${n.size}px`,
          '--opacity': `${n.opacity}`,
          animationDuration: `${n.spin}s`,
        } as React.CSSProperties,
      };
    });
  }, [isMounted]);

  // Globe tint based on active tab
  const globeTint = useMemo(() => {
    switch (activeTab) {
      case 'flights':
        return { from: 'rgba(14,165,233,0.40)', to: 'rgba(56,189,248,0.35)', opacity: '0.32' };
      case 'hotels':
        return { from: 'rgba(251,146,60,0.40)', to: 'rgba(245,158,11,0.35)', opacity: '0.32' };
      case 'restaurants':
        return { from: 'rgba(168,85,247,0.40)', to: 'rgba(139,92,246,0.35)', opacity: '0.32' };
      case 'mapout':
        return { from: 'rgba(34,197,94,0.40)', to: 'rgba(132,204,22,0.35)', opacity: '0.32' };
      default:
        return { from: 'rgba(82,113,255,0.40)', to: 'rgba(139,92,246,0.35)', opacity: '0.30' };
    }
  }, [activeTab]);

  // Animated globe parallax
  useEffect(() => {
    const el = globeFieldRef.current;
    if (!el) return;
    
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = ((e.clientX / w) - 0.5) * 24; // px parallax
      const y = ((e.clientY / h) - 0.5) * 16;
      el.style.setProperty('--px', `${x}px`);
      el.style.setProperty('--py', `${y}px`);
    };
    
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return {
    globeNodes,
    globeTint,
    globeFieldRef,
  };
}
