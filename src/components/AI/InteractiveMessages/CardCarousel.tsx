import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Star } from 'lucide-react';

export interface CarouselCard {
  id: string;
  title: string;
  subtitle?: string;
  price?: number;
  rating?: number;
  image?: string;
  details: string[];
  badge?: string;
}

interface CardCarouselProps {
  cards: CarouselCard[];
  onCardSelect: (cardId: string) => void;
  selectedCardId?: string;
  showPrice?: boolean;
  showRating?: boolean;
  gradientColors?: string;
  onConfirm?: () => void;
}

export default function CardCarousel({
  cards,
  onCardSelect,
  selectedCardId,
  showPrice = true,
  showRating = true,
  gradientColors = 'from-primary/30 to-purple-500/30',
  onConfirm
}: CardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
  }, [cards.length]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = 280;
      const gap = 12;
      scrollContainerRef.current.scrollTo({
        left: currentIndex * (cardWidth + gap),
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  return (
    <div className="mt-4 relative">
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20
                   scrollbar-track-transparent hover:scrollbar-thumb-primary/30 pb-2
                   cursor-grab active:cursor-grabbing touch-pan-x"
        style={{ scrollbarWidth: 'thin' }}
      >
        {cards.map((card) => {
          const isSelected = selectedCardId === card.id;
          return (
            <div
              key={card.id}
              className={`
                group relative flex-shrink-0 w-[280px] rounded-2xl overflow-hidden
                transition-all duration-300 transform hover:scale-[1.02]
                ${
                  isSelected
                    ? `glass-panel border-2 border-primary/50 shadow-xl`
                    : 'glass-card border border-white/40 hover:border-primary/30 hover:shadow-lg'
                }
              `}
            >
              {/* Image */}
              {card.image && (
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {card.badge && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold
                                    bg-white/90 backdrop-blur-sm text-gray-800 shadow-md">
                      {card.badge}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-primary
                                    flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{card.title}</h3>
                  {showRating && card.rating && (
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{card.rating}</span>
                    </div>
                  )}
                </div>

                {card.subtitle && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-1">{card.subtitle}</p>
                )}

                <div className="space-y-1.5 mb-4">
                  {card.details.slice(0, 3).map((detail, idx) => (
                    <p key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-primary/60"></span>
                      {detail}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  {showPrice && card.price && (
                    <span className="text-lg font-bold text-primary">
                      ${card.price.toLocaleString()}
                    </span>
                  )}
                  <button
                    onClick={() => onCardSelect(card.id)}
                    className={`
                      ml-auto px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                      ${
                        isSelected
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      {cards.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3
                       w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm
                       border border-white/40 shadow-lg
                       flex items-center justify-center
                       transition-all duration-300 hover:bg-white hover:scale-110
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3
                       w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm
                       border border-white/40 shadow-lg
                       flex items-center justify-center
                       transition-all duration-300 hover:bg-white hover:scale-110
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 mt-3">
        {cards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${currentIndex === idx ? 'bg-primary w-6' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>

      {/* Confirm Button */}
      {onConfirm && (
        <button
          onClick={onConfirm}
          disabled={!selectedCardId}
          className="w-full mt-4 px-6 py-3 text-base font-semibold text-white bg-primary rounded-xl
                   hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
                   flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Confirm Selection
        </button>
      )}
    </div>
  );
}
