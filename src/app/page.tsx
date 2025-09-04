"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Search as SearchIcon, ChevronDownIcon } from 'lucide-react';
import React, {useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/navigation';
import {DayPicker} from 'react-day-picker';
import type {DateRange} from 'react-day-picker';

type Feature = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
};

const features: Feature[] = [
  {
    title: "AI Itineraries.",
    description: "Let our smart AI generate and book the perfect trip for you - no stress.",
    imageSrc: "/images/HomePage/AIModal.jpg",
    imageAlt: "AI Modal Picture",
    href: "/ai"
  },
  {
    title: "Unbeatable Deals.",
    description: "Grab exclusive prices for flights and accomodations worldwide, every day.",
    imageSrc: "/images/HomePage/DealsModalPic.jpg",
    imageAlt: "Deals Modal Picture",
    href: "/deals"
  },
  {
    title: "Travel & Share.",
    description: "Post, save, or revisit your adventures - Voyagr is part trip tool, part social feed.",
    imageSrc: "/images/HomePage/TravelModalPic.jpg",
    imageAlt: "Travel Modal Picture",
    href: "/profile"
  },
];

function FeatureCard({ title, description, imageSrc, imageAlt, href }: Feature) {
  return (
    <Link href={href}>
      <div className="transition-all duration-300 transform hover:scale-105 hover:bg-white cursor-pointer">
        <div className="w-full max-w-sm md:max-w-md lg:max-w-xl flex flex-col">
          <div className="w-full aspect-square bg-gray-300 rounded-[20px] mb-4 flex items-center justify-center relative overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768 px) 100vw,
              (max-width: 1024px) 50vw,
              33vw"
              className="object-cover rounded-[20px]"
            />
          </div>
          <h2 className="text-xl lg:text-2xl font-semibold text-secondary mb-1">{title}</h2>
          <p className="text-base lg:text-lg text-gray-500 leading-snug">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<'all' | 'Africa' | 'Antarctica' | 'Asia' | 'Australia' | 'Europe' | 'North America' | 'South America' > ('all');
  const [selectedType, setSelectedType] = useState<'all' | 'flight' | 'hotel' | 'package' > ('all');
  const [activeSearchDropdown, setActiveSearchDropdown] = useState<'continent' | 'type' | 'dates' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const continents = [
    {value: 'all', label: 'All Locations'},
    {value: 'Africa', label: 'Africa'},
    {value: 'Antarctica', label: 'Antarctica'},
    {value: 'Asia', label: 'Asia'},
    {value: 'Australia', label: 'Australia'},
    {value: 'Europe', label: 'Europe'},
    {value: 'North America', label: 'North America'},
    {value: 'South America', label: 'South America'}
  ];
  const dealTypes = [
    {value: 'all', label: 'All Types' },
    {value: 'flight', label: 'Flights' },
    {value: 'hotel', label: 'Hotels' },
    {value: 'package', label: 'Packages' }
  ];

  const fmt = (d?: Date) =>
    d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

  const ymd = (d: Date) => d.toISOString().slice(0, 10);

  //Redirection with prepopulated filters
  const handleSearch = () => {
    const params = new URLSearchParams();    
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    if (selectedContinent !== 'all') {
      params.append('continent', selectedContinent);
    }
    if (selectedType !== 'all') {
      params.append('type', selectedType);
    }
    if (dateRange?.from){
      params.append('from', ymd(dateRange.from));
    }
    if (dateRange?.to) {
      params.append('to', ymd(dateRange.to));
    }
    router.push(`/deals?${params.toString()}`);
  };

  //Handle Click outside Modal
  useEffect(() => {
    const handleClickOutisde = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)){
        setActiveSearchDropdown(null);
      }
    };
    if (activeSearchDropdown){
      document.addEventListener('mousedown', handleClickOutisde);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutisde);
    };
  }, [activeSearchDropdown]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-screen">
        <Image
          src="/images/HomePage/HomeHeroImage.jpg"
          alt="Hero Image"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 bg-black/40 -mt-40">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold drop-shadow-lg max-w-6xl">
            Explore More. Plan Less.
          </h1>
          <p className="mt-4 text-lg md:text-xl lg:text-2xl xl:text-4xl drop-shadow-lg max-w-4xl">
            Discover tailored trips, unbeatable deals, and unforgettable journeys.
          </p>
        </div>
        <div ref={menuRef} className="absolute left-1/2 bottom-32 sm:bottom-44 md:bottom-80 lg:bottom-88 xl:bottom-88 transform -translate-x-1/2 w-full max-w-6xl px-4">
          <div className="bg-white rounded-lg shadow-lg p-4 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
              {/* Search Bar */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Where to?"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key =="Enter"){
                      handleSearch();
                    }
                  }}
                />
              </div>

              {/* Date Picker */}
              <div className="relative">
                <button
                  className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  type="button"
                  onClick={() =>
                    setActiveSearchDropdown( activeSearchDropdown === 'dates' ? null : 'dates')
                  }
                >
                  <span className="truncate">
                    {dateRange?.from && dateRange?.to ? `${fmt(dateRange.from)} - ${fmt(dateRange.to)}`: dateRange?.from? `${fmt(dateRange.from)} – ?`: 'Dates'}
                  </span>
                  <ChevronDownIcon className={`ml-2 shrink w-4 h-4 transition-transform duration-300 ${activeSearchDropdown === 'dates' ? 'rotate-180' : ''}`} />
                </button>

                {activeSearchDropdown === 'dates' && (
                  <div className="absolute top-full mt-1 right-0 inline-block bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2">
                    <DayPicker
                      classNames={{ root: 'rdp-root small-rdp' }}
                      mode="range"
                      selected={dateRange}
                      disabled={{before: new Date()}}
                      excludeDisabled
                      onSelect={(range) => {
                        setDateRange(range || undefined);
                        //Only close date picker, when from & to dates are set
                        if (range && range.from && range.to) {
                          if (range.from.getTime() !== range.to.getTime()){
                            setActiveSearchDropdown(null);
                          }
                        } 
                      }}
                      numberOfMonths={1}
                      showOutsideDays
                      fixedWeeks
                    />

                    <div className="mt-2 flex items-center justify-between px-1">
                      <button
                        type="button"
                        className="text-sm text-gray-600 hover:text-primary"
                        onClick={() => setDateRange(undefined)}
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-md bg-primary text-white hover:bg-[#7C97FF] text-sm"
                        onClick={() => setActiveSearchDropdown(null)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Continent Drop-Down menu */}
              <div className="relative">
                <button 
                onClick={() => setActiveSearchDropdown(activeSearchDropdown === 'continent' ? null : 'continent')}
                className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  <span className="truncate">{continents.find(c => c.value === selectedContinent)?.label}</span>
                  <ChevronDownIcon className={`ml-2 shrink w-4 h-4 transition-transform duration-300 ${activeSearchDropdown === 'continent' ? 'rotate-180' : ''}`} />
                </button>
                {activeSearchDropdown === 'continent' && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                    {continents.map((continent) => (
                      <button
                        key={continent.value}
                        type="button"
                        onClick={() => {
                          setActiveSearchDropdown(null);
                          setSelectedContinent(continent.value as any);
                        }}
                        role="option"
                        aria-selected={selectedContinent === continent.value}
                        className={[
                          "w-full text-left px-4 py-2 rounded-xl transition-all duration-300",
                          "text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5",
                          selectedContinent === continent.value ? "bg-gray-50 text-primary" : ""
                        ].join(" ")}
                      >
                        <span className="font-semibold">{continent.label}</span>
                      </button>
                    ))}
                  </div>  
                )}
              </div>

              {/* Deal Type Drop Down */}
              <div className="relative">
              <button 
                onClick={() => setActiveSearchDropdown(activeSearchDropdown === 'type' ? null : 'type')}
                className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text0base"
                >
                  <span className="truncate">{dealTypes.find(t => t.value === selectedType)?.label}</span>
                  <ChevronDownIcon className={`ml-2 shrink w-4 h-4 transition-transform duration-300 ${activeSearchDropdown === 'type' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeSearchDropdown === 'type' && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                    {dealTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setActiveSearchDropdown(null);
                          setSelectedType(type.value as any);
                        }}
                        role="option"
                        aria-selected={selectedType === type.value}
                        className={
                          `w-full text-left px-4 py-2 rounded-xl transition-all duration-300 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5
                          ${selectedType === type.value ? "bg-gray-50 text-primary" : ""}`
                        }
                      >
                        <span className="font-semibold">{type.label}</span>
                      </button>
                    ))}
                  </div>  
                )}
              </div>

              {/*Search Button */}
              <button 
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#7C97FF] transition-colors" 
              onClick={handleSearch}
            >
              Search 
            </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-16 md:mt-24 lg:mt-32 xl:mt-48 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 justify-items-center">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="text-center mt-16 md:mt-24 lg:mt-32 xl:mt-48 pb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Plan your next adventure now.</h2>
          <p className="w-full max-w-md mx-auto text-gray-500 text-lg md:text-xl leading-snug mb-6 px-4">
            Leave the planning to Voyagr — start exploring worldwide deals and AI-powered trips in seconds.
          </p>
          <Link href="/ai">
            <button className="bg-primary text-white px-6 py-3 text-lg rounded-xl hover:bg-[#7C97FF] transition-colors">
              Book with AI
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}