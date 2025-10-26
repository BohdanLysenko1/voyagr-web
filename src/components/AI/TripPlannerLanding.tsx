'use client';

import React from 'react';
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';

interface TripPlannerLandingProps {
  onStartPlanning: () => void;
}

// Feature data with clear value propositions
const FEATURES = [
  {
    icon: '/images/AIPage/SVG/earth-globe-global-svgrepo-com.svg',
    title: 'Smart Destinations',
    description: 'AI analyzes millions of data points to suggest hidden gems and perfect-fit locations based on your interests.',
    benefit: 'Discover places you never knew existed'
  },
  {
    icon: '/images/AIPage/SVG/earth-globe-maps-and-location-svgrepo-com.svg',
    title: 'Live Flight Search',
    description: 'Real-time flight data with instant price updates. See actual availability, not outdated listings.',
    benefit: 'Book flights that actually exist'
  },
  {
    icon: '/images/AIPage/SVG/hotel-svgrepo-com.svg',
    title: 'Curated Stays',
    description: 'From boutique hostels to luxury resorts. Every option vetted for quality, location, and value.',
    benefit: 'Sleep somewhere you\'ll remember'
  },
  {
    icon: '/images/AIPage/SVG/compass-cardinal-points-svgrepo-com.svg',
    title: 'Smart Itineraries',
    description: 'Day-by-day plans that flow naturally. No backtracking, no rushed schedules, just seamless travel.',
    benefit: 'Stories, not checklists'
  },
  {
    icon: '/images/AIPage/SVG/suitcase-svgrepo-com.svg',
    title: 'Budget Optimizer',
    description: 'Set your budget once. We\'ll allocate it smartly across flights, stays, and experiences.',
    benefit: 'Splurge smart, save smarter'
  },
  {
    icon: '/images/AIPage/SVG/passport-svgrepo-com.svg',
    title: 'Flexible Dates',
    description: 'Can\'t decide when to go? Our AI finds the best times based on weather, crowds, and prices.',
    benefit: 'Travel when it makes sense'
  },
];

// Process steps with clear progression
const PROCESS_STEPS = [
  {
    number: 1,
    icon: '/images/AIPage/SVG/map-svgrepo-com.svg',
    title: 'Where to?',
    description: 'Name a place or describe a vibe',
    detail: 'Beach paradise, mountain adventure, or city buzz'
  },
  {
    number: 2,
    icon: '/images/AIPage/SVG/passport-svgrepo-com.svg',
    title: 'When?',
    description: 'Pick dates or get suggestions',
    detail: 'Flexible dates unlock better deals'
  },
  {
    number: 3,
    icon: '/images/AIPage/SVG/sailboat-svgrepo-com.svg',
    title: 'Who?',
    description: 'Solo, couple, or crew',
    detail: 'Tailored for your travel style'
  },
  {
    number: 4,
    icon: '/images/AIPage/SVG/mountain-svgrepo-com.svg',
    title: 'Your Style',
    description: 'Budget, pace, preferences',
    detail: 'Adventure seeker or slow traveler'
  },
  {
    number: 5,
    icon: '/images/AIPage/SVG/luggage-svgrepo-com.svg',
    title: 'Your Trip',
    description: 'Complete itinerary ready',
    detail: 'Book it or tweak it'
  },
];

// Trust signals
const TRUST_INDICATORS = [
  { icon: CheckCircle2, text: 'AI-powered planning', color: 'text-blue-600' },
  { icon: CheckCircle2, text: 'Real-time availability', color: 'text-purple-600' },
  { icon: CheckCircle2, text: 'Instant results', color: 'text-indigo-600' },
];

// Stats for social proof
const STATS = [
  { value: '10K+', label: 'Trips Planned' },
  { value: '50+', label: 'Countries' },
  { value: '4.9/5', label: 'User Rating', icon: Star },
];

const TripPlannerLanding: React.FC<TripPlannerLandingProps> = ({ onStartPlanning }) => {
  return (
    <div className="relative flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Hero Section - Above the Fold */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced gradient orbs background with animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-indigo-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/30 via-pink-400/20 to-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/15 via-blue-400/10 to-purple-400/5 rounded-full blur-3xl" />
          {/* Additional accent orbs */}
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/10 rounded-full blur-2xl" />
          <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center mb-8">
            <Image
              src="/images/AIPage/VoyagrAI logo.png"
              alt="VoyagrAI"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>

          {/* Main Value Proposition */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-[1.1]">
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Plan Your Dream Trip
            </span>
            <span className="block mt-2 text-gray-900">
              In Under 5 Minutes
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Skip hours of research. Our AI builds personalized itineraries with real flights,
            curated stays, and day-by-day plans — before your coffee gets cold.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col items-center gap-6 mb-10">
            <button
              onClick={onStartPlanning}
              className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold text-xl rounded-3xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105 ring-2 ring-white/30"
            >
              <span>Start Planning Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              {TRUST_INDICATORS.map((indicator, index) => {
                const Icon = indicator.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${indicator.color}`} />
                    <span className="font-medium">{indicator.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Proof Stats - Enhanced Glass Card */}
          <div className="inline-flex flex-wrap items-center justify-center gap-8 sm:gap-12 px-10 py-5 rounded-3xl backdrop-blur-2xl bg-white/50 border border-white/80 shadow-xl shadow-black/10 ring-1 ring-white/20">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center gap-1 text-2xl sm:text-3xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-1">
                  {stat.value}
                  {stat.icon && <stat.icon className="w-6 h-6 text-yellow-500 fill-yellow-500 drop-shadow-sm" />}
                </div>
                <div className="text-xs sm:text-sm text-gray-600/90 font-semibold tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Clear Process */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Five Steps, One Perfect Trip
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Answer a few questions. Get a complete itinerary. Start exploring.
            </p>
          </div>

          {/* Process Steps - Glass Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {PROCESS_STEPS.map((step, index) => (
              <div
                key={step.number}
                className="relative group h-full"
              >
                {/* Connector line - desktop only */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(100%-1rem)] w-8 h-0.5 bg-gradient-to-r from-blue-300/40 to-transparent z-0" />
                )}

                <div className="relative h-full backdrop-blur-2xl bg-white/70 border border-white/80 rounded-3xl p-6 shadow-xl shadow-black/10 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 ring-1 ring-white/20 flex flex-col">
                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 ring-2 ring-white/50">
                    <span className="text-sm font-bold text-white drop-shadow">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className="inline-flex p-4 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-blue-50/90 via-purple-50/80 to-indigo-50/70 shadow-inner">
                      <Image
                        src={step.icon}
                        alt={step.title}
                        width={32}
                        height={32}
                        className="w-8 h-8"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2 font-medium">
                    {step.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Value-Driven */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Travelers Choose Voyagr
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              We don't just search. We curate, optimize, and personalize every aspect of your journey.
            </p>
          </div>

          {/* Feature Grid - Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="relative backdrop-blur-2xl bg-white/70 border border-white/80 rounded-3xl p-8 shadow-xl shadow-black/10 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 ring-1 ring-white/20"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="inline-flex p-5 rounded-2xl backdrop-blur-sm bg-gradient-to-br from-blue-100/90 via-purple-100/80 to-indigo-100/70 shadow-lg shadow-blue-500/10">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Benefit callout */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-gradient-to-r from-blue-100/70 to-purple-100/60 border border-blue-200/70 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 drop-shadow-sm" />
                  <span className="text-sm font-bold text-blue-700">{feature.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section - Traditional vs Voyagr */}
      <section className="py-20 sm:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              The Old Way vs The Voyagr Way
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Way - Glass Card */}
            <div className="backdrop-blur-2xl bg-white/60 border border-white/70 rounded-3xl p-8 shadow-xl shadow-black/10 ring-1 ring-white/20">
              <div className="text-center mb-6">
                <div className="inline-flex px-4 py-2 rounded-full backdrop-blur-sm bg-gray-200/60 text-gray-700 font-bold text-sm mb-4">
                  Traditional Planning
                </div>
                <div className="text-4xl font-black text-gray-400 mb-2">8+ Hours</div>
                <p className="text-gray-600">Average planning time</p>
              </div>
              <ul className="space-y-3">
                {[
                  'Browse 15+ tabs of flight comparison sites',
                  'Cross-reference hotel reviews on 3 platforms',
                  'Manually build day-by-day schedules',
                  'Calculate distances and travel times',
                  'Hope everything fits your budget'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Voyagr Way - Glass Card with Gradient */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-blue-200/40 rounded-3xl p-8 shadow-xl shadow-blue-500/10 relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl pointer-events-none" />

              <div className="absolute top-4 right-4 z-10">
                <div className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-md">
                  RECOMMENDED
                </div>
              </div>
              <div className="text-center mb-6 relative z-10">
                <div className="inline-flex px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white font-bold text-sm mb-4 shadow-lg">
                  The Voyagr Way
                </div>
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  &lt; 5 Minutes
                </div>
                <p className="text-gray-700 font-medium">Complete trip planned</p>
              </div>
              <ul className="space-y-3 relative z-10">
                {[
                  'Answer 5 simple questions',
                  'AI searches thousands of options instantly',
                  'Get personalized itinerary in seconds',
                  'Real prices, real availability, real places',
                  'Budget optimized automatically'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Strong Conversion Focus */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
        {/* Enhanced gradient orbs background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/30 via-indigo-400/20 to-pink-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-purple-300/10 rounded-full blur-3xl" />
        </div>

        {/* Floating decorative icons */}
        <div className="absolute top-20 left-10 opacity-10 hidden lg:block">
          <Image src="/images/AIPage/SVG/mountain-svgrepo-com.svg" alt="" width={80} height={80} className="w-20 h-20" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 hidden lg:block">
          <Image src="/images/AIPage/SVG/tent-svgrepo-com.svg" alt="" width={80} height={80} className="w-20 h-20" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Your Next Adventure Starts Now
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Weekend getaway or month-long journey. Voyagr builds it in minutes.
          </p>

          <button
            onClick={onStartPlanning}
            className="group inline-flex items-center gap-3 px-14 py-7 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold text-2xl rounded-3xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105 ring-2 ring-white/30 backdrop-blur-sm mb-6"
          >
            <span>Start Planning Now</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-sm text-gray-600">
            Smart itineraries • Real-time pricing • Personalized recommendations
          </p>
        </div>
      </section>
    </div>
  );
};

export default TripPlannerLanding;
