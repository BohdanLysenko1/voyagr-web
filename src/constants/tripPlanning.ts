/**
 * Trip Planning Constants
 * Centralized constants for the trip planning feature
 */

import { WizardStep } from '@/types/tripPlanning';

/**
 * Ordered array of wizard steps
 */
export const WIZARD_STEPS: WizardStep[] = [
  'destination',
  'dates',
  'travelers',
  'budget',
  'preferences',
  'flights',
  'hotels',
  'activities',
  'review',
];

/**
 * Wizard step metadata
 */
export const WIZARD_STEP_CONFIG: Record<
  WizardStep,
  {
    title: string;
    description: string;
    icon: string;
  }
> = {
  destination: {
    title: 'Choose Destination',
    description: 'Where would you like to go?',
    icon: '🌍',
  },
  dates: {
    title: 'Select Dates',
    description: 'When are you planning to travel?',
    icon: '📅',
  },
  travelers: {
    title: 'Number of Travelers',
    description: 'How many people are traveling?',
    icon: '👥',
  },
  budget: {
    title: 'Set Budget',
    description: "Let's allocate your budget",
    icon: '💰',
  },
  preferences: {
    title: 'Travel Preferences',
    description: 'What interests you most?',
    icon: '⭐',
  },
  flights: {
    title: 'Choose Flight',
    description: 'Select your preferred flight',
    icon: '✈️',
  },
  hotels: {
    title: 'Select Hotel',
    description: 'Pick your accommodation',
    icon: '🏨',
  },
  activities: {
    title: 'Plan Activities',
    description: 'What would you like to do?',
    icon: '🎯',
  },
  review: {
    title: 'Review & Confirm',
    description: 'Review your trip details',
    icon: '✅',
  },
};

/**
 * Default budget allocation percentages
 */
export const DEFAULT_BUDGET_ALLOCATION = {
  flights: 35,
  accommodation: 30,
  activities: 20,
  food: 10,
  other: 5,
};

/**
 * Budget limits
 */
export const BUDGET_LIMITS = {
  MIN: 500,
  MAX: 50000,
  DEFAULT: 3000,
};

/**
 * Activity selection limits
 */
export const ACTIVITY_LIMITS = {
  MIN: 1,
  MAX: 10,
  RECOMMENDED: 5,
};

/**
 * Date constraints
 */
export const DATE_CONSTRAINTS = {
  MIN_TRIP_DAYS: 1,
  MAX_TRIP_DAYS: 365,
  MAX_ADVANCE_BOOKING_DAYS: 365,
};

/**
 * Glassmorphism gradient presets for different tabs
 */
export const GRADIENT_PRESETS = {
  primary: 'from-primary/30 to-purple-500/30',
  flights: 'from-sky-400/30 to-blue-500/30',
  hotels: 'from-orange-400/30 to-amber-500/30',
  restaurants: 'from-purple-400/30 to-violet-500/30',
  plan: 'from-primary/30 to-purple-500/30',
};

/**
 * Animation durations (in ms)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};
