'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  HomeIcon, 
  MenuIcon, 
  XIcon,
  ChevronDownIcon,
  GlobeIcon,
  TagIcon,
  HeartIcon,
  BookmarkIcon,
  SparklesIcon,
  SearchIcon,
  BellIcon
} from 'lucide-react';

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const continents = [
    { label: 'Africa', href: '/continents/africa' },
    { label: 'Asia', href: '/continents/asia' },
    { label: 'Europe', href: '/continents/europe' },
    { label: 'North America', href: '/continents/north-america' },
    { label: 'South America', href: '/continents/south-america' },
    { label: 'Australia', href: '/continents/australia' },
    { label: 'Antarctica', href: '/continents/antarctica' },
  ];

  const deals = [
    { label: 'All Deals', href: '/deals' },
    { label: 'Search Deals', href: '/deals/searchdeals' },
  ];

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-40 transition-all duration-700
        ${isScrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-2xl' 
          : 'bg-gradient-to-r from-primary via-primary to-purple-600'
        }
      `}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/LogoNavBar.png"
                alt="Voyagr"
                width={100}
                height={20}
                className={`
                  object-contain hover:scale-105 transition-all duration-300
                  ${isScrolled ? 'brightness-50 contrast-125' : 'brightness-100'}
                `}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              
              {/* Explore Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group
                    ${isScrolled 
                      ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                    ${activeDropdown === 'explore' ? (isScrolled ? 'text-primary bg-gradient-to-r from-primary/10 to-purple-500/10' : 'text-white bg-white/15') : ''}
                  `}
                >
                  <GlobeIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Explore</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'explore' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'explore' && (
                  <div className="absolute left-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2">
                    {continents.map((continent) => (
                      <Link
                        key={continent.href}
                        href={continent.href}
                        className="flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 transition-all duration-300"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <GlobeIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{continent.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Deals Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'deals' ? null : 'deals')}
                  className={`
                    flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group
                    ${isScrolled 
                      ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                    ${activeDropdown === 'deals' ? (isScrolled ? 'text-primary bg-gradient-to-r from-primary/10 to-purple-500/10' : 'text-white bg-white/15') : ''}
                  `}
                >
                  <TagIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Deals</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'deals' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'deals' && (
                  <div className="absolute left-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2">
                    {deals.map((deal) => (
                      <Link
                        key={deal.href}
                        href={deal.href}
                        className="flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 transition-all duration-300"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <TagIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{deal.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Links */}
              <Link href="/favorites" className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group
                ${isScrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}>
                <HeartIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Favorites</span>
              </Link>

              <Link href="/reserved" className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group
                ${isScrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}>
                <BookmarkIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Reserved</span>
              </Link>

              <Link href="/ai" className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group
                ${isScrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}>
                <SparklesIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>AI Assistant</span>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Search */}
              <button className={`
                p-3 rounded-xl transition-all duration-300 group
                ${isScrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}>
                <SearchIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </button>

              {/* Notifications */}
              <button className={`
                p-3 rounded-xl transition-all duration-300 group relative
                ${isScrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}>
                <BellIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>

              {/* Home */}
              <Link href="/" className={`
                p-3 rounded-xl transition-all duration-300 group
                ${isScrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}>
                <HomeIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </Link>

              {/* User Menu */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                  className={`
                    p-3 rounded-xl transition-all duration-300 group
                    ${isScrolled 
                      ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                    ${activeDropdown === 'user' ? (isScrolled ? 'text-primary bg-gradient-to-r from-primary/10 to-purple-500/10' : 'text-white bg-white/15') : ''}
                  `}
                >
                  <UserIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </button>
                
                {activeDropdown === 'user' && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2">
                    <Link href="/profile" className="flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 transition-all duration-300" onClick={() => setActiveDropdown(null)}>
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">Profile</span>
                    </Link>
                    <Link href="/myjourney" className="flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 transition-all duration-300" onClick={() => setActiveDropdown(null)}>
                      <GlobeIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">My Journey</span>
                    </Link>
                    <Link href="/settings" className="flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 transition-all duration-300" onClick={() => setActiveDropdown(null)}>
                      <SparklesIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">Settings</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`
                  lg:hidden p-3 rounded-xl transition-all duration-300
                  ${isScrolled 
                    ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary/20 to-purple-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl border-l border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-primary bg-clip-text text-transparent">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <XIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Link href="/favorites" className="flex items-center gap-3 p-3 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                <HeartIcon className="w-5 h-5" />
                <span className="font-semibold">Favorites</span>
              </Link>
              <Link href="/reserved" className="flex items-center gap-3 p-3 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                <BookmarkIcon className="w-5 h-5" />
                <span className="font-semibold">Reserved</span>
              </Link>
              <Link href="/ai" className="flex items-center gap-3 p-3 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                <SparklesIcon className="w-5 h-5" />
                <span className="font-semibold">AI Assistant</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="h-20" />
    </>
  );
}