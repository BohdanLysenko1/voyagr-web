"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SearchDeal } from '@/components/DealsPage/SearchDeals';
import { Flight, Hotel, Restaurant } from '@/types/ai';
import { api } from '@/lib/apiClient';
import { auth } from '@/lib/firebase';

type AIItem = Flight | Hotel | Restaurant;

// Backend favorite type from API
interface BackendFavorite {
  id: string;
  userId: string;
  dealId: string;
  dealType: 'flight' | 'hotel' | 'restaurant';
  dealData: SearchDeal;
  createdAt: string;
}

interface FavoritesContextType {
  favorites: SearchDeal[];
  loading: boolean;
  addToFavorites: (deal: SearchDeal) => Promise<void>;
  removeFromFavorites: (dealId: number) => Promise<void>;
  isFavorite: (dealId: number) => boolean;
  toggleFavorite: (deal: SearchDeal) => Promise<void>;
  // AI page specific methods
  addAIItemToFavorites: (item: AIItem, type: 'flight' | 'hotel' | 'restaurant') => Promise<void>;
  removeAIItemFromFavorites: (itemId: number) => Promise<void>;
  isAIItemFavorite: (itemId: number) => boolean;
  toggleAIItemFavorite: (item: AIItem, type: 'flight' | 'hotel' | 'restaurant') => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<SearchDeal[]>([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from backend on mount and when auth state changes
  useEffect(() => {
    const loadFavorites = async () => {
      const user = auth.currentUser;

      if (!user) {
        // User not logged in, load from localStorage
        const savedFavorites = localStorage.getItem('voyagr-favorites');
        if (savedFavorites) {
          try {
            setFavorites(JSON.parse(savedFavorites));
          } catch (error) {
            console.error('Error loading favorites from localStorage:', error);
          }
        }
        return;
      }

      // User logged in, fetch from backend
      try {
        setLoading(true);
        const response = await api.get<{
          success: boolean;
          data: BackendFavorite[];
        }>('/favorites', true);

        if (response.success && response.data) {
          // Extract deal data from backend favorites
          const dealFavorites = response.data.map(fav => fav.dealData);
          setFavorites(dealFavorites);
          // Also save to localStorage as backup
          localStorage.setItem('voyagr-favorites', JSON.stringify(dealFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites from backend:', error);
        // Fall back to localStorage
        const savedFavorites = localStorage.getItem('voyagr-favorites');
        if (savedFavorites) {
          try {
            setFavorites(JSON.parse(savedFavorites));
          } catch (err) {
            console.error('Error loading favorites from localStorage:', err);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadFavorites();
    });

    return () => unsubscribe();
  }, []);

  // Save favorites to localStorage whenever they change (as backup)
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('voyagr-favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = async (deal: SearchDeal): Promise<void> => {
    const user = auth.currentUser;

    // Optimistically update UI
    setFavorites(prev => {
      if (!prev.find(fav => fav.id === deal.id)) {
        return [...prev, deal];
      }
      return prev;
    });

    if (!user) {
      // Not logged in, just use localStorage
      return;
    }

    // Logged in, sync with backend
    try {
      await api.post<{
        success: boolean;
        data: BackendFavorite;
      }>('/favorites', {
        dealId: deal.id.toString(),
        dealType: deal.type,
        dealData: deal,
      }, true);
    } catch (error) {
      console.error('Error adding favorite to backend:', error);
      // Revert optimistic update on error
      setFavorites(prev => prev.filter(fav => fav.id !== deal.id));
      throw error;
    }
  };

  const removeFromFavorites = async (dealId: number): Promise<void> => {
    const user = auth.currentUser;

    // Optimistically update UI
    const previousFavorites = favorites;
    setFavorites(prev => prev.filter(fav => fav.id !== dealId));

    if (!user) {
      // Not logged in, just use localStorage
      return;
    }

    // Logged in, sync with backend
    try {
      await api.delete<{
        success: boolean;
      }>(`/favorites/deal/${dealId}`, true);
    } catch (error) {
      console.error('Error removing favorite from backend:', error);
      // Revert optimistic update on error
      setFavorites(previousFavorites);
      throw error;
    }
  };

  const isFavorite = (dealId: number): boolean => {
    return favorites.some(fav => fav.id === dealId);
  };

  const toggleFavorite = async (deal: SearchDeal): Promise<void> => {
    if (isFavorite(deal.id)) {
      await removeFromFavorites(deal.id);
    } else {
      await addToFavorites(deal);
    }
  };

  // AI item conversion to SearchDeal format
  const convertAIItemToSearchDeal = (item: AIItem, type: 'flight' | 'hotel' | 'restaurant'): SearchDeal => {
    let title, description, image, price, location;
    
    if (type === 'flight') {
      const flight = item as Flight;
      title = `Flight`;
      description = flight.route;
      image = '/images/AIPage/flight-placeholder.jpg';
      price = 299; // Default price since not in type
      location = flight.route;
    } else if (type === 'hotel') {
      const hotel = item as Hotel;
      title = hotel.name;
      description = `Hotel in ${hotel.location}`;
      image = '/images/AIPage/hotel-placeholder.jpg';
      price = 150; // Default price since not in type
      location = hotel.location;
    } else {
      const restaurant = item as Restaurant;
      title = restaurant.name;
      description = `${restaurant.cuisine} cuisine in ${restaurant.location}`;
      image = '/images/AIPage/restaurant-placeholder.jpg';
      price = 75; // Default price since not in type
      location = restaurant.location;
    }

    return {
      id: item.id,
      type,
      title,
      location,
      continent: 'Unknown', // Could be enhanced with mapping
      price,
      description,
      image,
      rating: undefined,
      duration: undefined,
      features: []
    };
  };

  const addAIItemToFavorites = async (item: AIItem, type: 'flight' | 'hotel' | 'restaurant'): Promise<void> => {
    const searchDeal = convertAIItemToSearchDeal(item, type);
    await addToFavorites(searchDeal);
  };

  const removeAIItemFromFavorites = async (itemId: number): Promise<void> => {
    await removeFromFavorites(itemId);
  };

  const isAIItemFavorite = (itemId: number): boolean => {
    return isFavorite(itemId);
  };

  const toggleAIItemFavorite = async (item: AIItem, type: 'flight' | 'hotel' | 'restaurant'): Promise<void> => {
    if (isAIItemFavorite(item.id)) {
      await removeAIItemFromFavorites(item.id);
    } else {
      await addAIItemToFavorites(item, type);
    }
  };

  const value: FavoritesContextType = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    addAIItemToFavorites,
    removeAIItemFromFavorites,
    isAIItemFavorite,
    toggleAIItemFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
