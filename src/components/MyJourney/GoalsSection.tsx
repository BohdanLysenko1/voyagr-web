"use client";

import React from "react";
import { Target } from "lucide-react";

export type Goal = {
  id: string;
  label: string;
  current: number;
  target: number; // avoid zero
  period?: string; // e.g. "2025", "This year"
};

type Props = {
  items: Goal[];
  className?: string;
};

function clampPct(p: number) {
  if (Number.isNaN(p)) return 0;
  return Math.max(0, Math.min(100, p));
}

function pct(current: number, target: number) {
  if (!target || target <= 0) return 0;
  return clampPct((current / target) * 100);
}

/**
 * Personal Goals with simple progress bars.
 */
export default function GoalsSection({ items, className }: Props) {
  const total = items.length;
  const avg = clampPct(
    total ? items.reduce((acc, g) => acc + pct(g.current, g.target), 0) / total : 0
  );

  return (
    <section
      className={`rounded-2xl border border-blue-100 bg-white/70 p-6 shadow-sm ${className ?? ""}`}
      aria-labelledby="goals-heading"
    >
      <header className="mb-5 flex items-center justify-between">
        <h2 id="goals-heading" className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-500" aria-hidden />
          Personal Goals
        </h2>
        <p className="text-xs text-gray-600">
          Avg completion: <span className="font-medium text-gray-900">{Math.round(avg)}%</span>
        </p>
      </header>

      <ul className="space-y-4">
        {items.map((g) => {
          const p = pct(g.current, g.target);
          return (
            <li
              key={g.id}
              className="rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-purple-500/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2" title={g.label}>{g.label}</p>
                  {g.period ? (
                    <p className="text-xs text-gray-500">{g.period}</p>
                  ) : null}
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                    {Math.round(p)}%
                  </span>
                  <span className="text-xs text-gray-600">
                    {g.current} / {g.target}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden" aria-hidden>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                  style={{ width: `${p}%` }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(p)}
                  aria-label={`${g.label} completion`}
                />
              </div>
              <span className="sr-only">{g.label} {Math.round(p)}% complete</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
