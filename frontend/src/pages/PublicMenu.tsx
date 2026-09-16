import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Info,
  Image as ImageIcon,
  Phone,
  MapPin,
  Clock,
  Search,
  Share2,
  Navigation,
  MessageCircle,
  Star,
  Sparkles,
  X,
  ChevronRight,
  Heart,
  WifiOff,
  Globe,
  Check,
} from 'lucide-react';

import { menuService } from '../services/menu.service.js';
import { getImageUrl, handleImageError } from '../utils/image.js';
import logoIcon from '../assets/logo-icon.png';
import { Capacitor } from '@capacitor/core';
import { Share as CapShare } from '@capacitor/share';
import { Clipboard as CapClipboard } from '@capacitor/clipboard';

// Sample gallery photos if restaurant doesn't have custom gallery
const DEFAULT_GALLERY = [
  { id: 'g1', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', title: 'Restaurant Interior' },
  { id: 'g2', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80', title: 'Dining Ambience' },
  { id: 'g3', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', title: 'Signature Dishes' },
  { id: 'g4', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', title: 'Fresh Ingredients' },
  { id: 'g5', url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80', title: 'Special Delicacies' },
  { id: 'g6', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', title: 'Chefs Special' },
];

export const PublicMenu: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();

  // 1. Splash Screen state (0.8s native launch feel)
  const [showSplash, setShowSplash] = useState(true);

  // 2. Tab Navigation
  const [activeTab, setActiveTab] = useState<'menu' | 'about' | 'gallery' | 'contact'>('menu');

  // 3. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterNonVeg, setFilterNonVeg] = useState(false);
  const [filterBestseller, setFilterBestseller] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // 4. Modal & Toast UI state
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 5. Fetch Public Menu Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['public-menu', restaurantSlug],
    queryFn: () => menuService.getPublicMenu(restaurantSlug || ''),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const restaurant = data?.data?.restaurant;
  const categories = data?.data?.categories || [];

  // Hide Splash Screen after 0.8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Update Page Title
  useEffect(() => {
    if (restaurant?.restaurantName) {
      document.title = `${restaurant.restaurantName} | Digital Menu`;
    }
  }, [restaurant]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Scroll category selector into view helper
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (catId !== 'all') {
      const el = document.getElementById(`cat-${catId}`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Robust Time parser: HH:mm, HH:mm:ss, h:mm AM/PM
  const parseTimeToMinutes = (timeStr?: string | null): number | null => {
    if (!timeStr) return null;
    const s = timeStr.trim();
    const ampmMatch = s.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*(AM|PM)$/i);
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1], 10);
      const minutes = parseInt(ampmMatch[2] || '0', 10);
      const period = ampmMatch[4].toUpperCase();
      if (period === 'AM' && hours === 12) hours = 0;
      if (period === 'PM' && hours !== 12) hours += 12;
      return hours * 60 + minutes;
    }
    const h24Match = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (h24Match) {
      const hours = parseInt(h24Match[1], 10);
      const minutes = parseInt(h24Match[2], 10);
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return hours * 60 + minutes;
      }
    }
    return null;
  };

  const formatTimeDisplay = (timeStr?: string | null): string => {
    if (!timeStr) return '';
    const minutes = parseTimeToMinutes(timeStr);
    if (minutes === null) return timeStr;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
  };

  // Check if restaurant is currently open
  const isOpen = useMemo(() => {
    if (!restaurant?.openingTime || !restaurant?.closingTime) return true;
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const openMinutes = parseTimeToMinutes(restaurant.openingTime);
      const closeMinutes = parseTimeToMinutes(restaurant.closingTime);
      if (openMinutes === null || closeMinutes === null) return true;
      if (closeMinutes < openMinutes) {
        return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
      }
      return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    } catch (e) {
      return true;
    }
  }, [restaurant]);

  // Address line construction
  const locationStr = useMemo(() => {
    if (!restaurant) return 'Sikar, Rajasthan';
    const parts = [restaurant.city || 'Sikar', restaurant.state || 'Rajasthan'].filter(Boolean);
    return parts.join(', ');
  }, [restaurant]);

  // Share link trigger
  const handleShare = async () => {
    const url = window.location.href;
    if (Capacitor.isNativePlatform()) {
      try {
        await CapShare.share({
          title: restaurant?.restaurantName || 'Digital Menu',
          text: `Checkout the digital menu of ${restaurant?.restaurantName || 'our restaurant'}!`,
          url,
        });
      } catch (err) {}
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant?.restaurantName || 'Digital Menu',
          text: `Checkout the digital menu of ${restaurant?.restaurantName || 'our restaurant'}!`,
          url,
        });
      } catch (err) {}
    } else {
      if (Capacitor.isNativePlatform()) {
        await CapClipboard.write({ string: url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Filtered categories & items
  const processedCategories = useMemo(() => {
    return categories
      .map((cat: any) => {
        const filteredItems = (cat.menuItems || []).filter((item: any) => {
          // Search match
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const nameMatch = item.name.toLowerCase().includes(q);
            const descMatch = item.description?.toLowerCase().includes(q);
            const catMatch = cat.name.toLowerCase().includes(q);
            if (!nameMatch && !descMatch && !catMatch) return false;
          }
          // Veg filter
          if (filterVeg && !item.isVeg) return false;
          // Non-Veg filter
          if (filterNonVeg && item.isVeg) return false;
          // Bestseller filter
          if (filterBestseller && (!item.isBestseller && item.price <= 200)) return false;

          return true;
        });
        return { ...cat, menuItems: filteredItems };
      })
      .filter((cat: any) => cat.menuItems.length > 0);
  }, [categories, searchQuery, filterVeg, filterNonVeg, filterBestseller]);

  // Loading skeleton screen
  if (isLoading || showSplash) {
    return (
      <div className="min-h-screen bg-[#181818] flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden font-sans">
        {/* Background ambient orange glows */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#FF6B00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Logo container */}
          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-[#FF6B00]/30 shadow-[#FF6B00]/20 mb-6 flex items-center justify-center">
            <img src={logoIcon} alt="ROS Logo" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            {restaurant?.restaurantName || 'Restaurant OS'}
          </h1>
          <p className="text-xs font-semibold text-[#FF6B00] tracking-wider uppercase mb-8">
            Digital Interactive Menu
          </p>

          {/* Glowing loader dots */}
          <div className="flex items-center gap-2 mb-4">
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
              className="w-3 h-3 bg-[#FF6B00] rounded-full shadow-[0_0_10px_#FF6B00]"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              className="w-3 h-3 bg-[#FF6B00] rounded-full shadow-[0_0_10px_#FF6B00]"
            />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              className="w-3 h-3 bg-[#FF6B00] rounded-full shadow-[0_0_10px_#FF6B00]"
            />
          </div>

          <p className="text-xs text-neutral-400 font-medium">Preparing fresh menu...</p>
        </motion.div>
      </div>
    );
  }

  // Error screen
  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-neutral-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#181818] mb-2">Restaurant Unavailable</h2>
          <p className="text-sm text-neutral-500 mb-6">
            The requested digital menu could not be loaded or is temporarily offline.
          </p>
          <button
            onClick={() => refetch()}
            className="w-full py-3 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold rounded-xl shadow-lg shadow-[#FF6B00]/30 transition-all active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] font-sans text-[#181818] antialiased selection:bg-[#FF6B00] selection:text-white flex justify-center">
      {/* PWA Mobile Container Frame (Max 420px centered on Desktop) */}
      <div className="w-full max-w-[420px] bg-white min-h-screen shadow-2xl relative flex flex-col pb-20">
        
        {/* Offline Banner */}
        {!isOnline && (
          <div className="bg-amber-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 sticky top-0 z-50">
            <WifiOff className="w-4 h-4" />
            <span>Offline Mode — Showing cached menu</span>
          </div>
        )}

        {/* Copy link Toast alert */}
        <AnimatePresence>
          {copiedLink && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#181818] border border-[#FF6B00]/40 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-[0_4px_20px_rgba(255,107,0,0.25)] flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Link copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* HERO SECTION (Restaurant OS Orange & Charcoal Brand Language)              */}
        {/* ========================================================================= */}
        <div className="relative bg-[#181818] text-white overflow-hidden">
          {/* Cover image or Orange Gradient fallback */}
          <div className="h-44 w-full relative overflow-hidden bg-[#181818]">
            {restaurant.coverImageUrl ? (
              <img
                src={getImageUrl(restaurant.coverImageUrl)}
                onError={handleImageError}
                alt="Restaurant Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FF6B00] via-[#E05300] to-[#181818] flex items-center justify-center relative">
                {/* Subtle ambient orange glow accents */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#FF6B00]/30 rounded-full blur-2xl" />
              </div>
            )}
            {/* Dark charcoal gradient overlay for high contrast text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/70 to-black/30" />
          </div>

          {/* Floating Restaurant Brand Header Info */}
          <div className="px-5 pb-5 -mt-12 relative z-10 text-center flex flex-col items-center">
            {/* Restaurant Logo Avatar */}
            <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-2xl ring-4 ring-[#FF6B00]/20 border border-[#FF6B00]/30 overflow-hidden mb-3 flex items-center justify-center shrink-0 shadow-[#FF6B00]/10">
              {restaurant.logoUrl ? (
                <img
                  src={getImageUrl(restaurant.logoUrl)}
                  onError={handleImageError}
                  alt={restaurant.restaurantName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-[#FF6B00] text-white font-black text-2xl flex items-center justify-center rounded-xl shadow-inner">
                  {restaurant.restaurantName.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Restaurant Name */}
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight mb-1">
              {restaurant.restaurantName}
            </h1>

            {/* Tagline / Description */}
            <p className="text-xs text-neutral-300 font-medium line-clamp-1 mb-3">
              {restaurant.description || 'Authentic Taste, Always Special'}
            </p>

            {/* Meta Information Badges (Location, Opening Hours, Veg) */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] font-semibold text-neutral-200 mb-4">
              <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                <MapPin className="w-3 h-3 text-[#FF6B00]" />
                <span>{locationStr}</span>
              </span>

              {restaurant.openingTime && restaurant.closingTime && (
                <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                  <Clock className="w-3 h-3 text-[#FF6B00]" />
                  <span>Open {formatTimeDisplay(restaurant.openingTime)} - {formatTimeDisplay(restaurant.closingTime)}</span>
                </span>
              )}

              <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                Pure Veg
              </span>

              {isOpen && (
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm">
                  Open Now
                </span>
              )}
            </div>

            {/* Quick Action Button Pills */}
            <div className="grid grid-cols-4 gap-2 w-full pt-2 border-t border-white/10">
              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex flex-col items-center justify-center py-2 bg-white/5 hover:bg-[#FF6B00]/15 hover:border-[#FF6B00]/40 active:scale-95 rounded-xl border border-white/10 transition-all text-white group"
                >
                  <Phone className="w-4 h-4 text-[#FF6B00] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">Call</span>
                </a>
              )}

              {restaurant.googleMapsUrl && (
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center py-2 bg-white/5 hover:bg-[#FF6B00]/15 hover:border-[#FF6B00]/40 active:scale-95 rounded-xl border border-white/10 transition-all text-white group"
                >
                  <Navigation className="w-4 h-4 text-[#FF6B00] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">Directions</span>
                </a>
              )}

              <button
                onClick={handleShare}
                className="flex flex-col items-center justify-center py-2 bg-white/5 hover:bg-[#FF6B00]/15 hover:border-[#FF6B00]/40 active:scale-95 rounded-xl border border-white/10 transition-all text-white group"
              >
                <Share2 className="w-4 h-4 text-[#FF6B00] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold">Share</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className="flex flex-col items-center justify-center py-2 bg-white/5 hover:bg-[#FF6B00]/15 hover:border-[#FF6B00]/40 active:scale-95 rounded-xl border border-white/10 transition-all text-white group"
              >
                <ImageIcon className="w-4 h-4 text-[#FF6B00] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold">Gallery</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN TAB SWITCHER CONTENT                                                 */}
        {/* ========================================================================= */}

        {activeTab === 'menu' && (
          <div className="flex-1 flex flex-col">
            
            {/* STICKY SEARCH & CATEGORY CHIPS BAR */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-3 pb-2 px-4 border-b border-neutral-100 shadow-sm">
              
              {/* Rounded Search Bar */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-neutral-100 focus:bg-white border border-transparent focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 rounded-2xl text-xs font-semibold placeholder:text-neutral-400 text-[#181818] outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Horizontal Category Scroll Chips */}
              <div
                ref={categoryScrollRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs font-bold"
              >
                <button
                  onClick={() => handleSelectCategory('all')}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 shrink-0 ${
                    selectedCategory === 'all'
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/30'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  All Dishes
                </button>

                {categories.map((cat: any) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 shrink-0 ${
                        isSelected
                          ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/30'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Dietary Filter Pills (Veg / Non-Veg / Bestseller) */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-100 text-[11px] font-bold overflow-x-auto no-scrollbar">
                <button
                  onClick={() => { setFilterVeg(!filterVeg); setFilterNonVeg(false); }}
                  className={`px-3 py-1 rounded-full border transition-all shrink-0 flex items-center gap-1 ${
                    filterVeg
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Veg Only</span>
                </button>

                <button
                  onClick={() => { setFilterNonVeg(!filterNonVeg); setFilterVeg(false); }}
                  className={`px-3 py-1 rounded-full border transition-all shrink-0 flex items-center gap-1 ${
                    filterNonVeg
                      ? 'bg-red-600 border-red-600 text-white shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Non-Veg</span>
                </button>

                <button
                  onClick={() => setFilterBestseller(!filterBestseller)}
                  className={`px-3 py-1 rounded-full border transition-all shrink-0 flex items-center gap-1 ${
                    filterBestseller
                      ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <Star className="w-3 h-3 fill-white text-white" />
                  <span>Bestseller</span>
                </button>
              </div>
            </div>

            {/* DISHES LIST AREA */}
            <div className="px-4 py-4 space-y-6">
              {processedCategories.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-3xl border border-neutral-100">
                  <div className="w-12 h-12 bg-orange-50 text-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#181818] mb-1">No dishes match search</h3>
                  <p className="text-xs text-neutral-500">Try adjusting your search term or dietary filters.</p>
                </div>
              ) : (
                processedCategories.map((category: any) => (
                  <div
                    key={category.id}
                    id={`cat-${category.id}`}
                    className="scroll-mt-40 space-y-3"
                  >
                    {/* Category Header Title */}
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <h2 className="text-lg font-black text-[#181818] tracking-tight flex items-center gap-2">
                        <span>{category.name}</span>
                        <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                          {category.menuItems.length}
                        </span>
                      </h2>
                    </div>

                    {/* Dish Cards inside Category */}
                    <div className="space-y-3">
                      {category.menuItems.map((item: any) => {
                        const isFav = favorites.includes(item.id);
                        const isBestseller = item.isBestseller || item.price > 200;

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all flex items-start gap-3 relative overflow-hidden group"
                          >
                            {/* Left: 96x96 Dish Image (Rounded 14px) */}
                            <div className="w-24 h-24 rounded-2xl bg-neutral-100 overflow-hidden relative shrink-0 border border-neutral-100">
                              {item.imageUrl ? (
                                <img
                                  src={getImageUrl(item.imageUrl)}
                                  onError={handleImageError}
                                  alt={item.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300 bg-orange-50/50">
                                  <Utensils className="w-8 h-8 text-[#FF6B00]/40" />
                                </div>
                              )}

                              {/* Favorite Heart trigger */}
                              <button
                                onClick={() => toggleFavorite(item.id)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
                              >
                                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                              </button>
                            </div>

                            {/* Center: Dish Details */}
                            <div className="flex-1 min-w-0 pr-2">
                              {/* Name + Veg Badge */}
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                {/* Veg Square Icon */}
                                <span className={`inline-flex items-center justify-center w-4 h-4 border ${item.isVeg ? 'border-emerald-600' : 'border-red-600'} rounded p-0.5 shrink-0`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                                </span>

                                <h3 className="text-sm font-bold text-[#181818] tracking-tight truncate leading-snug">
                                  {item.name}
                                </h3>

                                {isBestseller && (
                                  <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                    ★ Bestseller
                                  </span>
                                )}
                              </div>

                              {/* Price */}
                              <div className="text-sm font-black text-[#181818] mb-1">
                                ₹{Number(item.price).toFixed(0)}
                              </div>

                              {/* Description (max 2 lines) */}
                              {item.description && (
                                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed mb-2 font-normal">
                                  {item.description}
                                </p>
                              )}

                              {/* Prep Time Tag */}
                              <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400">
                                <Clock className="w-3 h-3 text-[#FF6B00]" />
                                <span>15 mins prep time</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ABOUT VIEW                                                         */}
        {/* ========================================================================= */}
        {activeTab === 'about' && (
          <div className="p-4 space-y-4">
            {/* Story Card */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#FF6B00]">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-base font-black text-[#181818]">About {restaurant.restaurantName}</h2>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                {restaurant.description ||
                  `Welcome to ${restaurant.restaurantName}. We are dedicated to providing fresh ingredients, authentic flavors, warm hospitality, and an unforgettably rich dining experience for families and food enthusiasts.`}
              </p>
            </div>

            {/* Address & Directions Card */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#FF6B00]">
                <MapPin className="w-5 h-5" />
                <h2 className="text-base font-black text-[#181818]">Location & Address</h2>
              </div>
              <p className="text-xs text-neutral-700 font-semibold leading-relaxed">
                {restaurant.address ? `${restaurant.address}, ${locationStr}` : locationStr}
              </p>

              {restaurant.googleMapsUrl && (
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold text-xs rounded-xl shadow-md shadow-[#FF6B00]/20 transition-all"
                >
                  <Navigation className="w-4 h-4 text-white" />
                  <span>Open in Google Maps</span>
                </a>
              )}
            </div>

            {/* Timings Schedule */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#FF6B00]">
                <Clock className="w-5 h-5" />
                <h2 className="text-base font-black text-[#181818]">Opening Hours</h2>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-neutral-100">
                <span className="text-neutral-500">Monday – Sunday</span>
                <span className="text-[#181818]">
                  {restaurant.openingTime && restaurant.closingTime
                    ? `${formatTimeDisplay(restaurant.openingTime)} - ${formatTimeDisplay(restaurant.closingTime)}`
                    : '1:00 PM - 11:00 PM'}
                </span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm space-y-3">
              <h2 className="text-sm font-black text-[#181818] mb-2">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-neutral-700">
                <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center gap-2">
                  <span className="text-emerald-500">⚡</span>
                  <span>UPI & Card Accepted</span>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center gap-2">
                  <span className="text-[#FF6B00]">❄️</span>
                  <span>Air Conditioned</span>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center gap-2">
                  <span className="text-[#FF6B00]">👨‍👩‍👧</span>
                  <span>Family Seating</span>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-xl flex items-center gap-2">
                  <span className="text-amber-500">🅿️</span>
                  <span>Free Parking</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: GALLERY VIEW                                                       */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#181818]">Photo Gallery</h2>
              <span className="text-xs font-bold text-neutral-400">Ambience & Dishes</span>
            </div>

            {/* 3-Column Instagram Grid Layout */}
            <div className="grid grid-cols-3 gap-2">
              {DEFAULT_GALLERY.map((img) => (
                <motion.div
                  key={img.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGalleryImg(img.url)}
                  className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden cursor-pointer relative shadow-sm border border-neutral-100 group"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Search className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fullscreen Photo Modal */}
            <AnimatePresence>
              {selectedGalleryImg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedGalleryImg(null)}
                  className="fixed inset-0 z-50 bg-[#181818]/95 backdrop-blur-xl p-4 flex flex-col items-center justify-center"
                >
                  <button
                    onClick={() => setSelectedGalleryImg(null)}
                    className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-[#FF6B00] text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <img
                    src={selectedGalleryImg}
                    alt="Enlarged view"
                    className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CONTACT VIEW                                                       */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="p-4 space-y-3">
            <h2 className="text-lg font-black text-[#181818] mb-2">Connect With Us</h2>

            {/* Phone Card */}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex items-center justify-between hover:bg-neutral-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400">Phone Number</p>
                    <p className="text-sm font-black text-[#181818]">{restaurant.phone}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-300" />
              </a>
            )}

            {/* WhatsApp Card */}
            {restaurant.phone && (
              <a
                href={`https://wa.me/${restaurant.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex items-center justify-between hover:bg-neutral-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400">WhatsApp Chat</p>
                    <p className="text-sm font-black text-[#181818]">Message on WhatsApp</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-300" />
              </a>
            )}

            {/* Google Maps Directions */}
            {restaurant.googleMapsUrl && (
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex items-center justify-between hover:bg-neutral-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 text-[#FF6B00] rounded-xl flex items-center justify-center font-bold">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400">Location Map</p>
                    <p className="text-sm font-black text-[#181818]">Get Directions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-300" />
              </a>
            )}

            {/* Website Card */}
            <button
              onClick={handleShare}
              className="w-full bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex items-center justify-between hover:bg-neutral-50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-[#FF6B00] rounded-xl flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400">Share QR Menu</p>
                  <p className="text-sm font-black text-[#181818]">Share Link with Friends</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STICKY BOTTOM NAVIGATION BAR                                              */}
        {/* ========================================================================= */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white/95 backdrop-blur-xl border-t border-neutral-100 shadow-2xl z-40 px-6 py-2 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-1 transition-all relative py-1 ${
              activeTab === 'menu' ? 'text-[#FF6B00] scale-105 font-black' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px] font-black">Menu</span>
            {activeTab === 'menu' && (
              <motion.div layoutId="activeTabPill" className="absolute -bottom-1 w-4 h-1 bg-[#FF6B00] rounded-full shadow-[0_0_6px_#FF6B00]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center gap-1 transition-all relative py-1 ${
              activeTab === 'about' ? 'text-[#FF6B00] scale-105 font-black' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[10px] font-black">About</span>
            {activeTab === 'about' && (
              <motion.div layoutId="activeTabPill" className="absolute -bottom-1 w-4 h-1 bg-[#FF6B00] rounded-full shadow-[0_0_6px_#FF6B00]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex flex-col items-center gap-1 transition-all relative py-1 ${
              activeTab === 'gallery' ? 'text-[#FF6B00] scale-105 font-black' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] font-black">Gallery</span>
            {activeTab === 'gallery' && (
              <motion.div layoutId="activeTabPill" className="absolute -bottom-1 w-4 h-1 bg-[#FF6B00] rounded-full shadow-[0_0_6px_#FF6B00]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex flex-col items-center gap-1 transition-all relative py-1 ${
              activeTab === 'contact' ? 'text-[#FF6B00] scale-105 font-black' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-black">Contact</span>
            {activeTab === 'contact' && (
              <motion.div layoutId="activeTabPill" className="absolute -bottom-1 w-4 h-1 bg-[#FF6B00] rounded-full shadow-[0_0_6px_#FF6B00]" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
