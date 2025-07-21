import React from 'react';
import { ChevronDown } from 'lucide-react';
import { RepeatOptions as IRepeatOptions } from '@/types/calendar';

interface RepeatOptionsProps {
  value: IRepeatOptions;
  onChange: <K extends keyof IRepeatOptions>(field: K, value: IRepeatOptions[K]) => void;
  className?: string;
}

export const RepeatOptions: React.FC<RepeatOptionsProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const frequencies = [
    { value: 'never', label: 'Never' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom' }
  ] as const;

  const intervalLabels = {
    daily: 'day(s)',
    weekly: 'week(s)', 
    monthly: 'month(s)',
    yearly: 'year(s)',
    custom: 'interval(s)'
  };

  const showIntervalInput = value.frequency !== 'never';
  const showEndOptions = value.frequency !== 'never';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Frequency Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Repeat
        </label>
        <div className="relative">
          <select
            value={value.frequency}
            onChange={(e) => onChange('frequency', e.target.value as IRepeatOptions['frequency'])}
            className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {frequencies.map(({ value: freq, label }) => (
              <option key={freq} value={freq}>{label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Interval Input */}
      {showIntervalInput && (
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-700">Every</label>
          <input
            type="number"
            min="1"
            max="999"
            value={value.interval}
            onChange={(e) => onChange('interval', Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-700">
            {intervalLabels[value.frequency as keyof typeof intervalLabels] || 'day(s)'}
          </span>
        </div>
      )}

      {/* End Options */}
      {showEndOptions && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            End repeat
          </label>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="endType"
                checked={!value.endDate && !value.count}
                onChange={() => {
                  onChange('endDate', '');
                  onChange('count', 0);
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Never</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="endType"
                checked={!!value.endDate}
                onChange={() => {
                  onChange('count', 0);
                  onChange('endDate', new Date().toISOString().split('T')[0]);
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">On date:</span>
              {!!value.endDate && (
                <input
                  type="date"
                  value={value.endDate}
                  onChange={(e) => onChange('endDate', e.target.value)}
                  className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="endType"
                checked={!!value.count && value.count > 0}
                onChange={() => {
                  onChange('endDate', '');
                  onChange('count', 10);
                }}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">After:</span>
              {!!value.count && value.count > 0 && (
                <>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={value.count}
                    onChange={(e) => onChange('count', Math.max(1, parseInt(e.target.value) || 1))}
                    className="ml-2 w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-700">occurrences</span>
                </>
              )}
            </label>
          </div>
        </div>
      )}
    </div>
  );
};