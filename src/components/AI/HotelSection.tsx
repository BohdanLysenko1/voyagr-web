import { useState } from 'react';
import { Building, Star, ChevronDown, ChevronRight, Filter, Sparkles, MapPin, Award, DollarSign } from 'lucide-react';
import { Hotel } from '@/types/ai';
import StarrableItemComponent from './StarrableItem';

interface HotelSectionProps {
  hotels: Hotel[];
  onStarToggle: (id: number) => void;
}

export default function HotelSection({ hotels, onStarToggle }: HotelSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [aiRecommendations] = useState([
    { text: "Best value for money", icon: DollarSign, color: "text-green-600" },
    { text: "Highest rated nearby", icon: Award, color: "text-yellow-600" },
    { text: "Perfect location match", icon: MapPin, color: "text-blue-600" }
  ]);
  const starredHotels = hotels.filter(hotel => hotel.starred);

  const renderHotelContent = (hotel: Hotel) => (
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-800 tracking-wide truncate">{hotel.name}</p>
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium text-gray-500">{hotel.location}</p>
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <p className="text-xs font-medium text-amber-600">⭐ Top Rated</p>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 border border-white/50 hover:border-amber-200/60 backdrop-blur-sm hover:bg-gradient-to-r hover:from-white/90 hover:to-white/70 transition-all duration-500 shadow-sm hover:shadow-lg transform hover:scale-[1.01] group">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-4 flex-1"
        >
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200 transition-all duration-300 shadow-sm group-hover:shadow-md transform group-hover:scale-110">
            <Building className="w-6 h-6 text-amber-600 group-hover:text-amber-700 transition-colors duration-300 group-hover:scale-110" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 tracking-wide">AI Hotel Search</h2>
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 font-medium">Perfect accommodations</p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${showFilters ? 'bg-primary/20 text-primary shadow-md ring-2 ring-primary/20' : 'hover:bg-amber-100/50 text-gray-600 hover:text-amber-600'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl hover:bg-amber-100/50 text-gray-600 hover:text-amber-600 transition-all duration-300 transform hover:scale-110"
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
          {/* AI Hotel Recommendations */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              AI Hotel Recommendations
            </h4>
            <div className="space-y-2">
              {aiRecommendations.map((recommendation, index) => (
                <button 
                  key={index}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-all duration-300 group"
                >
                  <recommendation.icon className={`w-4 h-4 ${recommendation.color}`} />
                  <span className="text-xs text-gray-600 group-hover:text-gray-800">{recommendation.text}</span>
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
                  <span className="text-xs text-gray-600">Star Rating</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>3+ Stars</option>
                    <option>4+ Stars</option>
                    <option>5 Stars</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Price Range</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>Budget</option>
                    <option>Mid-range</option>
                    <option>Luxury</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Amenities</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>Pool</option>
                    <option>Spa</option>
                    <option>Business</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Starred Hotels */}
          {starredHotels.length > 0 && (
            <div className="pb-3 border-b border-gray-200/50">
              <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                Starred Hotels
              </p>
              {starredHotels.map(hotel => (
                <StarrableItemComponent
                  key={hotel.id}
                  item={hotel}
                  onStarToggle={onStarToggle}
                  renderContent={renderHotelContent}
                />
              ))}
            </div>
          )}
        
          {/* All Hotels */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Building className="w-4 h-4" />
              All Hotels
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {hotels.map(hotel => (
                <StarrableItemComponent
                  key={hotel.id}
                  item={hotel}
                  onStarToggle={onStarToggle}
                  renderContent={renderHotelContent}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
