import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MapPin, Loader2, Plane, Navigation, PencilLine } from 'lucide-react';
import QuickReply from './InteractiveMessages/QuickReply';
import CalendarPicker from './InteractiveMessages/CalendarPicker';
import CardCarousel from './InteractiveMessages/CardCarousel';
import ActivityGrid from './InteractiveMessages/ActivityGrid';
import BudgetSlider from './InteractiveMessages/BudgetSlider';
import ConfirmationCard from './InteractiveMessages/ConfirmationCard';
import FlightModal from './FlightModal';
import { TripItinerary, WizardStep } from '@/types/tripPlanning';
import { useTripPlanningData } from '@/hooks/useTripPlanningData';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { FlightSearchParams, FlightOption } from '@/types/flights';
import { BUDGET_LIMITS, WIZARD_STEP_CONFIG } from '@/constants/tripPlanning';

interface TripPlanningWizardProps {
  onStepComplete: (step: WizardStep, data: Partial<TripItinerary>) => void;
  onTripConfirm: (itinerary: TripItinerary) => void;
  currentStep: WizardStep;
  itinerary: Partial<TripItinerary>;
  onAddUserMessage?: (message: string) => void;
}

export default function TripPlanningWizard({
  onStepComplete,
  onTripConfirm,
  currentStep,
  itinerary,
  onAddUserMessage
}: TripPlanningWizardProps) {
  const [locationMethod, setLocationMethod] = useState<'current' | 'manual' | null>(null);
  const [destinationPhase, setDestinationPhase] = useState<'origin' | 'destination'>('origin');
  const [selectedOrigin, setSelectedOrigin] = useState<string>(itinerary.origin?.city || '');
  const [selectedDestination, setSelectedDestination] = useState<string>(itinerary.destination?.city || '');
  const [selectedDates, setSelectedDates] = useState<{ from: Date; to?: Date }>();
  const [selectedTravelers, setSelectedTravelers] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<number>(BUDGET_LIMITS.DEFAULT);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [hasSearchedFlights, setHasSearchedFlights] = useState(false);

  // Get mock data from custom hook (in production, this would fetch from API)
  const {
    destinationOptions,
    travelerOptions,
    preferenceOptions,
    getFlightOptions,
    getHotelOptions,
    getActivityOptions,
  } = useTripPlanningData();

  // Use flight search hook for real-time flight search
  const { flights, loading: flightsLoading, error: flightsError, searchFlights } = useFlightSearch();

  // Sync state with itinerary when it changes
  useEffect(() => {
    if (itinerary.origin?.city && itinerary.origin.city !== selectedOrigin) {
      setSelectedOrigin(itinerary.origin.city);
    }
    if (itinerary.destination?.city && itinerary.destination.city !== selectedDestination) {
      setSelectedDestination(itinerary.destination.city);
    }
  }, [itinerary.origin, itinerary.destination, selectedOrigin, selectedDestination]);

  // Automatically transition to destination phase when origin is set
  useEffect(() => {
    if (currentStep === 'destination' && itinerary.origin && destinationPhase === 'origin') {
      setTimeout(() => {
        setDestinationPhase('destination');
        setLocationMethod(null);
      }, 500);
    }
  }, [currentStep, itinerary.origin, destinationPhase]);

  // City to IATA code mapping for automatic flight search
  const cityToIATA: Record<string, string> = {
    'paris': 'CDG', 'tokyo': 'NRT', 'new-york': 'JFK', 'bali': 'DPS',
    'rome': 'FCO', 'dubai': 'DXB', 'london': 'LHR', 'barcelona': 'BCN',
    'amsterdam': 'AMS', 'sydney': 'SYD', 'bangkok': 'BKK', 'singapore': 'SIN',
  };

  // Auto-search flights when flight step is reached
  useEffect(() => {
    if (currentStep === 'flights' && itinerary.destination && itinerary.dates && itinerary.travelers && !hasSearchedFlights) {
      const destinationCode = cityToIATA[itinerary.destination.city?.toLowerCase() || ''] || 'CDG';
      
      const searchParams: FlightSearchParams = {
        origin: 'JFK', // Default origin - could be user's location
        destination: destinationCode,
        departureDate: itinerary.dates.startDate.toISOString().split('T')[0],
        returnDate: itinerary.dates.endDate.toISOString().split('T')[0],
        adults: itinerary.travelers,
        cabinClass: 'ECONOMY',
        currencyCode: 'USD',
      };

      searchFlights(searchParams);
      setHasSearchedFlights(true);
    }
  }, [currentStep, itinerary.destination, itinerary.dates, itinerary.travelers, hasSearchedFlights, searchFlights]);

  // Auto-open modal when flights are loaded
  useEffect(() => {
    if (currentStep === 'flights' && !flightsLoading && flights.length > 0 && !isFlightModalOpen && hasSearchedFlights) {
      // Slight delay for smoother transition
      const timer = setTimeout(() => {
        setIsFlightModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Reset search state when leaving flights step
    if (currentStep !== 'flights' && hasSearchedFlights) {
      setHasSearchedFlights(false);
    }
  }, [currentStep, flightsLoading, flights.length, isFlightModalOpen, hasSearchedFlights]);

  // Location method options
  const locationMethodOptions = useMemo(() => [
    { 
      id: 'current', 
      label: 'Use My Location', 
      value: 'current',
      icon: Navigation
    },
    { 
      id: 'manual', 
      label: 'Manual Entry', 
      value: 'manual',
      icon: PencilLine
    },
  ], []);

  // Memoized options based on current selections
  const flightOptions = getFlightOptions(selectedDestination);
  const hotelOptions = getHotelOptions(selectedDestination);
  const activityOptions = getActivityOptions(selectedDestination, selectedPreferences);

  const handleLocationMethodSelect = useCallback((value: string) => {
    const method = value as 'current' | 'manual';
    setLocationMethod(method);
    
    if (method === 'current') {
      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Reverse geocode coordinates to get city name
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                {
                  headers: {
                    'Accept-Language': 'en-US,en;q=0.9',
                  }
                }
              );
              
              if (response.ok) {
                const data = await response.json();
                const city = data.address.city || 
                             data.address.town || 
                             data.address.village || 
                             data.address.municipality ||
                             data.address.county ||
                             'Your Location';
                const country = data.address.country || '';
                
                setSelectedOrigin(city);
                
                // Add user confirmation message with city name
                onAddUserMessage?.(city);
                
                // Update itinerary with origin and move to destination phase
                onStepComplete('destination', { 
                  origin: { 
                    city,
                    country,
                    lat: latitude,
                    lng: longitude
                  } 
                });
              } else {
                // Fallback if geocoding fails
                setSelectedOrigin('Your Location');
                onStepComplete('destination', { 
                  origin: { 
                    city: 'Your Location',
                    country: '',
                    lat: latitude,
                    lng: longitude
                  } 
                });
              }
              
              // Move to destination phase after a short delay
              setTimeout(() => {
                setDestinationPhase('destination');
                setLocationMethod(null);
              }, 500);
            } catch (error) {
              console.error('Error reverse geocoding:', error);
              // Fallback to coordinates display
              setSelectedOrigin('Your Location');
              onStepComplete('destination', { 
                origin: { 
                  city: 'Your Location',
                  country: '',
                  lat: latitude,
                  lng: longitude
                } 
              });
              setTimeout(() => {
                setDestinationPhase('destination');
                setLocationMethod(null);
              }, 500);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            // Fallback to manual entry if geolocation fails
            setLocationMethod('manual');
          }
        );
      } else {
        // Geolocation not supported, fallback to manual
        setLocationMethod('manual');
      }
    }
  }, [onStepComplete, onAddUserMessage]);

  const handleOriginSelect = useCallback((value: string) => {
    setSelectedOrigin(value);
    onStepComplete('destination', { 
      origin: { 
        city: value,
        country: ''
      } 
    });
    // Move to destination phase after origin is set
    setTimeout(() => {
      setDestinationPhase('destination');
      setLocationMethod(null);
    }, 500);
  }, [onStepComplete]);

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

  const handleFlightSelect = useCallback((flight: FlightOption) => {
    setSelectedFlight(flight.id);
    setIsFlightModalOpen(false);

    // Store the selected flight data
    onStepComplete('flights', {
      flight: {
        id: flight.id,
        airline: flight.airline,
        departure: flight.departure,
        arrival: flight.arrival,
        duration: flight.duration,
        price: flight.price,
        stops: flight.stops,
        selected: true
      }
    });
  }, [onStepComplete]);

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
            {/* ORIGIN PHASE */}
            {destinationPhase === 'origin' && (
              <>
                <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.destination.description}</p>
                
                {/* Location Method Selection */}
                {!locationMethod && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-3">How would you like to enter your location?</p>
                    <QuickReply
                      options={locationMethodOptions}
                      onSelect={handleLocationMethodSelect}
                      selectedValues={[]}
                      gradientColors="from-blue-500/30 to-indigo-500/30"
                    />
                  </div>
                )}

                {/* Manual Entry */}
                {locationMethod === 'manual' && (
                  <div className="mt-3 p-4 glass-card border-2 border-primary/30 rounded-xl">
                    <p className="text-sm font-medium text-gray-800">
                      💬 Type your starting location in the chat input below and press Enter
                    </p>
                    {selectedOrigin && (
                      <div className="mt-3 flex items-center gap-2 text-primary">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-semibold">{selectedOrigin}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Current Location */}
                {locationMethod === 'current' && (
                  <div className="mt-3 p-4 glass-card border-2 border-blue-500/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Navigation className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {selectedOrigin ? '📍 Using your current location' : '🔍 Getting your location...'}
                        </p>
                        {selectedOrigin && (
                          <p className="text-xs text-gray-600 mt-1">
                            ✅ Origin location saved
                          </p>
                        )}
                      </div>
                    </div>
                    {!selectedOrigin && (
                      <button
                        onClick={() => setLocationMethod('manual')}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        Enter manually instead
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* DESTINATION PHASE */}
            {destinationPhase === 'destination' && (
              <>
                <p className="text-gray-700 mb-2">Where would you like to go? 🌍</p>
                
                {/* Show origin for context */}
                {selectedOrigin && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-green-800">✅ Traveling from:</span> {selectedOrigin}
                    </p>
                  </div>
                )}

                {/* Destination Input */}
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
              </>
            )}
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
              travelers={itinerary.travelers || parseInt(selectedTravelers) || 1}
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

            {flightsLoading && (
              <div className="flex flex-col items-center justify-center py-16 glass-card rounded-xl border border-primary/20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-700 font-medium">Searching flights...</p>
                <p className="text-sm text-gray-500 mt-1">Finding the best options for your trip</p>
              </div>
            )}

            {flightsError && (
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-sm text-red-800 font-medium">{flightsError}</p>
                <button 
                  onClick={() => {
                    setHasSearchedFlights(false);
                  }}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {!flightsLoading && !flightsError && flights.length > 0 && !isFlightModalOpen && (
              <div className="p-8 glass-card rounded-xl border-2 border-primary/30 text-center">
                <div className="mb-4">
                  <Plane className="w-16 h-16 text-primary mx-auto mb-3" />
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    ✈️ {flights.length} Flight{flights.length !== 1 ? 's' : ''} Found!
                  </p>
                  <p className="text-sm text-gray-600">
                    Based on your trip to {itinerary.destination?.city}
                  </p>
                </div>
                <button
                  onClick={() => setIsFlightModalOpen(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold
                    hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-105 active:scale-95 transition-all duration-300
                    shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  View Flight Options
                </button>
              </div>
            )}

            {!flightsLoading && !flightsError && flights.length === 0 && hasSearchedFlights && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <p className="text-sm text-gray-600">No flights found for this route. Please try adjusting your dates or destination.</p>
                <button 
                  onClick={() => {
                    setHasSearchedFlights(false);
                  }}
                  className="mt-3 text-sm text-primary hover:text-primary/80 underline"
                >
                  Search again
                </button>
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

  return (
    <div className="w-full px-2 sm:px-4">
      {renderStep()}
      
      {/* Flight Selection Modal */}
      <FlightModal
        flights={flights}
        isOpen={isFlightModalOpen}
        onClose={() => setIsFlightModalOpen(false)}
        onSelectFlight={handleFlightSelect}
      />
    </div>
  );
}
