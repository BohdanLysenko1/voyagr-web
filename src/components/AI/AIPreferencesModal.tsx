'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AIPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: any) => void;
}

export default function AIPreferencesModal({ isOpen, onClose, onSave }: AIPreferencesModalProps) {
  const [travelStyle, setTravelStyle] = useState('');
  const [budget, setBudget] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [activities, setActivities] = useState<string[]>([]);

  if (!isOpen) return null;

  const travelStyles = [
    { id: 'luxury', label: 'Luxury', desc: 'Premium experiences and accommodations' },
    { id: 'budget', label: 'Budget-Friendly', desc: 'Great value without compromising fun' },
    { id: 'adventure', label: 'Adventure', desc: 'Outdoor activities and exploration' },
    { id: 'family', label: 'Family-Friendly', desc: 'Safe and enjoyable for all ages' },
    { id: 'romantic', label: 'Romantic', desc: 'Perfect for couples and special occasions' },
    { id: 'business', label: 'Business', desc: 'Efficient travel with professional needs' },
  ];

  const budgetRanges = [
    { id: 'under-500', label: 'Under $500', desc: 'Budget-conscious travel' },
    { id: '500-1000', label: '$500 - $1,000', desc: 'Mid-range comfort' },
    { id: '1000-2500', label: '$1,000 - $2,500', desc: 'Premium experiences' },
    { id: '2500-plus', label: '$2,500+', desc: 'Luxury without limits' },
  ];

  const activityOptions = [
    'Museums & Culture',
    'Nightlife & Entertainment',
    'Nature & Hiking',
    'Food & Dining',
    'Shopping',
    'Beaches',
    'Historical Sites',
    'Art & Architecture',
    'Sports & Adventure',
    'Relaxation & Spa',
  ];

  const toggleActivity = (activity: string) => {
    setActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSave = () => {
    const preferences = { travelStyle, budget, groupSize, activities };
    onSave(preferences);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-4 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 sm:mb-8">
            <div className="flex-1 pr-2">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Customize Your Trip Preferences</h2>
              <p className="text-sm sm:text-base text-gray-600">Tell us about your travel style to get personalized AI recommendations</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </button>
          </div>

          {/* Travel Style */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">What's your travel style?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {travelStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setTravelStyle(style.id)}
                  className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    travelStyle === style.id
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-800 text-sm sm:text-base">{style.label}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">What's your budget range?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {budgetRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setBudget(range.id)}
                  className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    budget === range.id
                      ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-800 text-sm sm:text-base">{range.label}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">{range.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Group Size */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">How many people are traveling?</h3>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {['Solo', '2 People', '3-4 People', '5+ People'].map((size) => (
                <button
                  key={size}
                  onClick={() => setGroupSize(size)}
                  className={`px-3 py-2 sm:px-6 sm:py-3 rounded-xl border-2 font-medium transition-all duration-200 text-xs sm:text-base ${
                    groupSize === size
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">What activities interest you? (Select all that apply)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {activityOptions.map((activity) => (
                <button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`px-2 py-2 sm:px-4 sm:py-3 rounded-xl border-2 text-center sm:text-left font-medium transition-all duration-200 text-xs sm:text-sm ${
                    activities.includes(activity)
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-3 sm:px-6 sm:py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-medium hover:from-primary/90 hover:to-purple-600/90 transition-all duration-200 shadow-lg text-sm sm:text-base order-1 sm:order-2"
            >
              Save Preferences & Start Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
