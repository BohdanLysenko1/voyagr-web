import Image from 'next/image';
import React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Deal {
    id: number;
    title: string;
    price: string;
    description: string;
    imagesrc: string;
    imagealt: string;
}

interface DealCardProps {
    deals: Deal[];
    variant: 'overlay';
    className?: string;
    onDealClick?: (deal: Deal) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deals, variant, className = '', onDealClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextDeal = () => {
        setCurrentIndex((prev) => (prev + 1) % deals.length);
    };

    const prevDeal = () => {
        setCurrentIndex((prev) => (prev - 1 + deals.length) % deals.length);
    };

    const currentDeal = deals[currentIndex];

    const handleDealClick = () => {
        if (onDealClick) {
            onDealClick(currentDeal);
        }
    };

    if (variant === 'overlay') {
        return (
            <div className={`relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg ${className}`}>
                <div 
                    className="h-80 bg-cover bg-center relative cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                    style={{ backgroundImage: `url(${currentDeal.imagesrc})` }}
                    onClick={handleDealClick}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">{currentDeal.title}</h3>
                        <p className="text-xl font-semibold mb-3 text-yellow-300">{currentDeal.price}</p>
                        <p className="text-sm opacity-90 leading-relaxed">{currentDeal.description}</p>
                    </div>
                </div>
                {/* Toggle Functionality */}
                <button
                    onClick={prevDeal}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                    aria-label="Previous deal"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                    onClick={nextDeal}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                    aria-label="Next deal"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {deals.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                            aria-label={`Go to deal ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        );
    }
};

export default DealCard;