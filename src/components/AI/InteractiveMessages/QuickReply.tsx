import React, { useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface QuickReplyOption {
  id: string;
  label: string;
  value: string;
  emoji?: string;
}

interface QuickReplyProps {
  options: QuickReplyOption[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  selectedValues?: string[];
  gradientColors?: string;
}

export default function QuickReply({
  options,
  onSelect,
  multiSelect = false,
  selectedValues = [],
  gradientColors = 'from-primary/30 to-purple-500/30'
}: QuickReplyProps) {
  const handleSelect = useCallback((value: string) => {
    onSelect(value);
  }, [onSelect]);

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <button
            key={option.id}
            onClick={() => handleSelect(option.value)}
            disabled={!multiSelect && selectedValues.length > 0 && !isSelected}
            className={`
              group relative overflow-hidden rounded-xl px-4 py-2.5 text-sm font-medium
              transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
              ${
                isSelected
                  ? `bg-gradient-to-r ${gradientColors} border-2 border-primary/40 text-gray-900 shadow-lg`
                  : 'glass-card border border-white/40 text-gray-700 hover:border-primary/30 hover:shadow-md'
              }
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {option.emoji && <span className="text-base">{option.emoji}</span>}
              {option.label}
              {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
