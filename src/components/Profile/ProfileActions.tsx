import Link from 'next/link';
import { Luggage, Map } from 'lucide-react';

interface ProfileActionsProps {
  className?: string;
}

export default function ProfileActions({ className = '' }: ProfileActionsProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {/* My Trips Button */}
      <Link 
        href="/trips" 
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center group"
      >
        <Luggage className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
        My Trips
      </Link>

      {/* My Journey Button */}
      <Link 
        href="/myjourney" 
        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center group"
      >
        <Map className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
        My Journey
      </Link>
    </div>
  );
}
