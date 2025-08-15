import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white pt-8 mt-auto">
      <hr className="border-gray-200 mb-8 mx-8" />
      <div className="container mx-auto flex justify-end">
        <div className="grid grid-cols-3 gap-16">
          <div>
            <h3 className="font-bold mb-2">Company</h3>
            <ul className="space-y-1 text-gray-500">
              <li>
                <Link href="/about" className="hover:text-gray-700 text-sm">About</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-700 text-sm">Contact Us</Link>             
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-2">Product</h3>
            <ul className="space-y-1 text-gray-500">
              <li>
                <Link href="/howItWorks" className="hover:text-gray-700 text-sm">How It Works</Link>
              </li>
              <li>
                <a href="#" className="hover:text-gray-700 text-sm">Pricing</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Community</h3>
            <ul className="space-y-1 text-gray-500">
              <li>
                <a href="#" className="hover:text-gray-700 text-sm">Trips Feed</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-700 text-sm">Ambassadors</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-primary h-6 mt-8 w-full" />
    </footer>
  );
}