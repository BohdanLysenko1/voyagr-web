"use client";

import React from "react";
import CircularProgress from "./CircularProgress";
import { Award, CheckCircle2 } from "lucide-react";

export type Milestone = {
  id: string;
  title: string;
  description?: string;
  progress: number; // 0-100
  earned?: boolean;
  icon?: React.ReactNode;
};

type Props = {
  items: Milestone[];
  className?: string;
};

/**
 * Milestones & Badges grid with compact circular progress and optional icons.
 */
export default function MilestonesSection({ items, className }: Props) {
  const earnedCount = items.filter((i) => i.earned).length;

  const clamp = (v: number) => {
    if (Number.isNaN(v)) return 0;
    return Math.max(0, Math.min(100, v));
  };

  return (
    <section
      className={`rounded-2xl border border-blue-100 bg-white/70 p-6 shadow-sm ${className ?? ""}`}
      aria-labelledby="milestones-heading"
    >
      <header className="mb-5 flex items-center justify-between">
        <h2 id="milestones-heading" className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-500" aria-hidden />
          Milestones & Badges
        </h2>
        <p className="text-xs text-gray-600">
          <span className="font-medium text-gray-900">{earnedCount}</span> earned • {items.length} total
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {items.map((m) => {
          const progress = clamp(m.progress);
          const earned = Boolean(m.earned);
          return (
            <article
              key={m.id}
              className={`relative flex items-center gap-4 rounded-xl p-4 border transition-all shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50 hover:shadow-md ${
                earned ? "bg-green-50/70 border-green-100" : "bg-white border-gray-100"
              }`}
              aria-label={`${m.title} ${progress}%`}
            >
              {/* Earned badge */}
              {earned ? (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium text-green-800 shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  Earned
                </div>
              ) : null}

              <div className="relative" style={{ width: 56, height: 56 }}>
                <CircularProgress
                  percent={progress}
                  size={56}
                  strokeWidth={8}
                  from={earned ? "#34d399" : "#93c5fd"}
                  to={earned ? "#059669" : "#3b82f6"}
                  trackColor="transparent"
                  ariaLabel={`${m.title} progress ${progress}%`}
                />
                {m.icon ? (
                  <div className="absolute inset-[10px] rounded-full bg-white/90 flex items-center justify-center text-gray-700">
                    {m.icon}
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2" title={m.title}>
                  {m.title}
                </h3>
                {m.description ? (
                  <p className="text-xs text-gray-600 leading-snug line-clamp-2" title={m.description}>
                    {m.description}
                  </p>
                ) : null}
                <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      earned
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                        : "bg-gradient-to-r from-blue-400 to-blue-600"
                    }`}
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                    aria-label={`${m.title} completion`}
                  />
                </div>
                <span className="sr-only">{Math.round(progress)}% complete</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
