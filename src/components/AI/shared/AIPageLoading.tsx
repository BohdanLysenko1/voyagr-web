'use client';

import { Loader2, Sparkles } from 'lucide-react';

interface AIPageLoadingProps {
  message?: string;
}

export default function AIPageLoading({ message = 'Loading...' }: AIPageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Animated loader */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 animate-spin">
          <div className="h-20 w-20 rounded-full border-4 border-transparent border-t-primary border-r-purple-500"></div>
        </div>
        
        {/* Inner pulsing circle */}
        <div className="flex items-center justify-center h-20 w-20">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center animate-pulse">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Loading message */}
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold text-gray-900 mb-2">{message}</p>
        <div className="flex items-center justify-center gap-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Skeleton cards preview */}
      <div className="mt-12 w-full max-w-2xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Minimal loading for faster transitions
export function AIPageLoadingMinimal() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Chat skeleton for AI interface
export function AIChatSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Chat messages skeleton */}
      <div className="flex-1 space-y-4 p-6">
        {/* AI message */}
        <div className="flex gap-3 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex-shrink-0"></div>
          <div className="flex-1 glass-card rounded-2xl p-4 max-w-[80%]">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>

        {/* User message */}
        <div className="flex gap-3 justify-end animate-pulse">
          <div className="flex-1 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-4 max-w-[70%]">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* AI message */}
        <div className="flex gap-3 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex-shrink-0"></div>
          <div className="flex-1 glass-card rounded-2xl p-4 max-w-[85%]">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Input skeleton */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="glass-card rounded-xl p-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
