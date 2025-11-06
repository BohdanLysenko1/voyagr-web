import axios, { AxiosError } from 'axios';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * SERP API Place/Location Result
 */
export interface SerpPlaceResult {
  name: string;
  rating?: number;
  reviews?: number;
  priceLevel?: string;
  address?: string;
  category?: string;
  hours?: string;
  imageUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  description?: string;
  phone?: string;
  website?: string;
}

/**
 * SERP API Flight Result
 */
export interface SerpFlightResult {
  id: string;
  airline: string;
  flightNumber?: string;
  departure: {
    time: string;
    airport: string;
    airportCode: string;
  };
  arrival: {
    time: string;
    airport: string;
    airportCode: string;
  };
  duration: string;
  price: number;
  currency: string;
  stops: number;
  layovers?: string[];
  carbonEmissions?: number;
  bookingUrl?: string;
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  metadata?: Record<string, any>;
}

/**
 * Search options for restaurants
 */
export interface RestaurantSearchOptions {
  cuisine?: string;
  priceLevel?: string;
  limit?: number;
}

/**
 * Search options for attractions
 */
export interface AttractionSearchOptions {
  interests?: string[];
  limit?: number;
}

/**
 * Search options for hotels
 */
export interface HotelSearchOptions {
  checkIn?: string;
  checkOut?: string;
  budget?: number;
  limit?: number;
}

/**
 * Search options for flights
 */
export interface FlightSearchOptions {
  adults?: number;
  children?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  limit?: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const SERP_BASE_URL = `${API_URL}/serp`;

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Handle API errors and return user-friendly messages
 */
const handleApiError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response) {
      // Server responded with an error status
      const statusCode = axiosError.response.status;
      const errorMessage = axiosError.response.data?.message || 'An error occurred';

      console.error(`[SERP API Error - ${context}]:`, {
        status: statusCode,
        message: errorMessage,
      });

      throw new Error(errorMessage);
    } else if (axiosError.request) {
      // Request made but no response received
      console.error(`[SERP API No Response - ${context}]:`, axiosError.message);
      throw new Error('Unable to connect to the server. Please try again.');
    }
  }

  // Unknown error
  console.error(`[SERP API Unknown Error - ${context}]:`, error);
  throw new Error(`Failed to ${context}`);
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Search for restaurants in a destination
 * @param destination - City or location name
 * @param options - Search options (cuisine, price level, limit)
 * @returns Array of restaurant results
 *
 * @example
 * const restaurants = await serpApi.getRestaurants('Paris', {
 *   cuisine: 'French',
 *   priceLevel: '$$',
 *   limit: 5
 * });
 */
export const getRestaurants = async (
  destination: string,
  options?: RestaurantSearchOptions
): Promise<SerpPlaceResult[]> => {
  try {
    const response = await axios.get<ApiResponse<SerpPlaceResult[]>>(
      `${SERP_BASE_URL}/restaurants`,
      {
        params: {
          destination,
          cuisine: options?.cuisine,
          priceLevel: options?.priceLevel,
          limit: options?.limit,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error, 'search restaurants');
  }
};

/**
 * Search for attractions and things to do in a destination
 * @param destination - City or location name
 * @param options - Search options (interests, limit)
 * @returns Array of attraction results
 *
 * @example
 * const attractions = await serpApi.getAttractions('Paris', {
 *   interests: ['culture', 'art'],
 *   limit: 15
 * });
 */
export const getAttractions = async (
  destination: string,
  options?: AttractionSearchOptions
): Promise<SerpPlaceResult[]> => {
  try {
    const response = await axios.get<ApiResponse<SerpPlaceResult[]>>(
      `${SERP_BASE_URL}/attractions`,
      {
        params: {
          destination,
          interests: options?.interests?.join(','),
          limit: options?.limit,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error, 'search attractions');
  }
};

/**
 * Search for hotels in a destination
 * @param destination - City or location name
 * @param options - Search options (dates, budget, limit)
 * @returns Array of hotel results
 *
 * @example
 * const hotels = await serpApi.getHotels('Paris', {
 *   checkIn: '2025-12-01',
 *   checkOut: '2025-12-05',
 *   limit: 10
 * });
 */
export const getHotels = async (
  destination: string,
  options?: HotelSearchOptions
): Promise<SerpPlaceResult[]> => {
  try {
    const response = await axios.get<ApiResponse<SerpPlaceResult[]>>(
      `${SERP_BASE_URL}/hotels`,
      {
        params: {
          destination,
          checkIn: options?.checkIn,
          checkOut: options?.checkOut,
          budget: options?.budget,
          limit: options?.limit,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error, 'search hotels');
  }
};

/**
 * Search for flights between two destinations
 * @param origin - Origin city or airport code
 * @param destination - Destination city or airport code
 * @param departureDate - Departure date (YYYY-MM-DD)
 * @param returnDate - Optional return date (YYYY-MM-DD)
 * @param options - Search options (passengers, cabin class, limit)
 * @returns Array of flight results
 *
 * @example
 * const flights = await serpApi.getFlights('NYC', 'Paris', '2025-12-01', '2025-12-05', {
 *   adults: 2,
 *   cabinClass: 'economy'
 * });
 */
export const getFlights = async (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  options?: FlightSearchOptions
): Promise<SerpFlightResult[]> => {
  try {
    const response = await axios.get<ApiResponse<SerpFlightResult[]>>(
      `${SERP_BASE_URL}/flights`,
      {
        params: {
          origin,
          destination,
          departureDate,
          returnDate,
          adults: options?.adults,
          children: options?.children,
          cabinClass: options?.cabinClass,
          limit: options?.limit,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error, 'search flights');
  }
};

/**
 * Check if SERP API is configured and available
 * @returns Health status
 *
 * @example
 * const status = await serpApi.checkHealth();
 * if (status.configured) {
 *   console.log('SERP API is ready');
 * }
 */
export const checkHealth = async (): Promise<{
  configured: boolean;
  status: string;
  message: string;
}> => {
  try {
    const response = await axios.get<
      ApiResponse<{
        configured: boolean;
        status: string;
        message: string;
      }>
    >(`${SERP_BASE_URL}/health`);

    return response.data.data;
  } catch (error) {
    console.error('[SERP API Health Check Failed]:', error);
    return {
      configured: false,
      status: 'error',
      message: 'Health check failed',
    };
  }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export const serpApi = {
  getRestaurants,
  getAttractions,
  getHotels,
  getFlights,
  checkHealth,
};

export default serpApi;
