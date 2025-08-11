"use client";

import React, { useEffect, useId, useState } from "react";

export type CircularProgressProps = {
  percent: number; // 0-100
  size?: number; // px
  strokeWidth?: number; // px
  trackColor?: string; // hex/tailwind color
  className?: string;
  ariaLabel?: string;
  // gradient colors for progress ring
  from?: string;
  to?: string;
  roundedCaps?: boolean;
  animate?: boolean;
  durationMs?: number;
};

/**
 * Accessible, animated SVG circular progress ring.
 * - Uses unique gradient ids to avoid collisions across multiple instances.
 * - Defaults tuned for Tailwind palette.
 */
export default function CircularProgress({
  percent,
  size = 120,
  strokeWidth = 10,
  trackColor = "#e5effe", // light blue-100
  className,
  ariaLabel,
  from = "#93c5fd", // blue-300
  to = "#2563eb", // blue-600
  roundedCaps = true,
  animate = true,
  durationMs = 900,
}: CircularProgressProps) {
  const id = useId();
  const [displayPercent, setDisplayPercent] = useState(animate ? 0 : clamp(percent));

  useEffect(() => {
    if (!animate) return;
    const target = clamp(percent);
    // simple ease-out animation using rAF
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // cubic ease out
      setDisplayPercent(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [percent, animate, durationMs]);

  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = c;
  const offset = c * (1 - clamp(displayPercent) / 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel ?? `Progress: ${Math.round(displayPercent)}%`}
      className={className}
    >
      <defs>
        <linearGradient id={`ringGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Progress */}
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#ringGradient-${id})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          strokeLinecap={roundedCaps ? "round" : "butt"}
          style={{ transition: animate ? `stroke-dashoffset ${durationMs}ms ease-out` : undefined }}
        />
      </g>
    </svg>
  );
}

function clamp(v: number) {
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(100, v));
}
