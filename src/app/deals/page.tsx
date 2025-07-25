"use client"
import DealCard from '@/components/DealsPage/DealCard';
import { Hotel, Plane, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FlightDeal {
    id: number;
    title: string;
    price: string;
    description: string;
    imagesrc: string;
    imagealt: string;
}

interface HotelDeal {
    id: number;
    title: string;
    price: string;
    description: string;
    imagesrc: string;
    imagealt: string;
}

interface PackageDeal {
    id: number;
    title: string;
    price: string;
    description: string;
    imagesrc: string;
    imagealt: string;
}

const flightDeals: FlightDeal[] = [
    {
        id: 1,
        title: 'NYC → Paris',
        price: '$499 round trip',
        description: 'Soar direct from NYC to the City of Lights. Flexible return dates, priority boarding, a full checked bag included, and seamless transfers make this an ideal city break.',
        imagesrc: '/images/DealsPage/Flights_ParisPic.jpg',
        imagealt: 'Paris',
    },
    {
        id: 2,
        title: 'LA → Amsterdam',
        price: '$529 round trip',
        description: 'Fly from LA to Amsterdam with premium service, flexible dates, and exclusive Voyagr rates.',
        imagesrc: '/images/DealsPage/Flights_Amsterdam.jpg',
        imagealt: 'Amsterdam',
    },
    {
        id: 3,
        title: 'Chicago → Lisbon',
        price: '$515 round trip',
        description: 'Direct flights from Chicago to Lisbon, Portugal. Enjoy seamless transfers and a complimentary checked bag.',
        imagesrc: '/images/DealsPage/Flights_LisbonPortugal.jpg',
        imagealt: 'Lisbon, Portugal',
    },
];

const hotelDeals: HotelDeal[] = [
    {
        id: 1,
        title: 'Grand Hotel Tremezzo, Lake Como',
        price: '$425 per nightt',
        description: 'Lakefront luxury in Italy with panoramic lake views, gourmet restaurants, and a world-class spa.',
        imagesrc: '/images/DealsPage/Hotel_LakeComo.jpg',
        imagealt: 'Lake Como Hotel',
    },
    {
        id: 2,
        title: 'Ritz-Carlton, San Francisco',
        price: '$349 per night',
        description: 'Experience luxury at the Ritz-Carlton with stunning bay views, michelin-starred dining, and exclusive club access.',
        imagesrc: '/images/DealsPage/Hotel_SanFrancisco.jpg',
        imagealt: 'Ritz-Carlton San Francisco',
    },
    {
        id: 3,
        title: 'Swiss Alpine Lodge; Zermatt, Switzerland',
        price: '$458 per night',
        description: 'Mountain luxury with Matterhorn views. Ski-in/ski-out access, alpine spa, and traditional Swiss hospitality',
        imagesrc: '/images/DealsPage/Hotel_Switzerland.jpg',
        imagealt: 'Switzerland',
    },
];

const packageDeals: PackageDeal[] = [
    {
        id: 1,
        title: 'Mediterranean Sampler',
        price: '$1,899 per person',
        description: "Experience Barcelona's energy, Nice's Riviera charm, and Florence's historic beauty. Includes intercity flights, 7 nights in central hotels, exclusive foodie day trips, and skip-the-line museum accesss.",
        imagesrc: '/images/DealsPage/Packages_BarcelonaPic.jpg',
        imagealt: 'Barcelona Package',
    },
    {
        id: 2,
        title: 'Mediterranean Cruise & Stay',
        price: '$2,299 per person',
        description: '10-day package combining a 7-night Mediterranean cruise with 3 nights in Rome. All meals, transfers, and guided tours included.',
        imagesrc: '/images/DealsPage/Packages_RomePic.jpg',
        imagealt: 'Mediterranean Package',
    },
    {
        id: 3,
        title: 'Bali Wellness Retreat',
        price: '$1,599 per person',
        description: '6-day wellness package with luxury resort accommodation, daily yoga, spa treatments, and healthy cuisine.',
        imagesrc: '/images/DealsPage/Packages_Bali.jpg',
        imagealt: 'Bali Wellness',
    },
];

export default function DealsPage() {
  const router = useRouter();

  const handleFlightDealClick = (deal: FlightDeal) => {
    router.push(`/deals/flights/${deal.id}`);
  };

  const handleHotelDealClick = (deal: HotelDeal) => {
    router.push(`/deals/hotels/${deal.id}`);
  };

  const handlePackageDealClick = (deal: PackageDeal) => {
    router.push(`/deals/packages/${deal.id}`);
  };
  return (
    <main className="bg-white min-h-screen w-full pb-8">
      <div className="pt-12 pb-4 px-8 max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold text-center mt-4 mb-2">Top Travel Deals</h1>
        <h2 className="text-5xl font-semibold text-center text-gray-400 mb-10">Save more on flights, hotels, and custom trips</h2>

        {/* Flight Deals Section */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold mb-1 flex items-center justify-center gap-2"> <Plane className="w-6 h-6"/> Flight Deals</h3>
          <p className="text-gray-700 mb-2 text-center">Discover hand-picked flight discounts to top global destinations.<br/>Enjoy flexible dates, premium carriers, and exclusive Voyagr rates.</p>
          <p className="text-gray-700 mb-4 text-center">Book quickly—these limited-time deals are updated weekly to help you take off for less.</p>
          
          <div className="flex flex-col items-center gap-6">
            <DealCard deals={flightDeals} variant="overlay" onDealClick={handleFlightDealClick} />
            <Link href="/deals/searchdeals?type=flight">
              <button className="bg-primary text-white font-semibold rounded-full px-10 py-3 text-lg shadow hover:bg-blue-700 transition">View All Flight Deals</button>
            </Link>
          </div>
        </section>

        {/* Hotel Deals Section */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold mb-1 flex items-center justify-center gap-2"> <Hotel className="w-6 h-6" />Hotel Deals</h3>
          <p className="text-gray-700 mb-2 text-center">Save on curated hotels and resorts. Our deals feature verified ratings, central locations, and value-packed inclusions.</p>
          <p className="text-gray-700 mb-4 text-center">Browse exclusive rates and book stays that match your style, budget, and destination.</p>
          
          <div className="flex flex-col items-center gap-6">
            <DealCard deals={hotelDeals} variant="overlay" onDealClick={handleHotelDealClick} />
            <Link href="/deals/searchdeals?type=hotel">
              <button className="bg-primary text-white font-semibold rounded-full px-10 py-3 text-lg shadow hover:bg-blue-700 transition">Browse All Hotels</button>
              </Link>
          </div>
        </section>

         {/* Packages & Bundles Section */}
        <section className="mb-8">
          <h3 className="text-3xl font-bold mb-1 flex items-center justify-center gap-2"> <Package className="w-6 h-6" /> Packages & Bundles</h3>
          <p className="text-gray-700 mb-2 text-center">Combine flights, hotels, and experiences for maximum savings. Explore custom trips built for every type of traveler.</p>
          <p className="text-gray-700 mb-4 text-center">See below for today's featured packages—each offers great value and smart itineraries you can book instantly.</p>
          
          <div className="flex flex-col items-center gap-6">
            <DealCard deals={packageDeals} variant="overlay" onDealClick={handlePackageDealClick} />
            <Link href="/deals/searchdeals?type=package">
              <button className="bg-primary text-white font-semibold rounded-full px-10 py-3 text-lg shadow hover:bg-blue-700 transition">See More Bundles</button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}