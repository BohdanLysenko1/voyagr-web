"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SearchDeal } from '@/components/DealsPage/SearchDeals';

interface FavoritesContextType {
  favorites: SearchDeal[];
  addToFavorites: (deal: SearchDeal) => void;
  removeFromFavorites: (dealId: number) => void;
  isFavorite: (dealId: number) => boolean;
  toggleFavorite: (deal: SearchDeal) => void;
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

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
