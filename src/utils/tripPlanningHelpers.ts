/**
 * Trip Planning Utility Functions
 * Shared helper functions for trip planning feature
 */

import { TripItinerary, WizardStep } from '@/types/tripPlanning';
import { WIZARD_STEPS } from '@/constants/tripPlanning';

/**
 * Get the next wizard step
 */
export function getNextWizardStep(currentStep: WizardStep): WizardStep | null {
  const currentIndex = WIZARD_STEPS.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === WIZARD_STEPS.length - 1) {
    return null;
  }
  return WIZARD_STEPS[currentIndex + 1];
}

/**
 * Get the previous wizard step
 */
export function getPreviousWizardStep(currentStep: WizardStep): WizardStep | null {
  const currentIndex = WIZARD_STEPS.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return WIZARD_STEPS[currentIndex - 1];
}

/**
 * Calculate trip duration in days
 */
export function calculateTripDuration(startDate: Date, endDate: Date): number {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

/**
 * Calculate total budget spent from itinerary
 */
export function calculateTotalSpent(itinerary: Partial<TripItinerary>): number {
  let total = 0;

  if (itinerary.flight?.price) {
    total += itinerary.flight.price;
  }

  if (itinerary.hotel?.pricePerNight && itinerary.dates) {
    const nights = calculateTripDuration(
      itinerary.dates.startDate,
      itinerary.dates.endDate
    );
    total += itinerary.hotel.pricePerNight * nights;
  }

  if (itinerary.selectedActivities) {
    total += itinerary.selectedActivities.reduce(
      (sum, activity) => sum + activity.price,
      0
    );
  }

  return total;
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date range
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  const start = startDate.toLocaleDateString('en-US', options);
  const end = endDate.toLocaleDateString('en-US', options);

  if (startDate.getFullYear() !== endDate.getFullYear()) {
    return `${start}, ${startDate.getFullYear()} - ${end}, ${endDate.getFullYear()}`;
  }

  return `${start} - ${end}, ${startDate.getFullYear()}`;
}

/**
 * Validate wizard step completion
 */
export function isStepComplete(
  step: WizardStep,
  itinerary: Partial<TripItinerary>
): boolean {
  switch (step) {
    case 'destination':
      return !!itinerary.destination?.city;
    case 'dates':
      return !!(itinerary.dates?.startDate && itinerary.dates?.endDate);
    case 'travelers':
      return !!itinerary.travelers && itinerary.travelers > 0;
    case 'budget':
      return !!itinerary.budget?.total && itinerary.budget.total > 0;
    case 'preferences':
      return !!(
        itinerary.preferences?.interests &&
        itinerary.preferences.interests.length > 0
      );
    case 'flights':
      return !!itinerary.flight;
    case 'hotels':
      return !!itinerary.hotel;
    case 'activities':
      return !!(
        itinerary.selectedActivities && itinerary.selectedActivities.length > 0
      );
    case 'review':
      return true; // Review is always "complete" if reached
    default:
      return false;
  }
}

/**
 * Calculate completion percentage
 */
export function calculateCompletionPercentage(
  itinerary: Partial<TripItinerary>
): number {
  const completedSteps = WIZARD_STEPS.filter((step) =>
    isStepComplete(step, itinerary)
  ).length;
  return Math.round((completedSteps / WIZARD_STEPS.length) * 100);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
