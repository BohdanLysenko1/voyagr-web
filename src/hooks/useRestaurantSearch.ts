import { useState, useCallback } from 'react';
import { serpApi, SerpPlaceResult } from '@/lib/serpApi';

export interface RestaurantSearchParams {
  destination: string;
  cuisine?: string;
  priceLevel?: string;
  limit?: number;
}

export interface RestaurantOption {
  id: string;
  name: string;
  rating?: number;
  reviews?: number;
  priceLevel?: string;
  address?: string;
  category?: string;
  imageUrl?: string;
  description?: string;
  phone?: string;
  website?: string;
}

export function useRestaurantSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantOption[]>([]);

  const searchRestaurants = useCallback(async (params: RestaurantSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Call SERP API
      const serpResults = await serpApi.getRestaurants(
        params.destination,
        {
          cuisine: params.cuisine,
          priceLevel: params.priceLevel,
          limit: params.limit || 10,
        }
      );

      // Transform SERP results to RestaurantOption format
      const transformedRestaurants: RestaurantOption[] = serpResults.map((restaurant, index) => ({
        id: `restaurant-${index}-${Date.now()}`,
        name: restaurant.name,
        rating: restaurant.rating,
        reviews: restaurant.reviews,
        priceLevel: restaurant.priceLevel,
        address: restaurant.address,
        category: restaurant.category,
        imageUrl: restaurant.imageUrl,
        description: restaurant.description,
        phone: restaurant.phone,
        website: restaurant.website,
      }));

      setRestaurants(transformedRestaurants);
      return transformedRestaurants;

    } catch (err: any) {
      console.error('Restaurant search error:', err);
      setError(err.message || 'Failed to search restaurants');
      setRestaurants([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRestaurants = useCallback(() => {
    setRestaurants([]);
    setError(null);
  }, []);

  return {
    restaurants,
    loading,
    error,
    searchRestaurants,
    clearRestaurants,
  };
}
