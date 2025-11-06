import { useState, useCallback } from 'react';
import { serpApi, SerpPlaceResult } from '@/lib/serpApi';

export interface HotelSearchParams {
  destination: string;
  checkIn?: string;
  checkOut?: string;
  budget?: number;
  limit?: number;
}

export interface HotelOption {
  id: string;
  name: string;
  rating?: number;
  pricePerNight: number;
  address?: string;
  imageUrl?: string;
  amenities?: string[];
  description?: string;
}

export function useHotelSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotels, setHotels] = useState<HotelOption[]>([]);

  const searchHotels = useCallback(async (params: HotelSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Call SERP API
      const serpResults = await serpApi.getHotels(
        params.destination,
        {
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          budget: params.budget,
          limit: params.limit || 10,
        }
      );

      // Transform SERP results to HotelOption format
      const transformedHotels: HotelOption[] = serpResults.map((hotel, index) => {
        // Extract price from priceLevel string (e.g., "$150" -> 150)
        let pricePerNight = 0;
        if (hotel.priceLevel) {
          const priceMatch = hotel.priceLevel.match(/\d+/);
          pricePerNight = priceMatch ? parseInt(priceMatch[0]) : 0;
        }

        return {
          id: `hotel-${index}-${Date.now()}`,
          name: hotel.name,
          rating: hotel.rating,
          pricePerNight,
          address: hotel.address,
          imageUrl: hotel.imageUrl,
          amenities: hotel.description ? [hotel.description] : [],
          description: hotel.description,
        };
      });

      setHotels(transformedHotels);
      return transformedHotels;

    } catch (err: any) {
      console.error('Hotel search error:', err);
      setError(err.message || 'Failed to search hotels');
      setHotels([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHotels = useCallback(() => {
    setHotels([]);
    setError(null);
  }, []);

  return {
    hotels,
    loading,
    error,
    searchHotels,
    clearHotels,
  };
}
