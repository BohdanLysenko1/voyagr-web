'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useId } from 'react';
import { useNavbarVisibility } from '@/contexts/NavbarVisibilityContext';
import NotificationModal from '@/components/Notifications/NotificationModal';
import type { NotificationItem } from '@/components/Notifications/NotificationModal';
import { 
  UserIcon, 
  MenuIcon, 
  XIcon,
  ChevronDownIcon,
  GlobeIcon,
  TagIcon,
  HeartIcon,
  BookmarkIcon,
  SparklesIcon,
  SearchIcon,
  BellIcon,
  SettingsIcon
} from 'lucide-react';

export default function Navbar() {
  const { isNavbarVisible } = useNavbarVisibility();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isContinentsExpanded, setIsContinentsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const notificationModalId = useId();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  // Close notification modal when clicking outside
  const continents = [
    { label: 'Africa', href: '/continents/africa' },
    { label: 'Antarctica', href: '/continents/antarctica' },
    { label: 'Asia', href: '/continents/asia' },
    { label: 'Australia', href: '/continents/australia' },
    { label: 'Europe', href: '/continents/europe' },
    { label: 'North America', href: '/continents/north-america' },
    { label: 'South America', href: '/continents/south-america' },
  ];

/*   const deals = [
    { label: 'All Deals', href: '/deals' },
  ]; */

  // Sample notification data
  const notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'New Deal Alert!',
      message: 'Amazing 50% off flights to Europe this weekend only',
      time: '2 minutes ago',
      type: 'deal',
      unread: true
    },
    {
      id: 2,
      title: 'Trip Reminder',
      message: 'Your flight to Tokyo departs in 3 days',
      time: '1 hour ago',
      type: 'reminder',
      unread: true
    },
    {
      id: 3,
      title: 'Welcome to Voyagr!',
      message: 'Complete your profile to get personalized recommendations',
      time: '1 day ago',
      type: 'welcome',
      unread: false
    }
  ];

  const visibilityClasses = isNavbarVisible
    ? 'opacity-100 pointer-events-auto transform translate-y-0'
    : 'opacity-0 pointer-events-none transform -translate-y-full';

  return (
    <>
      <nav
        aria-hidden={!isNavbarVisible}
        className={`
        fixed top-0 left-0 right-0 z-40 transition-all duration-700 ease-out
        ${isScrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-2xl' 
          : 'bg-gradient-to-r from-primary via-primary to-purple-600'
        }
        ${visibilityClasses}
      `}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div ref={navRef} className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/images/UpdateLogo.svg"
                  alt="Voyagr"
                  width={100}
                  height={20}
                  className={`
                    object-contain transition-all duration-300
                    group-hover:scale-105 group-active:scale-95
                    ${isScrolled ? 'brightness-50 contrast-125' : 'brightness-100'}
                  `}
                  priority
                />
                {/* Cool ripple effect on click only */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-active:opacity-40 group-active:animate-pulse bg-gradient-to-r from-primary/50 to-purple-500/50 transition-opacity duration-150 pointer-events-none" />
                {/* Shine effect on hover - fixed to prevent artifacts */}
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform -translate-x-full opacity-0 group-hover:translate-x-full group-hover:opacity-100 transition-all duration-700" />
                </div>
              </div>
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
{/*               <div className="relative">
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
              </div> */}

              {/* Direct Links */}
              <Link href="/deals" className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group
                ${isScrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}>
                <TagIcon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Deals</span>
              </Link>

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
            <div className="flex items-center space-x-1">
              
              {/* Search */}
              <button className={`
                p-3 rounded-xl transition-all duration-300 group
                ${isScrolled 
                  ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                }
              `}>
                <Link href='/'>
                  <SearchIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </Link>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  ref={notificationButtonRef}
                  onClick={() => setIsNotificationModalOpen(!isNotificationModalOpen)}
                  className={`
                    p-3 rounded-xl transition-all duration-300 group relative
                    ${isScrolled 
                      ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                    ${isNotificationModalOpen ? (isScrolled ? 'text-primary bg-gradient-to-r from-primary/10 to-purple-500/10' : 'text-white bg-white/15') : ''}
                  `}
                  aria-haspopup="dialog"
                  aria-expanded={isNotificationModalOpen}
                  aria-controls={isNotificationModalOpen ? notificationModalId : undefined}
                >
                  <BellIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  {/* Notification badge */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                </button>
                <NotificationModal
                  id={notificationModalId}
                  open={isNotificationModalOpen}
                  notifications={notifications}
                  onClose={() => setIsNotificationModalOpen(false)}
                  anchorRef={notificationButtonRef}
                />
              </div>

              {/* User Menu */}
              <div className="relative">
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
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 transition-all duration-300"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 transition-all duration-300"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <SettingsIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">Settings</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`
                  lg:hidden p-3 rounded-xl transition-all duration-300
                  ${isScrolled 
                    ? 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {isMobileMenuOpen ? (
                  <XIcon className="w-5 h-5" />
                ) : (
                  <MenuIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-30 bg-white/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6">
            
            {/* Mobile Explore Section */}
            <div className="mb-6">
              <button
                onClick={() => setIsContinentsExpanded(!isContinentsExpanded)}
                className="flex items-center justify-between w-full p-4 text-left text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <GlobeIcon className="w-5 h-5" />
                  <span className="font-semibold">Explore Continents</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isContinentsExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {isContinentsExpanded && (
                <div className="mt-2 ml-8 space-y-1">
                  {continents.map((continent) => (
                    <Link
                      key={continent.href}
                      href={continent.href}
                      className="block p-3 text-gray-600 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-lg transition-all duration-300"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsContinentsExpanded(false);
                      }}
                    >
                      {continent.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Deals */}
{/*             <div className="mb-6">
              <div className="space-y-1">
                {deals.map((deal) => (
                  <Link
                    key={deal.href}
                    href={deal.href}
                    className="flex items-center gap-3 p-4 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-xl transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <TagIcon className="w-5 h-5" />
                    <span className="font-semibold">{deal.label}</span>
                  </Link>
                ))}
              </div>
            </div>  */}

            {/* Mobile Direct Links */}
            <div className="space-y-1">
            <Link
                href="/deals"
                className="flex items-center gap-3 p-4 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TagIcon className="w-5 h-5" />
                <span className="font-semibold">Deals</span>
              </Link>

              <Link
                href="/favorites"
                className="flex items-center gap-3 p-4 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HeartIcon className="w-5 h-5" />
                <span className="font-semibold">Favorites</span>
              </Link>

              <Link
                href="/reserved"
                className="flex items-center gap-3 p-4 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookmarkIcon className="w-5 h-5" />
                <span className="font-semibold">Reserved</span>
              </Link>

              <Link
                href="/ai"
                className="flex items-center gap-3 p-4 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="font-semibold">AI Assistant</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-3 p-4 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-semibold">Profile</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 p-4 text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 rounded-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="font-semibold">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
