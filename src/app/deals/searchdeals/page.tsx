"use client"
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchDealCard, { SearchDeal } from '@/components/DealsPage/SearchDeals';
import DealModal from '@/components/DealsPage/DealModal';

const sampleDeals: SearchDeal[] = [
  {
    id: 1,
    type: 'flight',
    title: 'NYC → Paris',
    location: 'Paris, France',
    continent: 'Europe',
    price: 499,
    originalPrice: 699,
    description: 'Direct flights with premium service and flexible dates. Enjoy priority boarding and complimentary checked baggage.',
    image: '/images/DealsPage/Flights_ParisPic.jpg',
    rating: 4.8,
    duration: 'per person',
    features: ['Direct Flight', 'Checked Bag', 'Flexible Dates', 'Priority Boarding']
  },
  {
    id: 2,
    type: 'hotel',
    title: 'The Plaza Hotel',
    location: 'New York, USA',
    continent: 'North America',
    price: 299,
    originalPrice: 450,
    description: 'Luxury accommodations in Manhattan with Central Park views. Experience world-class dining and premium spa services.',
    image: '/images/DealsPage/Hotel_NewYork.jpg',
    rating: 4.9,
    duration: 'per night',
    features: ['Central Park View', 'Spa Access', 'Fine Dining', 'Concierge Service']
  },
  {
    id: 3,
    type: 'package',
    title: 'Tokyo Adventure Package',
    location: 'Tokyo, Japan',
    continent: 'Asia',
    price: 1899,
    originalPrice: 2299,
    description: '7-day complete experience with flights, hotel, and guided tours. Includes bullet train pass and cultural experiences.',
    image: '/images/DealsPage/Packages_Tokyo.jpg',
    rating: 4.7,
    duration: '7 days',
    features: ['Flights Included', '4-Star Hotel', 'City Tours', 'Bullet Train Pass', 'Cultural Experiences']
  },
  {
    id: 4,
    type: 'flight',
    title: 'LA → London',
    location: 'London, UK',
    continent: 'Europe',
    price: 549,
    originalPrice: 799,
    description: 'Premium economy with extra legroom and complimentary meals. Direct flights with award-winning airline service.',
    image: '/images/DealsPage/Flights_London.jpg',
    rating: 4.6,
    duration: 'per person',
    features: ['Premium Economy', 'Meals Included', 'Extra Legroom', 'Entertainment System']
  },
  {
    id: 5,
    type: 'hotel',
    title: 'Santorini Sunset Resort',
    location: 'Santorini, Greece',
    continent: 'Europe',
    price: 425,
    originalPrice: 600,
    description: 'Oceanfront luxury resort with infinity pool and breathtaking sunset views. Includes daily breakfast and spa access.',
    image: '/images/DealsPage/Hotel_Greece.jpg',
    rating: 4.8,
    duration: 'per night',
    features: ['Ocean View', 'Infinity Pool', 'Breakfast Included', 'Spa Access', 'Sunset Views']
  },
  {
    id: 6,
    type: 'package',
    title: 'Bali Wellness Retreat',
    location: 'Bali, Indonesia',
    continent: 'Asia',
    price: 1599,
    originalPrice: 1899,
    description: '6-day wellness package with luxury accommodations, daily spa treatments, yoga sessions, and healthy organic cuisine.',
    image: '/images/DealsPage/Packages_Bali.jpg',
    rating: 4.9,
    duration: '6 days',
    features: ['Spa Treatments', 'Daily Yoga', 'Organic Cuisine', 'Meditation Classes', 'Nature Excursions']
  },
  {
    id: 7,
    type: 'flight',
    title: 'Miami → Barcelona',
    location: 'Barcelona, Spain',
    continent: 'Europe',
    price: 389,
    originalPrice: 589,
    description: 'Explore the vibrant culture of Barcelona with these discounted direct flights. Flexible booking with free date changes.',
    image: '/images/DealsPage/Packages_BarcelonaPic.jpg',
    rating: 4.5,
    duration: 'per person',
    features: ['Direct Flight', 'Free Date Changes', 'Personal Entertainment', 'Meal Service']
  },
  {
    id: 8,
    type: 'hotel',
    title: 'Swiss Alpine Lodge',
    location: 'Zermatt, Switzerland',
    continent: 'Europe',
    price: 520,
    originalPrice: 750,
    description: 'Mountain luxury with Matterhorn views. Ski-in/ski-out access, alpine spa, and traditional Swiss hospitality.',
    image: '/images/DealsPage/Hotel_Switzerland.jpg',
    rating: 4.7,
    duration: 'per night',
    features: ['Matterhorn Views', 'Ski Access', 'Alpine Spa', 'Mountain Dining']
  },
  {
    id: 9,
    type: 'package',
    title: 'Egyptian Discovery Tour',
    location: 'Cairo, Egypt',
    continent: 'Africa',
    price: 1299,
    originalPrice: 1699,
    description: '5-day historical journey including pyramids, museums, and Nile cruise. Expert guides and luxury accommodations included.',
    image: '/images/DealsPage/Packages_Egypt.jpg',
    rating: 4.6,
    duration: '5 days',
    features: ['Pyramid Tours', 'Nile Cruise', 'Expert Guides', 'Luxury Hotels', 'Museum Access']
  },
  {
    id: 10,
    type: 'flight',
    title: 'Seattle → Amsterdam',
    location: 'Amsterdam, Netherlands',
    continent: 'Europe',
    price: 456,
    originalPrice: 678,
    description: 'Discover Amsterdam with these great flight deals. Includes checked baggage and seat selection.',
    image: '/images/DealsPage/Flights_Amsterdam.jpg',
    rating: 4.4,
    duration: 'per person',
    features: ['Checked Baggage', 'Seat Selection', 'In-flight WiFi', 'Refreshments']
  },
  {
    id: 11,
    type: 'hotel',
    title: 'Dubai Marina Resort',
    location: 'Dubai, UAE',
    continent: 'Asia',
    price: 380,
    originalPrice: 550,
    description: 'Modern luxury in Dubai Marina with beach access, rooftop pool, and world-class dining options.',
    image: '/images/DealsPage/Hotel_Dubai.jpg',
    rating: 4.8,
    duration: 'per night',
    features: ['Beach Access', 'Rooftop Pool', 'Marina Views', 'Fine Dining', 'Spa Services']
  },
  {
    id: 12,
    type: 'package',
    title: 'Iceland Northern Lights',
    location: 'Reykjavik, Iceland',
    continent: 'Europe',
    price: 1799,
    originalPrice: 2199,
    description: '4-day Northern Lights adventure with glacier tours, hot springs, and luxury lodge accommodations.',
    image: '/images/DealsPage/Packages_Iceland.jpg',
    rating: 4.9,
    duration: '4 days',
    features: ['Northern Lights Tours', 'Glacier Excursions', 'Hot Springs', 'Luxury Lodge', 'Photography Guide']
  }
];

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