/**
 * Command Palette (⌘K)
 * Enterprise keyboard-navigable search across Features, Solutions, Industries, Docs, Guides, and FAQ.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Sparkles,
  BookOpen,
  Building2,
  QrCode,
  Store,
  Layers,
  FileText,
  HelpCircle,
  X,
  CreditCard,
  Tablet,
  Clock,
} from '../../lib/icons.ts';
import { Badge } from '../ui/badge.tsx';

export interface CommandItemData {
  id: string;
  title: string;
  category: 'Features' | 'Solutions' | 'Industries' | 'Docs & Guides' | 'General';
  path: string;
  description: string;
  keywords?: string[];
  badge?: string;
  icon: React.ReactNode;
}

const SEARCH_DATABASE: CommandItemData[] = [
  // Features
  {
    id: 'feat-qr-menu',
    title: 'QR Menu Ecosystem',
    category: 'Features',
    path: '/features/qr-menu',
    description: 'Table stand vector QR generator for direct guest dining',
    badge: 'POPULAR',
    keywords: ['qr', 'code', 'table', 'stand', 'menu', 'contactless'],
    icon: <QrCode className="w-4 h-4 text-[#FF7A00]" />,
  },
  {
    id: 'feat-pos',
    title: 'Cloud Restaurant POS',
    category: 'Features',
    path: '/features/restaurant-pos',
    description: 'Hardware-agnostic tablet billing & order management',
    badge: 'NEW',
    keywords: ['pos', 'billing', 'point of sale', 'register', 'orders'],
    icon: <Tablet className="w-4 h-4 text-[#FF7A00]" />,
  },
  {
    id: 'feat-digital-menu',
    title: 'Real-Time Digital Menu',
    category: 'Features',
    path: '/features/digital-menu',
    description: 'Tactile, live-sync digital catalog with 820ms update propagation',
    keywords: ['digital', 'catalog', 'live', 'sync', 'prices', 'modifiers'],
    icon: <Layers className="w-4 h-4 text-[#FF7A00]" />,
  },
  {
    id: 'feat-kds',
    title: 'Kitchen Display System (KDS)',
    category: 'Features',
    path: '/features/kitchen-display-system',
    description: 'Paperless ticket routing for cook stations',
    keywords: ['kds', 'kitchen', 'tickets', 'cook', 'chef', 'display'],
    icon: <Layers className="w-4 h-4 text-[#FF7A00]" />,
  },
  {
    id: 'feat-inventory',
    title: 'Recipe Inventory Management',
    category: 'Features',
    path: '/features/inventory',
    description: 'Real-time ingredient depletion and recipe costing',
    keywords: ['inventory', 'stock', 'ingredients', 'recipes', 'costing'],
    icon: <Store className="w-4 h-4 text-[#FF7A00]" />,
  },
  {
    id: 'feat-billing',
    title: 'Billing & GST Invoicing',
    category: 'Features',
    path: '/features/billing',
    description: 'Split bills, GST-compliant print slips, and direct UPI',
    keywords: ['billing', 'invoice', 'gst', 'tax', 'split', 'payment', 'upi'],
    icon: <CreditCard className="w-4 h-4 text-[#FF7A00]" />,
  },
  {
    id: 'feat-multi-branch',
    title: 'Multi-Branch Master Hub',
    category: 'Features',
    path: '/features/multi-branch-management',
    description: 'Franchise and central multi-location administration',
    badge: 'ENTERPRISE',
    keywords: ['multi-branch', 'franchise', 'chain', 'headquarters', 'central'],
    icon: <Building2 className="w-4 h-4 text-[#FF7A00]" />,
  },
  {
    id: 'feat-ordering',
    title: 'Commission-Free Ordering',
    category: 'Features',
    path: '/features/restaurant-ordering',
    description: 'Direct guest order intake with 0% aggregator commissions',
    badge: '0% FEE',
    keywords: ['ordering', 'direct', 'commission', 'pickup', 'delivery'],
    icon: <Sparkles className="w-4 h-4 text-[#FF7A00]" />,
  },

  // Solutions
  {
    id: 'sol-chains',
    title: 'Restaurant Chains & Franchises',
    category: 'Solutions',
    path: '/solutions/restaurant-chains',
    description: 'Centralized menu, inventory, and analytics across all units',
    keywords: ['chain', 'franchise', 'enterprise', 'brand', 'multi-unit'],
    icon: <Building2 className="w-4 h-4 text-blue-500" />,
  },
  {
    id: 'sol-indie',
    title: 'Independent Bistros & Cafes',
    category: 'Solutions',
    path: '/solutions/single-restaurants',
    description: 'Single-unit cafes, bistros, and neighborhood eateries',
    keywords: ['independent', 'bistro', 'cafe', 'single', 'local'],
    icon: <Store className="w-4 h-4 text-blue-500" />,
  },
  {
    id: 'sol-cloud-kitchen',
    title: 'Cloud & Virtual Kitchens',
    category: 'Solutions',
    path: '/solutions/cloud-kitchens',
    description: 'Delivery-only multi-brand operations from a single facility',
    keywords: ['cloud kitchen', 'ghost kitchen', 'dark kitchen', 'virtual'],
    icon: <Layers className="w-4 h-4 text-blue-500" />,
  },
  {
    id: 'sol-compare',
    title: 'Platform Comparisons',
    category: 'Solutions',
    path: '/compare',
    description: 'Side-by-side matrices vs. paper menus and aggregators',
    keywords: ['compare', 'vs', 'aggregators', 'paper', 'swiggy', 'zomato'],
    icon: <FileText className="w-4 h-4 text-blue-500" />,
  },

  // Industries
  {
    id: 'ind-cafes',
    title: 'Specialty Cafes & Coffee',
    category: 'Industries',
    path: '/industries/cafes',
    description: 'Rapid queue ordering and specialized drink modifiers',
    keywords: ['cafe', 'coffee', 'espresso', 'barista', 'bakery'],
    icon: <Store className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: 'ind-hotels',
    title: 'Hotels & In-Room Dining',
    category: 'Industries',
    path: '/industries/hotels',
    description: 'Room-specific QR stands and dining charge to room',
    keywords: ['hotel', 'resort', 'in-room', 'hospitality', 'stay'],
    icon: <Building2 className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: 'ind-fast-food',
    title: 'Fast Casual & QSR',
    category: 'Industries',
    path: '/industries/fast-food',
    description: 'Sub-3-minute ticket velocity and kitchen throughput',
    keywords: ['qsr', 'fast food', 'burger', 'pizza', 'counter'],
    icon: <Clock className="w-4 h-4 text-emerald-500" />,
  },

  // Docs & Guides
  {
    id: 'doc-hub',
    title: 'Documentation Hub',
    category: 'Docs & Guides',
    path: '/docs',
    description: 'Setup guides, printer configurations, and hardware pairings',
    keywords: ['docs', 'documentation', 'setup', 'manual', 'help'],
    icon: <FileText className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'doc-guides',
    title: 'Hospitality Playbooks & Guides',
    category: 'Docs & Guides',
    path: '/resources/guides',
    description: 'Commission-free blueprints, menu engineering, and growth tactics',
    keywords: ['guides', 'playbooks', 'blueprint', 'growth', 'articles'],
    icon: <BookOpen className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'doc-faq',
    title: 'FAQ Library',
    category: 'Docs & Guides',
    path: '/resources/faqs',
    description: 'Comprehensive answers to hardware, pricing, and UPI queries',
    keywords: ['faq', 'questions', 'answers', 'support', 'pricing faq'],
    icon: <HelpCircle className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'doc-api',
    title: 'Developer API & Webhooks',
    category: 'Docs & Guides',
    path: '/api',
    description: 'REST API, Webhook endpoints, and developer sandbox tokens',
    badge: 'API v2',
    keywords: ['api', 'webhooks', 'developer', 'tokens', 'endpoints', 'json'],
    icon: <Layers className="w-4 h-4 text-purple-500" />,
  },

  // General
  {
    id: 'gen-pricing',
    title: 'Pricing Plans & Calculator',
    category: 'General',
    path: '/pricing',
    description: 'Transparent 0% commission subscription tiers',
    keywords: ['pricing', 'cost', 'plans', 'free trial', 'monthly', 'annual'],
    icon: <CreditCard className="w-4 h-4 text-slate-600" />,
  },
];

const RECENT_SEARCHES: CommandItemData[] = [
  SEARCH_DATABASE[0], // QR Menu
  SEARCH_DATABASE[1], // POS
  SEARCH_DATABASE[15], // Docs
  SEARCH_DATABASE[19], // Pricing
];

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filtered results
  const filteredItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return RECENT_SEARCHES;

    return SEARCH_DATABASE.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(cleanQuery);
      const matchDesc = item.description.toLowerCase().includes(cleanQuery);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(cleanQuery));
      return matchTitle || matchDesc || matchKeywords;
    });
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  const handleSelect = (item: CommandItemData) => {
    onOpenChange(false);
    navigate(item.path);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200/80 animate-scaleIn flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search features, solutions, docs, guides, pricing..."
            className="w-full bg-transparent text-sm sm:text-base outline-none placeholder:text-slate-400 text-slate-900"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          role="listbox"
          className="overflow-y-auto p-2 space-y-1 flex-1 max-h-[420px]"
        >
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {query.trim() ? 'Search Results' : 'Recent & Popular Searches'}
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for POS, QR menu, pricing, or docs.</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleSelect(item)}
                  className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-orange-50/70 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-[#FF7A00]/10' : 'bg-slate-100'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <Badge variant="orange" size="sm">
                            {item.badge}
                          </Badge>
                        )}
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">
                          in {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 text-[#FF7A00] shrink-0 transition-transform ${
                      isSelected ? 'opacity-100 translate-x-0.5' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                ↑
              </kbd>
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                ↓
              </kbd>{' '}
              to navigate
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                ↵
              </kbd>{' '}
              to select
            </span>
          </div>
          <span className="text-slate-400">Restaurant OS v2.0</span>
        </div>
      </div>
    </div>
  );
};
