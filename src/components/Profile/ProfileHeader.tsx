'use client';

import { MapPin, User, Globe, Trophy, TrendingUp, Camera } from 'lucide-react';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';

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
  const defaultUser = {
    name: 'Alex Johnson',
    title: 'Gold Traveler',
    bio: 'Gold Traveler | Explorer at heart | Product designer by day, wanderer by weekend 🌟 | Obsessed with local coffee shops & hidden trails 🏔️☕ | Currently: Working remotely from Lisbon | 📍 Follow my journey',
    location: 'Lisbon, Portugal'
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
                {/* Avatar Container with hover camera overlay */}
                <div className="relative w-32 h-32 md:w-40 lg:w-48 md:h-40 lg:h-48 rounded-full bg-blue-100 shadow-lg flex items-center justify-center overflow-hidden group/avatar cursor-pointer">
                  <User className="w-20 h-20 text-blue-600" />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 rounded-full bg-black/35 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                    aria-hidden="true"
                    title="Change profile picture"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow">
                      <Camera className="w-5 h-5 text-gray-800" />
                    </div>
                    <span className="sr-only">Change profile picture</span>
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
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          <span className="mr-2">{item.icon}</span>
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-gray-700">{item.progress}%</span>
                      </div>
                      <div className="relative h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full overflow-hidden border border-white/50 shadow-inner">
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
              <ProfileStats />

              {/* Enhanced Action Buttons */}
              <ProfileActions className="w-full max-w-sm lg:w-64 mx-auto lg:mx-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
