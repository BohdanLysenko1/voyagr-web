import { NextRequest, NextResponse } from 'next/server';
import { getAmadeusClient, getAirlineName, formatDuration } from '@/lib/amadeus';
import { FlightSearchParams, FlightOption } from '@/types/flights';

export async function POST(request: NextRequest) {
  try {
    const body: FlightSearchParams = await request.json();

    // Validate required parameters
    const { origin, destination, departureDate, adults } = body;

    if (!origin || !destination || !departureDate || !adults) {
      return NextResponse.json(
        { error: 'Missing required parameters: origin, destination, departureDate, and adults are required' },
        { status: 400 }
      );
    }

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
    console.error('Amadeus API Error:', error);

    // Handle specific Amadeus errors
    if (error.response) {
      const { statusCode, result } = error.response;
      const errorMessage = result?.errors?.[0]?.detail || result?.errors?.[0]?.title || 'Flight search failed';

      return NextResponse.json(
        {
          error: errorMessage,
          details: result?.errors || [],
        },
        { status: statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
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
    const price = parseFloat(offer.price.total);

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
      price: price,
      currency: offer.price.currency,
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
