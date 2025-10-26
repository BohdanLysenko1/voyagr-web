/**
 * Flight-related constants for AI Interface
 */

/**
 * Keywords used to detect if a query is related to flight searches
 */
export const FLIGHT_SEARCH_KEYWORDS = [
  'flight',
  'fly',
  'trip',
  'round-trip',
  'one-way',
  'ticket',
  'travel',
  'business class',
  'economy',
  'airline',
];

/**
 * Mapping of city names to their IATA airport codes
 * This is used for parsing natural language queries
 */
export const CITY_TO_IATA_MAP: Record<string, string> = {
  'london': 'LHR',
  'tokyo': 'NRT',
  'paris': 'CDG',
  'new york': 'JFK',
  'los angeles': 'LAX',
  'miami': 'MIA',
  'chicago': 'ORD',
  'sydney': 'SYD',
  'rome': 'FCO',
  'dubai': 'DXB',
  'singapore': 'SIN',
  'hong kong': 'HKG',
  'toronto': 'YYZ',
  'san francisco': 'SFO',
  'seattle': 'SEA',
  'boston': 'BOS',
  'las vegas': 'LAS',
  'orlando': 'MCO',
  'denver': 'DEN',
  'atlanta': 'ATL',
  // Regional defaults
  'europe': 'LHR',
  'australia': 'SYD',
  'asia': 'NRT',
};

/**
 * Month names for date parsing
 */
export const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];
