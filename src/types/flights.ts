export interface FlightSearchParams {
  origin: string; // IATA code (e.g., 'JFK')
  destination: string; // IATA code (e.g., 'LAX')
  departureDate: string; // Format: YYYY-MM-DD
  returnDate?: string; // Optional for one-way
  adults: number; // Number of adult passengers (min 1)
  children?: number; // Age 2-11
  infants?: number; // Under 2
  cabinClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  nonStop?: boolean; // Direct flights only
  maxPrice?: number;
  currencyCode?: string; // Default: USD
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    at: string; // ISO 8601 datetime
    terminal?: string;
  };
  arrival: {
    iataCode: string;
    at: string;
    terminal?: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  cabin?: string;
  numberOfBookableSeats?: number;
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  cabinClass: string;
  segments: FlightSegment[];
  validatingAirlineCodes?: string[];
  bookingClass?: string;
  availableSeats?: number;
  selected: boolean;
  // Original data for booking
  rawData?: any;
}

export interface Airport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
  type: 'AIRPORT' | 'CITY';
}
