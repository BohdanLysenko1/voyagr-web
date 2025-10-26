/**
 * Custom hook for managing trip planning data and mock data
 * This separates data fetching logic from UI components
 */

import { useMemo } from 'react';
import { 
  User, 
  Users, 
  UsersRound, 
  Mountain, 
  Landmark, 
  Waves, 
  UtensilsCrossed, 
  PartyPopper, 
  ShoppingBag,
  Umbrella,
  Trees,
  Camera,
  Castle,
  Dumbbell,
  Sparkles,
  Music,
  Palette,
  Gem,
  DollarSign,
  Footprints,
  Fish,
  Snowflake,
  Wine,
  Car,
  Tent,
  Ship,
  Building2,
  Store,
  Ticket,
  Leaf,
  Heart,
  LucideIcon 
} from 'lucide-react';
import { Activity } from '@/components/AI/InteractiveMessages/ActivityGrid';
import { CarouselCard } from '@/components/AI/InteractiveMessages/CardCarousel';

interface QuickReplyOption {
  id: string;
  label: string;
  value: string;
  emoji?: string;
  icon?: LucideIcon;
}

export function useTripPlanningData() {
  /**
   * Destination options - in production, fetch from API
   */
  const destinationOptions = useMemo<QuickReplyOption[]>(
    () => [
      { id: '1', label: 'Paris, France', value: 'paris', emoji: '🇫🇷' },
      { id: '2', label: 'Tokyo, Japan', value: 'tokyo', emoji: '🇯🇵' },
      { id: '3', label: 'New York, USA', value: 'new-york', emoji: '🗽' },
      { id: '4', label: 'Bali, Indonesia', value: 'bali', emoji: '🏝️' },
      { id: '5', label: 'Rome, Italy', value: 'rome', emoji: '🇮🇹' },
      { id: '6', label: 'Dubai, UAE', value: 'dubai', emoji: '🕌' },
    ],
    []
  );

  /**
   * Traveler count options
   */
  const travelerOptions = useMemo<QuickReplyOption[]>(
    () => [
      { id: '1', label: 'Solo', value: '1', icon: User },
      { id: '2', label: 'Couple', value: '2', icon: Users },
      { id: '3', label: 'Family (3-4)', value: '4', icon: UsersRound },
      { id: '4', label: 'Group (5+)', value: '5', icon: UsersRound },
    ],
    []
  );

  /**
   * Travel preference options
   */
  const preferenceOptions = useMemo<QuickReplyOption[]>(
    () => [
      { id: '1', label: 'Adventure', value: 'adventure', icon: Mountain },
      { id: '2', label: 'Culture', value: 'culture', icon: Landmark },
      { id: '3', label: 'Relaxation', value: 'relaxation', icon: Waves },
      { id: '4', label: 'Food & Dining', value: 'food', icon: UtensilsCrossed },
      { id: '5', label: 'Nightlife', value: 'nightlife', icon: PartyPopper },
      { id: '6', label: 'Shopping', value: 'shopping', icon: ShoppingBag },
      { id: '7', label: 'Beach & Water', value: 'beach', icon: Umbrella },
      { id: '8', label: 'Nature & Wildlife', value: 'nature', icon: Trees },
      { id: '9', label: 'Photography', value: 'photography', icon: Camera },
      { id: '10', label: 'History', value: 'history', icon: Castle },
      { id: '11', label: 'Sports & Fitness', value: 'sports', icon: Dumbbell },
      { id: '12', label: 'Wellness & Spa', value: 'wellness', icon: Sparkles },
      { id: '13', label: 'Music & Festivals', value: 'music', icon: Music },
      { id: '14', label: 'Art & Museums', value: 'art', icon: Palette },
      { id: '15', label: 'Luxury', value: 'luxury', icon: Gem },
      { id: '16', label: 'Budget Travel', value: 'budget', icon: DollarSign },
      { id: '17', label: 'Hiking & Trekking', value: 'hiking', icon: Footprints },
      { id: '18', label: 'Diving & Snorkeling', value: 'diving', icon: Fish },
      { id: '19', label: 'Skiing & Snow Sports', value: 'skiing', icon: Snowflake },
      { id: '20', label: 'Wine & Gastronomy', value: 'wine', icon: Wine },
      { id: '21', label: 'Road Trips', value: 'roadtrip', icon: Car },
      { id: '22', label: 'Camping', value: 'camping', icon: Tent },
      { id: '23', label: 'Cruises', value: 'cruise', icon: Ship },
      { id: '24', label: 'Architecture', value: 'architecture', icon: Building2 },
      { id: '25', label: 'Local Markets', value: 'markets', icon: Store },
      { id: '26', label: 'Theme Parks', value: 'themepark', icon: Ticket },
      { id: '27', label: 'Eco Tourism', value: 'ecotourism', icon: Leaf },
      { id: '28', label: 'Spiritual & Yoga', value: 'spiritual', icon: Heart },
    ],
    []
  );

  /**
   * Mock flight options - in production, fetch from API based on destination/dates
   */
  const getFlightOptions = useMemo(
    () => (destination?: string): CarouselCard[] => [
      {
        id: 'flight-1',
        title: 'Air France Direct',
        subtitle: 'CDG → JFK',
        price: 850,
        rating: 4.5,
        details: ['Direct flight', '8h 15m', 'Economy class'],
        badge: 'Best Value',
        image: '/images/flights/air-france.jpg',
      },
      {
        id: 'flight-2',
        title: 'Emirates Premium',
        subtitle: 'DXB → JFK',
        price: 1200,
        rating: 4.8,
        details: ['1 stop in Dubai', '14h 30m', 'Business class'],
        badge: 'Luxury',
        image: '/images/flights/emirates.jpg',
      },
      {
        id: 'flight-3',
        title: 'Delta Budget',
        subtitle: 'ATL → JFK',
        price: 450,
        rating: 4.2,
        details: ['2 stops', '12h 45m', 'Economy'],
        badge: 'Cheapest',
        image: '/images/flights/delta.jpg',
      },
    ],
    []
  );

  /**
   * Mock hotel options - in production, fetch from API based on destination/dates
   */
  const getHotelOptions = useMemo(
    () => (destination?: string): CarouselCard[] => [
      {
        id: 'hotel-1',
        title: 'The Plaza Hotel',
        subtitle: 'Luxury 5-star hotel',
        price: 450,
        rating: 4.9,
        details: ['Central Park view', 'Spa & pool', 'Fine dining'],
        badge: 'Premium',
        image: '/images/hotels/plaza.jpg',
      },
      {
        id: 'hotel-2',
        title: 'Boutique Soho',
        subtitle: 'Trendy boutique hotel',
        price: 280,
        rating: 4.6,
        details: ['SoHo location', 'Rooftop bar', 'Modern design'],
        badge: 'Popular',
        image: '/images/hotels/soho.jpg',
      },
      {
        id: 'hotel-3',
        title: 'Budget Inn Manhattan',
        subtitle: 'Comfortable budget stay',
        price: 120,
        rating: 4.0,
        details: ['Midtown location', 'Free WiFi', 'Clean rooms'],
        badge: 'Best Price',
        image: '/images/hotels/budget.jpg',
      },
    ],
    []
  );

  /**
   * Mock activity options - in production, fetch from API based on destination/preferences
   */
  const getActivityOptions = useMemo(
    () => (destination?: string, preferences?: string[]): Activity[] => [
      {
        id: 'act-1',
        name: 'Statue of Liberty Tour',
        category: 'Sightseeing',
        price: 45,
        duration: '3h',
        emoji: '🗽',
      },
      {
        id: 'act-2',
        name: 'Central Park Bike Ride',
        category: 'Adventure',
        price: 30,
        duration: '2h',
        emoji: '🚴',
      },
      {
        id: 'act-3',
        name: 'Broadway Show',
        category: 'Culture',
        price: 120,
        duration: '3h',
        emoji: '🎭',
      },
      {
        id: 'act-4',
        name: 'Food Walking Tour',
        category: 'Food',
        price: 80,
        duration: '4h',
        emoji: '🍕',
      },
      {
        id: 'act-5',
        name: 'Museum of Modern Art',
        category: 'Culture',
        price: 25,
        duration: '2h',
        emoji: '🎨',
      },
      {
        id: 'act-6',
        name: 'Rooftop Bar Hopping',
        category: 'Nightlife',
        price: 60,
        duration: '4h',
        emoji: '🍸',
      },
    ],
    []
  );

  return {
    destinationOptions,
    travelerOptions,
    preferenceOptions,
    getFlightOptions,
    getHotelOptions,
    getActivityOptions,
  };
}
