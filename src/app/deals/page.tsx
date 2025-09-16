"use client"
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchDealCard, { SearchDeal, sampleDeals } from '@/components/DealsPage/SearchDeals';
import DealModal from '@/components/DealsPage/DealModal';

const continents = [
  {value: 'all', label: 'All Locations'},
  {value: 'Africa', label: 'Africa'},
  {value: 'Antarctica', label: 'Antarctica'},
  {value: 'Asia', label: 'Asia'},
  {value: 'Australia', label: 'Australia'},
  {value: 'Europe', label: 'Europe'},
  {value: 'North America', label: 'North America'},
  {value: 'South America', label: 'South America'}
];

const sortOptions = [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'Alphabetical' }
];



// Separate component that uses useSearchParams
function SearchDealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'flight' | 'hotel' | 'package'>('all');
  const [selectedContinent, setSelectedContinent] = useState<'all' | 'Africa' | 'Antarctica' | 'Asia' | 'Australia' | 'Europe' | 'North America' | 'South America' > ('all');
  const [sortBy, setSortBy] = useState('price-low');
  const [selectedDeal, setSelectedDeal] = useState<SearchDeal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    const continentParam = searchParams.get('continent');
    const searchParam = searchParams.get('search');
    
    if (typeParam && ['flight', 'hotel', 'package'].includes(typeParam)) {
      setSelectedType(typeParam as 'flight' | 'hotel' | 'package');
    }
    
    if (continentParam && continents.some(c => c.value === continentParam)) {
      setSelectedContinent(continentParam as any);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const filteredAndSortedDeals = useMemo(() => {
    let filtered = sampleDeals.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || deal.type === selectedType;
      const matchesContinent = selectedContinent === 'all' || deal.continent === selectedContinent;
      
      
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
  }, [searchQuery, selectedType, selectedContinent, sortBy]);

  const handleViewDeal = (deal: SearchDeal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Search Travel Deals</h1>
          <p className="text-lg md:text-xl text-gray-600">Find the perfect deal for your next adventure</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations, deals, or experiences..."
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
                onChange={(e) => setSelectedContinent(e.target.value as any)}
              >
                {continents.map(continent => (
                  <option key={continent.value} value={continent.value}>{continent.label}</option>
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
            Showing {filteredAndSortedDeals.length} {filteredAndSortedDeals.length === 1 ? 'deal' : 'deals'}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {filteredAndSortedDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedDeals.map(deal => (
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more deals.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedContinent('all');
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
    </div>
  );
}

// Main component with Suspense boundary
export default function SearchDealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center"><div className="text-lg text-gray-600">Loading search results...</div></div>}>
      <SearchDealsContent />
    </Suspense>
  );
}