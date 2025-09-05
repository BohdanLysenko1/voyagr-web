import { Sparkles } from 'lucide-react';
import Image from 'next/image';

interface AIInterfaceProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  isTyping: boolean;
  suggestedPrompts: string[];
  placeholderText: string;
  onSubmit?: () => void;
  preferences?: any;
}

export default function AIInterface({ 
  inputValue, 
  onInputChange, 
  isTyping, 
  suggestedPrompts, 
  placeholderText,
  onSubmit,
  preferences
}: AIInterfaceProps) {
  return (
    <div className="flex-1 relative overflow-y-auto min-h-screen">
      {/* Globe Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" 
             style={{
               backgroundImage: `
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg"),
                 url("/images/AIPage/globeBackground.svg"), 
                 url("/images/AIPage/globeBackground.svg")
               `,
               backgroundRepeat: 'no-repeat',
               backgroundSize: '45px, 60px, 35px, 55px, 40px, 65px, 30px, 50px, 38px, 48px, 42px, 52px, 28px, 58px, 36px, 44px, 54px, 32px, 46px, 62px, 34px, 56px, 41px, 49px, 37px, 43px, 39px, 53px, 29px, 47px, 61px, 33px, 59px, 45px, 31px',
               backgroundPosition: '8% 18%, 72% 45%, 23% 73%, 89% 12%, 45% 85%, 15% 52%, 91% 78%, 6% 88%, 58% 8%, 33% 38%, 78% 25%, 12% 65%, 84% 55%, 38% 12%, 65% 92%, 95% 35%, 25% 28%, 67% 15%, 14% 40%, 88% 62%, 42% 68%, 75% 82%, 19% 8%, 93% 48%, 51% 25%, 26% 90%, 71% 33%, 17% 75%, 82% 9%, 49% 58%, 11% 43%, 76% 67%, 35% 6%, 86% 79%, 4% 22%'
             }}>
        </div>
      </div>

      {/* Floating Liquid Glass Card */}
      <div className="relative flex items-start justify-center p-8 pt-0 min-h-screen">
        <div className="max-w-4xl w-full mt-6 space-y-4">
          
          {/* Preferences Display */}
          {preferences && (
            <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl backdrop-saturate-150 bg-clip-padding border border-white/30 rounded-2xl shadow-lg p-4 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5">
              <div className="relative z-10">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Trip Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.travelStyle && (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                      {preferences.travelStyle.charAt(0).toUpperCase() + preferences.travelStyle.slice(1)} Style
                    </span>
                  )}
                  {preferences.budget && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                      {preferences.budget.replace('-', ' - $').replace('plus', '+')}
                    </span>
                  )}
                  {preferences.groupSize && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                      {preferences.groupSize}
                    </span>
                  )}
                  {preferences.activities && preferences.activities.length > 0 && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                      {preferences.activities.length} Activities Selected
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Main AI Card */}
          <div className="relative overflow-hidden bg-white/60 backdrop-blur-2xl backdrop-saturate-150 bg-clip-padding border border-white/40 rounded-[2rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.18)] p-12 text-center before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5 after:content-[''] after:absolute after:-top-10 after:-left-10 after:w-40 after:h-40 after:bg-white/20 after:rounded-full after:blur-3xl after:pointer-events-none">
            
            {/* Gradient Orb Effects */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-500/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Logo and Title */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="relative">
                  <Image
                    src="/images/AIPage/VoyagrAI logo.png"
                    alt="VoyagrAI Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                    priority
                  />
                </div>
                <h1 className="text-6xl font-bold text-primary leading-none">
                  VoyagrAI
                </h1>
              </div>

              {/* Description */}
              <div className="mb-12">
                <p className="text-xl text-gray-700 font-medium">
                  Plan your perfect trip with AI assistance
                </p>
              </div>

              {/* Input Section */}
              <div className="mb-10">
                <div className="relative max-w-3xl mx-auto">
                  <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl backdrop-saturate-150 bg-clip-padding border border-white/40 rounded-3xl shadow-xl before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5 after:content-[''] after:absolute after:-top-10 after:-left-10 after:w-32 after:h-32 after:bg-white/20 after:rounded-full after:blur-3xl after:pointer-events-none">
                    <textarea
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      placeholder="Describe your dream trip and I'll help plan it..."
                      className="w-full p-6 text-lg bg-transparent resize-none focus:outline-none focus:ring-0 border-0 transition-all duration-300 min-h-[120px] placeholder-gray-400"
                      rows={4}
                    />
                  </div>
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="absolute bottom-4 right-4 flex items-center text-primary">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Floating Action Button */}
                  <button 
                    onClick={onSubmit}
                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 p-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-110 active:scale-95"
                  >
                    <Sparkles className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Suggested Prompts */}
              <div className="mt-12">
                <p className="text-gray-600 font-medium mb-8 text-center">Get inspired with these travel ideas:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                  {[
                    { text: "Romantic weekend in Paris", emoji: "💕", color: "from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40" },
                    { text: "Adventure trip to New Zealand", emoji: "🏔️", color: "from-emerald-400/20 to-green-400/20 hover:from-emerald-400/30 hover:to-green-400/30 border-emerald-300/40" },
                    { text: "Food tour through Italy", emoji: "🍝", color: "from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/30 hover:to-orange-400/30 border-yellow-300/40" },
                    { text: "Beach relaxation in Maldives", emoji: "🏝️", color: "from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border-blue-300/40" },
                    { text: "Cultural exploration in Japan", emoji: "🏯", color: "from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40" },
                    { text: "Safari adventure in Kenya", emoji: "🦁", color: "from-amber-400/20 to-yellow-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 border-amber-300/40" },
                    { text: "Northern lights in Iceland", emoji: "🌌", color: "from-indigo-400/20 to-blue-400/20 hover:from-indigo-400/30 hover:to-blue-400/30 border-indigo-300/40" },
                    { text: "City break in New York", emoji: "🗽", color: "from-gray-400/20 to-slate-400/20 hover:from-gray-400/30 hover:to-slate-400/30 border-gray-300/40" }
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => onInputChange(prompt.text)}
                      className={`
                        group relative p-4 bg-gradient-to-br ${prompt.color}
                        backdrop-blur-sm border rounded-2xl font-medium 
                        transition-all duration-300 hover:shadow-lg 
                        transform hover:scale-105 hover:-translate-y-1 active:scale-95
                        text-left overflow-hidden
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {prompt.emoji}
                        </span>
                        <span className="text-gray-700 group-hover:text-gray-900 font-medium text-sm leading-relaxed">
                          {prompt.text}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-2xl"></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
