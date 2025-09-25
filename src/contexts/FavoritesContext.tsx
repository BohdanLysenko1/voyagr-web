"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SearchDeal } from '@/components/DealsPage/SearchDeals';
import { Flight, Hotel, Package, Restaurant } from '@/types/ai';

type AIItem = Flight | Hotel | Package | Restaurant;

interface FavoritesContextType {
  favorites: SearchDeal[];
  addToFavorites: (deal: SearchDeal) => void;
  removeFromFavorites: (dealId: number) => void;
  isFavorite: (dealId: number) => boolean;
  toggleFavorite: (deal: SearchDeal) => void;
  // AI page specific methods
  addAIItemToFavorites: (item: AIItem, type: 'flight' | 'hotel' | 'package' | 'restaurant') => void;
  removeAIItemFromFavorites: (itemId: number) => void;
  isAIItemFavorite: (itemId: number) => boolean;
  toggleAIItemFavorite: (item: AIItem, type: 'flight' | 'hotel' | 'package' | 'restaurant') => void;
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

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('voyagr-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voyagr-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (deal: SearchDeal) => {
    setFavorites(prev => {
      if (!prev.find(fav => fav.id === deal.id)) {
        return [...prev, deal];
      }
      return prev;
    });
  };

  const removeFromFavorites = (dealId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== dealId));
  };

  const isFavorite = (dealId: number) => {
    return favorites.some(fav => fav.id === dealId);
  };

  const toggleFavorite = (deal: SearchDeal) => {
    if (isFavorite(deal.id)) {
      removeFromFavorites(deal.id);
    } else {
      addToFavorites(deal);
    }
  };

  // AI item conversion to SearchDeal format
  const convertAIItemToSearchDeal = (item: AIItem, type: 'flight' | 'hotel' | 'package' | 'restaurant'): SearchDeal => {
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
    } else if (type === 'package') {
      const pkg = item as Package;
      title = pkg.name;
      description = pkg.duration;
      image = '/images/AIPage/package-placeholder.jpg';
      price = 899; // Default price since not in type
      location = 'Multiple Destinations';
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
      duration: type === 'package' ? (item as Package).duration : undefined,
      features: []
    };
  };

  const addAIItemToFavorites = (item: AIItem, type: 'flight' | 'hotel' | 'package' | 'restaurant') => {
    const searchDeal = convertAIItemToSearchDeal(item, type);
    addToFavorites(searchDeal);
  };

  const removeAIItemFromFavorites = (itemId: number) => {
    removeFromFavorites(itemId);
  };

  const isAIItemFavorite = (itemId: number) => {
    return isFavorite(itemId);
  };

  const toggleAIItemFavorite = (item: AIItem, type: 'flight' | 'hotel' | 'package' | 'restaurant') => {
    if (isAIItemFavorite(item.id)) {
      removeAIItemFromFavorites(item.id);
    } else {
      addAIItemToFavorites(item, type);
    }
  };

  const value: FavoritesContextType = {
    favorites,
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
