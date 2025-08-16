import Image from 'next/image';
import Link from 'next/link';

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
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 bg-black/40">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold drop-shadow-lg max-w-6xl">
            Explore More. Plan Less.
          </h1>
          <p className="mt-4 text-lg md:text-xl lg:text-2xl xl:text-4xl drop-shadow-lg max-w-4xl">
            Discover tailored trips, unbeatable deals, and unforgettable journeys.
          </p>
          <Link href="/ai" className="mt-6 text-[#5271FF] text-xl md:text-2xl lg:text-3xl font-semibold transition-all duration-300 transform hover:scale-110 cursor-pointer">
            Start Planning Now
          </Link>
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