import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Voyagr
        </Link>
        <div className="flex space-x-6">
          <div className="relative">
            <button className="hover:text-gray-300">Continents</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300">Deals</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300">Favorites</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300">Reserved</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300">AI</button>
          </div>
        </div>
      </div>
    </nav>
  );
}