'use client';

import { useState } from 'react';
import { MapPin, User, Plane, Route, Globe, MapPin as LocationIcon, Camera, Star, Trophy, TrendingUp } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ProfileHeaderProps {
  user?: {
    name: string;
    title: string;
    bio: string;
    location: string;
    avatar?: string;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultUser = {
    name: 'Alex Johnson',
    title: 'Gold Traveler',
    bio: 'Gold Traveler | Explorer at heart | Product designer by day, wanderer by weekend 🌟 | Obsessed with local coffee shops & hidden trails 🏔️☕ | Currently: Working remotely from Lisbon | 📍 Follow my journey',
    location: 'Lisbon, Portugal',
    avatar: '/images/avatar.jpg'
  };

  const userData = user || defaultUser;

  return (
    <div className="relative overflow-hidden rounded-3xl mb-8 group">
      {/* Custom Light Blue Background - Darker for Better Contrast */}
      <div className="absolute inset-0" style={{ backgroundColor: '#B8C8E5' }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 to-indigo-300/25"></div>
      
      {/* Glass Morphism Overlay */}
      <div className="relative backdrop-blur-sm bg-white/20 border border-white/30 shadow-2xl">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            
            {/* Left Section: Enhanced Avatar with Status */}
            <div className="flex-shrink-0 w-full lg:w-auto flex flex-col items-center lg:items-start">
              <div className="relative">
                {/* Avatar Container */}
                <div className="relative w-32 h-32 md:w-40 lg:w-48 md:h-40 lg:h-48 rounded-full overflow-hidden bg-gray-100 shadow-lg cursor-pointer group/avatar">
                  {imageLoading && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                  {imageError ? (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100">
                      <User className="w-20 h-20 text-blue-600" />
                    </div>
                  ) : (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-full h-full object-cover opacity-100"
                      onError={() => {
                        setImageError(true);
                      }}
                    />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="w-8 h-8 md:w-10 lg:w-12 md:h-10 lg:h-12 text-white" />
                  </div>
                </div>

                {/* Enhanced Progress Bars */}
                <div className="mt-6 lg:mt-8 w-full max-w-sm lg:w-80 space-y-4 lg:space-y-6">
                  {[
                    { label: 'Global Explorer', icon: '🌍', progress: 75, color: 'from-slate-400 to-slate-600' },
                    { label: 'North America', icon: '🇺🇸', progress: 60, color: 'from-slate-500 to-slate-700' },
                    { label: 'Europe', icon: '🇪🇺', progress: 45, color: 'from-slate-400 to-slate-600' }
                  ].map((item, index) => (
                    <div key={index} className="group/progress">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-800 flex items-center drop-shadow-sm">
                          <span className="mr-3 text-lg">{item.icon}</span>
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-gray-800 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/50">
                          {item.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-white/40 border border-white/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full shadow-lg transition-all duration-1000 ease-out transform group-hover/progress:scale-x-105`}
                          style={{ width: `${item.progress}%` }}
                        >
                          <div className="h-full bg-white/30 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Section: Enhanced Bio */}
            <div className="flex-1 space-y-4 lg:space-y-6 text-center lg:text-left">
              {/* Name and Title */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-2 tracking-tight drop-shadow-lg">
                  {userData.name}
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  <div className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-md bg-white/10 border border-white/20">
                    <Trophy className="w-5 h-5 mr-2" />
                    <span className="font-bold">{userData.title}</span>
                  </div>
                  <div className="flex items-center text-gray-700 drop-shadow-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{userData.location}</span>
                  </div>
                </div>
              </div>

              {/* Bio Text with Better Typography */}
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/50">
                <div className="text-gray-800 text-sm lg:text-base leading-relaxed space-y-2 font-medium">
                  <p className="text-base lg:text-lg">✨ <span className="font-semibold">Explorer at heart</span> | Product designer by day</p>
                  <p>🌟 Wanderer by weekend</p>
                  <p>☕ Obsessed with local coffee shops & hidden trails 🏔️</p>
                  <p>📍 Currently: <span className="font-semibold text-slate-700">Working remotely from Lisbon</span></p>
                  <p>🚀 Follow my journey around the world</p>
                </div>
              </div>

              {/* Enhanced Achievement Badges */}
              <div className="flex flex-wrap gap-3 lg:gap-4 mt-4 lg:mt-6 justify-center lg:justify-start max-w-full">
                {[
                  { icon: Trophy, label: 'Top Contributor', color: 'from-slate-500 to-slate-600' },
                  { icon: TrendingUp, label: 'Rising Explorer', color: 'from-slate-600 to-slate-700' },
                  { icon: Globe, label: 'Global Nomad', color: 'from-slate-500 to-slate-600' }
                ].map((badge, index) => (
                  <div key={index} className={`flex items-center bg-gradient-to-r ${badge.color} text-white px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 backdrop-blur-md bg-white/10 border border-white/20 flex-shrink-0 whitespace-nowrap min-w-fit`}>
                    <badge.icon className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-2.5 flex-shrink-0" />
                    <span className="font-bold">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section: Enhanced Stats & Buttons */}
            <div className="flex flex-col space-y-6 lg:space-y-8 w-full lg:w-auto">
              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-4">
                {[
                  { icon: Plane, value: '42', label: 'Voyages', color: 'from-slate-600 to-slate-700', iconColor: 'text-slate-200' },
                  { icon: Route, value: '432K', label: 'Miles', color: 'from-slate-700 to-slate-800', iconColor: 'text-slate-200' },
                  { icon: Globe, value: '35', label: 'Countries', color: 'from-slate-600 to-slate-700', iconColor: 'text-slate-200' },
                  { icon: LocationIcon, value: '38', label: 'Cities', color: 'from-slate-700 to-slate-800', iconColor: 'text-slate-200' }
                ].map((stat, index) => (
                  <div key={index} className={`bg-gradient-to-br ${stat.color} p-3 lg:p-4 rounded-2xl text-center transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group/stat backdrop-blur-md bg-white/10 border border-white/20`}>
                    <stat.icon className={`w-6 lg:w-8 h-6 lg:h-8 ${stat.iconColor} mx-auto mb-2 group-hover/stat:scale-110 transition-transform duration-300`} />
                    <div className="text-xl lg:text-2xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-white/80 font-semibold uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col space-y-3 lg:space-y-4 w-full max-w-sm lg:w-64 mx-auto lg:mx-0">
                <button className="group relative bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-2xl transition-all duration-300 flex items-center justify-center text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 backdrop-blur-md bg-white/10 border border-white/20">
                  <Route className="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  My Trips
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button className="group relative bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold py-3 lg:py-4 px-6 lg:px-8 rounded-2xl transition-all duration-300 flex items-center justify-center text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 backdrop-blur-md bg-white/10 border border-white/20">
                  <MapPin className="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-3 group-hover:bounce transition-all duration-300" />
                  My Journey
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
