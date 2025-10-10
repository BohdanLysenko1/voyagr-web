import { useState, useCallback } from 'react';
import { FlightSearchParams, FlightOption } from '@/types/flights';

export function useFlightSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flights, setFlights] = useState<FlightOption[]>([]);

  const searchFlights = useCallback(async (params: FlightSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Flight search failed');
      }

      setFlights(data.data.flights);
      return data.data.flights;

    } catch (err: any) {
      console.error('Flight search error:', err);
      setError(err.message);
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
