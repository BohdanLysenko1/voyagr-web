"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingDown, Share2, Calendar, MapPin, Users, Zap, Shield, Globe, Check } from 'lucide-react';

export default function Home() {
  const [aiQuery, setAiQuery] = useState('');
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Email:', email);
    }
  };

  return (
    <div className="flex flex-col bg-white">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(107, 140, 255, 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, rgba(157, 123, 255, 0.15) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 mb-8 shadow-sm border border-gray-200">
                <Sparkles className="w-4 h-4 text-[#6B8CFF]" />
                <span className="text-sm font-medium text-gray-700">AI-Powered Travel Planning</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Travel better.
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Plan trips in seconds with AI. Get personalized itineraries, exclusive deals, and share your adventures—all in one place.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                 {[
                   { icon: <Calendar className="w-4 h-4" />, label: "Weekend Getaway", href: "/ai" },
                   { icon: <MapPin className="w-4 h-4" />, label: "Paris 3-Day", href: "/ai" },
                   { icon: <TrendingDown className="w-4 h-4" />, label: "Budget Flights", href: "/ai" },
                   { icon: <Users className="w-4 h-4" />, label: "Group Travel", href: "/ai" },
                 ].map((action, i) => (
                   <Link key={i} href={action.href} className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm border border-gray-200 hover:border-[#6B8CFF]">
                     {action.icon}
                     {action.label}
                   </Link>
                 ))}
               </div>

               <Link href="/ai" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6B8CFF] to-[#9D7BFF] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-lg">
                 Start Planning
                 <ArrowRight className="w-5 h-5" />
               </Link>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B8CFF] to-[#9D7BFF] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Travel Assistant</h3>
                    <p className="text-sm text-gray-500">Always here to help</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-[#6B8CFF] to-[#9D7BFF] text-white rounded-2xl rounded-tr-sm px-5 py-3 max-w-[80%]">
                      <p className="text-sm">Plan a 3-day trip to Rome under $1500</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-3 max-w-[85%]">
                      <p className="text-sm text-gray-700 mb-3">I've created a perfect Roman getaway for you! ✨</p>
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6B8CFF]" />
                          <span>Flight: $450 roundtrip</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6B8CFF]" />
                          <span>Hotel: $400 (3 nights)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6B8CFF]" />
                          <span>Activities: Colosseum, Vatican, more</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B8CFF] text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && aiQuery.trim()) {
                        e.preventDefault();
                        window.location.href = '/ai';
                      }
                    }}
                  />
                  {aiQuery.trim() ? (
                    <button 
                      onClick={() => {
                        window.location.href = '/ai';
                      }}
                      className="px-4 py-3 bg-gradient-to-br from-[#6B8CFF] to-[#9D7BFF] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center justify-center relative z-10"
                      style={{ minWidth: '48px', minHeight: '48px' }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="px-4 py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed transition-all flex items-center justify-center"
                      style={{ minWidth: '48px', minHeight: '48px' }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#6B8CFF] to-[#9D7BFF] rounded-3xl opacity-10 blur-2xl" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#9D7BFF] to-[#6B8CFF] rounded-3xl opacity-10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#6B8CFF] to-[#9D7BFF] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500K+", label: "Trips Planned" },
              { value: "150+", label: "Countries" },
              { value: "98%", label: "Satisfaction" },
              { value: "$2M+", label: "Saved by Users" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/90 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-block bg-[#6B8CFF]/10 rounded-full px-4 py-2 mb-4">
                <span className="text-[#6B8CFF] font-semibold text-sm">HOW IT WORKS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Create your next trip using our AI
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Once generated, use our tools to stay organized and stress-free—then share your adventures with the world.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  { 
                    step: "1", 
                    title: "Tell us your destination, dates, and budget", 
                    desc: "Share your travel preferences and let AI do the work" 
                  },
                  { 
                    step: "2", 
                    title: "Get a smart itinerary with flights & stays", 
                    desc: "Personalized recommendations based on your style" 
                  },
                  { 
                    step: "3", 
                    title: "Edit, save, and book—everything in one place", 
                    desc: "Make changes and manage your entire trip seamlessly" 
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#6B8CFF] to-[#9D7BFF] text-white font-bold flex items-center justify-center text-lg shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/ai" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6B8CFF] to-[#9D7BFF] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-lg">
                 Start with AI
                 <ArrowRight className="w-5 h-5" />
               </Link>
            </div>

            <div className="lg:mt-16">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Try an AI shortcut</h3>
                <p className="text-gray-600 mb-6">Quick access to popular travel plans</p>
                
                <div className="space-y-3">
                   {[
                     { label: "Plan a weekend trip", href: "/ai" },
                     { label: "Find cheap flights", href: "/ai" },
                     { label: "Book a hotel under $150", href: "/ai" },
                     { label: "3-day itinerary for Paris", href: "/ai" },
                   ].map((shortcut) => (
                     <Link key={shortcut.href} href={shortcut.href} className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-gray-200 hover:border-[#6B8CFF] hover:bg-gradient-to-r hover:from-[#6B8CFF]/5 hover:to-[#9D7BFF]/5 transition-all duration-300 group">
                       <span className="font-medium text-gray-700 group-hover:text-gray-900">{shortcut.label}</span>
                       <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#6B8CFF] group-hover:translate-x-1 transition-all" />
                     </Link>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-[#6B8CFF]/10 rounded-full px-4 py-2 mb-4">
                <span className="text-[#6B8CFF] font-semibold text-sm">SIMPLE TRAVEL</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Effortless planning, unforgettable experiences
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Your time should be spent traveling, not stressing. We handle the details so you can focus on the memories.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <Zap className="w-5 h-5" />,
                    title: "Lightning Fast",
                    desc: "Generate complete itineraries in seconds with AI"
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "Stay Organized",
                    desc: "All bookings, itineraries, and details in one place"
                  },
                  {
                    icon: <Globe className="w-5 h-5" />,
                    title: "Complete Experience",
                    desc: "From planning to sharing, we've got you covered"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B8CFF] to-[#9D7BFF] flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#6B8CFF]/10 to-[#9D7BFF]/10 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B8CFF] to-[#9D7BFF]"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Your Trip to Tokyo</h4>
                        <p className="text-sm text-gray-500">March 15-22, 2025</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { title: "Flights", status: "Booked", icon: "✈️" },
                      { title: "Hotel - Shibuya", status: "Confirmed", icon: "🏨" },
                      { title: "Mt. Fuji Tour", status: "Reserved", icon: "🗻" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.status}</p>
                          </div>
                        </div>
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to travel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI-powered planning to exclusive deals, we've got your journey covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI-Powered Itineraries",
                description: "Smart trip planning in seconds. Let AI create your perfect journey with personalized recommendations.",
              },
              {
                icon: <TrendingDown className="w-8 h-8" />,
                title: "Exclusive Deals",
                description: "Access curated travel deals worldwide. Save up to 60% on flights, hotels, and packages.",
              },
              {
                icon: <Share2 className="w-8 h-8" />,
                title: "Share & Inspire",
                description: "Document your adventures and inspire others. Your trips, your stories, your community.",
              },
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#6B8CFF]/30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B8CFF]/5 to-[#9D7BFF]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6B8CFF] to-[#9D7BFF] text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  <div className="flex items-center text-[#6B8CFF] font-semibold group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#6B8CFF] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9D7BFF] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for your next adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers who trust Voyagr to plan their perfect trips. Start exploring today.
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-3 p-2 bg-white rounded-xl">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 outline-none text-gray-700"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleEmailSubmit(e);
                  }
                }}
              />
              <button 
                onClick={handleEmailSubmit}
                className="px-6 py-2 bg-gradient-to-r from-[#6B8CFF] to-[#9D7BFF] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai" className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg flex items-center justify-center gap-2">
              Plan with AI
              <Sparkles className="w-5 h-5" />
            </Link>
            <Link href="/deals" className="px-8 py-4 bg-gradient-to-r from-[#6B8CFF] to-[#9D7BFF] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-lg flex items-center justify-center gap-2">
              Browse Deals
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}