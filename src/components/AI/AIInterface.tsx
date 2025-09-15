import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, Send, Bot, User, Menu, ArrowRight, Settings, MessageSquarePlus } from 'lucide-react';
import Image from 'next/image';

type TabKey = 'plan' | 'preferences' | 'flights' | 'hotels' | 'packages' | 'mapout';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIInterfaceProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  isTyping: boolean;
  suggestedPrompts: (string | { text: string; emoji: string })[];
  placeholderText: string;
  onSubmit?: () => void;
  preferences?: any;
  activeTab: TabKey;
  isMobile?: boolean;
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
  onNewTrip?: () => void;
  registerClearChat?: (fn: () => void) => void;
  onFirstMessage?: (firstMessage: string) => void;
  onMessageSent?: (message: string) => void;
  onPreferencesOpen?: () => void;
}

export default function AIInterface({ 
  inputValue, 
  onInputChange, 
  isTyping, 
  suggestedPrompts, 
  placeholderText,
  onSubmit,
  preferences,
  activeTab,
  isMobile = false,
  onSidebarToggle,
  isSidebarOpen = false,
  onNewTrip,
  registerClearChat,
  onFirstMessage,
  onMessageSent,
  onPreferencesOpen
}: AIInterfaceProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  }, [inputValue]);

  // Clear chat messages to return to welcome screen
  const clearChat = useCallback(() => {
    setChatMessages([]);
    setIsAITyping(false);
  }, []);
  
  // Also clear chat when activeTab changes to ensure clean state
  useEffect(() => {
    setChatMessages([]);
    setIsAITyping(false);
  }, [activeTab]);

  // Expose clearChat function to parent component
  useEffect(() => {
    registerClearChat?.(clearChat);
  }, [registerClearChat]);

  const scrollToBottom = useCallback(() => {
    const scrollContainer = messagesEndRef.current?.parentElement;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chatMessages, scrollToBottom]);

  const generateAIResponse = useCallback((userMessage: string): string => {
    const responses: Record<string, string[]> = {
      flights: [
        `I'd be happy to help you find the perfect flights! Based on "${userMessage}", I can suggest some great options. Let me search for flights that match your preferences for dates, destinations, and budget.`,
        `Great choice! For your flight search "${userMessage}", I recommend checking both direct and connecting flights to get the best deals. Would you like me to focus on specific airlines or departure times?`,
        `Perfect! I'll help you with "${userMessage}". I can find flights with various price points and schedules. Do you have any preference for morning, afternoon, or evening departures?`
      ],
      hotels: [
        `Excellent! For "${userMessage}", I can recommend some amazing accommodations. Let me find hotels that match your style, budget, and location preferences.`,
        `I love helping with hotel searches! Based on "${userMessage}", I can suggest properties with great amenities and reviews. Are you looking for luxury, boutique, or budget-friendly options?`,
        `Perfect request! For "${userMessage}", I'll find accommodations that offer the best value and experience. Would you like properties with specific amenities like pools, spas, or business centers?`
      ],
      packages: [
        `Fantastic! For your package request "${userMessage}", I can create comprehensive travel deals that include flights, hotels, and activities all in one bundle.`,
        `Great idea! Based on "${userMessage}", I'll design complete travel packages that save you time and money. These packages can include transportation, accommodation, meals, and experiences.`,
        `Perfect! For "${userMessage}", I can bundle everything together - flights, hotels, transfers, and activities. Package deals often provide better value than booking separately.`
      ],
      plan: [
        `I'm excited to help plan your trip! Based on "${userMessage}", I can create a detailed itinerary with recommendations for flights, accommodations, activities, and dining.`,
        `Wonderful! For "${userMessage}", I'll craft a personalized travel plan that includes the best attractions, local experiences, and practical tips for your journey.`,
        `Great travel idea! From "${userMessage}", I can design a complete trip plan with day-by-day activities, restaurant suggestions, and insider tips to make your trip unforgettable.`
      ],
      preferences: [
        `Thanks for sharing your preferences! Based on "${userMessage}", I can now provide more personalized recommendations for your trip planning.`,
        `Perfect! Your preferences for "${userMessage}" will help me tailor the best travel suggestions for you.`,
        `Excellent! With your preferences about "${userMessage}", I can create more targeted recommendations for your perfect trip.`
      ]
    };

    const categoryResponses = responses[activeTab] || responses.plan;
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    return randomResponse;
  }, [activeTab]);

  const handleSendMessage = useCallback(async (messageOverride?: string) => {
    const textToSend = messageOverride ? messageOverride.trim() : inputValue.trim();
    if (!textToSend) return;

    // Check if this is the first message in the conversation
    const isFirstMessage = chatMessages.length === 0;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    // Clear the input box regardless of where the text came from
    onInputChange('');
    
    // If this is the first message, save it to recent conversations
    if (isFirstMessage) {
      onFirstMessage?.(textToSend);
    }
    
    // Track all messages for conversation history
    onMessageSent?.(textToSend);
    
    // Show AI typing indicator
    setIsAITyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(textToSend),
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsAITyping(false);
    }, 600 + Math.random() * 1000);

    onSubmit?.();
  }, [chatMessages.length, onInputChange, onFirstMessage, onMessageSent, generateAIResponse, onSubmit]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  // Dynamic content based on active tab
  const getContentByTab = () => {
    switch (activeTab) {
      case 'flights':
        return {
          title: 'Flight Search',
          description: 'Find the perfect flights for your journey',
          placeholder: 'Tell me about your flight preferences: destinations, dates, budget, seat class...',
          prompts: [
            { text: 'Round-trip to London for 2 weeks', emoji: '🇬🇧', color: 'from-blue-400/20 to-indigo-400/20 hover:from-blue-400/30 hover:to-indigo-400/30 border-blue-300/40' },
            { text: 'Business class to Tokyo in March', emoji: '🛩️', color: 'from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40' },
            { text: 'Budget flights to Europe this summer', emoji: '💰', color: 'from-green-400/20 to-emerald-400/20 hover:from-green-400/30 hover:to-emerald-400/30 border-green-300/40' },
            { text: 'Multi-city trip: NYC → Paris → Rome', emoji: '🌍', color: 'from-orange-400/20 to-red-400/20 hover:from-orange-400/30 hover:to-red-400/30 border-orange-300/40' },
            { text: 'One-way ticket to Australia', emoji: '🦘', color: 'from-yellow-400/20 to-amber-400/20 hover:from-yellow-400/30 hover:to-amber-400/30 border-yellow-300/40' },
            { text: 'Weekend getaway to Miami', emoji: '🏖️', color: 'from-cyan-400/20 to-blue-400/20 hover:from-cyan-400/30 hover:to-blue-400/30 border-cyan-300/40' },
          ],
          gradientColors: 'from-blue-500/30 to-indigo-500/30',
          accentColor: 'text-blue-600'
        };
      case 'hotels':
        return {
          title: 'Hotel Search',
          description: 'Discover amazing accommodations for your stay',
          placeholder: 'Describe your ideal hotel: location, amenities, budget, check-in dates...',
          prompts: [
            { text: 'Luxury resort in Maldives', emoji: '🏝️', color: 'from-teal-400/20 to-cyan-400/20 hover:from-teal-400/30 hover:to-cyan-400/30 border-teal-300/40' },
            { text: 'Boutique hotel in Paris', emoji: '🏨', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
            { text: 'Budget-friendly hostel in Bangkok', emoji: '💸', color: 'from-green-400/20 to-lime-400/20 hover:from-green-400/30 hover:to-lime-400/30 border-green-300/40' },
            { text: 'Ski resort in Swiss Alps', emoji: '⛷️', color: 'from-blue-400/20 to-slate-400/20 hover:from-blue-400/30 hover:to-slate-400/30 border-blue-300/40' },
            { text: 'Beachfront villa in Santorini', emoji: '🏖️', color: 'from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border-blue-300/40' },
            { text: 'Historic inn in Kyoto', emoji: '🏯', color: 'from-purple-400/20 to-indigo-400/20 hover:from-purple-400/30 hover:to-indigo-400/30 border-purple-300/40' },
          ],
          gradientColors: 'from-emerald-500/30 to-teal-500/30',
          accentColor: 'text-emerald-600'
        };
      case 'packages':
        return {
          title: 'Package Deals',
          description: 'Complete travel packages tailored just for you',
          placeholder: 'Tell me about your dream vacation package: destination, duration, activities, group size...',
          prompts: [
            { text: '7-day Italy tour with flights & hotels', emoji: '🍝', color: 'from-red-400/20 to-orange-400/20 hover:from-red-400/30 hover:to-orange-400/30 border-red-300/40' },
            { text: 'All-inclusive Caribbean cruise', emoji: '🚢', color: 'from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border-blue-300/40' },
            { text: 'Adventure package to Costa Rica', emoji: '🦜', color: 'from-green-400/20 to-emerald-400/20 hover:from-green-400/30 hover:to-emerald-400/30 border-green-300/40' },
            { text: 'Romantic honeymoon in Bali', emoji: '💕', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
            { text: 'Family Disney World vacation', emoji: '🎢', color: 'from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40' },
            { text: 'Cultural tour of Southeast Asia', emoji: '🕌', color: 'from-amber-400/20 to-yellow-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 border-amber-300/40' },
          ],
          gradientColors: 'from-purple-500/30 to-pink-500/30',
          accentColor: 'text-purple-600'
        };
      case 'mapout':
        return {
          title: 'Map Out Planner',
          description: 'Create detailed day-by-day itineraries with optimal routing',
          placeholder: 'Describe your trip details: destinations, duration, preferred activities, travel pace...',
          prompts: [
            { text: '5-day New York City itinerary', emoji: '🗽', color: 'from-blue-400/20 to-indigo-400/20 hover:from-blue-400/30 hover:to-indigo-400/30 border-blue-300/40' },
            { text: 'Weekend food tour in Paris', emoji: '🥐', color: 'from-amber-400/20 to-orange-400/20 hover:from-amber-400/30 hover:to-orange-400/30 border-amber-300/40' },
            { text: 'Cultural exploration of Rome', emoji: '🏛️', color: 'from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40' },
            { text: 'Island hopping in Greece', emoji: '🏝️', color: 'from-cyan-400/20 to-blue-400/20 hover:from-cyan-400/30 hover:to-blue-400/30 border-cyan-300/40' },
            { text: 'Adventure route through Iceland', emoji: '🌋', color: 'from-slate-400/20 to-gray-400/20 hover:from-slate-400/30 hover:to-gray-400/30 border-slate-300/40' },
            { text: 'Cherry blossom tour in Japan', emoji: '🌸', color: 'from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40' },
          ],
          gradientColors: 'from-emerald-500/30 to-cyan-500/30',
          accentColor: 'text-emerald-600'
        };
      default: // 'plan'
        return {
          title: 'Voyagr',
          description: 'Plan your perfect trip with assistance',
          placeholder: placeholderText || 'Describe your dream trip and I\'ll help plan it...',
          prompts: suggestedPrompts || [
            { text: "Romantic weekend in Paris", emoji: "💕", color: "from-pink-400/20 to-rose-400/20 hover:from-pink-400/30 hover:to-rose-400/30 border-pink-300/40" },
            { text: "Adventure trip to New Zealand", emoji: "🏔️", color: "from-emerald-400/20 to-green-400/20 hover:from-emerald-400/30 hover:to-green-400/30 border-emerald-300/40" },
            { text: "Food tour through Italy", emoji: "🍝", color: "from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/30 hover:to-orange-400/30 border-yellow-300/40" },
            { text: "Beach relaxation in Maldives", emoji: "🏝️", color: "from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border-blue-300/40" },
            { text: "Cultural exploration in Japan", emoji: "🏯", color: "from-purple-400/20 to-violet-400/20 hover:from-purple-400/30 hover:to-violet-400/30 border-purple-300/40" },
            { text: "Safari adventure in Kenya", emoji: "🦁", color: "from-amber-400/20 to-yellow-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 border-amber-300/40" },
          ],
          gradientColors: 'from-primary/30 to-purple-500/30',
          accentColor: 'text-primary'
        };
    }
  };

  const content = getContentByTab();
  const showChat = chatMessages.length > 0 || isAITyping;

  return (
    <div className={`flex-1 relative ${isMobile ? 'h-full flex flex-col overflow-hidden' : 'h-full flex flex-col'}`}>
      
      {/* Mobile Floating Menu Button */}
      {isMobile && !isSidebarOpen && (
        <button
          onClick={onSidebarToggle}
          className="fixed top-24 left-4 z-50 p-3 rounded-full bg-white/95 border border-gray-200 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}
      
      {/* Globe Background */}
      <div 
        className="absolute inset-0 opacity-10 bg-repeat-y"
        style={{
          backgroundImage: 'url("/images/AIPage/globeBackground.svg")',
          backgroundSize: '50px',
          backgroundPosition: 'center'
        }}
      />

      {/* Chat Interface or Welcome Screen */}
      {showChat ? (
        /* Chat Mode */
        <div className={`relative flex flex-col ${isMobile ? 'h-screen p-4 pt-0' : 'h-full p-8 pt-0'}`}>
          {/* Mobile New Chat Button */}
          {isMobile && (
            <button
              onClick={() => {
                clearChat();
                onNewTrip?.();
              }}
              className="fixed top-28 right-4 z-50 w-14 h-14 rounded-full bg-white/70 backdrop-blur-xl backdrop-saturate-150 border border-white/40 shadow-[0_8px_32px_rgba(8,_112,_184,_0.2)] hover:shadow-[0_12px_40px_rgba(8,_112,_184,_0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center before:content-[''] before:absolute before:inset-0 before:rounded-full before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5"
            >
              <MessageSquarePlus className="w-6 h-6 text-gray-700" />
            </button>
          )}
          
          <div className={`${isMobile ? 'w-full' : 'max-w-4xl w-full mx-auto'} ${isMobile ? 'mt-2' : 'mt-6'} h-full flex flex-col`}>
            {/* Chat Header - Desktop only */}
            {!isMobile && (
              <div className="relative overflow-hidden bg-white/60 backdrop-blur-2xl backdrop-saturate-150 bg-clip-padding border border-white/40 rounded-t-[2rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.18)] p-6 text-center transition-all duration-700 ease-in-out before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5">
                <div className="flex items-center justify-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${content.gradientColors} border border-white/40`}>
                    <Sparkles className={`w-6 h-6 ${content.accentColor}`} />
                  </div>
                  <h2 className={`text-2xl font-bold ${content.accentColor}`}>
                    {content.title}
                  </h2>
                </div>
              </div>
            )}

            {/* Messages Container */}
            <div className={`flex-1 relative ${isMobile ? 'bg-white/95 border border-gray-200 rounded-2xl mt-4 mb-24 min-h-[300px]' : 'bg-white/40 backdrop-blur-xl backdrop-saturate-150 bg-clip-padding border-x border-white/40 before:content-[\'\'] before:absolute before:inset-0 before:pointer-events-none before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5'}`}>
                  <div className={`h-full overflow-y-auto ${isMobile ? 'p-4' : 'p-6'} space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400`}>
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-primary/20 border-2 border-primary/30' 
                            : `bg-gradient-to-br ${content.gradientColors} border-2 border-white/40`
                        }`}>
                          {message.sender === 'user' ? (
                            <User className="w-5 h-5 text-primary" />
                          ) : (
                            <Bot className={`w-5 h-5 ${content.accentColor}`} />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-[70%] ${
                          message.sender === 'user'
                            ? 'bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-md'
                            : 'bg-white/60 border border-white/40 rounded-2xl rounded-tl-md backdrop-blur-sm'
                        } p-4 shadow-sm`}>
                          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <div className="text-xs text-gray-500 mt-2">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* AI Typing Indicator */}
                    {isAITyping && (
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${content.gradientColors} border-2 border-white/40`}>
                          <Bot className={`w-5 h-5 ${content.accentColor}`} />
                        </div>
                        <div className="bg-white/60 border border-white/40 rounded-2xl rounded-tl-md backdrop-blur-sm p-4 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className={`w-2 h-2 rounded-full animate-bounce ${content.accentColor.replace('text-', 'bg-')}`}></div>
                              <div className={`w-2 h-2 rounded-full animate-bounce delay-100 ${content.accentColor.replace('text-', 'bg-')}`}></div>
                              <div className={`w-2 h-2 rounded-full animate-bounce delay-200 ${content.accentColor.replace('text-', 'bg-')}`}></div>
                            </div>
                            <span className="text-xs text-gray-500">AI is typing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
            </div>

            {/* Compact Chat Input */}
            <div className={`${isMobile ? 'relative mt-4 mx-4 mb-6' : 'relative'} z-[9999]`}>
              <div className={`relative overflow-hidden ${isMobile ? 'bg-white border-2 border-gray-200 shadow-lg' : 'bg-white/70 border border-white/30 backdrop-blur-3xl backdrop-saturate-200 before:content-[\'\'] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/50 before:via-white/20 before:to-white/10'} rounded-3xl hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center gap-3 p-4">
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask anything..."
                      className="w-full bg-transparent border-none resize-none focus:outline-none text-gray-800 placeholder-gray-500 text-base leading-6 min-h-[24px] max-h-32 py-0"
                      rows={1}
                      style={{ height: 'auto' }}
                    />
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isAITyping}
                    className={`flex-shrink-0 w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center ${
                      inputValue.trim() && !isAITyping
                        ? 'bg-gray-800 hover:bg-gray-700 text-white scale-100'
                        : 'bg-gray-200 text-gray-400 scale-95'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Welcome Mode */
        <div className={`relative flex items-start justify-center ${isMobile ? 'p-3 pt-0 pb-4 flex-1 overflow-y-auto' : 'p-8 pt-0'}`}>
          <div className={`${isMobile ? 'w-full' : 'max-w-4xl w-full'} ${isMobile ? 'mt-0' : 'mt-4'} ${isMobile ? 'space-y-1' : 'space-y-3'}`}>
          
          {/* Compact Preferences Display */}
          {preferences && (
            <div className={`relative overflow-hidden bg-white/40 backdrop-blur-xl backdrop-saturate-150 bg-clip-padding border border-white/30 rounded-xl shadow-lg ${isMobile ? 'p-2' : 'p-4'} before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-700`}>Trip Preferences</h3>
                  <div className="flex flex-wrap gap-1">
                    {preferences.travelStyle && (
                      <span className={`px-2 py-1 bg-primary/10 text-primary ${isMobile ? 'text-xs' : 'text-xs'} font-medium rounded-full border border-primary/20`}>
                        {preferences.travelStyle.charAt(0).toUpperCase() + preferences.travelStyle.slice(1)}
                      </span>
                    )}
                    {preferences.budget && (
                      <span className={`px-2 py-1 bg-green-100 text-green-700 ${isMobile ? 'text-xs' : 'text-xs'} font-medium rounded-full border border-green-200`}>
                        {preferences.budget.includes('-') ? preferences.budget.split('-')[0] + '+' : preferences.budget}
                      </span>
                    )}
                    {preferences.groupSize && (
                      <span className={`px-2 py-1 bg-blue-100 text-blue-700 ${isMobile ? 'text-xs' : 'text-xs'} font-medium rounded-full border border-blue-200`}>
                        {preferences.groupSize}
                      </span>
                    )}
                    {preferences.activities && preferences.activities.length > 0 && (
                      <span className={`px-2 py-1 bg-purple-100 text-purple-700 ${isMobile ? 'text-xs' : 'text-xs'} font-medium rounded-full border border-purple-200`}>
                        {preferences.activities.length} Activities
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Main AI Card with Enhanced Glassmorphism */}
          <div className={`relative overflow-hidden bg-white/60 backdrop-blur-2xl backdrop-saturate-150 bg-clip-padding border border-white/40 ${isMobile ? (preferences ? 'rounded-2xl p-3' : 'rounded-2xl p-4') : 'rounded-[2rem] p-12'} shadow-[0_20px_50px_rgba(8,_112,_184,_0.18)] text-center transition-all duration-700 ease-in-out before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5 after:content-[''] after:absolute after:-top-10 after:-left-10 after:w-40 after:h-40 after:bg-white/20 after:rounded-full after:blur-3xl after:pointer-events-none hover:shadow-[0_25px_60px_rgba(8,_112,_184,_0.25)] hover:border-white/50`}>
            
            {/* Dynamic Gradient Orb Effects */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${content.gradientColors} rounded-full blur-3xl animate-pulse transition-all duration-1000`}></div>
            <div className={`absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr ${content.gradientColors} rounded-full blur-3xl animate-pulse delay-1000 transition-all duration-1000`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Logo and Dynamic Title */}
              <div className={`flex items-center justify-center gap-4 ${isMobile ? (preferences ? 'mb-1' : 'mb-2') : 'mb-6'} transition-all duration-700 ease-in-out`}>
                {activeTab === 'plan' && (
                  <div className="relative">
                    <Image
                      src="/images/AIPage/VoyagrAI logo.png"
                      alt="VoyagrAI Logo"
                      width={isMobile ? 60 : 80}
                      height={isMobile ? 60 : 80}
                      className="object-contain"
                      priority
                    />
                  </div>
                )}
                <h1 className={`${isMobile ? (preferences ? 'text-2xl' : 'text-3xl') : 'text-6xl'} font-bold leading-none transition-all duration-700 ${content.accentColor}`}>
                  {content.title}
                </h1>
              </div>

              {/* Dynamic Description */}
              <div className={isMobile ? (preferences ? 'mb-0' : 'mb-2') : 'mb-6'}>
                <p className={`${isMobile ? (preferences ? 'text-xs' : 'text-sm') : 'text-lg'} text-gray-700 font-medium transition-all duration-500`}>
                  {content.description}
                </p>
              </div>


              {/* Input Section */}
              <div className={isMobile ? (preferences ? 'mb-4' : 'mb-4') : 'mb-10'}>
                <div className="relative max-w-3xl mx-auto">
                  <div className={`relative overflow-hidden ${isMobile ? 'bg-white/80 border-2 border-white/60' : 'bg-white/50 border border-white/30'} backdrop-blur-3xl backdrop-saturate-200 bg-clip-padding rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/60 before:via-white/20 before:to-transparent before:opacity-80 after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:bg-gradient-to-tl after:from-blue-100/20 after:via-purple-100/10 after:to-pink-100/20 after:animate-pulse after:duration-[3000ms] group hover:border-white/50 hover:bg-white/60 focus-within:border-white/70 focus-within:bg-white/70 focus-within:shadow-[0_0_50px_rgba(255,255,255,0.3)]`}>
                    <textarea
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder=""
                      className={`w-full ${isMobile ? (preferences ? 'p-4 text-base min-h-[80px]' : 'p-5 text-lg min-h-[100px]') : 'p-6 text-lg min-h-[120px]'} bg-transparent resize-none focus:outline-none focus:ring-0 border-0 transition-all duration-300 placeholder-gray-500 text-gray-800 relative z-10`}
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
                  
                  {/* Preferences and Start Planning Buttons */}
                  <div className={`${isMobile ? 'mt-4 flex flex-col gap-2 w-full' : 'absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4'}`}>
                    {/* Preferences Button */}
                    <button 
                      onClick={() => {
                        onPreferencesOpen?.();
                      }}
                      className={`relative overflow-hidden ${isMobile ? 'px-6 py-3 text-base w-full' : 'px-8 py-4 text-lg'} bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white rounded-2xl font-bold shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5 min-h-[48px]`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
                        <Settings className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                        Preferences
                      </span>
                    </button>

                    {/* Start Planning Button */}
                    <button 
                      onClick={() => {
                        if (inputValue.trim()) {
                          // If user has entered text, start search with their input immediately
                          handleSendMessage(inputValue);
                        } else {
                          // If no input, start with a default planning prompt immediately
                          const defaultPrompt = "Help me plan my next trip";
                          handleSendMessage(defaultPrompt);
                        }
                      }}
                      className={`relative overflow-hidden ${isMobile ? 'px-6 py-3 text-base w-full' : 'px-8 py-4 text-lg'} bg-gradient-to-r ${
                        activeTab === 'flights' ? 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' :
                        activeTab === 'hotels' ? 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500' :
                        activeTab === 'packages' ? 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500' :
                        activeTab === 'mapout' ? 'from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500' :
                        'from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90'
                      } text-white rounded-2xl font-bold shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-white/5 min-h-[48px]`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
                        <Sparkles className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                        Start Planning
                        <ArrowRight className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Suggested Prompts */}
              <div className={isMobile ? (preferences ? 'mt-1' : 'mt-2') : 'mt-6'}>
                <p className={`text-gray-600 font-medium ${isMobile ? (preferences ? 'mb-1 text-xs' : 'mb-2 text-sm') : 'mb-4 text-base'} text-center transition-all duration-500`}>
                  {activeTab === 'flights' ? 'Popular flight searches:' : 
                   activeTab === 'hotels' ? 'Find your perfect accommodation:' :
                   activeTab === 'packages' ? 'Discover amazing packages:' :
                   'Get inspired with these travel ideas:'}
                </p>
                
                <div className={`grid ${isMobile ? (preferences ? 'grid-cols-1 gap-1.5' : 'grid-cols-1 gap-2') : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'}`}>
                  {content.prompts.map((prompt, index) => {
                    // Handle both string and object prompt types
                    const promptText = typeof prompt === 'string' ? prompt : prompt.text;
                    const promptEmoji = typeof prompt === 'string' ? '✨' : prompt.emoji;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(promptText)}
                        className={`group relative overflow-hidden ${isMobile ? (preferences ? 'p-2 min-h-[44px]' : 'p-2.5 min-h-[48px]') : 'p-4'} rounded-xl border border-white/40 transition-all duration-300 text-left transform hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] bg-white/60 backdrop-blur-xl backdrop-saturate-150 bg-clip-padding shadow-[0_8px_32px_rgba(8,_112,_184,_0.12)] hover:shadow-[0_12px_40px_rgba(8,_112,_184,_0.18)] hover:bg-white/70 before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-white/5`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <span className={`${isMobile ? 'text-2xl' : 'text-2xl'} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>{promptEmoji}</span>
                          <span className={`${isMobile ? (preferences ? 'text-sm leading-tight' : 'text-sm leading-tight') : 'text-sm'} font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300 leading-relaxed`}>
                            {promptText}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"></div>
                        <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
