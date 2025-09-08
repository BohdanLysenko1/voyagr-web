import { useState } from 'react';
import { Plane, Heart, ChevronDown, ChevronRight, Filter, Sparkles, TrendingUp, Clock, Plus } from 'lucide-react';
import { Flight } from '@/types/ai';
import HeartableItemComponent from './HeartableItem';

interface FlightSectionProps {
  flights: Flight[];
  onHeartToggle: (id: number) => void;
  onNewTrip?: () => void;
}

export default function FlightSection({ flights, onHeartToggle, onNewTrip }: FlightSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [aiSuggestions] = useState([
    { text: "Best deals this week", icon: TrendingUp, color: "text-green-600" },
    { text: "Last-minute flights", icon: Clock, color: "text-orange-600" },
    { text: "AI recommendations", icon: Sparkles, color: "text-purple-600" }
  ]);
  const heartedFlights = flights.filter(flight => flight.hearted);

  const renderFlightContent = (flight: Flight) => (
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-800 tracking-wide">{flight.route}</p>
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium text-gray-500">{flight.date}</p>
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <p className="text-xs font-medium text-primary">AI Recommended</p>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 border border-white/50 hover:border-blue-200/60 backdrop-blur-sm hover:bg-gradient-to-r hover:from-white/90 hover:to-white/70 transition-all duration-500 shadow-sm hover:shadow-lg transform hover:scale-[1.01] group">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-4 flex-1"
        >
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 group-hover:from-blue-200 group-hover:to-sky-200 transition-all duration-300 shadow-sm group-hover:shadow-md transform group-hover:scale-110">
            <Plane className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300 group-hover:rotate-12" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 tracking-wide">AI Flight Search</h2>
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 font-medium">Smart recommendations</p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${showFilters ? 'bg-primary/20 text-primary shadow-md ring-2 ring-primary/20' : 'hover:bg-blue-100/50 text-gray-600 hover:text-blue-600'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl hover:bg-blue-100/50 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
          >
            {isExpanded ? (
              <ChevronDown className="w-6 h-6 transition-transform duration-300" />
            ) : (
              <ChevronRight className="w-6 h-6 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          {/* New Trip Button */}
          {onNewTrip && (
            <button
              onClick={onNewTrip}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 group mb-6"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="tracking-wide font-medium">New Trip</span>
            </button>
          )}

          {/* AI Smart Suggestions */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              AI Flight Insights
            </h4>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <button 
                  key={index}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-all duration-300 group"
                >
                  <suggestion.icon className={`w-4 h-4 ${suggestion.color}`} />
                  <span className="text-xs text-gray-600 group-hover:text-gray-800">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Smart Filters */}
          {showFilters && (
            <div className="bg-white/50 p-3 rounded-lg border border-gray-200 animate-in slide-in-from-top-1 duration-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Smart Filters</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Price Range</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>Budget</option>
                    <option>Premium</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Duration</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>Direct</option>
                    <option>1 Stop</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Hearted Flights */}
          {heartedFlights.length > 0 && (
            <div className="pb-3 border-b border-gray-200/50">
              <p className="text-sm font-semibold text-rose-600 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 fill-current" />
                Favorite Flights
              </p>
              {heartedFlights.map(flight => (
                <HeartableItemComponent
                  key={flight.id}
                  item={flight}
                  onHeartToggle={onHeartToggle}
                  renderContent={renderFlightContent}
                />
              ))}
            </div>
          )}
        
          {/* All Flights */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Plane className="w-4 h-4" />
              All Flights
            </p>
            {flights.map(flight => (
              <HeartableItemComponent
                key={flight.id}
                item={flight}
                onHeartToggle={onHeartToggle}
                renderContent={renderFlightContent}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
