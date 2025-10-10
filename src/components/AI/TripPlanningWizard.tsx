import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import QuickReply from './InteractiveMessages/QuickReply';
import CalendarPicker from './InteractiveMessages/CalendarPicker';
import CardCarousel from './InteractiveMessages/CardCarousel';
import ActivityGrid from './InteractiveMessages/ActivityGrid';
import BudgetSlider from './InteractiveMessages/BudgetSlider';
import ConfirmationCard from './InteractiveMessages/ConfirmationCard';
import AirportSearch from './InteractiveMessages/AirportSearch';
import { TripItinerary, WizardStep } from '@/types/tripPlanning';
import { useTripPlanningData } from '@/hooks/useTripPlanningData';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { Airport, FlightSearchParams } from '@/types/flights';
import { BUDGET_LIMITS, WIZARD_STEP_CONFIG } from '@/constants/tripPlanning';

interface TripPlanningWizardProps {
  onStepComplete: (step: WizardStep, data: Partial<TripItinerary>) => void;
  onTripConfirm: (itinerary: TripItinerary) => void;
  currentStep: WizardStep;
  itinerary: Partial<TripItinerary>;
}

export default function TripPlanningWizard({
  onStepComplete,
  onTripConfirm,
  currentStep,
  itinerary
}: TripPlanningWizardProps) {
  const [selectedDestination, setSelectedDestination] = useState<string>(itinerary.destination?.city || '');
  const [selectedDates, setSelectedDates] = useState<{ from: Date; to?: Date }>();
  const [selectedTravelers, setSelectedTravelers] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<number>(BUDGET_LIMITS.DEFAULT);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<Airport | null>(null);
  const [selectedDestinationAirport, setSelectedDestinationAirport] = useState<Airport | null>(null);

  // Get mock data from custom hook (in production, this would fetch from API)
  const {
    destinationOptions,
    travelerOptions,
    preferenceOptions,
    getFlightOptions,
    getHotelOptions,
    getActivityOptions,
  } = useTripPlanningData();

  // Use flight search hook for real-time Amadeus API integration
  const { flights, loading: flightsLoading, error: flightsError, searchFlights } = useFlightSearch();

  // Sync state with itinerary when it changes
  useEffect(() => {
    if (itinerary.destination?.city && itinerary.destination.city !== selectedDestination) {
      setSelectedDestination(itinerary.destination.city);
    }
  }, [itinerary.destination, selectedDestination]);

  // Auto-search flights when we have all required data
  useEffect(() => {
    if (selectedOrigin && selectedDestinationAirport && itinerary.dates && itinerary.travelers) {
      const searchParams: FlightSearchParams = {
        origin: selectedOrigin.iataCode,
        destination: selectedDestinationAirport.iataCode,
        departureDate: itinerary.dates.startDate.toISOString().split('T')[0],
        returnDate: itinerary.dates.endDate.toISOString().split('T')[0],
        adults: itinerary.travelers,
        cabinClass: 'ECONOMY',
        currencyCode: 'USD',
      };

      searchFlights(searchParams);
    }
  }, [selectedOrigin, selectedDestinationAirport, itinerary.dates, itinerary.travelers, searchFlights]);

  // Memoized options based on current selections
  const flightOptions = getFlightOptions(selectedDestination);
  const hotelOptions = getHotelOptions(selectedDestination);
  const activityOptions = getActivityOptions(selectedDestination, selectedPreferences);

  const handleDestinationSelect = useCallback((value: string) => {
    setSelectedDestination(value);
    onStepComplete('destination', { 
      destination: { 
        city: value,
        country: ''
      } 
    });
  }, [onStepComplete]);

  const handleDatesSelect = useCallback((dates: { from: Date; to?: Date }) => {
    setSelectedDates(dates);
    if (dates.to) {
      onStepComplete('dates', { 
        dates: { 
          startDate: dates.from, 
          endDate: dates.to 
        } 
      });
    }
  }, [onStepComplete]);

  const handleTravelersSelect = useCallback((value: string) => {
    setSelectedTravelers(value);
    const numTravelers = parseInt(value, 10);
    if (!isNaN(numTravelers) && numTravelers > 0) {
      onStepComplete('travelers', { travelers: numTravelers });
    }
  }, [onStepComplete]);

  const handleTotalBudgetChange = useCallback((total: number) => {
    setSelectedBudget(total);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBudgetChange = useCallback((_categories: unknown) => {
    // Budget categories are handled internally by BudgetSlider
    // This callback is required by BudgetSlider but not used in wizard flow
  }, []);

  const handleBudgetConfirm = useCallback(() => {
    if (selectedBudget >= BUDGET_LIMITS.MIN && selectedBudget <= BUDGET_LIMITS.MAX) {
      onStepComplete('budget', {
        budget: {
          total: selectedBudget,
          currency: 'USD',
          breakdown: {
            flights: 0,
            accommodation: 0,
            activities: 0,
            food: 0,
            other: 0
          }
        }
      });
    }
  }, [onStepComplete, selectedBudget]);

  const handlePreferenceToggle = useCallback((value: string) => {
    setSelectedPreferences(prev => {
      const newPrefs = prev.includes(value)
        ? prev.filter(p => p !== value)
        : [...prev, value];
      return newPrefs;
    });
  }, []);

  const handlePreferencesConfirm = useCallback(() => {
    if (selectedPreferences.length > 0) {
      onStepComplete('preferences', {
        preferences: {
          travelStyle: '',
          pace: 'moderate' as const,
          interests: selectedPreferences
        }
      });
    }
  }, [onStepComplete, selectedPreferences]);

  const handleFlightSelect = useCallback((flightId: string) => {
    setSelectedFlight(flightId);

    // Find and store the selected flight data from Amadeus results
    const selectedFlightData = flights.find(f => f.id === flightId);
    if (selectedFlightData) {
      onStepComplete('flights', {
        flight: {
          id: selectedFlightData.id,
          airline: selectedFlightData.airline,
          departure: selectedFlightData.departure,
          arrival: selectedFlightData.arrival,
          duration: selectedFlightData.duration,
          price: selectedFlightData.price,
          stops: selectedFlightData.stops,
          selected: true
        }
      });
    }
  }, [flights, onStepComplete]);

  const handleFlightConfirm = useCallback(() => {
    // Flight is already stored on selection, just move to next step
    if (selectedFlight) {
      // The step completion already happened in handleFlightSelect
      return;
    }
  }, [selectedFlight]);

  const handleHotelSelect = useCallback((hotelId: string) => {
    setSelectedHotel(hotelId);

    // Find and store the selected hotel data
    const selectedHotelData = hotelOptions.find(h => h.id === hotelId);
    if (selectedHotelData) {
      onStepComplete('hotels', {
        hotel: {
          id: selectedHotelData.id,
          name: selectedHotelData.title,
          rating: selectedHotelData.rating || 0,
          pricePerNight: selectedHotelData.price || 0,
          amenities: selectedHotelData.details || [],
          image: selectedHotelData.image,
          selected: true
        }
      });
    }
  }, [hotelOptions, onStepComplete]);

  const handleHotelConfirm = useCallback(() => {
    // Hotel is already stored on selection, just move to next step
    if (selectedHotel) {
      // The step completion already happened in handleHotelSelect
      return;
    }
  }, [selectedHotel]);

  const handleActivityToggle = useCallback((activityId: string) => {
    setSelectedActivities(prev => {
      const newActivities = prev.includes(activityId)
        ? prev.filter(a => a !== activityId)
        : [...prev, activityId];
      return newActivities;
    });
  }, []);

  const handleActivitiesConfirm = useCallback(() => {
    // Note: In production, you'd fetch the full activity objects here
    onStepComplete('activities', { selectedActivities: [] });
  }, [onStepComplete]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'destination':
        return (
          <div>
            <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.destination.description}</p>
            <div className="mt-3 p-4 glass-card border-2 border-primary/30 rounded-xl">
              <p className="text-sm font-medium text-gray-800">
                💬 Type your destination in the chat input below and press Enter
              </p>
              {selectedDestination && (
                <div className="mt-3 flex items-center gap-2 text-primary">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-semibold">{selectedDestination}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'dates':
        return (
          <div>
            <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.dates.description}</p>
            <CalendarPicker
              mode="range"
              onDateSelect={handleDatesSelect}
              minDate={new Date()}
              initialRange={selectedDates ? { from: selectedDates.from, to: selectedDates.to } : undefined}
            />
            {selectedDates?.from && selectedDates?.to && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm font-medium text-green-800">
                  ✅ Trip duration: {Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            )}
          </div>
        );

      case 'travelers':
        return (
          <div>
            <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.travelers.description}</p>
            <QuickReply
              options={travelerOptions}
              onSelect={handleTravelersSelect}
              selectedValues={selectedTravelers ? [selectedTravelers] : []}
            />
          </div>
        );

      case 'budget':
        return (
          <div>
            <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.budget.description}</p>
            <BudgetSlider
              totalBudget={selectedBudget}
              onBudgetChange={handleBudgetChange}
              onTotalBudgetChange={handleTotalBudgetChange}
              onConfirm={handleBudgetConfirm}
            />
          </div>
        );

      case 'preferences':
        return (
          <div>
            <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.preferences.description} (Select all that apply)</p>
            <QuickReply
              options={preferenceOptions}
              onSelect={handlePreferenceToggle}
              multiSelect
              selectedValues={selectedPreferences}
            />
            {selectedPreferences.length > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handlePreferencesConfirm}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-medium
                    hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        );

      case 'flights':
        return (
          <div>
            <p className="text-gray-700 mb-4">{WIZARD_STEP_CONFIG.flights.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <AirportSearch
                label="From"
                placeholder="Departure airport..."
                onSelect={setSelectedOrigin}
              />
              <AirportSearch
                label="To"
                placeholder="Arrival airport..."
                onSelect={setSelectedDestinationAirport}
              />
            </div>

            {flightsLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="ml-3 text-gray-600">Searching flights...</span>
              </div>
            )}

            {flightsError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-800">{flightsError}</p>
              </div>
            )}

            {!flightsLoading && !flightsError && flights.length > 0 && (
              <CardCarousel
                cards={flights.map(flight => ({
                  id: flight.id,
                  title: flight.airline,
                  subtitle: `${flight.departure} → ${flight.arrival}`,
                  price: flight.price,
                  details: [
                    flight.stops === 0 ? 'Direct flight' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`,
                    flight.duration,
                    flight.cabinClass,
                  ],
                  badge: flight.stops === 0 ? 'Direct' : undefined,
                }))}
                onCardSelect={handleFlightSelect}
                selectedCardId={selectedFlight}
                showPrice
                onConfirm={handleFlightConfirm}
              />
            )}

            {!flightsLoading && !flightsError && flights.length === 0 && selectedOrigin && selectedDestinationAirport && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <p className="text-sm text-gray-600">No flights found for this route. Try different airports.</p>
              </div>
            )}
          </div>
        );

      case 'hotels':
        return (
          <div>
            <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.hotels.description}</p>
            <CardCarousel
              cards={hotelOptions}
              onCardSelect={handleHotelSelect}
              selectedCardId={selectedHotel}
              showPrice
              showRating
              onConfirm={handleHotelConfirm}
            />
          </div>
        );

      case 'activities':
        return (
          <div>
            <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.activities.description}</p>
            <ActivityGrid
              activities={activityOptions}
              onActivityToggle={handleActivityToggle}
              selectedActivityIds={selectedActivities}
              maxSelections={5}
              onConfirm={handleActivitiesConfirm}
            />
          </div>
        );

      case 'review':
        return itinerary as TripItinerary ? (
          <div>
            <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.review.description}</p>
            <ConfirmationCard
              itinerary={itinerary as TripItinerary}
              onConfirm={() => onTripConfirm(itinerary as TripItinerary)}
              onEdit={() => {/* Handle edit */}}
            />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return <div className="w-full px-2 sm:px-4">{renderStep()}</div>;
}
