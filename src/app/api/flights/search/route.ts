import { NextRequest, NextResponse } from 'next/server';
import { getAmadeusClient, getAirlineName, formatDuration } from '@/lib/amadeus';
import { FlightSearchParams, FlightOption } from '@/types/flights';

export async function POST(request: NextRequest) {
  try {
    const body: FlightSearchParams = await request.json();

    console.log('Flight search request:', { ...body, timestamp: new Date().toISOString() });

    // Validate required parameters
    const { origin, destination, departureDate, adults } = body;

    if (!origin || !destination || !departureDate || !adults) {
      return NextResponse.json(
        { error: 'Missing required parameters: origin, destination, departureDate, and adults are required' },
        { status: 400 }
      );
    }

    // Check environment variables
    console.log('Environment check:', {
      hasApiKey: !!process.env.AMADEUS_API_KEY,
      hasApiSecret: !!process.env.AMADEUS_API_SECRET,
      hostname: process.env.AMADEUS_HOSTNAME,
      apiKeyLength: process.env.AMADEUS_API_KEY?.length,
      apiSecretLength: process.env.AMADEUS_API_SECRET?.length,
    });

    const amadeus = getAmadeusClient();

    // Build search parameters
    const searchParams: any = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults.toString(),
      max: 10, // Maximum results
    };

    // Add optional parameters
    if (body.returnDate) {
      searchParams.returnDate = body.returnDate;
    }

    if (body.cabinClass) {
      searchParams.travelClass = body.cabinClass;
    }

    if (body.children) {
      searchParams.children = body.children.toString();
    }

    if (body.infants) {
      searchParams.infants = body.infants.toString();
    }

    if (body.maxPrice) {
      searchParams.maxPrice = body.maxPrice.toString();
    }

    if (body.nonStop !== undefined) {
      searchParams.nonStop = body.nonStop.toString();
    }

    if (body.currencyCode) {
      searchParams.currencyCode = body.currencyCode;
    }

    // Make API call to Amadeus
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);

    // Transform response to our format
    const transformedFlights = transformAmadeusFlights(response.data);

    return NextResponse.json({
      success: true,
      data: {
        flights: transformedFlights,
        meta: {
          count: transformedFlights.length,
          searchParams: body,
        },
      },
    });

  } catch (error: any) {
    console.error('Amadeus API Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response ? {
        statusCode: error.response.statusCode,
        body: error.response.body,
        result: error.response.result,
      } : null,
    });

    // Handle specific Amadeus errors
    if (error.response) {
      const { statusCode, result } = error.response;
      const errorMessage = result?.errors?.[0]?.detail || result?.errors?.[0]?.title || 'Flight search failed';

      return NextResponse.json(
        {
          error: errorMessage,
          details: result?.errors || [],
          debug: {
            statusCode,
            fullError: result,
          }
        },
        { status: statusCode || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
        errorType: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Transform Amadeus response to our FlightOption format
function transformAmadeusFlights(amadeusData: any[]): FlightOption[] {
  return amadeusData.map((offer) => {
    const itinerary = offer.itineraries[0]; // First itinerary (outbound)
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    // Parse price safely
    const priceTotal = offer.price?.total || offer.price?.grandTotal || '0';
    const price = parseFloat(priceTotal);

    console.log('Transforming flight:', {
      id: offer.id,
      priceRaw: offer.price,
      priceTotal,
      price,
      departureTime: firstSegment.departure.at,
      arrivalTime: lastSegment.arrival.at
    });

    // Calculate stops
    const stops = segments.length - 1;

    // Get airline info
    const airlineCode = firstSegment.carrierCode;

    return {
      id: `amadeus-${offer.id}`,
      airline: getAirlineName(airlineCode),
      airlineCode: airlineCode,
      flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
      departure: firstSegment.departure.iataCode,
      arrival: lastSegment.arrival.iataCode,
      departureTime: firstSegment.departure.at,
      arrivalTime: lastSegment.arrival.at,
      duration: formatDuration(itinerary.duration),
      stops: stops,
      price: isNaN(price) ? 0 : price,
      currency: offer.price?.currency || 'USD',
      cabinClass: firstSegment.cabin || 'ECONOMY',
      segments: segments.map((seg: any) => ({
        departure: {
          iataCode: seg.departure.iataCode,
          at: seg.departure.at,
          terminal: seg.departure.terminal,
        },
        arrival: {
          iataCode: seg.arrival.iataCode,
          at: seg.arrival.at,
          terminal: seg.arrival.terminal,
        },
        carrierCode: seg.carrierCode,
        number: seg.number,
        aircraft: {
          code: seg.aircraft.code,
        },
        duration: seg.duration,
        cabin: seg.cabin,
        numberOfBookableSeats: seg.numberOfBookableSeats,
      })),
      validatingAirlineCodes: offer.validatingAirlineCodes,
      bookingClass: firstSegment.pricingDetailPerAdult?.travelClass,
      availableSeats: firstSegment.numberOfBookableSeats,
      selected: false,
      rawData: offer, // Store original data for booking
    };
  });
}
