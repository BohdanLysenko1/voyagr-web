import Image from 'next/image';

type Feature = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const features: Feature[] = [
  {
    title: "AI Itineraries.",
    description: "Let our smart AI generate and book the perfect trip for you - no stress.",
    imageSrc: "/AIModal.jpg",
    imageAlt: "AI Modal Picture",
  },
  {
    title: "Unbeatable Deals.",
    description: "Grab exclusive prices for flights and accomodations worldwide, every day.",
    imageSrc: "/DealsModalPic.jpg",
    imageAlt: "Deals Modal Picture",
  },
  {
    title: "Travel & Share.",
    description: "Post, save, or revisit your adventures - Voyagr is part trip tool, part social feed.",
    imageSrc: "/TravelModalPic.jpg",
    imageAlt: "Travel Modal Picture",
  },
];

function FeatureCard({ title, description, imageSrc, imageAlt }: Feature) {
  return (
    <div className="w-[225px] flex flex-col">
      <div className="w-full h-[225px] bg-gray-300 rounded-[20px] mb-4 flex items-center justify-center relative overflow-hidden">
          <Image
            src={imageSrc}
            alt = {imageAlt}
            fill
            className="object-cover rounded-[20px]"
          />
      </div>
      <h2 className="text-xl font-semibold text-secondary mb-1">{title}</h2>
      <p className="text-sm text-gray-500 leading-snug">{description}</p>
    </div>
  );
}

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
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            imageSrc={feature.imageSrc}
            imageAlt={feature.imageAlt}
          />
        ))}
      </div>

      <div className="text-center mt-[110px]">
        <h2 className="text-2xl font-bold mb-1">Plan your next adventure now.</h2>
        <p className="w-[300px] mx-auto text-gray-500 text-sm leading-snug mb-1">
          Leave the planning to Voyagr — start exploring worldwide deals and AI-powered trips in seconds.
        </p>
        <button className="bg-primary text-white px-2 py-1 rounded-xl hover:bg-[#7C97FF] transition-colors">
          Book with AI
        </button>
      </div>
    </div>
  );
}