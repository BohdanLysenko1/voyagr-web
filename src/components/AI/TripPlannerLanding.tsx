'use client';

import React from 'react';
import { CheckCircle2, ArrowRight, Star, Plane, Hotel, Calendar, Sparkles, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';

interface TripPlannerLandingProps {
  onStartPlanning: () => void;
}

const TripPlannerLanding: React.FC<TripPlannerLandingProps> = ({ onStartPlanning }) => {
  return (
    <div className="relative flex-1 bg-white">
      {/* Hero Section - Bold & Clean */}
      <section className="relative bg-white pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Center Content */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Trip Planning</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Dream Trip.<br />
              <span className="text-primary">Planned in Minutes.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-snug">
              Skip the endless research. Our AI creates personalized itineraries with real flights, curated hotels, and day-by-day plans instantly.
            </p>

            {/* CTA Button */}
            <button
              onClick={onStartPlanning}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-[#7C97FF] transition-colors shadow-lg"
            >
              Start Planning Free
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Real-time availability</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Instant results</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gray-50 rounded-[20px]">
              <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-sm text-gray-500">Trips Planned</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-[20px]">
              <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-sm text-gray-500">Countries</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-[20px]">
              <div className="flex items-center justify-center gap-1 text-4xl font-bold text-gray-900 mb-2">
                4.9 <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="text-sm text-gray-500">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              From Idea to Itinerary in 5 Steps
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Answer a few simple questions and let our AI do the heavy lifting.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-[20px] border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-bold text-primary mb-2">Step 1</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Where to?</h3>
              <p className="text-sm text-gray-600">Pick a destination or describe your ideal trip vibe</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-[20px] border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-bold text-primary mb-2">Step 2</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">When?</h3>
              <p className="text-sm text-gray-600">Choose dates or let AI suggest the best times</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-[20px] border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-bold text-primary mb-2">Step 3</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">How long?</h3>
              <p className="text-sm text-gray-600">Weekend getaway or month-long adventure</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-[20px] border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Plane className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-bold text-primary mb-2">Step 4</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your style</h3>
              <p className="text-sm text-gray-600">Budget, pace, and travel preferences</p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-6 rounded-[20px] border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-bold text-primary mb-2">Step 5</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Done!</h3>
              <p className="text-sm text-gray-600">Complete trip ready to book or customize</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - 2 Column Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need, Nothing You Don't
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Powerful AI that handles the complexity while keeping it simple.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-50 rounded-[20px] border border-gray-200">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Plane className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real Flight Data</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Access live flight prices and availability from hundreds of airlines. No more outdated listings or sold-out options.
              </p>
              <div className="text-sm font-semibold text-primary">→ Always up-to-date</div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gray-50 rounded-[20px] border border-gray-200">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Hotel className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Curated Accommodations</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                From boutique hotels to luxury resorts. Every stay is vetted for quality, location, and value.
              </p>
              <div className="text-sm font-semibold text-primary">→ Quality guaranteed</div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gray-50 rounded-[20px] border border-gray-200">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Itineraries</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Day-by-day plans optimized for flow. No backtracking, no rushed schedules—just seamless travel.
              </p>
              <div className="text-sm font-semibold text-primary">→ Perfectly paced</div>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-gray-50 rounded-[20px] border border-gray-200">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Budget Optimizer</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Set your budget once and our AI allocates it smartly across flights, stays, and experiences.
              </p>
              <div className="text-sm font-semibold text-primary">→ Maximum value</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison - Side by Side */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Waste 8 Hours When You Can Save 8 Hours?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="bg-white p-8 rounded-[20px] border-2 border-gray-200">
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-semibold text-sm mb-4">
                  The Old Way
                </div>
                <div className="text-5xl font-bold text-gray-400 mb-2">8+ Hours</div>
                <p className="text-gray-600">Average planning time</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-2xl leading-none">❌</span>
                  <span>Browse 15+ tabs comparing flights</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-2xl leading-none">❌</span>
                  <span>Read hundreds of hotel reviews</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-2xl leading-none">❌</span>
                  <span>Manually plan day-by-day schedules</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-2xl leading-none">❌</span>
                  <span>Hope it fits your budget</span>
                </li>
              </ul>
            </div>

            {/* New Way */}
            <div className="bg-primary p-8 rounded-[20px] border-2 border-primary shadow-xl relative">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg shadow-md">
                RECOMMENDED
              </div>
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-white/20 rounded-lg text-white font-semibold text-sm mb-4">
                  The Voyagr Way
                </div>
                <div className="text-5xl font-bold text-white mb-2">&lt; 5 Min</div>
                <p className="text-blue-100">Complete trip planned</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white">
                  <span className="text-2xl leading-none">✓</span>
                  <span>Answer 5 simple questions</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="text-2xl leading-none">✓</span>
                  <span>AI searches thousands of options instantly</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="text-2xl leading-none">✓</span>
                  <span>Complete itinerary in seconds</span>
                </li>
                <li className="flex items-start gap-3 text-white">
                  <span className="text-2xl leading-none">✓</span>
                  <span>Budget optimized automatically</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            Join thousands of travelers who've discovered the smarter way to plan trips.
          </p>

          <button
            onClick={onStartPlanning}
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-white text-xl font-semibold rounded-xl hover:bg-[#7C97FF] transition-colors shadow-lg mb-6"
          >
            Start Planning Free
            <ArrowRight className="w-6 h-6" />
          </button>

          <p className="text-sm text-gray-500">
            No credit card • Free to use • Instant results
          </p>
        </div>
      </section>
    </div>
  );
};

export default TripPlannerLanding;
