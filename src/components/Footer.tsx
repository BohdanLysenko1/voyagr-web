'use client';

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  const light = false; // Always keep footer purple 

  return (
    <footer
      ref={footerRef}
      className={`
        mt-auto transition-all duration-700
        ${light
          ? 'bg-white/90 text-gray-800 backdrop-blur-xl border-t border-gray-200/60'
          : 'text-white bg-gradient-to-r from-primary via-primary to-purple-600'}
      `}
      style={light ? undefined : {  }}
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {/* Company */}
              <div>
                <h3 className={`font-bold mb-2 ${light ? 'text-gray-900' : 'text-white'}`}>Company</h3>
                <ul className={`space-y-1 ${light ? 'text-gray-600' : 'text-white/90'}`}>
                  <li>
                    <Link href="/about" className="text-sm hover:opacity-100 opacity-90">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm hover:opacity-100 opacity-90">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Product */}
              <div>
                <h3 className={`font-bold mb-2 ${light ? 'text-gray-900' : 'text-white'}`}>Product</h3>
                <ul className={`space-y-1 ${light ? 'text-gray-600' : 'text-white/90'}`}>
                  <li>
                    {/* keep your route casing if needed: /howItWorks */}
                    <Link href="/howItWorks" className="text-sm hover:opacity-100 opacity-90">
                      How it Works
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Community */}
              <div>
                <h3 className={`font-bold mb-2 ${light ? 'text-gray-900' : 'text-white'}`}>Community</h3>
                <ul className={`space-y-1 ${light ? 'text-gray-600' : 'text-white/90'}`}>
                  <li>
                    <Link href="/tripsfeed" className="text-sm hover:opacity-100 opacity-90">
                      Trips Feed
                    </Link>
                  </li>
                  <li>
                    <Link href="/affiliates" className="text-sm hover:opacity-100 opacity-90">
                      Affiliates
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Subscribe box (server-safe form) */}
          <div className="md:col-span-5">
            <div
              className={`
                rounded-xl p-6 backdrop-blur transition-colors duration-700
                ${light ? 'bg-gray-50 border border-gray-200' : 'bg-white/10'}
              `}
            >
              <h3 className={`text-lg font-semibold ${light ? 'text-gray-900' : 'text-white'}`}>
                Subscribe
              </h3>

              <form
                action="/api/subscribe"
                method="post"
                className={`mt-4 flex overflow-hidden rounded-lg bg-white ${light ? 'border border-gray-200' : ''}`}
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address"
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 outline-none"
                />
                <button type="submit" aria-label="Subscribe" className="px-4">
                  <span className="text-[var(--color-primary,#5271FF)] text-2xl leading-none">
                    →
                  </span>
                </button>
              </form>

              <p className={`mt-4 text-sm ${light ? 'text-gray-600' : 'text-white/80'}`}>
                Get notified about new deals and discounts for flights, hotels, and more.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className={`my-10 transition-colors duration-700 ${light ? 'border-gray-200/70' : 'border-white/10'}`} />

        {/* Bottom row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/LogoNavBar.png"
              alt="Voyagr"
              width={96}
              height={32}
              className={`h-8 w-auto ${light ? 'brightness-50 contrast-125' : 'brightness-100'}`}
              priority
            />
          </div>

          <ul className={`flex flex-wrap items-center gap-x-6 gap-y-3 text-sm ${light ? 'text-gray-600' : 'text-white/90'}`}>
            <li><Link href="/terms" className={`${light ? 'hover:text-gray-800' : 'hover:opacity-100'}`}>Terms</Link></li>
            <li><Link href="/privacy" className={`${light ? 'hover:text-gray-800' : 'hover:opacity-100'}`}>Privacy</Link></li>
            <li><Link href="/cookies" className={`${light ? 'hover:text-gray-800' : 'hover:opacity-100'}`}>Cookies</Link></li>
          </ul>
        </div>
      </div>

      <div className="h-6 w-full bg-primary" />
    </footer>
  );
}