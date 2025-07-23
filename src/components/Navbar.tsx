import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-primary text-white p-4">
      <div className="flex items-center w-full pr-5">
        <Link href="/">
          <div
            style={{
              width: 400,
              height: 70,
              overflow: "hidden",
              display: "flex",
              alignItems: "center"
            }}
          >
            <Image
              src="/images/LogoNavBar.png"
              alt="Voyagr Logo"
              width={380}
              height={110}
              style={{ objectFit: "cover", marginTop: "1.5rem", marginLeft: "-5rem"}}
            />
          </div>
        </Link>
        <div className="flex space-x-6 ml-auto">
          <div className="relative">
            <Link href="/">
              <button className="hover:text-gray-300 text-lg">Home</button>
            </Link>
          </div>
          <div className="relative group">
            <button
              className="hover:text-gray-300 text-lg">
              Continents
            </button>
            <div
              className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-20"
              style={{ backgroundColor: "#5271FF" }}
            >
              <div className="flex flex-col">
                <Link href="/continents/africa" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Africa
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/continents/asia" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Asia
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/continents/europe" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Europe
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/continents/north-america" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> North America
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/continents/south-america" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> South America
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/continents/australia" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Australia
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/continents/antarctica" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Antarctica
                </Link>
              </div>
            </div>

          </div>
          <div className="relative group">
            <button
              className="hover:text-gray-300 text-lg">
              Deals
            </button>
            <div
              className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200"
              style={{ backgroundColor: "#5271FF" }}
            >
              <div className="flex flex-col">
                <Link href="/deals" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Deals
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/deals/flights" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Flights
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/deals/hotels" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Hotels
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/deals/packages" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Packages
                </Link>
              </div>
            </div>
          </div>
          <div className="relative">
            <Link href="/favorites">
              <button className="hover:text-gray-300 text-lg">Favorites</button>
            </Link>
          </div>
          <div className="relative">
            <Link href="/reserved">
              <button className="hover:text-gray-300 text-lg">Reserved</button>
            </Link>
          </div>
          <div className="relative">
            <Link href="/ai">
              <button className="hover:text-gray-300 text-lg">AI</button>
            </Link>
          </div>
          <div className="relative group">
            <button
              className="hover:text-gray-300 text-lg">
              Profile
            </button>
            <div
              className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-10 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200"
              style={{ backgroundColor: "#5271FF" }}
            >
              <div className="flex flex-col">
                <Link href="/profile" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Profile
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/myjourney" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> My Journey
                </Link>
                <div className="self-center w-4/5 h-px bg-white my-1" />
                <Link href="/settings" passHref className="block px-5 py-2 hover:bg-blue-600 hover:text-white"> Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}