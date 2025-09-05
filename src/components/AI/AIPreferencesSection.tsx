import { useState, useEffect } from 'react';
import { Settings, User, DollarSign, ChevronDown, ChevronRight, Heart, Globe, Calendar } from 'lucide-react';

type BudgetOption = 'budget' | 'moderate' | 'luxury';
type TravelStyle = 'adventure' | 'relaxation' | 'culture' | 'balanced';
type GroupType = 'solo' | 'couple' | 'family' | 'friends' | 'business';
type AIPersonality = 'helpful' | 'concise' | 'creative' | 'practical';
type Interest = 'culture' | 'food' | 'nature' | 'nightlife' | 'shopping' | 'history' | 'art' | 'sports';

interface Preferences {
  budget: BudgetOption;
  travelStyle: TravelStyle;
  groupType: GroupType;
  interests: Interest[];
  aiPersonality: AIPersonality;
}

interface AIPreferencesSectionProps {
  onPreferenceChange?: (key: keyof Preferences, value: Preferences[keyof Preferences]) => void;
  defaultExpanded?: boolean;
}

export default function AIPreferencesSection({ onPreferenceChange, defaultExpanded = false }: AIPreferencesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [preferences, setPreferences] = useState<Preferences>({
    budget: 'moderate',
    travelStyle: 'balanced',
    groupType: 'couple',
    interests: ['culture', 'food'],
    aiPersonality: 'helpful'
  });

  const [budgetOptions] = useState<{ value: BudgetOption; label: string; icon: string; color: string }[]>([
    { value: 'budget', label: 'Budget-friendly', icon: '💰', color: 'text-green-600' },
    { value: 'moderate', label: 'Moderate', icon: '💵', color: 'text-blue-600' },
    { value: 'luxury', label: 'Luxury', icon: '💎', color: 'text-purple-600' }
  ]);

  const [travelStyles] = useState<{ value: TravelStyle; label: string; icon: string }[]>([
    { value: 'adventure', label: 'Adventure', icon: '🏔️' },
    { value: 'relaxation', label: 'Relaxation', icon: '🏖️' },
    { value: 'culture', label: 'Cultural', icon: '🏛️' },
    { value: 'balanced', label: 'Balanced', icon: '⚖️' }
  ]);

  const [interests] = useState<Interest[]>([
    'culture', 'food', 'nature', 'nightlife', 'shopping', 'history', 'art', 'sports'
  ]);

   // Keep the expansion state in sync if the parent controls default
   useEffect(() => {
     setIsExpanded(defaultExpanded);
   }, [defaultExpanded]);

  const handlePreferenceChange = (key: keyof Preferences, value: Preferences[keyof Preferences]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    onPreferenceChange?.(key, value);
  };

  const toggleInterest = (interest: Interest) => {
    const currentInterests = preferences.interests;
    const newInterests: Interest[] = currentInterests.includes(interest)
      ? (currentInterests.filter(i => i !== interest) as Interest[])
      : [...currentInterests, interest];
    handlePreferenceChange('interests', newInterests);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 border border-white/50 hover:border-indigo-200/60 backdrop-blur-sm hover:bg-gradient-to-r hover:from-white/90 hover:to-white/70 transition-all duration-500 shadow-sm hover:shadow-lg transform hover:scale-[1.01] group">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-4 flex-1"
        >
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 group-hover:from-indigo-200 group-hover:to-blue-200 transition-all duration-300 shadow-sm group-hover:shadow-md transform group-hover:scale-110">
            <Settings className="w-6 h-6 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300 group-hover:rotate-90" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 tracking-wide">AI Preferences</h2>
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 font-medium">Personalize your experience</p>
          </div>
        </button>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl hover:bg-indigo-100/50 text-gray-600 hover:text-indigo-600 transition-all duration-300 transform hover:scale-110"
        >
          {isExpanded ? (
            <ChevronDown className="w-6 h-6 transition-transform duration-300" />
          ) : (
            <ChevronRight className="w-6 h-6 transition-transform duration-300" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          {/* Budget Preferences */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 p-5 rounded-2xl border border-green-200/60 shadow-sm backdrop-blur-sm">
            <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-100 shadow-sm">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="tracking-wide">Budget Preference</span>
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {budgetOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePreferenceChange('budget', option.value)}
                  className={`p-4 rounded-xl border transition-all duration-300 text-left transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] ${
                    preferences.budget === option.value 
                      ? 'border-primary bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-md ring-2 ring-primary/20' 
                      : 'border-gray-200/60 hover:border-green-300/60 bg-white/70 hover:bg-white/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">{option.icon}</span>
                    <div>
                      <span className="text-sm font-bold block">{option.label}</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {option.value === 'budget' ? 'Save money' : option.value === 'moderate' ? 'Balanced choice' : 'Premium experience'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 p-5 rounded-2xl border border-blue-200/60 shadow-sm backdrop-blur-sm">
            <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 shadow-sm">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <span className="tracking-wide">Travel Style</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {travelStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => handlePreferenceChange('travelStyle', style.value)}
                  className={`p-4 rounded-xl border transition-all duration-300 text-center transform hover:scale-105 hover:-translate-y-1 active:scale-95 shadow-sm hover:shadow-md ${
                    preferences.travelStyle === style.value 
                      ? 'border-primary bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-md ring-2 ring-primary/20' 
                      : 'border-gray-200/60 hover:border-blue-300/60 bg-white/70 hover:bg-white/90'
                  }`}
                >
                  <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{style.icon}</div>
                  <div className="text-sm font-bold text-gray-700">{style.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 p-5 rounded-2xl border border-pink-200/60 shadow-sm backdrop-blur-sm">
            <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-100 shadow-sm">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <span className="tracking-wide">Interests</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md ${
                    preferences.interests.includes(interest)
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white ring-2 ring-primary/30 shadow-lg'
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 border border-gray-200/60 hover:border-pink-300/60'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Group Type */}
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 p-5 rounded-2xl border border-purple-200/60 shadow-sm backdrop-blur-sm">
            <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 shadow-sm">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <span className="tracking-wide">Group Type</span>
            </h4>
            <select 
              value={preferences.groupType}
              onChange={(e) => handlePreferenceChange('groupType', e.target.value as GroupType)}
              className="w-full p-4 text-sm font-medium bg-white/90 border border-purple-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              <option value="solo">🧑‍💼 Solo Traveler</option>
              <option value="couple">💑 Couple</option>
              <option value="family">👨‍👩‍👧‍👦 Family</option>
              <option value="friends">👥 Friends</option>
              <option value="business">💼 Business</option>
            </select>
          </div>

          {/* AI Assistant Personality */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 p-5 rounded-2xl border border-amber-200/60 shadow-sm backdrop-blur-sm">
            <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 shadow-sm">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <span className="tracking-wide">AI Assistant Style</span>
            </h4>
            <select 
              value={preferences.aiPersonality}
              onChange={(e) => handlePreferenceChange('aiPersonality', e.target.value as AIPersonality)}
              className="w-full p-4 text-sm font-medium bg-white/90 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              <option value="helpful">🤝 Helpful & Detailed</option>
              <option value="concise">⚡ Quick & Concise</option>
              <option value="creative">✨ Creative & Inspiring</option>
              <option value="practical">🎯 Practical & Focused</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
