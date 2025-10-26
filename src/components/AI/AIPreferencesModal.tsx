'use client';

import { useState, useCallback, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AIPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: any) => void;
}

export default function AIPreferencesModal({ isOpen, onClose, onSave }: AIPreferencesModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = useMemo(() => 4, []);
  const [travelStyle, setTravelStyle] = useState('');
  const [budget, setBudget] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [activities, setActivities] = useState<string[]>([]);

  const travelStyles = useMemo(() => [
    { id: 'luxury', label: 'Luxury', desc: 'Premium experiences and accommodations' },
    { id: 'adventure', label: 'Adventure', desc: 'Outdoor activities and exploration' },
    { id: 'budget-friendly', label: 'Budget-Friendly', desc: 'Great value without compromising fun' },
    { id: 'romantic', label: 'Romantic', desc: 'Perfect for couples and special occasions' },
    { id: 'family-friendly', label: 'Family-Friendly', desc: 'Safe and enjoyable for all ages' },
    { id: 'business', label: 'Business', desc: 'Efficient travel with professional needs' }
  ], []);

  const budgetRanges = useMemo(() => [
    { id: 'budget', label: 'Budget', desc: 'Under $1,000 per person' },
    { id: 'moderate', label: 'Moderate', desc: '$1,000 - $3,000 per person' },
    { id: 'luxury', label: 'Luxury', desc: '$3,000 - $5,000 per person' },
    { id: 'ultra-luxury', label: 'Ultra Luxury', desc: '$5,000+ per person' }
  ], []);

  const activityOptions = useMemo(() => [
    'Museums & Culture', 'Food & Dining', 'Nightlife', 'Shopping',
    'Outdoor Activities', 'Beach & Water Sports', 'Adventure Sports', 'Wellness & Spa',
    'Photography', 'Music & Festivals', 'Local Experiences', 'Wildlife & Nature'
  ], []);

  const toggleActivity = useCallback((activity: string) => {
    setActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  }, []);

  const handleSave = useCallback(() => {
    const preferences = {
      travelStyle,
      budget,
      groupSize,
      activities
    };
    onSave(preferences);
    onClose();
  }, [travelStyle, budget, groupSize, activities, onSave, onClose]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: return travelStyle !== '';
      case 1: return budget !== '';
      case 2: return groupSize !== '';
      case 3: return activities.length > 0;
      default: return false;
    }
  }, [currentStep, travelStyle, budget, groupSize, activities]);

  const getStepTitle = useMemo(() => {
    switch (currentStep) {
      case 0: return "What's your travel style?";
      case 1: return "What's your budget range?";
      case 2: return "How many people are traveling?";
      case 3: return "What activities interest you?";
      default: return "";
    }
  }, [currentStep]);

  const getStepDescription = useMemo(() => {
    switch (currentStep) {
      case 0: return "Choose the style that best describes your ideal trip";
      case 1: return "Select a budget range that works for you";
      case 2: return "Tell us about your travel group size";
      case 3: return "Select all activities that interest you";
      default: return "";
    }
  }, [currentStep]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {travelStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setTravelStyle(style.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  travelStyle === style.id
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold text-gray-800 text-sm mb-2">{style.label}</div>
                <div className="text-sm text-gray-600">{style.desc}</div>
              </button>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {budgetRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setBudget(range.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  budget === range.id
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold text-gray-800 text-sm mb-2">{range.label}</div>
                <div className="text-sm text-gray-600">{range.desc}</div>
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="flex flex-wrap gap-4 justify-center max-w-lg mx-auto">
            {['Solo', '2 People', '3-4 People', '5+ People'].map((size) => (
              <button
                key={size}
                onClick={() => setGroupSize(size)}
                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 text-sm ${
                  groupSize === size
                    ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/30 shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            {activityOptions.map((activity) => (
              <button
                key={activity}
                onClick={() => toggleActivity(activity)}
                className={`px-3 py-3 rounded-lg border-2 text-center font-medium transition-all duration-200 text-sm ${
                  activities.includes(activity)
                    ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/30 shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto">
        <div className="bg-white/95 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col h-[75vh] max-h-[600px] min-h-[400px]">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 flex-shrink-0">
            <div className="flex-1 pr-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Travel Preferences</h2>
              <p className="text-sm text-gray-600">{getStepDescription}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {currentStep + 1} of {totalSteps}</span>
              <span className="text-sm font-medium text-primary">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">{getStepTitle}</h3>
            <div className="flex items-center justify-center">
              {renderCurrentStep()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 flex-shrink-0">
            {/* Previous Button */}
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Progress Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index <= currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Next/Finish Button */}
            {currentStep === totalSteps - 1 ? (
              <button
                onClick={() => {
                  if (currentStep < totalSteps - 1) {
                    nextStep();
                  } else {
                    handleSave();
                  }
                }}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  canProceed
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">Complete Setup</span>
                <span className="sm:hidden">Done</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  canProceed
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90 shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
