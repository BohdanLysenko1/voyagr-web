import React from 'react';
import { Bot, User } from 'lucide-react';

export interface ChatMessageData {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessageData;
  isMobile?: boolean;
  isSidebarOpen?: boolean;
  gradientColors: string;
  accentColor: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isMobile = false,
  isSidebarOpen = false,
  gradientColors,
  accentColor,
}) => {
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
          <Bot className={`h-5 w-5 ${accentColor}`} />
        )}
      </div>

      <div className={`w-fit overflow-hidden ${bubbleWidth} ${bubbleTone} ${bubbleRadius} ${bubblePadding}`}>
        <p className="text-sm font-medium leading-relaxed text-gray-900 whitespace-pre-wrap break-words">
          {message.content}
        </p>
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