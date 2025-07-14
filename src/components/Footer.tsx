export default function Footer() {
  return (
    <footer className="bg-white pt-8">
      <hr className="border-gray-200 mb-8" />
      <div className="container mx-auto flex justify-end">
        <div className="grid grid-cols-3 gap-16">
          <div>
            <h3 className="font-bold mb-2">Company</h3>
            <ul className="space-y-1 text-gray-500">
              <li>
                <a href="#" className="hover:text-gray-700 text-sm">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-700 text-sm">Careers</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-2">Product</h3>
            <ul className="space-y-1 text-gray-500">
              <li>
                <a href="#" className="hover:text-gray-700 text-sm">How it Works</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-700 text-sm">Pricing</a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-700 text-sm">FAQ</a>
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
                <a href="#" className="hover:text-gray-700 text-sm">Stories</a>
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