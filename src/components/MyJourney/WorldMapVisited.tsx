"use client";

import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

export type WorldMapVisitedProps = {
  visitedCountries?: string[]; // country names matching topojson properties.name
  wishlistCountries?: string[];
  className?: string;
};

// Using world-atlas countries TopoJSON that includes properties.name; reliable CDN
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMapVisited({
  visitedCountries = [],
  wishlistCountries = [],
  className,
}: WorldMapVisitedProps) {
  // Normalize and map common synonyms to improve matching against TopoJSON country names
  const normalize = React.useCallback((name: string) => {
    const lower = name.trim().toLowerCase();
    const synonyms: Record<string, string> = {
      "united states": "united states of america",
      "usa": "united states of america",
      "uk": "united kingdom",
      "south korea": "korea, republic of",
      "north korea": "korea, democratic people's republic of",
      "russia": "russian federation",
      "czech republic": "czechia",
      "ivory coast": "côte d'ivoire",
      "cape verde": "cabo verde",
      "laos": "lao people's democratic republic",
      "moldova": "moldova, republic of",
      "tanzania": "tanzania, united republic of",
      "iran": "iran, islamic republic of",
      "syria": "syrian arab republic",
      "bolivia": "bolivia (plurinational state of)",
      "venezuela": "venezuela (bolivarian republic of)",
      "brunei": "brunei darussalam",
      "palestine": "palestine, state of",
    };
    const canonical = synonyms[lower] ?? lower;
    // remove accents and punctuation to be defensive
    return canonical
      .normalize("NFD")
      .replace(/[\u0300-\u036f]+/g, "")
      .replace(/[.'’()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const visited = React.useMemo(() => new Set(visitedCountries.map((n) => normalize(n))), [visitedCountries, normalize]);
  const wishlist = React.useMemo(() => new Set(wishlistCountries.map((n) => normalize(n))), [wishlistCountries, normalize]);

  return (
    <section className={`rounded-2xl border border-blue-100 bg-white/70 p-6 shadow-sm ${className ?? ""}`}>
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Visited World Map</h2>
      </header>
      <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white p-2">
        <ComposableMap projectionConfig={{ scale: 145 }} style={{ width: "100%", height: "auto" }} aria-label="Visited world map">
          <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: unknown[] }) => {
                if (!geographies || geographies.length === 0) {
                  return (
                    <g>
                      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={12} fill="#9ca3af">
                        Loading map...
                      </text>
                    </g>
                  );
                }
                return geographies.map((geo) => {
                  type Geo = { rsmKey: string; properties?: Record<string, unknown> };
                  const g = geo as Geo;
                  const raw = g.properties || {};
                  const name = (
                    (raw["name"] as string | undefined) ||
                    (raw["NAME"] as string | undefined) ||
                    (raw["NAME_EN"] as string | undefined) ||
                    (raw["ADMIN"] as string | undefined) ||
                    (raw["NAME_LONG"] as string | undefined)
                  );
                  const normalizedName = name ? normalize(name) : undefined;
                  const isVisited = !!normalizedName && visited.has(normalizedName);
                  const isWish = !!normalizedName && wishlist.has(normalizedName);
                  const fill = isVisited
                    ? "#60a5fa"
                    : isWish
                    ? "#fde68a"
                    : "#e5e7eb";
                  const stroke = isVisited ? "#2563eb" : "#cbd5e1";
                  return (
                    <Geography
                      key={g.rsmKey}
                      geography={g}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: isVisited ? "#3b82f6" : "#f3f4f6" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                });
              }}
            </Geographies>
        </ComposableMap>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-blue-400 border border-blue-600" /> Visited</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-amber-200 border border-amber-400" /> Wishlist</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-gray-200 border border-slate-300" /> Not visited</span>
      </div>
    </section>
  );
}
