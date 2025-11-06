import { forwardRef } from 'react';
import { Send } from 'lucide-react';

type TabKey = 'plan' | 'chat' | 'preferences' | 'flights' | 'hotels' | 'restaurants' | 'mapout';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  placeholder: string;
  disabled?: boolean;
  activeTab: TabKey;
  isMobile?: boolean;
}

const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(
  ({ value, onChange, onKeyDown, onSend, placeholder, disabled, activeTab, isMobile }, ref) => {
    const glowClass = 
      activeTab === 'flights' ? 'neon-glow-flights' :
      activeTab === 'hotels' ? 'neon-glow-hotels' :
      activeTab === 'restaurants' ? 'neon-glow-restaurants' :
      activeTab === 'mapout' ? 'neon-glow-mapout' :
      'neon-glow';

    return (
      <div className={`glass-input glow-ring ${glowClass} rounded-3xl transition-all duration-300 hover:shadow-xl`}>
        <div className="flex items-center gap-3 p-3 sm:p-4">
          <div className="relative flex-1">
            <label htmlFor="ai-input" className="sr-only">
              Message Voyagr AI
            </label>
            <textarea
              id="ai-input"
              ref={ref}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              enterKeyHint="send"
              className="w-full resize-none border-none bg-transparent py-0 text-base leading-6 text-gray-800 placeholder-gray-500 focus:border-none focus:outline-none focus:ring-0 sm:text-lg"
              rows={1}
              style={{ maxHeight: '120px', fontSize: '16px' }}
            />
          </div>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className={`inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              value.trim() && !disabled
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400'
            }`}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';

export default MessageInput;
