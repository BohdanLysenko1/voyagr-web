import { useState, useCallback } from 'react';
import { serpApi, SerpPlaceResult } from '@/lib/serpApi';

export interface AttractionSearchParams {
  destination: string;
  interests?: string[];
  limit?: number;
}

export interface AttractionOption {
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

export function useAttractionSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attractions, setAttractions] = useState<AttractionOption[]>([]);

  const searchAttractions = useCallback(async (params: AttractionSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Call SERP API
      const serpResults = await serpApi.getAttractions(
        params.destination,
        {
          interests: params.interests,
          limit: params.limit || 10,
        }
      );

      // Transform SERP results to AttractionOption format
      const transformedAttractions: AttractionOption[] = serpResults.map((attraction, index) => ({
        id: `attraction-${index}-${Date.now()}`,
        name: attraction.name,
        rating: attraction.rating,
        reviews: attraction.reviews,
        priceLevel: attraction.priceLevel,
        address: attraction.address,
        category: attraction.category,
        imageUrl: attraction.imageUrl,
        description: attraction.description,
        phone: attraction.phone,
        website: attraction.website,
      }));

      setAttractions(transformedAttractions);
      return transformedAttractions;

    } catch (err: any) {
      console.error('Attraction search error:', err);
      setError(err.message || 'Failed to search attractions');
      setAttractions([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAttractions = useCallback(() => {
    setAttractions([]);
    setError(null);
  }, []);

  return {
    attractions,
    loading,
    error,
    searchAttractions,
    clearAttractions,
  };
}
