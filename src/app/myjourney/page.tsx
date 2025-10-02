import JourneyCard from "@/components/MyJourney/JourneyCard";
import MilestonesSection from "@/components/MyJourney/MilestonesSection";
import GoalsSection from "@/components/MyJourney/GoalsSection";
import WorldMapVisited from "@/components/MyJourney/WorldMapVisited";
import type { Milestone } from "@/components/MyJourney/MilestonesSection";
import type { Goal } from "@/components/MyJourney/GoalsSection";
import { Trophy, Award, Globe2, Plane, Crown, Flag } from "lucide-react";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

type Item = {
  title: string;
  src: string;
  percent: number;
  ringFrom?: string;
  ringTo?: string;
  href?: string;
};

const items: Item[] = [
  { title: "Voyagr", src: "/images/MyJourneyPage/Voyagr.png", percent: 28, ringFrom: "#b45309", ringTo: "#f59e0b", href: "/profile" }, // amber/orange
  { title: "North America", src: "/images/MyJourneyPage/NorthAmerica.png", percent: 72, href: "/continents/north-america" },
  { title: "Europe", src: "/images/MyJourneyPage/Europe.png", percent: 32, href: "/continents/europe" },
  { title: "Africa", src: "/images/MyJourneyPage/Africa.png", percent: 68, href: "/continents/africa" },
  { title: "South America", src: "/images/MyJourneyPage/SouthAmerica.png", percent: 24, href: "/continents/south-america" },
  { title: "Asia", src: "/images/MyJourneyPage/Asia.png", percent: 70, href: "/continents/asia" },
  { title: "Australia", src: "/images/MyJourneyPage/Australia.png", percent: 45, href: "/continents/australia" },
  { title: "Antarctica", src: "/images/MyJourneyPage/Antarctica.png", percent: 12, href: "/continents/antarctica" },
];

// Mock journey data (replace with real data later)
const milestones: Milestone[] = [
  { id: "m1", title: "First 5 Countries", description: "A great start!", progress: 80, earned: false, icon: <Flag className="h-4 w-4" /> },
  { id: "m2", title: "All of Europe", description: "Visit 44 countries", progress: 25, earned: false, icon: <Globe2 className="h-4 w-4" /> },
  { id: "m3", title: "3 Trips in a Month", description: "Jetsetter mode", progress: 100, earned: true, icon: <Trophy className="h-4 w-4" /> },
  { id: "m4", title: "7 Wonders Seen", description: "Bucket list", progress: 43, earned: false, icon: <Award className="h-4 w-4" /> },
  { id: "m5", title: "All 7 Continents", description: "World explorer", progress: 14, earned: false, icon: <Crown className="h-4 w-4" /> },
  { id: "m6", title: "100k Air Miles", description: "Frequent flyer", progress: 62, earned: false, icon: <Plane className="h-4 w-4" /> },
];

const goals: Goal[] = [
  { id: "g1", label: "Countries this year", current: 6, target: 12, period: "2025" },
  { id: "g2", label: "Cities this year", current: 14, target: 25, period: "2025" },
  { id: "g3", label: "Days traveled", current: 22, target: 45, period: "This year" },
];

const visitedCountries: string[] = [
  "United States",
  "Canada",
  "Mexico",
  "France",
  "Spain",
  "Portugal",
  "Morocco",
  "Japan",
];

const wishlistCountries: string[] = ["Italy", "Greece", "Iceland", "New Zealand"];

export default function MyJourneyPage() {
  return (
    <ProtectedRoute>
      <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Your Journey</h1>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 place-items-center">
          {items.map((it) => (
            <JourneyCard
              key={it.title}
              title={it.title}
              imgSrc={it.src}
              percent={it.percent}
              ringFrom={it.ringFrom}
              ringTo={it.ringTo}
              href={it.href}
            />
          ))}
        </div>
      </section>

      {/* New content sections */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MilestonesSection items={milestones} />
        <GoalsSection items={goals} />
      </div>

      <div className="mt-8">
        <WorldMapVisited
          visitedCountries={visitedCountries}
          wishlistCountries={wishlistCountries}
        />
      </div>
      </main>
    </ProtectedRoute>
  );
}
