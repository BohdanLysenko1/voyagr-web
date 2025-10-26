import { NextRequest, NextResponse } from 'next/server';
import { FlightSearchParams } from '@/types/flights';

/**
 * AI Chat endpoint for travel planning conversations
 * Detects flight search queries and integrates with Amadeus API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, chatHistory = [], context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Detect if this is a flight search query
    const isFlightQuery = detectFlightQuery(message);

    if (isFlightQuery) {
      // Parse flight parameters from the message
      const flightParams = parseFlightParameters(message, context);
      
      // Call the flights search API
      try {
        const flightSearchUrl = new URL('/api/flights/search', request.url);
        const flightResponse = await fetch(flightSearchUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(flightParams),
        });

        if (flightResponse.ok) {
          const flightData = await flightResponse.json();
          const flights = flightData.data.flights;

          if (flights && flights.length > 0) {
            return NextResponse.json({
              success: true,
              data: {
                message: generateFlightFoundMessage(flights.length, flightParams),
                flights: flights,
                metadata: {
                  flightSearch: true,
                  searchParams: flightParams,
                },
              },
            });
          }
        }

        // No flights found
        return NextResponse.json({
          success: true,
          data: {
            message: "I couldn't find any flights matching your criteria. Try adjusting your dates or destinations, or let me know if you'd like to search for something else!",
            metadata: {
              flightSearch: true,
              noResults: true,
            },
          },
        });
      } catch (flightError) {
        console.error('Flight search error:', flightError);
        return NextResponse.json({
          success: true,
          data: {
            message: "I encountered an issue searching for flights. Please try again or rephrase your request. I'm here to help!",
            metadata: {
              flightSearch: true,
              error: true,
            },
          },
        });
      }
    }

    // Regular AI chat response (non-flight queries)
    const aiResponse = generateAIResponse(message, chatHistory, context);

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse,
        metadata: {
          context,
        },
      },
    });

  } catch (error: any) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Detect if the message is a flight search query
 */
function detectFlightQuery(message: string): boolean {
  const flightKeywords = [
    'flight', 'flights', 'fly', 'flying',
    'trip', 'round-trip', 'one-way', 'roundtrip',
    'ticket', 'tickets', 'travel', 'traveling',
    'business class', 'first class', 'economy',
    'airline', 'departure', 'arriving'
  ];

  const messageLower = message.toLowerCase();
  return flightKeywords.some(keyword => messageLower.includes(keyword));
}

/**
 * Parse flight search parameters from natural language
 */
function parseFlightParameters(message: string, context?: string): FlightSearchParams {
  const messageLower = message.toLowerCase();
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  // City to IATA code mapping
  const cityToIATA: Record<string, string> = {
    'london': 'LHR', 'tokyo': 'NRT', 'paris': 'CDG', 'new york': 'JFK',
    'los angeles': 'LAX', 'miami': 'MIA', 'chicago': 'ORD', 'sydney': 'SYD',
    'rome': 'FCO', 'dubai': 'DXB', 'singapore': 'SIN', 'hong kong': 'HKG',
    'toronto': 'YYZ', 'san francisco': 'SFO', 'seattle': 'SEA', 'boston': 'BOS',
    'las vegas': 'LAS', 'orlando': 'MCO', 'denver': 'DEN', 'atlanta': 'ATL',
    'barcelona': 'BCN', 'amsterdam': 'AMS', 'berlin': 'BER', 'madrid': 'MAD',
    'lisbon': 'LIS', 'moscow': 'SVO', 'istanbul': 'IST', 'bangkok': 'BKK',
    'mumbai': 'BOM', 'delhi': 'DEL', 'shanghai': 'PVG', 'beijing': 'PEK',
    'seoul': 'ICN', 'mexico city': 'MEX', 'sao paulo': 'GRU', 'buenos aires': 'EZE',
    'cairo': 'CAI', 'johannesburg': 'JNB', 'melbourne': 'MEL', 'auckland': 'AKL',
    'vancouver': 'YVR', 'montreal': 'YUL', 'washington': 'DCA', 'philadelphia': 'PHL',
    'houston': 'IAH', 'dallas': 'DFW', 'phoenix': 'PHX', 'san diego': 'SAN',
  };

  // Extract destination
  const toMatch = message.match(/to\s+([A-Za-z\s]+?)(?:\s+in|\s+for|\s+on|\s+from|$)/i);
  const fromMatch = message.match(/from\s+([A-Za-z\s]+?)(?:\s+to|\s+in|\s+for|$)/i);

  let destination = 'LHR'; // Default
  let origin = 'JFK'; // Default

  if (toMatch) {
    const cityName = toMatch[1].trim().toLowerCase();
    destination = cityToIATA[cityName] || destination;
  }

  if (fromMatch) {
    const cityName = fromMatch[1].trim().toLowerCase();
    origin = cityToIATA[cityName] || origin;
  }

  // Parse context if available
  if (context) {
    const contextLower = context.toLowerCase();
    const destMatch = contextLower.match(/destination:\s*([^,]+)/i);
    if (destMatch) {
      const destCity = destMatch[1].trim().toLowerCase();
      destination = cityToIATA[destCity] || destination;
    }
  }

  // Detect cabin class
  const cabinClass: 'BUSINESS' | 'FIRST' | 'PREMIUM_ECONOMY' | 'ECONOMY' = 
    messageLower.includes('business') ? 'BUSINESS' :
    messageLower.includes('first') ? 'FIRST' :
    messageLower.includes('premium') ? 'PREMIUM_ECONOMY' : 'ECONOMY';

  // Detect trip type
  const isRoundTrip = !messageLower.includes('one-way') && !messageLower.includes('oneway');

  // Parse dates
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                     'july', 'august', 'september', 'october', 'november', 'december'];
  
  let departureDate = today.toISOString().split('T')[0];
  let returnDate = nextMonth.toISOString().split('T')[0];

  // Check for month mentions
  monthNames.forEach((month, index) => {
    if (messageLower.includes(month)) {
      const monthDate = new Date();
      monthDate.setMonth(index);
      if (monthDate < today) monthDate.setFullYear(monthDate.getFullYear() + 1);
      departureDate = monthDate.toISOString().split('T')[0];
      
      const retDate = new Date(monthDate);
      retDate.setDate(retDate.getDate() + 14); // Default 2 weeks
      returnDate = retDate.toISOString().split('T')[0];
    }
  });

  // Parse specific dates (Dec 13-24, 13-24 Dec, etc.)
  const dateRangeMatch = message.match(/(\w+)\s+(\d{1,2})-(\d{1,2})/i);
  if (dateRangeMatch) {
    const [, monthStr, day1, day2] = dateRangeMatch;
    const monthIdx = monthNames.findIndex(m => m.startsWith(monthStr.toLowerCase()));
    
    if (monthIdx !== -1) {
      const year = today.getFullYear();
      const depDate = new Date(year, monthIdx, parseInt(day1));
      const retDate = new Date(year, monthIdx, parseInt(day2));
      
      if (depDate < today) {
        depDate.setFullYear(year + 1);
        retDate.setFullYear(year + 1);
      }
      
      departureDate = depDate.toISOString().split('T')[0];
      returnDate = retDate.toISOString().split('T')[0];
    }
  }

  // Parse from context
  if (context) {
    const datesMatch = context.match(/dates:\s*([^,]+)/i);
    if (datesMatch) {
      const dateStr = datesMatch[1].trim();
      // Could parse more sophisticated date formats here
    }
  }

  // Detect number of travelers
  const adultsMatch = message.match(/(\d+)\s*(?:person|people|passenger|adult|traveler)/i);
  const adults = adultsMatch ? parseInt(adultsMatch[1]) : 1;

  // Parse travelers from context
  let contextTravelers = 1;
  if (context) {
    const travelersMatch = context.match(/travelers?:\s*(\d+)/i);
    if (travelersMatch) {
      contextTravelers = parseInt(travelersMatch[1]);
    }
  }

  return {
    origin,
    destination,
    departureDate,
    returnDate: isRoundTrip ? returnDate : undefined,
    adults: adultsMatch ? adults : contextTravelers,
    cabinClass,
    currencyCode: 'USD',
  };
}

/**
 * Generate a friendly message when flights are found
 */
function generateFlightFoundMessage(count: number, params: FlightSearchParams): string {
  const destination = params.destination;
  const origin = params.origin;
  const tripType = params.returnDate ? 'round-trip' : 'one-way';
  
  const messages = [
    `Great news! I found ${count} ${tripType} flight${count > 1 ? 's' : ''} from ${origin} to ${destination}. Here are your best options:`,
    `Perfect! I've discovered ${count} excellent flight${count > 1 ? 's' : ''} for your journey from ${origin} to ${destination}. Check them out:`,
    `✈️ Success! ${count} flight option${count > 1 ? 's are' : ' is'} available for your ${tripType} from ${origin} to ${destination}:`,
    `I found ${count} great flight${count > 1 ? 's' : ''} matching your search! Here's what's available from ${origin} to ${destination}:`,
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate AI response for non-flight queries
 */
function generateAIResponse(message: string, chatHistory: any[], context?: string): string {
  // This is a simple implementation. In production, integrate with OpenAI, Claude, etc.
  
  const responses: Record<string, string[]> = {
    chat: [
      "Thanks for reaching out! I'm here to help with any travel questions you have. What would you like to know?",
      "Hello! I'm Voyagr AI, your travel assistant. Feel free to ask me anything about destinations, travel tips, or planning advice.",
      "Great to chat with you! I can help with travel recommendations, tips, and answer any questions you might have.",
      "Hi there! I'm here to make your travel planning easier. What can I help you with today?",
    ],
    hotels: [
      "I'd be happy to help you find the perfect accommodation! Tell me more about your destination, dates, and preferences.",
      "Great! Let me assist you with hotel recommendations. What city are you visiting and when?",
      "I can suggest amazing hotels for your trip. Share your destination and budget, and I'll find the best options!",
    ],
    restaurants: [
      "I love helping with restaurant recommendations! Which city are you dining in, and what type of cuisine interests you?",
      "Let me find some fantastic dining spots for you! Tell me about your location and food preferences.",
      "Excellent! I can suggest great restaurants. What kind of dining experience are you looking for?",
    ],
    activities: [
      "I can help you discover amazing activities and experiences! Where are you traveling to?",
      "Let's make your trip memorable with great activities! Tell me about your destination and interests.",
      "I'd love to suggest fun things to do! Share your travel plans and what you enjoy.",
    ],
    planning: [
      "I'm here to help plan your perfect trip! Where would you like to go?",
      "Let's create an amazing travel itinerary together! Tell me about your dream destination.",
      "I can help you plan every detail of your journey. What kind of trip are you envisioning?",
    ],
  };

  // Detect category from context first
  let category = 'chat'; // Default to general chat
  
  if (context) {
    const contextLower = context.toLowerCase();
    if (contextLower.includes('chat tab')) {
      category = 'chat';
    } else if (contextLower.includes('plan tab')) {
      category = 'planning';
    } else if (contextLower.includes('hotels tab')) {
      category = 'hotels';
    } else if (contextLower.includes('restaurants tab')) {
      category = 'restaurants';
    }
  }
  
  // If no context, detect from message
  if (category === 'chat') {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('hotel') || messageLower.includes('accommodation') || messageLower.includes('stay')) {
      category = 'hotels';
    } else if (messageLower.includes('restaurant') || messageLower.includes('food') || messageLower.includes('dining') || messageLower.includes('eat')) {
      category = 'restaurants';
    } else if (messageLower.includes('activity') || messageLower.includes('activities') || messageLower.includes('do') || messageLower.includes('things')) {
      category = 'activities';
    } else if (messageLower.includes('plan') || messageLower.includes('trip') || messageLower.includes('itinerary')) {
      category = 'planning';
    }
  }

  const categoryResponses = responses[category] || responses.chat;
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}
