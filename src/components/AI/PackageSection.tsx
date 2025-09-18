import { useState, useCallback, useMemo } from 'react';
import { Map, Heart, ChevronDown, ChevronRight, Filter, Sparkles, Users, Calendar, Compass, Plus } from 'lucide-react';
import { Package } from '@/types/ai';
import HeartableItemComponent from './HeartableItem';

interface PackageSectionProps {
  packages: Package[];
  onHeartToggle: (id: number) => void;
  onNewTrip?: () => void;
}

export default function PackageSection({ packages, onHeartToggle, onNewTrip }: PackageSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const aiPersonalizedPackages = useMemo(() => [
    { text: "Perfect for couples", icon: Users, color: "text-pink-600" },
    { text: "Best seasonal timing", icon: Calendar, color: "text-blue-600" },
    { text: "Adventure match", icon: Compass, color: "text-orange-600" }
  ], []);
  
  const heartedPackages = useMemo(() => packages.filter(pkg => pkg.hearted), [packages]);

  const renderPackageContent = useCallback((pkg: Package) => (
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-800 tracking-wide">{pkg.name}</p>
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium text-gray-500">{pkg.duration}</p>
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <p className="text-xs font-medium text-purple-600">🎁 Best Deal</p>
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
          <Map className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">AI Package Deals</h2>
      </div>
      
      <div className="flex items-center justify-between w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 border border-white/50 hover:border-purple-200/60 backdrop-blur-sm hover:bg-gradient-to-r hover:from-white/90 hover:to-white/70 transition-all duration-500 shadow-sm hover:shadow-lg transform hover:scale-[1.01] group">
        <button 
          onClick={handleExpandToggle}
          className="flex items-center gap-4 flex-1"
        >
          <div className="text-left">
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 font-medium">Complete travel packages</p>
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
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-500/90 to-fuchsia-500/90 hover:from-purple-400 hover:to-fuchsia-400 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 group mb-6"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="tracking-wide font-medium">New Trip</span>
            </button>
          )}

          {/* AI Personalized Packages */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI Personalized Packages
            </h4>
            <div className="space-y-2">
              {aiPersonalizedPackages.map((packageType, index) => (
                <button 
                  key={index}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-all duration-300 group"
                >
                  <packageType.icon className={`w-4 h-4 ${packageType.color}`} />
                  <span className="text-xs text-gray-600 group-hover:text-gray-800">{packageType.text}</span>
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
                  <span className="text-xs text-gray-600">Trip Type</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>Adventure</option>
                    <option>Relaxation</option>
                    <option>Cultural</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Duration</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>Weekend</option>
                    <option>1 Week</option>
                    <option>2+ Weeks</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Group Size</span>
                  <select className="text-xs bg-white/80 border border-gray-200 rounded px-2 py-1">
                    <option>Any</option>
                    <option>Solo</option>
                    <option>Couple</option>
                    <option>Family</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Hearted Packages */}
          {heartedPackages.length > 0 && (
            <div className="pb-3 border-b border-gray-200/50">
              <p className="text-sm font-semibold text-rose-600 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 fill-current" />
                Favorite Packages
              </p>
              {heartedPackages.map(pkg => (
                <HeartableItemComponent
                  key={pkg.id}
                  item={pkg}
                  onHeartToggle={onHeartToggle}
                  renderContent={renderPackageContent}
                />
              ))}
            </div>
          )}
        
          {/* All Packages */}
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Map className="w-4 h-4" />
              All Packages
            </p>
            {packages.map(pkg => (
              <HeartableItemComponent
                key={pkg.id}
                item={pkg}
                onHeartToggle={onHeartToggle}
                renderContent={renderPackageContent}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
