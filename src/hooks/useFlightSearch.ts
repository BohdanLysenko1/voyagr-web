import { useState, useCallback } from 'react';
import { FlightSearchParams, FlightOption } from '@/types/flights';
import { serpApi } from '@/lib/serpApi';

export function useFlightSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<FlightOption[]>([]);

  const searchFlights = useCallback(async (params: FlightSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Map FlightSearchParams to SERP API format
      const cabinClassMap: Record<string, 'economy' | 'premium_economy' | 'business' | 'first'> = {
        'ECONOMY': 'economy',
        'PREMIUM_ECONOMY': 'premium_economy',
        'BUSINESS': 'business',
        'FIRST': 'first',
      };

      const cabinClass = cabinClassMap[params.cabinClass || 'ECONOMY'] || 'economy';

      // Call SERP API
      const serpResults = await serpApi.getFlights(
        params.origin,
        params.destination,
        params.departureDate,
        params.returnDate,
        {
          adults: params.adults || 1,
          children: params.children || 0,
          cabinClass,
          limit: params.maxResults || 10,
        }
      );

      // Transform SERP results to FlightOption format
      const transformedFlights: FlightOption[] = serpResults.map((flight) => ({
        id: flight.id,
        airline: flight.airline,
        airlineCode: flight.airline.substring(0, 2).toUpperCase(),
        flightNumber: flight.flightNumber || '',
        departure: flight.departure.airportCode,
        arrival: flight.arrival.airportCode,
        departureTime: flight.departure.time,
        arrivalTime: flight.arrival.time,
        departureDate: flight.departure.time.split('T')[0],
        arrivalDate: flight.arrival.time.split('T')[0],
        duration: flight.duration,
        stops: flight.stops,
        price: flight.price,
        currency: flight.currency,
        cabinClass: params.cabinClass || 'ECONOMY',
        segments: [],
        availableSeats: undefined,
        bookingUrl: flight.bookingUrl,
        bookingToken: flight.bookingToken,
        selected: false,
      }));

      setFlights(transformedFlights);
      return transformedFlights;

    } catch (err: any) {
      console.error('Flight search error:', err);
      setError(err.message || 'Failed to search flights');
      setFlights([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFlights = useCallback(() => {
    setFlights([]);
    setError(null);
  }, []);

  return {
    flights,
    loading,
    error,
    searchFlights,
    clearFlights,
  };
}
