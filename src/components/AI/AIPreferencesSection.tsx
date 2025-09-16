import { useState, useEffect, useCallback, useMemo } from 'react';
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
  isMobile?: boolean;
}

export default function AIPreferencesSection({ onPreferenceChange, defaultExpanded = false, isMobile = false }: AIPreferencesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [preferences, setPreferences] = useState<Preferences>({
    budget: 'moderate',
    travelStyle: 'balanced',
    groupType: 'couple',
    interests: ['culture', 'food'],
    aiPersonality: 'helpful'
  });

  const budgetOptions = useMemo(() => [
    { value: 'budget' as BudgetOption, label: 'Budget-friendly', icon: '💰', color: 'text-green-600' },
    { value: 'moderate' as BudgetOption, label: 'Moderate', icon: '💵', color: 'text-blue-600' },
    { value: 'luxury' as BudgetOption, label: 'Luxury', icon: '💎', color: 'text-purple-600' }
  ], []);

  const travelStyles = useMemo(() => [
    { value: 'adventure' as TravelStyle, label: 'Adventure', icon: '🏔️' },
    { value: 'relaxation' as TravelStyle, label: 'Relaxation', icon: '🏖️' },
    { value: 'culture' as TravelStyle, label: 'Cultural', icon: '🏛️' },
    { value: 'balanced' as TravelStyle, label: 'Balanced', icon: '⚖️' }
  ], []);

  const interests = useMemo(() => [
    'culture', 'food', 'nature', 'nightlife', 'shopping', 'history', 'art', 'sports'
  ] as Interest[], []);

   // Keep the expansion state in sync if the parent controls default
   useEffect(() => {
     setIsExpanded(defaultExpanded);
   }, [defaultExpanded]);

  const handlePreferenceChange = useCallback((key: keyof Preferences, value: Preferences[keyof Preferences]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    onPreferenceChange?.(key, value);
  }, [onPreferenceChange]);

  const toggleInterest = useCallback((interest: Interest) => {
    const currentInterests = preferences.interests;
    const newInterests: Interest[] = currentInterests.includes(interest)
      ? (currentInterests.filter(i => i !== interest) as Interest[])
      : [...currentInterests, interest];
    handlePreferenceChange('interests', newInterests);
  }, [preferences.interests, handlePreferenceChange]);

  const handleExpandToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className="mb-8">
      <div className="glass-card rounded-2xl transition-all duration-700 ease-in-out hover:shadow-[0_25px_60px_rgba(8,_112,_184,_0.25)] hover:border-white/50 group">
        <div className="flex items-center justify-between w-full p-6 relative z-10">
          <button 
            onClick={handleExpandToggle}
            className="flex items-center gap-4 flex-1"
          >
            <div className="relative overflow-hidden p-3 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/40 shadow-sm group-hover:shadow-md transform group-hover:scale-110 transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/30 before:via-white/10 before:to-white/5">
              <Settings className="w-6 h-6 text-primary group-hover:text-purple-600 transition-colors duration-300 group-hover:rotate-90 relative z-10" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 tracking-wide">AI Preferences</h2>
              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-medium">Personalize your AI assistant</p>
            </div>
          </button>
          <button 
            onClick={handleExpandToggle}
            className="relative overflow-hidden p-2 rounded-xl hover:bg-white/40 text-gray-600 hover:text-primary transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-white/40 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
          >
            {isExpanded ? (
              <ChevronDown className="w-6 h-6 transition-transform duration-300 relative z-10" />
            ) : (
              <ChevronRight className="w-6 h-6 transition-transform duration-300 relative z-10" />
            )}
          </button>
        </div>
      
      {isExpanded && (
        <div className="space-y-6 animate-in slide-in-from-top-2 duration-300 p-6 pt-0 relative z-10">
          {/* Budget Preferences */}
          <div className="glass-card rounded-2xl">
            <div className="p-6 relative z-10">
              <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
                <div className="relative overflow-hidden p-2 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-400/20 border border-white/40 shadow-sm before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5">
                  <DollarSign className="w-5 h-5 text-green-600 relative z-10" />
                </div>
                <span className="tracking-wide">Budget Preference</span>
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePreferenceChange('budget', option.value)}
                    className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 text-left transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] backdrop-blur-sm before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none ${
                      preferences.budget === option.value 
                        ? 'border-primary/40 bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-lg ring-2 ring-primary/30 before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5' 
                        : 'border-white/40 bg-white/60 hover:bg-white/80 shadow-sm hover:shadow-md hover:border-white/50 before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">{option.icon}</span>
                      <div>
                        <span className="text-sm font-bold block">{option.label}</span>
                        <span className="text-xs text-gray-600 font-medium">
                          {option.value === 'budget' ? 'Save money' : option.value === 'moderate' ? 'Balanced choice' : 'Premium experience'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Travel Style */}
          <div className="glass-card rounded-2xl">
            <div className="p-6 relative z-10">
              <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
                <div className="relative overflow-hidden p-2 rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-white/40 shadow-sm before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5">
                  <Globe className="w-5 h-5 text-blue-600 relative z-10" />
                </div>
                <span className="tracking-wide">Travel Style</span>
              </h4>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-3'}`}>
                {travelStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => handlePreferenceChange('travelStyle', style.value)}
                    className={`relative overflow-hidden ${isMobile ? 'p-3' : 'p-4'} rounded-xl border transition-all duration-300 text-center transform hover:scale-105 hover:-translate-y-1 active:scale-95 backdrop-blur-sm before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none ${
                      preferences.travelStyle === style.value 
                        ? 'border-primary/40 bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-lg ring-2 ring-primary/30 before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5' 
                        : 'border-white/40 bg-white/60 hover:bg-white/80 shadow-sm hover:shadow-md hover:border-white/50 before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className={`${isMobile ? 'text-xl mb-1' : 'text-2xl mb-2'} transform group-hover:scale-110 transition-transform duration-300`}>{style.icon}</div>
                      <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-gray-700`}>{style.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="glass-card rounded-2xl">
            <div className="p-6 relative z-10">
              <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
                <div className="relative overflow-hidden p-2 rounded-xl bg-gradient-to-br from-pink-400/20 to-rose-400/20 border border-white/40 shadow-sm before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5">
                  <Heart className="w-5 h-5 text-pink-600 relative z-10" />
                </div>
                <span className="tracking-wide">Interests</span>
              </h4>
              <div className={`flex flex-wrap ${isMobile ? 'gap-2' : 'gap-3'}`}>
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`relative overflow-hidden ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'} rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm border before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none ${
                      preferences.interests.includes(interest)
                        ? 'bg-gradient-to-r from-primary/80 to-purple-600/80 text-white border-primary/40 ring-2 ring-primary/30 shadow-lg before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5'
                        : 'bg-white/60 text-gray-700 hover:bg-white/80 hover:text-gray-800 border-white/40 hover:border-white/50 shadow-sm hover:shadow-md before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5'
                    }`}
                  >
                    <span className="relative z-10 capitalize">{interest}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Group Type */}
          <div className="glass-card rounded-2xl">
            <div className="p-6 relative z-10">
              <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
                <div className="relative overflow-hidden p-2 rounded-xl bg-gradient-to-br from-purple-400/20 to-indigo-400/20 border border-white/40 shadow-sm before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5">
                  <User className="w-5 h-5 text-purple-600 relative z-10" />
                </div>
                <span className="tracking-wide">Group Type</span>
              </h4>
              <select 
                value={preferences.groupType}
                onChange={(e) => handlePreferenceChange('groupType', e.target.value as GroupType)}
                className="relative w-full p-4 text-sm font-medium bg-white/70 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm hover:bg-white/80 focus:bg-white/90 z-10"
              >
                <option value="solo">🧑‍💼 Solo Traveler</option>
                <option value="couple">💑 Couple</option>
                <option value="family">👨‍👩‍👧‍👦 Family</option>
                <option value="friends">👥 Friends</option>
                <option value="business">💼 Business</option>
              </select>
            </div>
          </div>

          {/* AI Assistant Personality */}
          <div className="glass-card rounded-2xl">
            <div className="p-6 relative z-10">
              <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-3">
                <div className="relative overflow-hidden p-2 rounded-xl bg-gradient-to-br from-amber-400/20 to-yellow-400/20 border border-white/40 shadow-sm before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5">
                  <Calendar className="w-5 h-5 text-amber-600 relative z-10" />
                </div>
                <span className="tracking-wide">AI Assistant Style</span>
              </h4>
              <select 
                value={preferences.aiPersonality}
                onChange={(e) => handlePreferenceChange('aiPersonality', e.target.value as AIPersonality)}
                className="relative w-full p-4 text-sm font-medium bg-white/70 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm hover:bg-white/80 focus:bg-white/90 z-10"
              >
                <option value="helpful">🤝 Helpful & Detailed</option>
                <option value="concise">⚡ Quick & Concise</option>
                <option value="creative">✨ Creative & Inspiring</option>
                <option value="practical">🎯 Practical & Focused</option>
              </select>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
