import Amadeus from 'amadeus';

// Singleton pattern for Amadeus client
let amadeusClient: Amadeus | null = null;

export function getAmadeusClient(): Amadeus {
  if (!amadeusClient) {
    const apiKey = process.env.AMADEUS_API_KEY?.trim();
    const apiSecret = process.env.AMADEUS_API_SECRET?.trim();
    const hostname = process.env.AMADEUS_HOSTNAME?.trim() || 'test';

    if (!apiKey || !apiSecret) {
      throw new Error('Amadeus API credentials are not configured');
    }

    console.log('Initializing Amadeus client:', {
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      hostname,
      apiKeyLength: apiKey.length,
      apiSecretLength: apiSecret.length,
    });

    amadeusClient = new Amadeus({
      clientId: apiKey,
      clientSecret: apiSecret,
      hostname,
    });
  }
  return amadeusClient;
}

// Helper to get airline name from IATA code
export function getAirlineName(code: string): string {
  const airlines: { [key: string]: string } = {
    'AA': 'American Airlines',
    'DL': 'Delta Air Lines',
    'UA': 'United Airlines',
    'BA': 'British Airways',
    'AF': 'Air France',
    'LH': 'Lufthansa',
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'SQ': 'Singapore Airlines',
    'EY': 'Etihad Airways',
    'TK': 'Turkish Airlines',
    'KL': 'KLM',
    'AC': 'Air Canada',
    'NH': 'ANA',
    'JL': 'Japan Airlines',
    'CX': 'Cathay Pacific',
    'VS': 'Virgin Atlantic',
    'IB': 'Iberia',
    'AZ': 'ITA Airways',
    'SK': 'SAS',
    'AY': 'Finnair',
    'OS': 'Austrian Airlines',
    'LX': 'SWISS',
    'TP': 'TAP Portugal',
    'SN': 'Brussels Airlines',
  };
  return airlines[code] || code;
}

// Helper to format duration from ISO 8601 to readable format
export function formatDuration(duration: string): string {
  // Remove 'PT' prefix
  const cleaned = duration.replace('PT', '');

  const hours = cleaned.match(/(\d+)H/);
  const minutes = cleaned.match(/(\d+)M/);

  const h = hours ? parseInt(hours[1]) : 0;
  const m = minutes ? parseInt(minutes[1]) : 0;

  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}
