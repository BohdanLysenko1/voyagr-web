import React from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TripPlanningWizard from './TripPlanningWizard';
import FlightList from './FlightList';
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
  onAddUserMessage?: (message: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isMobile = false,
  isSidebarOpen = false,
  gradientColors,
  accentColor,
  onWizardStepComplete,
  onTripConfirm,
  onAddUserMessage,
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
        <div className="prose prose-sm max-w-none text-gray-900">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Paragraphs
              p: ({ children }) => (
                <p className="mb-3 last:mb-0 text-sm font-medium leading-relaxed">
                  {children}
                </p>
              ),
              // Headings
              h1: ({ children }) => (
                <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h3>
              ),
              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-5 mb-3 space-y-1.5">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-5 mb-3 space-y-1.5">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-sm leading-relaxed pl-1">{children}</li>
              ),
              // Strong/Bold
              strong: ({ children }) => (
                <strong className="font-bold text-gray-900">{children}</strong>
              ),
              // Emphasis/Italic
              em: ({ children }) => (
                <em className="italic text-gray-800">{children}</em>
              ),
              // Code
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-gray-100 text-primary px-1.5 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-gray-100 text-gray-900 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                    {children}
                  </code>
                );
              },
              // Links
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline font-medium"
                >
                  {children}
                </a>
              ),
              // Blockquote
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 italic text-gray-700 my-3">
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Interactive Elements */}
        {message.interactive && message.interactive.type === 'trip-wizard' && (
          <div className="mt-4">
            <ErrorBoundary>
              <TripPlanningWizard
                currentStep={currentStep}
                itinerary={itinerary}
                onStepComplete={(step, data) => onWizardStepComplete?.(step, data)}
                onTripConfirm={(itinerary) => onTripConfirm?.(itinerary)}
                onAddUserMessage={onAddUserMessage}
              />
            </ErrorBoundary>
          </div>
        )}

        {message.interactive && message.interactive.type === 'flight-results' && message.interactive.flights && (
          <div className="mt-3">
            <ErrorBoundary>
              <FlightList
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