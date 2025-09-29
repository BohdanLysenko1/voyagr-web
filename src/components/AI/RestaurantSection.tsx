import { useState, useCallback, useMemo } from 'react';
import { UtensilsCrossed, Heart, ChevronDown, ChevronRight, Filter, Sparkles, Users, Calendar, MapPin, Plus } from 'lucide-react';
import { Restaurant } from '@/types/ai';
import HeartableItemComponent from './HeartableItem';

export interface RestaurantSectionProps {
  restaurants: Restaurant[];
  onHeartToggle: (id: number) => void;
  onNewTrip?: () => void;
}

export default function RestaurantSection({ restaurants, onHeartToggle, onNewTrip }: RestaurantSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const aiPersonalizedRestaurants = useMemo(() => [
    { text: "Perfect for couples", icon: Users, color: "text-pink-600" },
    { text: "Best dining hours", icon: Calendar, color: "text-blue-600" },
    { text: "Local favorites", icon: MapPin, color: "text-orange-600" }
  ], []);
  
  const heartedRestaurants = useMemo(() => restaurants.filter(restaurant => restaurant.hearted), [restaurants]);

  const renderRestaurantContent = useCallback((restaurant: Restaurant) => (
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-800 tracking-wide">{restaurant.name}</p>
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium text-gray-500">{restaurant.cuisine}</p>
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <p className="text-xs font-medium text-gray-500">{restaurant.location}</p>
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <p className="text-xs font-medium text-orange-600">🍽️ Recommended</p>
      </div>
    </div>
  ), []);

  const handleExpandToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleFiltersToggle = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20">
          <UtensilsCrossed className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Restaurant Search</h2>
      </div>
      
      <div className="flex items-center justify-between w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 border border-white/50 hover:border-purple-200/60 backdrop-blur-sm hover:bg-gradient-to-r hover:from-white/90 hover:to-white/70 transition-all duration-500 shadow-sm hover:shadow-lg transform hover:scale-[1.01] group">
        <button 
          onClick={handleExpandToggle}
          className="flex items-center gap-4 flex-1"
        >
          <div className="text-left">
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 font-medium">Amazing dining experiences</p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleFiltersToggle}
            className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${showFilters ? 'bg-primary/20 text-primary shadow-md ring-2 ring-primary/20' : 'hover:bg-purple-100/50 text-gray-600 hover:text-purple-600'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={handleExpandToggle}
            className="p-2 rounded-xl hover:bg-purple-100/50 text-gray-600 hover:text-purple-600 transition-all duration-300 transform hover:scale-110"
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
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/90 to-purple-500/90 hover:from-primary/80 hover:to-purple-500/80 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 group mb-6"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="tracking-wide font-medium">New Trip</span>
            </button>
          )}

          {/* AI Personalized Restaurants */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI Personalized Restaurants
            </h4>
            <div className="space-y-2">
              {aiPersonalizedRestaurants.map((restaurantType, index) => (
                <button 
                  key={index}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-all duration-300 group"
                >
                  <restaurantType.icon className={`w-4 h-4 ${restaurantType.color}`} />
                  <span className="text-xs text-gray-600 group-hover:text-gray-800">{restaurantType.text}</span>
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
                  <span className="text-xs text-gray-600">Cuisine Type</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>Italian</option>
                    <option>French</option>
                    <option>Japanese</option>
                    <option>American</option>
                    <option>Chinese</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Price Range</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>$ Budget</option>
                    <option>$$ Moderate</option>
                    <option>$$$ Upscale</option>
                    <option>$$$$ Fine Dining</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Occasion</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>Casual</option>
                    <option>Date Night</option>
                    <option>Business</option>
                    <option>Celebration</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Hearted Restaurants */}
          {heartedRestaurants.length > 0 && (
            <div className="pb-3 border-b border-gray-200/50">
              <p className="text-sm font-semibold text-rose-600 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 fill-current" />
                Favorite Restaurants
              </p>
              {heartedRestaurants.map(restaurant => (
                <HeartableItemComponent
                  key={restaurant.id}
                  item={restaurant}
                  onHeartToggle={onHeartToggle}
                  renderContent={renderRestaurantContent}
                />
              ))}
            </div>
          )}
        
          {/* All Restaurants */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              All Restaurants
            </p>
            {restaurants.map(restaurant => (
              <HeartableItemComponent
                key={restaurant.id}
                item={restaurant}
                onHeartToggle={onHeartToggle}
                renderContent={renderRestaurantContent}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
