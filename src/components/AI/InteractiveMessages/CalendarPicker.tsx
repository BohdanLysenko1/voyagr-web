import React, { useState, useCallback } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { Calendar, X } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface CalendarPickerProps {
  mode?: 'single' | 'range';
  onDateSelect: (dates: { from: Date; to?: Date }) => void;
  minDate?: Date;
  maxDate?: Date;
  initialRange?: DateRange;
}

export default function CalendarPicker({
  mode = 'range',
  onDateSelect,
  minDate = new Date(),
  maxDate,
  initialRange
}: CalendarPickerProps) {
  const [range, setRange] = useState<DateRange | undefined>(initialRange);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback((selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
  }, []);

  const handleDone = useCallback(() => {
    if (range?.from && range?.to) {
      onDateSelect({
        from: range.from,
        to: range.to
      });
      setIsOpen(false);
    }
  }, [range, onDateSelect]);

  const formatDateRange = () => {
    if (!range?.from) return 'Select start and end dates';
    const fromStr = range.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (mode === 'single' || !range.to) return `${fromStr} - Select end date`;
    const toStr = range.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${fromStr} - ${toStr}`;
  };

  return (
    <div className="mt-3 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card border border-white/40 rounded-xl px-4 py-3 w-full text-left
                   hover:border-primary/30 hover:shadow-md transition-all duration-300
                   flex items-center justify-between group"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar className="w-4 h-4 text-primary" />
          {formatDateRange()}
        </span>
        {isOpen && (
          <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 glass-panel rounded-lg shadow-xl
                        border border-white/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 
                        w-[340px] flex flex-col">
          <div className="px-2 pt-2 pb-1">
            <p className="text-[10px] font-medium text-gray-600">
              {!range?.from && '📅 Click to select start date'}
              {range?.from && !range?.to && '📅 Now select end date'}
              {range?.from && range?.to && '✅ Dates selected!'}
            </p>
          </div>
          <style jsx global>{`
            .compact-calendar .rdp {
              --rdp-cell-size: 32px;
              font-size: 0.75rem;
              margin: 0;
            }
            .compact-calendar .rdp-caption {
              font-size: 0.8rem;
              margin-bottom: 0.25rem;
            }
            .compact-calendar .rdp-head_cell {
              font-size: 0.65rem;
            }
            .compact-calendar .rdp-day {
              font-size: 0.7rem;
            }
            .compact-calendar .rdp-months {
              margin: 0;
            }
          `}</style>
          <div className="compact-calendar px-2 flex-shrink-0">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleSelect}
              disabled={{ before: minDate, after: maxDate }}
              numberOfMonths={1}
              modifiersClassNames={{
                selected: 'bg-primary text-white rounded-md font-semibold',
                today: 'font-bold text-primary border-2 border-primary rounded-md',
                disabled: 'text-gray-300 cursor-not-allowed',
              }}
            />
          </div>
          <div className="flex gap-1.5 p-2 pt-1.5 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-2.5 py-1 text-[11px] font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              disabled={!range?.from || !range?.to}
              className="flex-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
