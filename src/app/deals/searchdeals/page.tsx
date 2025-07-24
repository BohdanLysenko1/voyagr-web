"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchDealCard, { SearchDeal } from '@/components/DealsPage/SearchDeals';

// Sample deals data
const sampleDeals: SearchDeal[] = [
  {
    id: 1,
    type: 'flight',
    title: 'NYC → Paris',
    location: 'Paris, France',
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
    price: 1799,
    originalPrice: 2199,
    description: '4-day Northern Lights adventure with glacier tours, hot springs, and luxury lodge accommodations.',
    image: '/images/DealsPage/Packages_Iceland.jpg',
    rating: 4.9,
    duration: '4 days',
    features: ['Northern Lights Tours', 'Glacier Excursions', 'Hot Springs', 'Luxury Lodge', 'Photography Guide']
  }
];

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



export default function SearchDealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'flight' | 'hotel' | 'package'>('all');
  const [selectedContinent, setSelectedContinent] = useState('All Locations');
  const [sortBy, setSortBy] = useState('price-low');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    const continentParam = searchParams.get('continent');
    const searchParam = searchParams.get('search');
    
    if (typeParam && ['flight', 'hotel', 'package'].includes(typeParam)) {
      setSelectedType(typeParam as 'flight' | 'hotel' | 'package');
    }
    
    if (continentParam && continents.includes(continentParam)) {
      setSelectedContinent(continentParam);
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
      const dealContinent = locationToContinentMap[deal.location];
      const matchesContinent = selectedContinent === 'All Locations' || dealContinent === selectedContinent;
      
      return matchesSearch && matchesType && matchesContinent;
    });

    // Sort the filtered results
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

  const handleDealClick = (deal: SearchDeal) => {
    router.push(`/deals/${deal.type}s/${deal.id}`);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Search Travel Deals</h1>
          <p className="text-lg md:text-xl text-gray-600">Find the perfect deal for your next adventure</p>
        </div>

        {/* Search Bar */}
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

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Type Filter */}
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

            {/* Continent Filter */}
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

            {/* Sort */}
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-lg">
            Showing {filteredAndSortedDeals.length} {filteredAndSortedDeals.length === 1 ? 'deal' : 'deals'}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Deal Cards Grid */}
        {filteredAndSortedDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedDeals.map(deal => (
              <SearchDealCard 
                key={deal.id} 
                deal={deal} 
                onDealClick={handleDealClick}
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
    </main>
  );
}