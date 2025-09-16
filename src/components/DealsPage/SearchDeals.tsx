import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plane, Hotel, Package, MapPin, Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

export interface SearchDeal {
  id: number;
  type: 'flight' | 'hotel' | 'package';
  title: string;
  location: string;
  continent: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating?: number;
  duration?: string;
  features: string[];
}

export const sampleDeals: SearchDeal[] = [
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
  },
  {
    id: 13,
    type: 'package',
    title: 'The Football Way',
    location: 'Barcelona, Spain',
    continent: 'Europe',
    price: 1199,
    originalPrice: 2199,
    description: '4-days of stadium tours, epic rivalries, club & city history, and a luxury community to fit the luxury stay',
    image: '/images/DealsPage/Packages_BarcelonaPic.jpg',
    rating: 4.9,
    duration: '4 days',
    features: ['Stadium Tours', 'FC Barcelona games', 'Museum', 'Luxury hotel', 'Photography Guide']
  },
  {
    id: 14,
    type: 'package',
    title: 'Kyiv & Carpathian Escape',
    location: 'Kyiv, Lviv & Carpathian Mountains',
    continent: 'Europe',
    price: 1059,
    originalPrice: 1500,
    description: 'Explore Ukraine with a 7-night journey through the historic streets of Kyiv, the charm of Lviv, and breathtaking Carpathian mountain excursions. Includes flights, 4-star hotels, guided tours, and cultural experiences.',
    image: '/images/DealsPage/Packages_Ukraine.jpg',
    rating: 4.9,
    duration: '7 nights',
    features: ['Roundtrip Flights', '4-Star Hotels', 'Glacier Excursions', 'Cultural City Tours', 'Carpathian Hiking']
  },
  {
    id: 15,
    type: 'package',
    title: 'Historic Rome Getaway',
    location: 'Rome, Italy',
    continent: 'Europe',
    price: 1169,
    originalPrice: 1650,
    description: 'Discover the Eternal City with a 5-night package including flights, a centrally located hotel, a guided tour of the Colosseum and Roman Forum, Vatican Museums entry, and authentic Italian dining experiences.',
    image: '/images/DealsPage/Packages_RomePic.jpg',
    rating: 4.8,
    duration: '5 nights',
    features: ['Flights Included', 'Central Hotel Stay', 'Colosseum Tour', 'Vatican Museums', 'Authentic Italian Dining']
  },
  {
    id: 16,
    type: 'package',
    title: 'Bangkok City & Temples Tour',
    location: 'Bangkok, Thailand',
    continent: 'Asia',
    price: 1189,
    originalPrice: 1699,
    description: 'Immerse yourself in Thailand’s capital with this 6-night Bangkok package. Includes flights, 4-star hotel stay, guided tours of the Grand Palace and floating markets, a day trip to Ayutthaya, and authentic Thai dining experiences.',
    image: '/images/DealsPage/Packages_Bangkok.jpg',
    rating: 4.8,
    duration: '6 nights',
    features: ['Flights Included', '4-Star Hotel', 'Grand Palace Tour', 'Floating Market Visit', 'Ayutthaya Excursion']
  },
  {
    id: 17,
    type: 'package',
    title: 'Sydney & Great Barrier Reef',
    location: 'Sydney & Cairns, Australia',
    continent: 'Australia',
    price: 1899,
    originalPrice: 2500,
    description: 'Discover Australia with 8 nights split between Sydney and Cairns. Includes flights, hotels, guided city tour, Sydney Opera House visit, and snorkeling at the Great Barrier Reef.',
    image: '/images/DealsPage/Packages_Australia.jpg',
    rating: 4.7,
    duration: '8 nights',
    features: ['Flights & Transfers', 'Hotels Included', 'Great Barrier Reef Snorkel', 'City Tour', 'Opera House Visit']
  },  
  {
    id: 18,
    type: 'package',
    title: 'Cape Town & Safari Escape',
    location: 'Cape Town & Kruger National Park, South Africa',
    continent: 'Africa',
    price: 1750,
    originalPrice: 2399,
    description: 'Embark on a 7-night South African journey. Explore Cape Town’s Table Mountain, wine country, and take a 3-day safari in Kruger National Park with luxury lodge stays.',
    image: '/images/DealsPage/Packages_SouthAfrica.jpg',
    rating: 4.9,
    duration: '7 nights',
    features: ['Flights Included', 'Luxury Lodges', 'Cape Town Tour', 'Wine Country Visit', 'Kruger Safari']
  }
];

interface SearchDealCardProps {
  deal: SearchDeal;
  onDealClick?: (deal: SearchDeal) => void;
  onViewDeal?: (deal: SearchDeal) => void;
}

const SearchDealCard: React.FC<SearchDealCardProps> = ({ deal, onDealClick, onViewDeal }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'hotel': return <Hotel className="w-4 h-4" />;
      case 'package': return <Package className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleClick = () => {
    if (onDealClick) {
      onDealClick(deal);
    }
  };

  const handleViewDeal = () => {
    if (onViewDeal) {
      onViewDeal(deal);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(deal);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 300px"
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          {getTypeIcon(deal.type)}
          <span className="text-xs font-medium capitalize">{deal.type}</span>
        </div>

        <button 
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1 hover:bg-white transition-colors" 
          onClick={handleToggleFavorite} 
          aria-label={isFavorite(deal.id) ? 'Unsave deal' : 'Save deal'}
        >
          <Heart
            className={`w-5 h-5 ${isFavorite(deal.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        
        {deal.originalPrice && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white rounded-full px-2 py-1">
            <span className="text-xs font-bold">
              {Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{deal.title}</h3>
          {deal.rating && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>⭐</span>
              <span>{deal.rating}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{deal.location}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {deal.features.slice(0, 2).map((feature, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
          {deal.features.length > 2 && (
            <span className="text-gray-500 text-xs">+{deal.features.length - 2} more</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">${deal.price}</span>
            {deal.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${deal.originalPrice}</span>
            )}
            {deal.duration && (
              <span className="text-sm text-gray-500">/{deal.duration}</span>
            )}
          </div>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleViewDeal}
          >
            View Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchDealCard;