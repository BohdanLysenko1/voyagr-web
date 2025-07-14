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
              src="/LogoNavBar.png"
              alt="Voyagr Logo"
              width={380}
              height={110}
              style={{ objectFit: "cover", marginTop: "1.5rem", marginLeft: "-5rem"}}
            />
          </div>
        </Link>
        <div className="flex space-x-6 ml-auto">
          <div className="relative">
            <button className="hover:text-gray-300 text-lg">Continents</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300 text-lg">Deals</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300 text-lg">Favorites</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300 text-lg">Reserved</button>
          </div>
          <div className="relative">
            <button className="hover:text-gray-300 text-lg">AI</button>
          </div>
        </div>
      </div>
    </nav>
  );
}