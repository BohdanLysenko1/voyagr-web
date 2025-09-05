import { Search, Plus, Sparkles, Filter, Settings, Clock } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { useState } from 'react';

interface SearchTripsSectionProps {
  onNewTrip?: () => void;
}

export default function SearchTripsSection({ onNewTrip }: SearchTripsSectionProps) {
  const [recentSearches] = useState([
    "Beach vacation in Thailand",
    "European city break",
    "Mountain adventure in Switzerland"
  ]);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);


  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">AI Trip Planner</h2>
      </div>
      
      {/* Main Action Button */}
      <button 
        onClick={() => {
          setIsCreatingTrip(true);
          setTimeout(() => {
            setIsCreatingTrip(false);
            onNewTrip?.();
          }, 1500);
        }}
        disabled={isCreatingTrip}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-4 
          bg-gradient-to-r from-primary to-purple-600 
          hover:from-primary/95 hover:to-purple-600/95
          text-white rounded-xl font-semibold text-base
          transition-all duration-300 ease-out
          shadow-lg shadow-primary/25 
          hover:shadow-xl hover:shadow-primary/35
          transform hover:scale-[1.01] hover:-translate-y-0.5 
          active:scale-[0.99] active:translate-y-0
          border border-white/10
          backdrop-blur-sm
          mb-6 group relative overflow-hidden
          ${isCreatingTrip ? 'opacity-80 cursor-not-allowed' : ''}
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/5 before:to-white/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
        `}
      >
        {isCreatingTrip ? (
          <>
            <LoadingSpinner size="sm" color="text-white" />
            <span className="tracking-wide">Creating Trip...</span>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <span className="tracking-wide font-medium">New AI Trip</span>
          </>
        )}
      </button>


      {/* Recent Searches */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">Recent AI Conversations</h3>
        </div>
        <div className="space-y-3">
          {recentSearches.map((search, index) => (
            <button 
              key={index}
              className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-white/70 to-white/50 hover:from-white/90 hover:to-white/70 border border-gray-200/40 hover:border-primary/40 backdrop-blur-sm transition-all duration-300 group transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors truncate leading-relaxed">
                    {search}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600 mt-1.5 font-medium">
                    {index === 0 ? "2 mins ago" : index === 1 ? "1 hour ago" : "3 hours ago"}
                  </p>
                </div>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
