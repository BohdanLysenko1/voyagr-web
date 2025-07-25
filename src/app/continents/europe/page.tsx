'use client';

import React, { useState } from 'react';
import ContinentCard from '@/components/ContinentCard';
import { Compass, Star, ChevronLeft, ChevronRight, Link } from 'lucide-react';

const EuropePage = () => {
  const [currentPackageSet, setCurrentPackageSet] = useState(0);

  const handleDealSearch = (filter: string) => {
    if (filter === 'flights') {
      window.location.href = `/deals/searchdeals?type=flight&continent=Europe`;
    } else if (filter === 'hotels') {
      window.location.href = `/deals/searchdeals?type=hotel&continent=Europe`;
    } else if (filter === 'package') {
      window.location.href = `/deals/searchdeals?type=package&continent=Europe`;
    } else {
      // For general continent searches
      window.location.href = `/deals/searchdeals?continent=${filter}`;
    }
  };

  const topImages = [
    {
      src: "/images/ContinentsPage/Continents_FlightPic.jpg",
      title: "Browse deals in the sky",
      filter: "flights"
    },
    {
      src: "/images/ContinentsPage/Continents_HotelPic.jpg",
      title: "Stay where it matters most",
      filter: "hotels"
    },
    {
      src: "/images/ContinentsPage/Continents_PackagePic.jpg",
      title: "Discover unforgettable moments",
      filter: "package"
    }
  ];

  const allPackages = [
    {
      title: "European Explorer Package",
      price: "$1,295",
      description: "Flights to Rome, hotel for 5 nights, guided experiences, 3-city sightseeing, and free WiFi. Explore 3 different cities in the slideshow to see your custom journey flow.",
      image: "/images/DealsPage/Packages_RomePic.jpg"
    },
    {
      title: "Alpine Adventure Package",
      price: "$1,580",
      description: "Swiss Alps flights, 4-star resort, local excursions and transportation. Use the slideshow to preview Interlaken, Zermatt, and Lucerne.",
      image: "/images/ContinentsPage/Continents_AlpsPackage.jpeg"
    },
    {
      title: "Mediterranean Escape Package",
      price: "$1,425",
      description: "Barcelona to Athens, boutique stays, culinary tours. Slide through cities you'll visit, each tailored for you.",
      image: "/images/ContinentsPage/Continents_BarcelonaPic.jpg"
    },
    {
      title: "Nordic Discovery Package",
      price: "$1,380",
      description: "Explore Stockholm, Copenhagen, and Oslo. Northern lights, fjord excursions, and guided city tours. Slide through your Scandinavian journey.",
      image: "/images/ContinentsPage/Continents_Copenhagen.jpg"
    }
  ];

  const packageSets = [];
  for (let i = 0; i < allPackages.length; i += 2) {
    packageSets.push(allPackages.slice(i, i + 2));
  }

  const nextPackageSet = () => {
    setCurrentPackageSet((prev) => (prev + 1) % packageSets.length);
  };

  const prevPackageSet = () => {
    setCurrentPackageSet((prev) => (prev - 1 + packageSets.length) % packageSets.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5271FF]/10 to-[#5271FF]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-bold text-black mb-6">
            Welcome to Europe!
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the magic of Europe with curated experiences, exclusive deals, and unforgettable adventures across the continent.
          </p>
        </div>
      </section>

      {/* Top Images Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              <img 
                src={image.src} 
                alt={image.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <button 
                  onClick={() => handleDealSearch(image.filter)}
                  className="w-full bg-[#5271FF] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#4461E8] transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm"
                >
                  {image.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Compass className="w-8 h-8 text-[#5271FF]" />
              <h3 className="text-3xl font-bold text-black">Find your next adventure</h3>
            </div>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Book flights across Europe instantly. Unlock exclusive routes and smart search for the best fares.
              </p>
              <p className="leading-relaxed">
                Lock in the perfect accommodation in top destinations, from boutique hotels to major brands, at special prices.
              </p>
              <p className="leading-relaxed">
                Discover and book unique experiences - from city tours to off-the-map adventures crafted just for you. <br/> Find what suits you by clicking now.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Star className="w-8 h-8 text-[#5271FF]" />
              <h3 className="text-3xl font-bold text-black">Tailored European Packages</h3>
            </div>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Choose from hand-picked trips that match your interests and travel style. Each package bundles accommodations, flights, and unique local experiences.
              </p>
              <p className="leading-relaxed">
                Browse the curated options below to see locations, pricing, and everything included. Find the perfect itinerary or get inspired to customize your own European adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          <button 
            onClick={prevPackageSet}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-[#5271FF]" />
          </button>
          
          <button 
            onClick={nextPackageSet}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6 text-[#5271FF]" />
          </button>

          <div className="px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {packageSets[currentPackageSet]?.map((pkg, index) => (
                <ContinentCard
                  key={index}
                  title={pkg.title}
                  price={pkg.price}
                  description={pkg.description}
                  image={pkg.image}
                  onNavigate={() => handleDealSearch('europe-package')}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {packageSets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPackageSet(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentPackageSet ? 'bg-[#5271FF]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EuropePage;