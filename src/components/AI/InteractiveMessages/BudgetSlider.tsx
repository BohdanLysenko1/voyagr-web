import React, { useState, useCallback, useMemo } from 'react';
import { DollarSign } from 'lucide-react';

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
}

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
  ]
}: BudgetSliderProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [totalBudget, setTotalBudget] = useState<number>(initialTotalBudget);
  const [budgetInput, setBudgetInput] = useState<string>(initialTotalBudget.toString());

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

  return (
    <div className="mt-4 space-y-4">
      {/* Total Budget Input */}
      <div className="glass-card rounded-xl p-4 border-2 border-primary/30">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Total Trip Budget
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => handleBudgetInputChange(e.target.value)}
            onWheel={(e) => e.currentTarget.blur()}
            min="0"
            step="100"
            className="w-full pl-10 pr-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg
                     focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all
                     bg-white text-gray-900"
            placeholder="Enter total budget"
          />
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Set your total budget, then allocate it across categories below
        </p>
      </div>

      {/* Visual Budget Breakdown Bar */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Budget Allocation
          </h4>
          <span className="text-sm font-bold text-primary">
            ${totalBudget.toLocaleString()}
          </span>
        </div>

        {/* Stacked Bar Chart */}
        <div className="flex h-3 rounded-full overflow-hidden mb-4 shadow-inner">
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
        <div className="space-y-4">
          {amounts.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <label className="text-sm font-medium text-gray-700">
                    {cat.label}
                  </label>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    ${cat.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({cat.value}%)
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cat.value}
                onChange={(e) => handleSliderChange(cat.id, Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer
                           bg-gray-200 slider-thumb"
                style={{
                  background: `linear-gradient(to right,
                    ${cat.color.replace('bg-', 'rgb(var(--')} 0%,
                    ${cat.color.replace('bg-', 'rgb(var(--')} ${cat.value}%,
                    #e5e7eb ${cat.value}%,
                    #e5e7eb 100%)`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2">
        {amounts.slice(0, 4).map((cat) => (
          <div key={cat.id} className="glass-card rounded-lg p-3 border border-white/40">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${cat.color}`} />
              <span className="text-xs text-gray-600">{cat.label}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              ${cat.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Confirm Budget Button */}
      {onConfirm && (
        <button
          onClick={onConfirm}
          disabled={totalBudget <= 0}
          className="w-full mt-4 px-6 py-3 text-base font-semibold text-white bg-primary rounded-xl
                   hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                   flex items-center justify-center gap-2"
        >
          <DollarSign className="w-5 h-5" />
          Confirm Budget Allocation
        </button>
      )}
    </div>
  );
}
