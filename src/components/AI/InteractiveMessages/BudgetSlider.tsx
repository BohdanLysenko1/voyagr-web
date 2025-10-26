import React, { useState, useCallback, useMemo } from 'react';
import { DollarSign, TrendingUp, Lightbulb, Users, PiggyBank, Sparkles, ChevronDown } from 'lucide-react';

interface BudgetCategory {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface BudgetSliderProps {
  totalBudget: number;
  onBudgetChange: (categories: BudgetCategory[]) => void;
  onTotalBudgetChange?: (total: number) => void;
  onConfirm?: () => void;
  initialCategories?: BudgetCategory[];
  travelers?: number;
}

type BudgetPreset = {
  name: string;
  value: number;
  icon: string;
  description: string;
  color: string;
};

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export default function BudgetSlider({
  totalBudget: initialTotalBudget,
  onBudgetChange,
  onTotalBudgetChange,
  onConfirm,
  initialCategories = [
    { id: 'flights', label: 'Flights', value: 40, color: 'bg-blue-500' },
    { id: 'accommodation', label: 'Hotels', value: 30, color: 'bg-emerald-500' },
    { id: 'activities', label: 'Activities', value: 15, color: 'bg-purple-500' },
    { id: 'food', label: 'Food & Dining', value: 10, color: 'bg-orange-500' },
    { id: 'other', label: 'Other', value: 5, color: 'bg-gray-500' },
  ],
  travelers = 1,
}: BudgetSliderProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [totalBudget, setTotalBudget] = useState<number>(initialTotalBudget);
  const [budgetInput, setBudgetInput] = useState<string>(initialTotalBudget.toString());
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [currency, setCurrency] = useState<Currency>({
    code: 'USD',
    symbol: '$',
    name: 'US Dollar'
  });

  // Budget presets
  const budgetPresets: BudgetPreset[] = useMemo(() => [
    {
      name: 'Budget',
      value: 1500,
      icon: '💰',
      description: 'Economical travel',
      color: 'from-green-400 to-emerald-500'
    },
    {
      name: 'Moderate',
      value: 3500,
      icon: '✨',
      description: 'Comfortable trip',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      name: 'Luxury',
      value: 7500,
      icon: '👑',
      description: 'Premium experience',
      color: 'from-purple-400 to-pink-500'
    },
  ], []);

  // Available currencies
  const currencies: Currency[] = useMemo(() => [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  ], []);

  const handleBudgetInputChange = useCallback((value: string) => {
    setBudgetInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setTotalBudget(numValue);
      onTotalBudgetChange?.(numValue);
    }
  }, [onTotalBudgetChange]);

  const handleSliderChange = useCallback((categoryId: string, newValue: number) => {
    setCategories(prev => {
      const updatedCategories = prev.map(cat =>
        cat.id === categoryId ? { ...cat, value: newValue } : cat
      );

      // Normalize to ensure total is 100%
      const total = updatedCategories.reduce((sum, cat) => sum + cat.value, 0);
      if (total !== 100) {
        const diff = 100 - total;
        const otherCategories = updatedCategories.filter(cat => cat.id !== categoryId);
        const adjustment = diff / otherCategories.length;

        return updatedCategories.map(cat => {
          if (cat.id === categoryId) return cat;
          return { ...cat, value: Math.max(0, cat.value + adjustment) };
        });
      }

      onBudgetChange(updatedCategories);
      return updatedCategories;
    });
  }, [onBudgetChange]);

  const amounts = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      amount: (totalBudget * cat.value) / 100
    }));
  }, [categories, totalBudget]);

  // Calculate per-person budget
  const perPersonBudget = useMemo(() => {
    return totalBudget / travelers;
  }, [totalBudget, travelers]);

  // Generate smart suggestions
  const suggestions = useMemo(() => {
    const tips: string[] = [];
    
    amounts.forEach(cat => {
      if (cat.id === 'flights' && cat.value > 50) {
        tips.push(`Consider reducing flight budget to 35-40% for better balance`);
      }
      if (cat.id === 'accommodation' && cat.value < 20) {
        tips.push(`Allocating 25-35% to hotels ensures comfortable stays`);
      }
      if (cat.id === 'activities' && cat.value < 10) {
        tips.push(`Increase activities budget to 15-20% for memorable experiences`);
      }
      if (cat.id === 'food' && cat.value < 8) {
        tips.push(`Budget 10-15% for dining to enjoy local cuisine`);
      }
    });

    if (totalBudget < 2000) {
      tips.push('Look for budget airlines and hostels to save money');
    } else if (totalBudget > 6000) {
      tips.push('Consider premium experiences and luxury accommodations');
    }

    return tips.slice(0, 2);
  }, [amounts, totalBudget]);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: BudgetPreset) => {
    setTotalBudget(preset.value);
    setBudgetInput(preset.value.toString());
    setSelectedPreset(preset.name.toLowerCase());
    onTotalBudgetChange?.(preset.value);
  }, [onTotalBudgetChange]);

  // Handle currency change
  const handleCurrencyChange = useCallback((newCurrency: Currency) => {
    setCurrency(newCurrency);
    setShowCurrencyDropdown(false);
  }, []);

  return (
    <div className="mt-4 space-y-5">
      {/* Budget Presets */}
      <div className="grid grid-cols-3 gap-3">
        {budgetPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetSelect(preset)}
            className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300
                      backdrop-blur-xl border-2 group hover:scale-[1.02] active:scale-[0.98]
                      ${
                        selectedPreset === preset.name.toLowerCase()
                          ? 'border-primary shadow-lg shadow-primary/20 bg-gradient-to-br ' + preset.color
                          : 'border-white/40 hover:border-primary/50 bg-white/60 hover:bg-white/80'
                      }`}
          >
            <div className="relative z-10">
              <div className="text-3xl mb-2">{preset.icon}</div>
              <div className="text-sm font-bold text-gray-900">{preset.name}</div>
              <div className="text-xl font-bold text-gray-900 mb-1">
                {currency.symbol}{preset.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">{preset.description}</div>
            </div>
            {selectedPreset === preset.name.toLowerCase() && (
              <div className="absolute top-2 right-2">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Total Budget Input */}
      <div className="glass-card rounded-xl p-5 border-2 border-primary/30 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-primary" />
            Total Trip Budget
          </label>
          
          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700
                       bg-white/80 hover:bg-white rounded-lg border border-gray-300 hover:border-primary/50
                       transition-all duration-200"
            >
              {currency.symbol} {currency.code}
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showCurrencyDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200
                            z-50 max-h-60 overflow-y-auto">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr)}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors
                              flex items-center justify-between
                              ${
                                currency.code === curr.code
                                  ? 'bg-primary/10 text-primary font-semibold'
                                  : 'text-gray-700'
                              }`}
                  >
                    <span>{curr.name}</span>
                    <span className="font-semibold">{curr.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-700">
            {currency.symbol}
          </span>
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => {
              handleBudgetInputChange(e.target.value);
              setSelectedPreset('custom');
            }}
            onWheel={(e) => e.currentTarget.blur()}
            min="0"
            step="100"
            className="w-full pl-10 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl
                     focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all
                     bg-white text-gray-900 hover:border-gray-400"
            placeholder="Enter total budget"
          />
        </div>
        
        {/* Per-Person Budget */}
        {travelers > 1 && (
          <div className="mt-4 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50
                        rounded-lg border border-blue-200/50">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="w-4 h-4 text-primary" />
              <span>Per Person ({travelers} travelers)</span>
            </div>
            <span className="text-lg font-bold text-primary">
              {currency.symbol}{perPersonBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        )}
        
        <p className="mt-3 text-xs text-gray-600">
          💡 Drag the sliders below to allocate your budget across different categories
        </p>
      </div>

      {/* Visual Budget Breakdown Bar */}
      <div className="glass-card rounded-xl p-5 border border-white/60 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Budget Allocation
          </h4>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">
              {currency.symbol}{totalBudget.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total allocated</div>
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="flex h-4 rounded-full overflow-hidden mb-5 shadow-lg border border-gray-200">
          {amounts.map((cat) => (
            <div
              key={cat.id}
              className={`${cat.color} transition-all duration-300`}
              style={{ width: `${cat.value}%` }}
              title={`${cat.label}: ${cat.value}%`}
            />
          ))}
        </div>

        {/* Category Sliders */}
        <div className="space-y-5">
          {amounts.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full ${cat.color} shadow-sm`} />
                  <label className="text-sm font-semibold text-gray-800">
                    {cat.label}
                  </label>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-gray-900">
                    {currency.symbol}{cat.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {cat.value}% of budget
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cat.value}
                  onChange={(e) => handleSliderChange(cat.id, Number(e.target.value))}
                  className="w-full h-2.5 rounded-full appearance-none cursor-pointer
                             bg-gray-200 slider-thumb transition-all hover:h-3"
                  style={{
                    background: `linear-gradient(to right,
                      ${cat.color.replace('bg-', 'rgb(var(--')} 0%,
                      ${cat.color.replace('bg-', 'rgb(var(--')} ${cat.value}%,
                      #e5e7eb ${cat.value}%,
                      #e5e7eb 100%)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="glass-card rounded-xl p-5 border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-yellow-50/80">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Smart Budget Tips</h4>
              <ul className="space-y-2">
                {suggestions.map((tip, index) => (
                  <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {amounts.slice(0, 4).map((cat) => (
          <div key={cat.id} className="glass-card rounded-xl p-4 border border-white/60 shadow-md
                                      hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${cat.color} shadow-sm`} />
              <span className="text-xs font-semibold text-gray-600">{cat.label}</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {currency.symbol}{cat.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">{cat.value}% of total</p>
          </div>
        ))}
      </div>

      {/* Confirm Budget Button */}
      {onConfirm && (
        <button
          onClick={onConfirm}
          disabled={totalBudget <= 0}
          className="w-full px-6 py-4 text-base font-bold text-white bg-gradient-to-r from-primary to-purple-600
                   rounded-xl hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300
                   shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   flex items-center justify-center gap-2 group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Confirm Budget & Continue
          <span className="text-sm font-normal opacity-90">({currency.symbol}{totalBudget.toLocaleString()})</span>
        </button>
      )}
    </div>
  );
}
