export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-secondary text-center">
        Explore More. Plan Less.
      </h1>

      <div className="w-full flex justify-center mt-8"> 
        <div className="mt-8 w-[790px] h-[450px] bg-gray-300 rounded-xl flex items-center justify-center text-gray-500">
          Image placeholder
        </div>
      </div>

      <div className="mt-[110px] flex justify-center gap-14">
          {/* Square 1 */}
          <div className="w-[225px] flex flex-col">
            <div className="w-full h-[225px] bg-gray-300 rounded-[20px] mb-4 flex items-center justify-center text-gray-500">Image</div>
            <h2 className="text-xl font-semibold text-secondary mb-1">AI Itineraries.</h2>
            <p className="text-sm text-gray-500 leading-snug">Let our smart AI generate and book the perfect trip for you - no stress.</p>
          </div>

          {/* Square 2 */}
          <div className="w-[225px] flex flex-col">
            <div className="w-full h-[225px] bg-gray-300 rounded-[20px] mb-4 flex items-center justify-center text-gray-500">Image</div>
            <h2 className="text-xl font-semibold text-secondary mb-1">Unbeatable Deals.</h2>
            <p className="text-sm text-gray-500 leading-snug">Grab exclusive prices for flights and accomodations worldwide, every day.</p>
          </div>

          {/* Square 3 */}
          <div className="w-[225px] flex flex-col">
            <div className="w-full h-[225px] bg-gray-300 rounded-[20px] mb-4 flex items-center justify-center text-gray-500">Image</div>
            <h2 className="text-xl font-semibold text-secondary mb-1">Travel & Share.</h2>
            <p className="text-sm text-gray-500 leading-snug">Post, save, or revisit your adventures-Voyagr is part trip tool, part social feed.</p>
          </div>
      </div>

      <div className="text-center mt-[110px]">
        <h2 className="text-2xl font-bold mb-1">Plan your next adventure now.</h2>
        <p className="w-[300px] mx-auto text-gray-500 text-sm leading-snug mb-1">
          Leave the planning to Voyagr — start exploring worldwide deals and AI-powered trips in seconds.
        </p>
      </div>

    </div>
  );
}
