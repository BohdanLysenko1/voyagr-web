type TabKey = 'plan' | 'chat' | 'preferences' | 'flights' | 'hotels' | 'restaurants' | 'mapout';

export interface TabContentConfig {
  title: string;
  description: string;
  placeholder: string;
  prompts: { text: string; emoji: string; color: string }[];
  gradientColors: string;
  accentColor: string;
}

export function getTabContent(activeTab: TabKey, suggestedPrompts?: (string | { text: string; emoji: string })[]): TabContentConfig {
  switch (activeTab) {
    case 'flights':
      return {
        title: 'Flight Search',
        description: 'Find the perfect flights for your journey',
        placeholder: '',
        prompts: [
          { text: 'Round-trip to London for 2 weeks', emoji: '🇬🇧', color: 'from-blue-400/20 to-indigo-400/20 hover:from-blue-400/30 hover:to-indigo-400/30 border-blue-300/40' },
          { text: 'Business class to Tokyo in March', emoji: '🛩️', color: 'from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40' },
          { text: 'Budget flights to Europe this summer', emoji: '💰', color: 'from-green-400/20 to-emerald-400/20 hover:from-green-400/30 hover:to-emerald-400/30 border-green-300/40' },
          { text: 'Multi-city trip: NYC → Paris → Rome', emoji: '🌍', color: 'from-orange-400/20 to-red-400/20 hover:from-orange-400/30 hover:to-red-400/30 border-orange-300/40' },
          { text: 'One-way ticket to Australia', emoji: '🦘', color: 'from-yellow-400/20 to-amber-400/20 hover:from-yellow-400/30 hover:to-amber-400/30 border-yellow-300/40' },
          { text: 'Weekend getaway to Miami', emoji: '🏖️', color: 'from-cyan-400/20 to-blue-400/20 hover:from-cyan-400/30 hover:to-blue-400/30 border-cyan-300/40' },
        ],
        gradientColors: 'from-blue-500/30 to-indigo-500/30',
        accentColor: 'text-blue-600'
      };
    case 'hotels':
      return {
        title: 'Hotel Search',
        description: 'Discover amazing accommodations for your stay',
        placeholder: '',
        prompts: [
          { text: 'Luxury resort in Maldives', emoji: '🏝️', color: 'from-teal-400/20 to-cyan-400/20 hover:from-teal-400/30 hover:to-cyan-400/30 border-teal-300/40' },
          { text: 'Boutique hotel in Paris', emoji: '🏨', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
          { text: 'Budget-friendly hostel in Bangkok', emoji: '💸', color: 'from-green-400/20 to-lime-400/20 hover:from-green-400/30 hover:to-lime-400/30 border-green-300/40' },
          { text: 'Ski resort in Swiss Alps', emoji: '⛷️', color: 'from-blue-400/20 to-slate-400/20 hover:from-blue-400/30 hover:to-slate-400/30 border-blue-300/40' },
          { text: 'Beachfront villa in Santorini', emoji: '🏖️', color: 'from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border-blue-300/40' },
          { text: 'Historic inn in Kyoto', emoji: '🏯', color: 'from-purple-400/20 to-indigo-400/20 hover:from-purple-400/30 hover:to-indigo-400/30 border-purple-300/40' },
        ],
        gradientColors: 'from-emerald-500/30 to-teal-500/30',
        accentColor: 'text-emerald-600'
      };
    case 'restaurants':
      return {
        title: 'Restaurant Finder',
        description: 'Discover amazing dining experiences worldwide',
        placeholder: '',
        prompts: [
          { text: 'Best sushi restaurants in Tokyo', emoji: '🍣', color: 'from-red-400/20 to-orange-400/20 hover:from-red-400/30 hover:to-orange-400/30 border-red-300/40' },
          { text: 'Romantic dinner spots in Paris', emoji: '🥂', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
          { text: 'Authentic Italian trattorias in Rome', emoji: '🍝', color: 'from-green-400/20 to-emerald-400/20 hover:from-green-400/30 hover:to-emerald-400/30 border-green-300/40' },
          { text: 'Michelin-starred restaurants in NYC', emoji: '⭐', color: 'from-yellow-400/20 to-amber-400/20 hover:from-yellow-400/30 hover:to-amber-400/30 border-amber-300/40' },
          { text: 'Vegetarian-friendly cafes in London', emoji: '🥗', color: 'from-green-400/20 to-lime-400/20 hover:from-green-400/30 hover:to-lime-400/30 border-green-300/40' },
          { text: 'Street food gems in Bangkok', emoji: '🍜', color: 'from-orange-400/20 to-red-400/20 hover:from-orange-400/30 hover:to-red-400/30 border-orange-300/40' },
        ],
        gradientColors: 'from-purple-500/30 to-violet-500/30',
        accentColor: 'text-purple-600'
      };
    case 'mapout':
      return {
        title: 'Map Out Planner',
        description: 'Create detailed day-by-day itineraries with optimal routing',
        placeholder: '',
        prompts: [
          { text: '5-day New York City itinerary', emoji: '🗽', color: 'from-blue-400/20 to-indigo-400/20 hover:from-blue-400/30 hover:to-indigo-400/30 border-blue-300/40' },
          { text: 'Weekend food tour in Paris', emoji: '🥐', color: 'from-amber-400/20 to-orange-400/20 hover:from-amber-400/30 hover:to-orange-400/30 border-amber-300/40' },
          { text: 'Cultural exploration of Rome', emoji: '🏛️', color: 'from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40' },
          { text: 'Island hopping in Greece', emoji: '🏝️', color: 'from-cyan-400/20 to-blue-400/20 hover:from-cyan-400/30 hover:to-blue-400/30 border-cyan-300/40' },
          { text: 'Adventure route through Iceland', emoji: '🌋', color: 'from-slate-400/20 to-gray-400/20 hover:from-slate-400/30 hover:to-gray-400/30 border-slate-300/40' },
          { text: 'Cherry blossom tour in Japan', emoji: '🌸', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
        ],
        gradientColors: 'from-emerald-500/30 to-cyan-500/30',
        accentColor: 'text-emerald-600'
      };
    default: // 'plan'
      return {
        title: 'Voyagr',
        description: 'Plan your perfect trip with assistance',
        placeholder: '',
        prompts: [
          { text: "Romantic weekend in Paris", emoji: "💕", color: "from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40" },
          { text: "Adventure trip to New Zealand", emoji: "🏔️", color: "from-emerald-400/20 to-green-400/20 hover:from-emerald-400/30 hover:to-green-400/30 border-emerald-300/40" },
          { text: "Food tour through Italy", emoji: "🍝", color: "from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/30 hover:to-orange-400/30 border-yellow-300/40" },
          { text: "Beach relaxation in Maldives", emoji: "🏝️", color: "from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border-blue-300/40" },
          { text: "Cultural exploration in Japan", emoji: "🏯", color: "from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40" },
          { text: "Safari adventure in Kenya", emoji: "🦁", color: "from-amber-400/20 to-yellow-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 border-amber-300/40" },
        ],
        gradientColors: 'from-primary/30 to-purple-500/30',
        accentColor: 'text-primary'
      };
  }
}
