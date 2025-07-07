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
            <button className="hover:text-gray-300">Dropdown 1</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300">Dropdown 2</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300">Dropdown 3</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300">Dropdown 4</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300">Dropdown 5</button>
          </div>
        </div>
      </div>
    </nav>
  );
}