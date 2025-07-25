'use client';
import Image from 'next/image';
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ContinentCardProps {
  title: string;
  price: string;
  description: string;
  image: string;
  onNavigate: () => void;
}

const ContinentCard: React.FC<ContinentCardProps> = ({
  title,
  price,
  description,
  image,
  onNavigate
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-105">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5271FF] transition-colors duration-300">
            {title}
          </h3>
          <span className="text-2xl font-bold text-[#5271FF] bg-blue-50 px-3 py-1 rounded-lg">
            {price}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        
        <button 
          onClick={onNavigate}
          className="w-full bg-[#5271FF] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#4461E8] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center group"
        >
          Explore Package
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default ContinentCard;