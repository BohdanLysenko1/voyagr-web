import { NextRequest, NextResponse } from 'next/server';
import { getAmadeusClient } from '@/lib/amadeus';
import { Airport } from '@/types/flights';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword || keyword.length < 2) {
      return NextResponse.json(
        { error: 'Keyword must be at least 2 characters' },
        { status: 400 }
      );
    }

    const amadeus = getAmadeusClient();

    // Search for airports and cities by keyword
    const response = await amadeus.referenceData.locations.get({
      keyword: keyword,
      subType: 'AIRPORT,CITY',
    });

    const airports: Airport[] = response.data.map((location: any) => ({
      iataCode: location.iataCode,
      name: location.name,
      city: location.address?.cityName || '',
      country: location.address?.countryName || '',
      type: location.subType as 'AIRPORT' | 'CITY',
    }));

    return NextResponse.json({
      success: true,
      data: airports,
    });

  } catch (error: any) {
    console.error('Airport search error:', error);

    if (error.response) {
      const { statusCode, result } = error.response;
      const errorMessage = result?.errors?.[0]?.detail || 'Airport search failed';

      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Airport search failed', details: error.message },
      { status: 500 }
    );
  }
}
