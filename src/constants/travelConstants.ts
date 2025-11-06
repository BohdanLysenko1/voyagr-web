// Wizard step constants
export const WIZARD_STEPS = {
  DESTINATION: 'destination',
  DATES: 'dates',
  TRAVELERS: 'travelers',
  BUDGET: 'budget',
  PREFERENCES: 'preferences',
  FLIGHTS: 'flights',
  HOTELS: 'hotels',
  ACTIVITIES: 'activities',
  REVIEW: 'review',
} as const;

export type WizardStepKey = typeof WIZARD_STEPS[keyof typeof WIZARD_STEPS];

// Default airport codes
export const DEFAULT_AIRPORTS = {
  ORIGIN: 'JFK',
  DESTINATION: 'LHR',
} as const;

// Budget level constants
export const BUDGET_LEVELS = {
  BUDGET: 'budget',
  MODERATE: 'moderate',
  LUXURY: 'luxury',
} as const;

// Cabin class mapping
export const CABIN_CLASSES = {
  ECONOMY: 'ECONOMY',
  PREMIUM_ECONOMY: 'PREMIUM_ECONOMY',
  BUSINESS: 'BUSINESS',
  FIRST: 'FIRST',
} as const;

// Scroll thresholds
export const SCROLL_THRESHOLDS = {
  NEAR_BOTTOM: 100,
  AUTO_SCROLL_THRESHOLD: 50,
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  FOCUS_DELAY_MOBILE: 25,
  FOCUS_DELAY_DESKTOP: 250,
  SCROLL_TIMEOUT: 1500,
} as const;
