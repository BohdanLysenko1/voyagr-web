import { Search, Clock, Plus } from 'lucide-react';
import { useCallback } from 'react';

interface RecentConversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface SearchTripsSectionProps {
  onNewTrip?: () => void;
  recentConversations?: RecentConversation[];
  onConversationSelect?: (conversation: RecentConversation) => void;
}

export default function SearchTripsSection({ 
  onNewTrip, 
  recentConversations,
  onConversationSelect 
}: SearchTripsSectionProps) {

  const getTimeAgo = useCallback((timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  }, []);


  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Trip Planner</h2>
      </div>
      
      {/* New Trip Button */}
      {onNewTrip && (
        <button
          onClick={onNewTrip}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 group mb-6"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          </div>
          <span className="tracking-wide font-medium">New Trip</span>
        </button>
      )}

      {/* Recent Conversations */}
      {recentConversations && recentConversations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">Recent Conversations</h3>
          </div>
          <div className="space-y-3">
            {recentConversations.map((conversation) => (
              <button 
                key={conversation.id}
                onClick={() => onConversationSelect?.(conversation)}
                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-white/70 to-white/50 hover:from-white/90 hover:to-white/70 border border-gray-200/40 hover:border-primary/40 backdrop-blur-sm transition-all duration-300 group transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors truncate leading-relaxed">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600 mt-1.5 font-medium">
                      {getTimeAgo(conversation.timestamp)}
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
      )}
    </div>
  );
}
