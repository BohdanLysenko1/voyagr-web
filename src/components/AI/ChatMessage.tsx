import React from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import TripPlanningWizard from './TripPlanningWizard';
import FlightCarousel from './FlightCarousel';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WizardStep, TripItinerary } from '@/types/tripPlanning';
import { FlightOption } from '@/types/flights';
import { useTripPlanningContext } from '@/contexts/TripPlanningContext';

export interface ChatMessageData {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  interactive?: {
    type: 'trip-wizard' | 'flight-results';
    currentStep?: WizardStep;
    itinerary?: Partial<TripItinerary>;
    flights?: FlightOption[];
    onSelectFlight?: (flight: FlightOption) => void;
  };
}

interface ChatMessageProps {
  message: ChatMessageData;
  isMobile?: boolean;
  isSidebarOpen?: boolean;
  gradientColors: string;
  accentColor: string;
  onWizardStepComplete?: (step: WizardStep, data: Partial<TripItinerary>) => void;
  onTripConfirm?: (itinerary: TripItinerary) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isMobile = false,
  isSidebarOpen = false,
  gradientColors,
  accentColor,
  onWizardStepComplete,
  onTripConfirm,
}) => {
  // Use context for live wizard state
  const { currentStep, itinerary } = useTripPlanningContext();
  
  const bubbleWidth = isMobile
    ? 'max-w-[calc(100%_-_5rem)]'
    : 'max-w-[calc(100%_-_4rem)] sm:max-w-[70ch] lg:max-w-[80ch]';

  const bubbleTone =
    message.sender === 'user'
      ? 'bg-gradient-to-br from-primary/16 via-white/96 to-white/88 border border-primary/25 shadow-[0_16px_32px_rgba(82,113,255,0.18)]'
      : 'bg-gradient-to-br from-white/96 via-white/88 to-white/78 border border-white/60 shadow-[0_12px_28px_rgba(15,23,42,0.12)]';

  const bubbleRadius =
    message.sender === 'user' ? 'rounded-3xl rounded-tr-xl' : 'rounded-3xl rounded-tl-xl';

  const bubblePadding = isMobile ? 'px-5 py-4' : 'px-4 py-4';

  return (
    <div
      className={`flex w-full max-w-full items-start ${isMobile ? 'gap-4' : 'gap-3'} ${
        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}
      style={{
        marginLeft:
          isMobile && isSidebarOpen && message.sender === 'ai' ? '20px' : '0',
      }}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
          message.sender === 'user'
            ? 'bg-primary/20 border-2 border-primary/30'
            : `bg-gradient-to-br ${gradientColors} border-2 border-white/40`
        }`}
      >
        {message.sender === 'user' ? (
          <User className="h-5 w-5 text-primary" />
        ) : (
          <Image
            src="/images/AIPage/Osunset.png"
            alt="AI Avatar"
            width={34}
            height={34}
            className="object-contain"
          />
        )}
      </div>

      <div className={`w-fit ${message.interactive ? 'overflow-visible' : 'overflow-hidden'} ${bubbleWidth} ${bubbleTone} ${bubbleRadius} ${bubblePadding}`}>
        <p className="text-sm font-medium leading-relaxed text-gray-900 whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {/* Interactive Elements */}
        {message.interactive && message.interactive.type === 'trip-wizard' && (
          <div className="mt-4">
            <ErrorBoundary>
              <TripPlanningWizard
                currentStep={currentStep}
                itinerary={itinerary}
                onStepComplete={(step, data) => onWizardStepComplete?.(step, data)}
                onTripConfirm={(itinerary) => onTripConfirm?.(itinerary)}
              />
            </ErrorBoundary>
          </div>
        )}

        {message.interactive && message.interactive.type === 'flight-results' && message.interactive.flights && (
          <div className="mt-4">
            <ErrorBoundary>
              <FlightCarousel
                flights={message.interactive.flights}
                onSelectFlight={message.interactive.onSelectFlight}
              />
            </ErrorBoundary>
          </div>
        )}

        <div className="mt-3 flex items-center justify-end gap-3 text-xs text-gray-600">
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;