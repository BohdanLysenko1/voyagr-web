import { useState, useCallback, useMemo } from 'react';
import { MapPin, Clock, Calendar, ArrowRight, Route, Navigation } from 'lucide-react';

interface MapOutSectionProps {
  onNewTrip?: () => void;
}

interface MapOutItem {
  id: number;
  day: number;
  location: string;
  activity: string;
  time: string;
  duration: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'activity' | 'transport';
}

const SAMPLE_MAPOUT_ITEMS: MapOutItem[] = [
  {
    id: 1,
    day: 1,
    location: 'Times Square',
    activity: 'Arrival & Check-in',
    time: '10:00 AM',
    duration: '2h',
    type: 'hotel'
  },
  {
    id: 2,
    day: 1,
    location: 'Central Park',
    activity: 'Morning Walk & Photos',
    time: '1:00 PM',
    duration: '3h',
    type: 'attraction'
  },
  {
    id: 3,
    day: 1,
    location: 'Little Italy',
    activity: 'Authentic Italian Dinner',
    time: '7:00 PM',
    duration: '2h',
    type: 'restaurant'
  },
  {
    id: 4,
    day: 2,
    location: 'Statue of Liberty',
    activity: 'Ferry Tour & Sightseeing',
    time: '9:00 AM',
    duration: '4h',
    type: 'attraction'
  },
  {
    id: 5,
    day: 2,
    location: 'Brooklyn Bridge',
    activity: 'Sunset Walk',
    time: '6:00 PM',
    duration: '1.5h',
    type: 'activity'
  }
];


export default function MapOutSection({ onNewTrip }: MapOutSectionProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  const getTypeColor = useCallback((type: MapOutItem['type']) => {
    switch (type) {
      case 'attraction': return 'from-blue-500 to-cyan-500';
      case 'restaurant': return 'from-orange-500 to-red-500';
      case 'hotel': return 'from-purple-500 to-pink-500';
      case 'activity': return 'from-green-500 to-emerald-500';
      case 'transport': return 'from-gray-500 to-slate-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  }, []);

  const getTypeIcon = useCallback((type: MapOutItem['type']) => {
    switch (type) {
      case 'attraction': return MapPin;
      case 'restaurant': return Clock;
      case 'hotel': return Calendar;
      case 'activity': return Navigation;
      case 'transport': return Route;
      default: return MapPin;
    }
  }, []);
  
  const days = useMemo(() => Array.from(new Set(SAMPLE_MAPOUT_ITEMS.map(item => item.day))).sort(), []);
  const filteredItems = useMemo(() => selectedDay 
    ? SAMPLE_MAPOUT_ITEMS.filter(item => item.day === selectedDay)
    : SAMPLE_MAPOUT_ITEMS, [selectedDay]);

  const handleDaySelect = useCallback((day: number | null) => {
    setSelectedDay(day);
  }, []);

  const handleAllDaysClick = useCallback(() => {
    setSelectedDay(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Map Out</h2>
      </div>
      
      {/* Header */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Visualize your day-by-day itinerary with optimal routing and timing
        </p>
      </div>

      {/* Day Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={handleAllDaysClick}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedDay === null
              ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200'
              : 'bg-white/60 text-gray-600 hover:bg-white/80'
          }`}
        >
          All Days
        </button>
        {days.map(day => (
          <button
            key={day}
            onClick={() => handleDaySelect(day)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedDay === day
                ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>

      {/* Map Out Items */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          const Icon = getTypeIcon(item.type);
          const isLastItem = index === filteredItems.length - 1;
          
          return (
            <div key={item.id} className="relative">
              {/* Timeline connector */}
              {!isLastItem && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-blue-200 to-blue-100 z-0"></div>
              )}
              
              {/* Item card */}
              <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white/80">
                <div className="flex items-start gap-4">
                  {/* Day badge & Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-700">
                      {item.day}
                    </div>
                    <div className={`w-10 h-10 bg-gradient-to-br ${getTypeColor(item.type)} rounded-xl flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{item.activity}</h4>
                        <p className="text-gray-600 text-xs mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </p>
                      </div>
                    </div>
                    
                    {/* Time info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.duration}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action button */}
                  <button className="flex-shrink-0 p-2 rounded-lg bg-white/60 hover:bg-white/80 text-gray-600 hover:text-blue-600 transition-all duration-200 border border-white/40">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="pt-4 space-y-3">
        <button
          onClick={onNewTrip}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-400 hover:to-lime-400 text-white rounded-2xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm border border-white/20"
        >
          Create New Itinerary
        </button>
        
        <button className="w-full py-2.5 px-4 bg-white/60 hover:bg-white/80 text-gray-700 rounded-xl font-medium text-sm border border-white/40 transition-all duration-200 backdrop-blur-sm">
          Optimize Route
        </button>
      </div>
    </div>
  );
}
