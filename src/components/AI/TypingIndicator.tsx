import React from 'react';
import Image from 'next/image';

interface TypingIndicatorProps {
  isMobile?: boolean;
  isSidebarOpen?: boolean;
  gradientColors: string;
  accentColor: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isMobile = false,
  isSidebarOpen = false,
  gradientColors,
  accentColor,
}) => {
  return (
    <div
      className={`flex items-start ${isMobile ? 'gap-4' : 'gap-3'}`}
      style={{
        marginLeft: isMobile && isSidebarOpen ? '20px' : '0',
      }}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradientColors} border-2 border-white/40`}
      >
        <Image
          src="/images/AIPage/Osunset.png"
          alt="AI Avatar"
          width={34}
          height={34}
          className="object-contain"
        />
      </div>
      <div
        className={`w-fit overflow-hidden ${
          isMobile
            ? 'max-w-[calc(100%_-_5rem)]'
            : 'max-w-[calc(100%_-_4rem)] sm:max-w-[70ch] lg:max-w-[80ch]'
        } rounded-3xl rounded-tl-xl border border-white/60 bg-gradient-to-br from-white/96 via-white/88 to-white/80 ${
          isMobile ? 'p-5' : 'p-4'
        } shadow-[0_12px_28px_rgba(15,23,42,0.12)]`}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div
              className={`h-2 w-2 rounded-full animate-bounce ${accentColor.replace('text-', 'bg-')}`}
            />
            <div
              className={`h-2 w-2 rounded-full animate-bounce delay-100 ${accentColor.replace('text-', 'bg-')}`}
            />
            <div
              className={`h-2 w-2 rounded-full animate-bounce delay-200 ${accentColor.replace('text-', 'bg-')}`}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">AI is typing...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;