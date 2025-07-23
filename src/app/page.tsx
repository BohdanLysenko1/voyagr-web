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
    imageSrc: "/images/AIModal.jpg",
    imageAlt: "AI Modal Picture",
    href: "/ai"
  },
  {
    title: "Unbeatable Deals.",
    description: "Grab exclusive prices for flights and accomodations worldwide, every day.",
    imageSrc: "/images/DealsModalPic.jpg",
    imageAlt: "Deals Modal Picture",
    href: "/deals"
  },
  {
    title: "Travel & Share.",
    description: "Post, save, or revisit your adventures - Voyagr is part trip tool, part social feed.",
    imageSrc: "/images/TravelModalPic.jpg",
    imageAlt: "Travel Modal Picture",
    href: "/profile"
  },
];

function FeatureCard({ title, description, imageSrc, imageAlt, href }: Feature) {
  return (
    <Link href={href}>
      <div className="transition-all duration-300 transform hover:scale-105 hover:bg-white cursor-pointer">
        <div className="w-[450px] flex flex-col">
          <div className="w-full h-[450px] bg-gray-300 rounded-[20px] mb-4 flex items-center justify-center relative overflow-hidden">
            <Image
              src={imageSrc}
              alt = {imageAlt}
              fill
              className="object-cover rounded-[20px]"
            />
          </div>
          <h2 className="text-2xl font-semibold text-secondary mb-1">{title}</h2>
          <p className="text-lg text-gray-500 leading-snug">{description}</p>
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
          src="/images/HomeHeroImage.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 bg-black/40">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
            Explore More. Plan Less.
          </h1>
          <p className="mt-4 text-xl md:text-4xl drop-shadow-lg">
            Discover tailored trips, unbeatable deals, and unforgettable journeys.
          </p>
          <Link href="/ai" className="mt-6 text-[#5271FF] text-3xl font-semibold transition-all duration-300 transform hover:scale-150 cursor-pointer">
            Start Planning Now
          </Link>
        </div>
      </div>


      <div className="p-8">
        <div className="mt-[200px] flex justify-center gap-20 flex-wrap">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="text-center mt-[200px]">
          <h2 className="text-5xl font-bold mb-1">Plan your next adventure now.</h2>
          <p className="w-[300px] mx-auto text-gray-500 text-xl leading-snug mb-1">
            Leave the planning to Voyagr — start exploring worldwide deals and AI-powered trips in seconds.
          </p>
          <Link href="/ai">
            <button className="bg-primary text-white px-2 py-1 rounded-xl hover:bg-[#7C97FF] transition-colors">
              Book with AI
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/*
export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-secondary text-center">
        Explore More. Plan Less.
      </h1>

      <div className="flex justify-center mt-8">
        <div className="w-[790px] h-[450px] bg-gray-300 rounded-xl flex items-center justify-center relative overflow-hidden">
          <Image
            src="/HomeHeroImage.jpg"
            alt="Hero Image"
            fill
            className="object-cover rounded-xl"
            priority
          />
        </div>
      </div>

      <div className="mt-[110px] flex justify-center gap-14">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
              href={feature.href}
            />
          </Link>
        ))}
      </div>

      <div className="text-center mt-[110px]">
        <h2 className="text-2xl font-bold mb-1">Plan your next adventure now.</h2>
        <p className="w-[300px] mx-auto text-gray-500 text-sm leading-snug mb-1">
          Leave the planning to Voyagr — start exploring worldwide deals and AI-powered trips in seconds.
        </p>
        <Link href="/ai">
          <button className="bg-primary text-white px-2 py-1 rounded-xl hover:bg-[#7C97FF] transition-colors">
            Book with AI
          </button>
        </Link>
      </div>
    </div>
  );
} */