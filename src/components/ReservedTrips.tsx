'use client';

import Image from 'next/image';

interface Trip {
  id: string;
  country: string;
  dates: string;
  image: string;
  flagImage: string;
  bgColor: string;
}

// Dummy data - can be replaced with API calls later
const dummyTrips: Trip[] = [
  {
    id: '1',
    country: 'Argentina',
    dates: 'August 19 - August 27',
    image: '/images/ReservedPageArgentina.png',
    flagImage: '/images/FlagArgentina.png',
    bgColor: 'from-gray-800 to-gray-600'
  },
  {
    id: '2',
    country: 'France',
    dates: 'September 7 - September 18',
    image: '/images/ReservedPageFrance1.png',
    flagImage: '/images/FlagParis.png',
    bgColor: 'from-blue-800 to-blue-600'
  }
];

export default function ReservedTrips() {
  return (
    <div className="space-y-6">
      {dummyTrips.map((trip) => (
        <div
          key={trip.id}
          className="relative h-48 rounded-lg overflow-hidden shadow-lg group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          role="button"
          tabIndex={0}
          aria-label={`View details for ${trip.country} trip`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              // Handle trip selection
              console.log(`Selected trip: ${trip.country}`);
            }
          }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={trip.image}
              alt={`${trip.country} background`}
              fill
              className={`object-cover ${
                trip.country === 'France' ? 'object-[center_70%]' : 'object-center'
              }`}
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          
          {/* Flag in top-right corner */}
          <div className="absolute top-4 right-4 z-20">
            <div className="w-12 h-8 rounded-sm overflow-hidden shadow-lg bg-white">
              <Image
                src={trip.flagImage}
                alt={`${trip.country} flag`}
                width={48}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-6">
            <div className="text-white">
              <h2 className="text-6xl font-bold italic mb-2">{trip.country}</h2>
              <p className="text-xl font-semibold italic opacity-90">{trip.dates}</p>
            </div>
          </div>
          
          {/* Hover effect */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
      ))}
    </div>
  );
}
