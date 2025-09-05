import { useState } from 'react';
import { Map, Star, ChevronDown, ChevronRight, Filter, Sparkles, Users, Calendar, Compass } from 'lucide-react';
import { Package } from '@/types/ai';
import StarrableItemComponent from './StarrableItem';

interface PackageSectionProps {
  packages: Package[];
  onStarToggle: (id: number) => void;
}

export default function PackageSection({ packages, onStarToggle }: PackageSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [aiPersonalizedPackages] = useState([
    { text: "Perfect for couples", icon: Users, color: "text-pink-600" },
    { text: "Best seasonal timing", icon: Calendar, color: "text-blue-600" },
    { text: "Adventure match", icon: Compass, color: "text-orange-600" }
  ]);
  const starredPackages = packages.filter(pkg => pkg.starred);

  const renderPackageContent = (pkg: Package) => (
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-800 tracking-wide">{pkg.name}</p>
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium text-gray-500">{pkg.duration}</p>
        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        <p className="text-xs font-medium text-purple-600">🎁 Best Deal</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 border border-white/50 hover:border-purple-200/60 backdrop-blur-sm hover:bg-gradient-to-r hover:from-white/90 hover:to-white/70 transition-all duration-500 shadow-sm hover:shadow-lg transform hover:scale-[1.01] group">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-4 flex-1"
        >
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300 shadow-sm group-hover:shadow-md transform group-hover:scale-110">
            <Map className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-300 group-hover:rotate-12" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 tracking-wide">AI Package Deals</h2>
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 font-medium">Complete travel packages</p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${showFilters ? 'bg-primary/20 text-primary shadow-md ring-2 ring-primary/20' : 'hover:bg-purple-100/50 text-gray-600 hover:text-purple-600'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
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

          {/* Starred Packages */}
          {starredPackages.length > 0 && (
            <div className="pb-3 border-b border-gray-200/50">
              <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                Starred Packages
              </p>
              {starredPackages.map(pkg => (
                <StarrableItemComponent
                  key={pkg.id}
                  item={pkg}
                  onStarToggle={onStarToggle}
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
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {packages.map(pkg => (
                <StarrableItemComponent
                  key={pkg.id}
                  item={pkg}
                  onStarToggle={onStarToggle}
                  renderContent={renderPackageContent}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
