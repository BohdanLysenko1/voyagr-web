import { useCallback } from 'react';
import { CITY_TO_IATA_MAP, MONTH_NAMES, FLIGHT_SEARCH_KEYWORDS } from '@/constants/flightData';
import { DEFAULT_AIRPORTS, CABIN_CLASSES } from '@/constants/travelConstants';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  cabinClass: 'BUSINESS' | 'FIRST' | 'PREMIUM_ECONOMY' | 'ECONOMY';
  currencyCode: string;
}

export function useFlightParsing() {
  const detectFlightSearch = useCallback((query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    return FLIGHT_SEARCH_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
  }, []);

  const parseFlightQuery = useCallback((query: string): FlightSearchParams => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Simple parsing - in production, use NLP or more sophisticated parsing
    const queryLower = query.toLowerCase();
    
    // Detect destinations from common patterns
    const toMatch = query.match(/to\s+([A-Za-z\s]+?)(?:\s+in|\s+for|\s+on|$)/i);
    const fromMatch = query.match(/from\s+([A-Za-z\s]+?)(?:\s+to|\s+in|\s+for|$)/i);

    let destination: string = DEFAULT_AIRPORTS.DESTINATION;
    let origin: string = DEFAULT_AIRPORTS.ORIGIN;

    if (toMatch) {
      const cityName = toMatch[1].trim().toLowerCase();
      destination = CITY_TO_IATA_MAP[cityName] || DEFAULT_AIRPORTS.DESTINATION;
    }

    if (fromMatch) {
      const cityName = fromMatch[1].trim().toLowerCase();
      origin = CITY_TO_IATA_MAP[cityName] || DEFAULT_AIRPORTS.ORIGIN;
    }

    // Detect cabin class
    const cabinClass: 'BUSINESS' | 'FIRST' | 'PREMIUM_ECONOMY' | 'ECONOMY' = 
      queryLower.includes('business') ? CABIN_CLASSES.BUSINESS :
      queryLower.includes('first') ? CABIN_CLASSES.FIRST :
      queryLower.includes('premium') ? CABIN_CLASSES.PREMIUM_ECONOMY : 
      CABIN_CLASSES.ECONOMY;

    // Detect round-trip or one-way
    const isRoundTrip = !queryLower.includes('one-way');

    // Parse dates (simple detection)
    let departureDate = today.toISOString().split('T')[0];
    let returnDate = nextMonth.toISOString().split('T')[0];

    MONTH_NAMES.forEach((month, index) => {
      if (queryLower.includes(month)) {
        const monthDate = new Date();
        monthDate.setMonth(index);
        if (monthDate < today) monthDate.setFullYear(monthDate.getFullYear() + 1);
        departureDate = monthDate.toISOString().split('T')[0];
        const retDate = new Date(monthDate);
        retDate.setDate(retDate.getDate() + 14);
        returnDate = retDate.toISOString().split('T')[0];
      }
    });

    // Detect number of travelers
    const adultsMatch = query.match(/(\d+)\s*(?:person|people|passenger|adult)/i);
    const adults = adultsMatch ? parseInt(adultsMatch[1]) : 1;

    return {
      origin,
      destination,
      departureDate,
      returnDate: isRoundTrip ? returnDate : undefined,
      adults,
      cabinClass,
      currencyCode: 'USD'
    };
  }, []);

  return {
    detectFlightSearch,
    parseFlightQuery,
  };
}
