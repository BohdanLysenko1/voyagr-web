"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SearchDeal } from './SearchDeals';
import { Plane, Hotel, Package, MapPin, Heart, ExternalLink } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

export interface DealModalProps {
  open: boolean;
  onClose: () => void;
  deal: SearchDeal | null;
}

export default function DealModal({ open, onClose, deal }: DealModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Mount flag for safe portals
  useEffect(() => setMounted(true), []);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on Escape + focus close on open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => { document.removeEventListener("keydown", onKey); clearTimeout(t); };
  }, [open, onClose]);

  // Basic focus trap
  const onTrapFocus = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeEl = document.activeElement as HTMLElement | null;
    if (!e.shiftKey && activeEl === last) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && activeEl === first) { e.preventDefault(); last.focus(); }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="w-5 h-5" />;
      case 'hotel': return <Hotel className="w-5 h-5" />;
      case 'package': return <Package className="w-5 h-5" />;
      default: return null;
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deal) {
      toggleFavorite(deal);
    }
  };

  const handleBookNow = () => {
    // code...#affiliate link goes here
    window.open('https://example.com/book', '_blank');
  };

  if (!open || !mounted || !deal) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title" onKeyDown={onTrapFocus}>
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Shell */}
      <div
        ref={modalRef}
        className="absolute top-1/2 left-1/2 w-full max-w-lg max-h-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white/90 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // prevent overlay close when clicking inside
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-black/10 px-4 sm:px-6 py-3 bg-gradient-to-b from-white/70 to-white/40">
          <h2 id="modal-title" className="text-base sm:text-lg md:text-xl font-semibold tracking-tight">
            {deal.title}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full p-2 text-neutral-700 hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5271FF]"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" d="M6 6l8 8M14 6l-8 8" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="relative w-full h-64 sm:h-80">
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2 border border-gray-200">
                  {getTypeIcon(deal.type)}
                  <span className="text-sm font-medium capitalize">{deal.type}</span>
                </div>

                {/* Discount badge */}
                {deal.originalPrice && (
                  <div className="bg-red-500 text-white rounded-full px-3 py-2">
                    <span className="text-sm font-bold">
                      {Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Save deal button */}
              <button 
                className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors border border-gray-200" 
                onClick={handleToggleFavorite} 
                aria-label={isFavorite(deal.id) ? 'Unsave deal' : 'Save deal'}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite(deal.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
            </div>

            {/* Price and rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-green-600">${deal.price}</span>
                {deal.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">${deal.originalPrice}</span>
                )}
                {deal.duration && (
                  <span className="text-lg text-gray-500">/{deal.duration}</span>
                )}
              </div>
              {deal.rating && (
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <span>⭐</span>
                  <span className="font-semibold">{deal.rating}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{deal.location}</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">About this deal</h3>
              <p className="text-gray-700 leading-relaxed">{deal.description}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900">What's included</h4>
              <div className="flex flex-wrap gap-2">
                {deal.features.map((feature, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 text-sm px-3 py-2 rounded-full border border-blue-200">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 px-4 sm:px-6 py-4 bg-white/60">
          <div className="flex justify-end">
            <button
              onClick={handleBookNow}
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center gap-2"
            >
              Book Now
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}