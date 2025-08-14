import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plane, Hotel, Package, MapPin, Heart } from 'lucide-react';

export interface SearchDeal {
  id: number;
  type: 'flight' | 'hotel' | 'package';
  title: string;
  location: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating?: number;
  duration?: string;
  features: string[];
}

interface SearchDealCardProps {
  deal: SearchDeal;
  onDealClick?: (deal: SearchDeal) => void;
}

const SearchDealCard: React.FC<SearchDealCardProps> = ({ deal, onDealClick }) => {
  const [isSaved, setIsSaved] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-4 h-4" />;
      case 'hotel': return <Hotel className="w-4 h-4" />;
      case 'package': return <Package className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleClick = () => {
    if (onDealClick) {
      onDealClick(deal);
    }
  };

  const toggleSave = () => {
    setIsSaved((prev) => !prev);
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48">
        <Image
          src={deal.image}
          alt={deal.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          {getTypeIcon(deal.type)}
          <span className="text-xs font-medium capitalize">{deal.type}</span>
        </div>

        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1 hover:bg-white transition-colors" onClick={toggleSave} aria-label={isSaved ? 'Unsave deal' : 'Save deal'}>
          <Heart
            className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        
        {deal.originalPrice && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white rounded-full px-2 py-1">
            <span className="text-xs font-bold">
              {Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{deal.title}</h3>
          {deal.rating && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>⭐</span>
              <span>{deal.rating}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{deal.location}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deal.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {deal.features.slice(0, 2).map((feature, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
              {feature}
            </span>
          ))}
          {deal.features.length > 2 && (
            <span className="text-gray-500 text-xs">+{deal.features.length - 2} more</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">${deal.price}</span>
            {deal.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${deal.originalPrice}</span>
            )}
            {deal.duration && (
              <span className="text-sm text-gray-500">/{deal.duration}</span>
            )}
          </div>
          <Link href={`/deals/${deal.type}s/${deal.id}`}>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleClick}
            >
              View Deal
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchDealCard;