"use client"
import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SearchDealCard, { SearchDeal } from '@/components/DealsPage/SearchDeals';
import { useFavorites } from '@/contexts/FavoritesContext';
import DealModal from '@/components/DealsPage/DealModal';

const locationToContinentMap: { [key: string]: string } = {
  'Paris, France': 'Europe',
  'New York, USA': 'North America',
  'Tokyo, Japan': 'Asia',
  'London, UK': 'Europe',
  'Santorini, Greece': 'Europe',
  'Bali, Indonesia': 'Asia',
  'Barcelona, Spain': 'Europe',
  'Zermatt, Switzerland': 'Europe',
  'Cairo, Egypt': 'Africa',
  'Amsterdam, Netherlands': 'Europe',
  'Dubai, UAE': 'Asia',
  'Reykjavik, Iceland': 'Europe',
  'Sydney, New South Wales': 'Australia'
};

const continents = ['All Locations', ...Array.from(new Set(Object.values(locationToContinentMap)))];

const sortOptions = [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'Alphabetical' }
];

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites } = useFavorites();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'flight' | 'hotel' | 'package'>('all');
  const [selectedContinent, setSelectedContinent] = useState('All Locations');
  const [sortBy, setSortBy] = useState('price-low');
  const [selectedDeal, setSelectedDeal] = useState<SearchDeal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favorites.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || deal.type === selectedType;
      const dealContinent = locationToContinentMap[deal.location];
      const matchesContinent = selectedContinent === 'All Locations' || dealContinent === selectedContinent;
      
      return matchesSearch && matchesType && matchesContinent;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [favorites, searchQuery, selectedType, selectedContinent, sortBy]);

  const handleViewDeal = (deal: SearchDeal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  if (favorites.length === 0) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="mb-4">
              <Heart className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Your Favorites</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              You haven't saved any deals yet. Start exploring and save your favorite travel deals!
            </p>
            <button
              onClick={() => router.push('/deals')}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Explore Deals
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Your Favorites
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            {favorites.length} saved {favorites.length === 1 ? 'deal' : 'deals'} for your next adventure
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your saved deals..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
              >
                <option value="all">All Types</option>
                <option value="flight">Flights</option>
                <option value="hotel">Hotels</option>
                <option value="package">Packages</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Continent:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
              >
                {continents.map(continent => (
                  <option key={continent} value={continent}>{continent}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-lg">
            Showing {filteredAndSortedFavorites.length} of {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {filteredAndSortedFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedFavorites.map(deal => (
              <SearchDealCard 
                key={deal.id} 
                deal={deal} 
                onViewDeal={handleViewDeal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites match your search</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find your saved deals.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedContinent('All Locations');
                setSortBy('price-low');
              }}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Deal Modal */}
      <DealModal
        open={isModalOpen}
        onClose={closeModal}
        deal={selectedDeal}
      />
    </main>
  );
}