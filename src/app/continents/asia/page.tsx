'use client';

import React, { useState } from 'react';
// import ContinentCard from '@/components/ContinentCard';
import SearchDealCard, {sampleDeals, SearchDeal } from '@/components/DealsPage/SearchDeals';
import DealModal from '@/components/DealsPage/DealModal';
import { Compass, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const AsiaPage = () => {
  const [currentPackageSet, setCurrentPackageSet] = useState(0);
  const [selectedDeal, setSelectedDeal] = useState<SearchDeal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDealSearch = (filter: string) => {
    if (filter === 'flights') {
      window.location.href = `/deals/?type=flight&continent=Asia`;
    } else if (filter === 'hotels') {
      window.location.href = `/deals/?type=hotel&continent=Asia`;
    } else if (filter === 'package') {
      window.location.href = `/deals/?type=package&continent=Asia`;
    } else {
      // For general continent searches
      window.location.href = `/deals/?continent=${filter}`;
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

  const asiaDeals = sampleDeals.filter(deal => deal.continent === 'Asia' && deal.type === 'package');


  const packageSets = [];
  for (let i = 0; i < asiaDeals.length; i += 2) {
    packageSets.push(asiaDeals.slice(i, i + 2));
  }

  const nextPackageSet = () => {
    setCurrentPackageSet((prev) => (prev + 1) % packageSets.length);
  };

  const prevPackageSet = () => {
    setCurrentPackageSet((prev) => (prev - 1 + packageSets.length) % packageSets.length);
  };

  const handleViewDeal = (deal : SearchDeal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5271FF]/10 to-[#5271FF]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-6xl font-bold text-black mb-6">
            Welcome to Asia!
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the magic of Asia with curated experiences, exclusive deals, and unforgettable adventures across the continent.
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
                Book flights across Asia instantly. Unlock exclusive routes and smart search for the best fares.
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
              <h3 className="text-3xl font-bold text-black">Tailored Asian Packages</h3>
            </div>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Choose from hand-picked trips that match your interests and travel style. Each package bundles accommodations, flights, and unique local experiences.
              </p>
              <p className="leading-relaxed">
                Browse the curated options below to see locations, pricing, and everything included. Find the perfect itinerary or get inspired to customize your own Asian adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Carousel Section */}
      {packageSets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative">
            <button 
              onClick={prevPackageSet}
              disabled={packageSets.length <= 1}
              className={`absolute -left-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 transition-colors duration-200 ${
                packageSets.length <= 1 
                  ? 'bg-gray-100 shadow-sm cursor-not-allowed' 
                  : 'bg-white shadow-lg hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <ChevronLeft className={`w-6 h-6 ${
                packageSets.length <= 1 ? 'text-gray-300' : 'text-[#5271FF]'
              }`} />
            </button>
              
            <button 
              onClick={nextPackageSet}
              disabled={packageSets.length <= 1}
              className={`absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 transition-colors duration-200 ${
                packageSets.length <= 1 
                  ? 'bg-gray-100 shadow-sm cursor-not-allowed' 
                  : 'bg-white shadow-lg hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <ChevronRight className={`w-6 h-6 ${
                packageSets.length <= 1 ? 'text-gray-300' : 'text-[#5271FF]'
              }`} />
            </button>

            <div className="px-12">
              <div className={`grid gap-6 ${
                  asiaDeals.length === 1 
                    ? 'grid-cols-1 justify-items-center max-w-sm mx-auto' 
                    : 'grid-cols-1 md:grid-cols-2 justify-items-center max-w-2xl mx-auto'
                }`}>
                {packageSets[currentPackageSet]?.map((deal) => (
                  <SearchDealCard
                    key={deal.id}
                    deal={deal}
                    onViewDeal={handleViewDeal}
                  />
                ))}
              </div>
            </div>

            {packageSets.length > 1 && (
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
            )}
          </div>
        </section>
      )}

      {/* If no packages exist, show message */}
      {packageSets.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gray-600 text-lg">
            No package deals currently available for Asia. Check back soon for amazing offers!
          </p>
          <button
            onClick={() => handleDealSearch('Asia')}
            className="mt-4 bg-[#5271FF] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#4461E8] transition-colors"
          >
            Search All Deals For Asia
          </button>
        </section>
      )}

      {/* Deal Modal */}
      <DealModal
        open={isModalOpen}
        onClose={closeModal}
        deal={selectedDeal}
      />
    </div>
  );
};

export default AsiaPage;