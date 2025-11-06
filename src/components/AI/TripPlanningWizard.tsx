import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MapPin, Loader2, Plane, Navigation, PencilLine } from 'lucide-react';
import QuickReply from './InteractiveMessages/QuickReply';
import CalendarPicker from './InteractiveMessages/CalendarPicker';
import CardCarousel from './InteractiveMessages/CardCarousel';
import ActivityGrid from './InteractiveMessages/ActivityGrid';
import BudgetSlider from './InteractiveMessages/BudgetSlider';
import ConfirmationCard from './InteractiveMessages/ConfirmationCard';
import FlightList from './FlightList';
import { TripItinerary, WizardStep } from '@/types/tripPlanning';
import { useTripPlanningData } from '@/hooks/useTripPlanningData';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useHotelSearch } from '@/hooks/useHotelSearch';
import { useRestaurantSearch } from '@/hooks/useRestaurantSearch';
import { useAttractionSearch } from '@/hooks/useAttractionSearch';
import { FlightSearchParams, FlightOption } from '@/types/flights';
import { BUDGET_LIMITS, WIZARD_STEP_CONFIG } from '@/constants/tripPlanning';
import { useTripPlanningContext } from '@/contexts/TripPlanningContext';

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
  // Get context for sharing destination phase with the page
  const { destinationPhase, setDestinationPhase } = useTripPlanningContext();

  const [locationMethod, setLocationMethod] = useState<'current' | 'manual' | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string>(itinerary.origin?.city || '');
  const [selectedCountry, setSelectedCountry] = useState<string>(itinerary.destination?.country || '');
  const [selectedDestination, setSelectedDestination] = useState<string>(itinerary.destination?.city || '');
  const [popularCities, setPopularCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [popularCountries, setPopularCountries] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ from: Date; to?: Date }>();
  const [selectedTravelers, setSelectedTravelers] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<number>(BUDGET_LIMITS.DEFAULT);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [selectedHotel, setSelectedHotel] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [hasSearchedFlights, setHasSearchedFlights] = useState(false);
  const [hasSearchedHotels, setHasSearchedHotels] = useState(false);
  const [hasSearchedActivities, setHasSearchedActivities] = useState(false);

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

  // Use hotel search hook for real-time hotel search
  const { hotels, loading: hotelsLoading, error: hotelsError, searchHotels } = useHotelSearch();

  // Use restaurant search hook
  const { restaurants, loading: restaurantsLoading, error: restaurantsError, searchRestaurants } = useRestaurantSearch();

  // Use attraction search hook
  const { attractions, loading: attractionsLoading, error: attractionsError, searchAttractions } = useAttractionSearch();

  // Sync state with itinerary when it changes
  useEffect(() => {
    if (itinerary.origin?.city && itinerary.origin.city !== selectedOrigin) {
      setSelectedOrigin(itinerary.origin.city);
    }
    if (itinerary.destination?.city && itinerary.destination.city !== selectedDestination) {
      setSelectedDestination(itinerary.destination.city);
    }
  }, [itinerary.origin, itinerary.destination, selectedOrigin, selectedDestination]);

  // Fetch popular countries
  const fetchPopularCountries = useCallback(async () => {
    setLoadingCountries(true);
    try {
      const response = await fetch('http://localhost:4000/api/ai/countries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }

      const data = await response.json();
      setPopularCountries(data.data.countries || []);
    } catch (error) {
      console.error('Error fetching popular countries:', error);
      // Fallback to empty array if API fails
      setPopularCountries([]);
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  // Automatically transition to country phase when origin is set
  useEffect(() => {
    if (currentStep === 'destination' && itinerary.origin && destinationPhase === 'origin') {
      setTimeout(() => {
        setDestinationPhase('country');
        setLocationMethod(null);
        // Fetch popular countries when transitioning to country phase
        fetchPopularCountries();
      }, 500);
    }
  }, [currentStep, itinerary.origin, destinationPhase, setDestinationPhase, fetchPopularCountries]);

  // Fetch popular cities when country is selected
  const fetchPopularCities = useCallback(async (country: string) => {
    setLoadingCities(true);
    try {
      const response = await fetch('http://localhost:4000/api/ai/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }

      const data = await response.json();
      setPopularCities(data.data.cities || []);
    } catch (error) {
      console.error('Error fetching popular cities:', error);
      // Fallback to empty array if API fails
      setPopularCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  // When country is selected, fetch cities and move to city phase
  const handleCountrySelect = useCallback((country: string) => {
    setSelectedCountry(country);
    fetchPopularCities(country);
    setDestinationPhase('city');
  }, [fetchPopularCities, setDestinationPhase]);

  // Handle user messages during destination phase
  useEffect(() => {
    if (!onAddUserMessage) return;

    // Intercept user messages for manual entry during destination step
    const handleUserInput = (event: CustomEvent<{ message: string }>) => {
      const message = event.detail.message.trim();

      if (currentStep === 'destination' && message) {
        // Country phase - user typed a country name
        if (destinationPhase === 'country') {
          handleCountrySelect(message);
        }
        // City phase - user typed a city name
        else if (destinationPhase === 'city' && selectedCountry) {
          setSelectedDestination(message);
          onStepComplete('destination', {
            destination: { city: message, country: selectedCountry }
          });
        }
        // Origin phase (manual) - user typed origin
        else if (destinationPhase === 'origin' && locationMethod === 'manual') {
          setSelectedOrigin(message);
          onStepComplete('destination', {
            origin: { city: message, country: '' }
          });
        }
      }
    };

    // Listen for user messages
    window.addEventListener('userMessageSent', handleUserInput as EventListener);
    return () => {
      window.removeEventListener('userMessageSent', handleUserInput as EventListener);
    };
  }, [currentStep, destinationPhase, selectedCountry, locationMethod, onStepComplete, onAddUserMessage, handleCountrySelect]);

  // City to IATA code mapping for automatic flight search (expanded mapping)
  const cityToIATA: Record<string, string> = {
    // North America
    'new york': 'JFK', 'new-york': 'JFK', 'nyc': 'JFK', 'manhattan': 'JFK',
    'los angeles': 'LAX', 'la': 'LAX', 'chicago': 'ORD', 'miami': 'MIA',
    'san francisco': 'SFO', 'sf': 'SFO', 'boston': 'BOS', 'seattle': 'SEA',
    'washington': 'DCA', 'dc': 'DCA', 'atlanta': 'ATL', 'dallas': 'DFW',
    'houston': 'IAH', 'phoenix': 'PHX', 'philadelphia': 'PHL', 'las vegas': 'LAS',
    'orlando': 'MCO', 'denver': 'DEN', 'toronto': 'YYZ', 'vancouver': 'YVR',
    'montreal': 'YUL', 'mexico city': 'MEX',

    // Europe
    'london': 'LHR', 'paris': 'CDG', 'rome': 'FCO', 'barcelona': 'BCN',
    'amsterdam': 'AMS', 'berlin': 'BER', 'madrid': 'MAD', 'vienna': 'VIE',
    'zurich': 'ZRH', 'munich': 'MUC', 'frankfurt': 'FRA', 'milan': 'MXP',
    'venice': 'VCE', 'athens': 'ATH', 'lisbon': 'LIS', 'dublin': 'DUB',
    'copenhagen': 'CPH', 'stockholm': 'ARN', 'oslo': 'OSL', 'helsinki': 'HEL',
    'prague': 'PRG', 'budapest': 'BUD', 'warsaw': 'WAW', 'brussels': 'BRU',

    // Asia
    'tokyo': 'NRT', 'singapore': 'SIN', 'hong kong': 'HKG', 'bangkok': 'BKK',
    'dubai': 'DXB', 'seoul': 'ICN', 'beijing': 'PEK', 'shanghai': 'PVG',
    'delhi': 'DEL', 'mumbai': 'BOM', 'kuala lumpur': 'KUL', 'manila': 'MNL',
    'ho chi minh': 'SGN', 'hanoi': 'HAN', 'jakarta': 'CGK', 'taipei': 'TPE',
    'osaka': 'KIX', 'bali': 'DPS',

    // Oceania
    'sydney': 'SYD', 'melbourne': 'MEL', 'auckland': 'AKL', 'brisbane': 'BNE',

    // South America
    'sao paulo': 'GRU', 'rio de janeiro': 'GIG', 'buenos aires': 'EZE',
    'lima': 'LIM', 'bogota': 'BOG', 'santiago': 'SCL',

    // Africa & Middle East
    'johannesburg': 'JNB', 'cape town': 'CPT', 'cairo': 'CAI', 'nairobi': 'NBO',
    'tel aviv': 'TLV', 'doha': 'DOH', 'abu dhabi': 'AUH', 'istanbul': 'IST',
  };

  // Helper function to convert city name to IATA code with fallback to city name
  const getCityCode = (cityName: string | undefined): string => {
    if (!cityName) return '';

    // Try exact match (case insensitive)
    const normalized = cityName.toLowerCase().trim();
    const iataCode = cityToIATA[normalized];

    if (iataCode) {
      return iataCode;
    }

    // If no match found, return the city name itself (SERP API will handle it)
    return cityName.trim();
  };

  // Auto-search flights when flight step is reached
  useEffect(() => {
    if (currentStep === 'flights' && itinerary.destination && itinerary.origin && itinerary.dates && itinerary.travelers && !hasSearchedFlights) {
      // Use actual origin and destination from itinerary
      const originCode = getCityCode(itinerary.origin.city);
      const destinationCode = getCityCode(itinerary.destination.city);

      // Only search if we have valid codes
      if (!originCode || !destinationCode) {
        console.error('Missing origin or destination for flight search');
        return;
      }

      const searchParams: FlightSearchParams = {
        origin: originCode,
        destination: destinationCode,
        departureDate: itinerary.dates.startDate.toISOString().split('T')[0],
        returnDate: itinerary.dates.endDate.toISOString().split('T')[0],
        adults: itinerary.travelers,
        cabinClass: 'ECONOMY',
        currencyCode: 'USD',
      };

      console.log('🔍 Searching flights:', searchParams);
      searchFlights(searchParams);
      setHasSearchedFlights(true);
    }
  }, [currentStep, itinerary.destination, itinerary.origin, itinerary.dates, itinerary.travelers, hasSearchedFlights, searchFlights]);

  // Auto-search hotels when hotel step is reached
  useEffect(() => {
    if (currentStep === 'hotels' && itinerary.destination && itinerary.dates && !hasSearchedHotels) {
      const destinationCity = itinerary.destination.city || 'Paris';

      searchHotels({
        destination: destinationCity,
        checkIn: itinerary.dates.startDate.toISOString().split('T')[0],
        checkOut: itinerary.dates.endDate.toISOString().split('T')[0],
        budget: itinerary.budget?.total,
        limit: 10,
      });
      setHasSearchedHotels(true);
    }

    // Reset search state when leaving hotels step
    if (currentStep !== 'hotels' && hasSearchedHotels) {
      setHasSearchedHotels(false);
    }
  }, [currentStep, itinerary.destination, itinerary.dates, itinerary.budget, hasSearchedHotels, searchHotels]);

  // Auto-search activities (restaurants + attractions) when activities step is reached
  useEffect(() => {
    if (currentStep === 'activities' && itinerary.destination && !hasSearchedActivities) {
      // Format destination as "City, Country" for better SERP API results
      const destinationCity = itinerary.destination.city || 'Paris';
      const destinationCountry = itinerary.destination.country || 'France';
      const fullDestination = `${destinationCity}, ${destinationCountry}`;
      const interests = itinerary.preferences?.interests || [];

      // Search both restaurants and attractions in parallel
      Promise.all([
        searchRestaurants({
          destination: fullDestination,
          limit: 5,
        }),
        searchAttractions({
          destination: fullDestination,
          interests,
          limit: 10,
        })
      ]);

      setHasSearchedActivities(true);
    }

    // Reset search state when leaving activities step
    if (currentStep !== 'activities' && hasSearchedActivities) {
      setHasSearchedActivities(false);
    }
  }, [currentStep, itinerary.destination, itinerary.preferences, hasSearchedActivities, searchRestaurants, searchAttractions]);

  // Reset search state when leaving flights step
  useEffect(() => {
    if (currentStep !== 'flights' && hasSearchedFlights) {
      setHasSearchedFlights(false);
    }
  }, [currentStep, hasSearchedFlights]);

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
  const mockHotelOptions = getHotelOptions(selectedDestination);
  const mockActivityOptions = getActivityOptions(selectedDestination, selectedPreferences);

  // Transform real activity data (restaurants + attractions) to Activity format
  const activityOptions = useMemo(() => {
    const realActivities: Array<{
      id: string;
      name: string;
      category: string;
      price: number;
      duration: string;
      image?: string;
      emoji: string;
    }> = [];

    // Add restaurants as activities
    if (restaurants.length > 0) {
      restaurants.forEach(restaurant => {
        realActivities.push({
          id: restaurant.id,
          name: restaurant.name,
          category: 'food',
          price: 50, // Default price, could be extracted from priceLevel
          duration: '2h',
          image: restaurant.imageUrl,
          emoji: '🍽️',
        });
      });
    }

    // Add attractions as activities
    if (attractions.length > 0) {
      attractions.forEach(attraction => {
        realActivities.push({
          id: attraction.id,
          name: attraction.name,
          category: 'culture',
          price: 30, // Default price
          duration: '3h',
          image: attraction.imageUrl,
          emoji: '🏛️',
        });
      });
    }

    // Return real data if available, otherwise fallback to mock data
    return realActivities.length > 0 ? realActivities : mockActivityOptions;
  }, [restaurants, attractions, mockActivityOptions]);

  // Transform real hotel data to carousel card format
  const hotelOptions = useMemo(() => {
    if (hotels.length > 0) {
      return hotels.map(hotel => ({
        id: hotel.id,
        title: hotel.name,
        subtitle: hotel.address || 'Hotel',
        price: hotel.pricePerNight,
        rating: hotel.rating,
        details: hotel.amenities || [],
        badge: hotel.rating && hotel.rating >= 4.5 ? 'Top Rated' : undefined,
        image: hotel.imageUrl,
      }));
    }
    // Fallback to mock data if no real hotels loaded
    return mockHotelOptions;
  }, [hotels, mockHotelOptions]);

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
              
              // Move to country phase after a short delay
              setTimeout(() => {
                setDestinationPhase('country');
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
                setDestinationPhase('country');
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
    // Move to country phase after origin is set
    setTimeout(() => {
      setDestinationPhase('country');
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

            {/* COUNTRY PHASE */}
            {destinationPhase === 'country' && (
              <>
                <p className="text-gray-700 mb-2">Which country would you like to visit? 🌍</p>

                {/* Show origin for context */}
                {selectedOrigin && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-green-800">✅ Traveling from:</span> {selectedOrigin}
                    </p>
                  </div>
                )}

                {/* Popular Countries */}
                {loadingCountries ? (
                  <div className="mt-3 p-4 glass-card border-2 border-primary/30 rounded-xl flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <p className="text-sm font-medium text-gray-800">Loading popular countries...</p>
                  </div>
                ) : popularCountries.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-3">Top destinations:</p>
                    <QuickReply
                      options={popularCountries.map(country => ({ id: country, value: country, label: country }))}
                      onSelect={handleCountrySelect}
                      selectedValues={[]}
                      gradientColors="from-blue-500/30 to-indigo-500/30"
                    />
                    <p className="text-xs text-gray-600 mt-3 text-center">
                      Or type a different country in the chat input below
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-4 glass-card border-2 border-primary/30 rounded-xl">
                    <p className="text-sm font-medium text-gray-800">
                      💬 Type the country name in the chat input below and press Enter
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Example: France, Japan, Italy, USA, etc.
                    </p>
                    {selectedCountry && (
                      <div className="mt-3 flex items-center gap-2 text-primary">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-semibold">{selectedCountry}</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* CITY PHASE */}
            {destinationPhase === 'city' && (
              <>
                <p className="text-gray-700 mb-2">Which city in {selectedCountry} would you like to visit? 🏙️</p>

                {/* Show origin and country for context */}
                <div className="mb-4 space-y-2">
                  {selectedOrigin && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-green-800">✅ Traveling from:</span> {selectedOrigin}
                      </p>
                    </div>
                  )}
                  {selectedCountry && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-800">✅ Visiting:</span> {selectedCountry}
                      </p>
                    </div>
                  )}
                </div>

                {/* Popular Cities */}
                {loadingCities ? (
                  <div className="mt-3 p-4 glass-card border-2 border-primary/30 rounded-xl flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <p className="text-sm font-medium text-gray-800">Loading popular cities...</p>
                  </div>
                ) : popularCities.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-3">Popular destinations in {selectedCountry}:</p>
                    <QuickReply
                      options={popularCities.map(city => ({ id: city, value: city, label: city }))}
                      onSelect={(city) => {
                        setSelectedDestination(city);
                        onStepComplete('destination', {
                          destination: { city, country: selectedCountry }
                        });
                      }}
                      selectedValues={[]}
                      gradientColors="from-primary/30 to-purple-500/30"
                    />
                    <p className="text-xs text-gray-600 mt-3 text-center">
                      Or type a different city in the chat input below
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-4 glass-card border-2 border-primary/30 rounded-xl">
                    <p className="text-sm font-medium text-gray-800">
                      💬 Type the city name in the chat input below and press Enter
                    </p>
                    {selectedDestination && (
                      <div className="mt-3 flex items-center gap-2 text-primary">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-semibold">{selectedDestination}</span>
                      </div>
                    )}
                  </div>
                )}
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

            {!flightsLoading && !flightsError && flights.length > 0 && (
              <div className="glass-card rounded-xl border border-gray-200 p-4">
                <FlightList 
                  flights={flights}
                  onSelectFlight={handleFlightSelect}
                  selectedFlightId={selectedFlight}
                />
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

            {hotelsLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-gray-600">Searching for hotels...</span>
              </div>
            )}

            {hotelsError && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{hotelsError}</p>
              </div>
            )}

            {!hotelsLoading && !hotelsError && (
              <CardCarousel
                cards={hotelOptions}
                onCardSelect={handleHotelSelect}
                selectedCardId={selectedHotel}
                showPrice
                showRating
                onConfirm={handleHotelConfirm}
              />
            )}

            {!hotelsLoading && !hotelsError && hotelOptions.length === 0 && hasSearchedHotels && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <p className="text-sm text-gray-600">No hotels found for this destination. Please try adjusting your dates or budget.</p>
                <button
                  onClick={() => {
                    setHasSearchedHotels(false);
                  }}
                  className="mt-3 text-sm text-primary hover:text-primary/80 underline"
                >
                  Search again
                </button>
              </div>
            )}
          </div>
        );

      case 'activities':
        return (
          <div>
            <p className="text-gray-700 mb-2">{WIZARD_STEP_CONFIG.activities.description}</p>

            {(restaurantsLoading || attractionsLoading) && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-gray-600">Finding restaurants and attractions...</span>
              </div>
            )}

            {(restaurantsError || attractionsError) && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl mb-4">
                <p className="text-sm text-red-600">
                  {restaurantsError || attractionsError}
                </p>
              </div>
            )}

            {!restaurantsLoading && !attractionsLoading && (
              <ActivityGrid
                activities={activityOptions}
                onActivityToggle={handleActivityToggle}
                selectedActivityIds={selectedActivities}
                maxSelections={5}
                onConfirm={handleActivitiesConfirm}
              />
            )}

            {!restaurantsLoading && !attractionsLoading && activityOptions.length === 0 && hasSearchedActivities && (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl text-center">
                <p className="text-sm text-gray-600">No activities found for this destination.</p>
                <button
                  onClick={() => {
                    setHasSearchedActivities(false);
                  }}
                  className="mt-3 text-sm text-primary hover:text-primary/80 underline"
                >
                  Search again
                </button>
              </div>
            )}
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
      
    </div>
  );
}
