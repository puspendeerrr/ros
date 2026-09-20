/**
 * Enterprise Mega Menu (Sprint 2 - Refined Layout)
 * 2-Column Layout (promotional panel removed):
 * - Left: Category sidebar (only when 2+ sections exist)
 * - Right: Feature cards grid (2-col or 1-col depending on item count)
 *
 * Panel width adapts to content:
 * - Multi-section menus (Platform, Industries, Resources) -> 820px
 * - Single-section menus (Solutions, Company)            -> 580px
 *
 * featuredCta renders as a slim bottom strip, not a full column.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ArrowRight,
  QrCode,
  Smartphone,
  Globe,
  ShoppingBag,
  Utensils,
  Tablet,
  Receipt,
  Printer,
  Layers,
  Building2,
  BarChart3,
  Users,
  Star,
  Award,
  Store,
  Coffee,
  Zap,
  BookOpen,
  FileText,
  HelpCircle,
  Download,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Mail,
} from '../../lib/icons.ts';
import { Badge } from '../ui/badge.tsx';
import { MAIN_NAV_ITEMS, type MegaMenuDropdown, type NavSection } from '../../config/navigation.config.ts';

// --- Icon registry ---

const renderIcon = (name?: string) => {
  const cls = 'w-4 h-4';
  switch (name) {
    case 'QrCode':      return <QrCode      className={cls} />;
    case 'Smartphone':  return <Smartphone  className={cls} />;
    case 'Globe':       return <Globe       className={cls} />;
    case 'ShoppingBag': return <ShoppingBag className={cls} />;
    case 'Utensils':    return <Utensils    className={cls} />;
    case 'Tablet':      return <Tablet      className={cls} />;
    case 'Receipt':     return <Receipt     className={cls} />;
    case 'Printer':     return <Printer     className={cls} />;
    case 'Layers':      return <Layers      className={cls} />;
    case 'Building2':   return <Building2   className={cls} />;
    case 'BarChart3':   return <BarChart3   className={cls} />;
    case 'Users':       return <Users       className={cls} />;
    case 'Star':        return <Star        className={cls} />;
    case 'Award':       return <Award       className={cls} />;
    case 'Store':       return <Store       className={cls} />;
    case 'Coffee':      return <Coffee      className={cls} />;
    case 'Zap':         return <Zap         className={cls} />;
    case 'BookOpen':    return <BookOpen    className={cls} />;
    case 'FileText':    return <FileText    className={cls} />;
    case 'HelpCircle':  return <HelpCircle  className={cls} />;
    case 'Download':    return <Download    className={cls} />;
    case 'RefreshCw':   return <RefreshCw   className={cls} />;
    case 'TrendingUp':  return <TrendingUp  className={cls} />;
    case 'Sparkles':    return <Sparkles    className={cls} />;
    case 'Mail':        return <Mail        className={cls} />;
    default:            return <Sparkles    className={cls} />;
  }
};

// --- Feature card ---

interface FeatureCardProps {
  item: NavSection['items'][number];
  onNavigate: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ item, onNavigate }) => (
  <Link
    to={item.path}
    onClick={onNavigate}
    className="group flex items-start gap-2.5 p-2.5 rounded-xl border border-transparent hover:border-slate-200/80 hover:bg-slate-50/80 hover:shadow-xs transition-all duration-150"
  >
    <div className="w-8 h-8 rounded-lg bg-orange-50/80 text-[#FF7A00] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FF7A00] group-hover:text-white transition-colors">
      {renderIcon(item.iconName)}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-1.5">
        <span className="text-[13px] font-semibold leading-snug text-slate-900 group-hover:text-[#FF7A00] transition-colors">
          {item.label}
        </span>
        {item.badge && (
          <Badge
            variant={
              item.badge === 'ENTERPRISE' ? 'enterprise'
              : item.badge === 'NEW'      ? 'success'
              : 'orange'
            }
            size="sm"
            className="shrink-0 mt-0.5 text-[9px] px-1.5 py-0"
          >
            {item.badge}
          </Badge>
        )}
      </div>
      {item.description && (
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-1">
          {item.description}
        </p>
      )}
    </div>
  </Link>
);

// --- Main MegaMenu ---

export const MegaMenu: React.FC = () => {
  const [activeMenuKey, setActiveMenuKey] = useState<string | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => { setActiveMenuKey(null); }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveMenuKey(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenuKey(key);
    setActiveCategoryIndex(0);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => setActiveMenuKey(null), 150);
  };

  const closeMenu = () => setActiveMenuKey(null);

  const activeItem = MAIN_NAV_ITEMS.find((i) => i.key === activeMenuKey);
  const activeDropdown: MegaMenuDropdown | undefined = activeItem?.megaMenu;
  const currentSection: NavSection | undefined =
    activeDropdown?.sections[activeCategoryIndex] ?? activeDropdown?.sections[0];

  const isMultiSection = (activeDropdown?.sections.length ?? 0) > 1;
  const panelWidth     = isMultiSection ? 'w-[820px]' : 'w-[580px]';
  const cardCols       = (currentSection?.items.length ?? 0) >= 4 ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main Enterprise Navigation"
      className="relative flex items-center"
      onMouseLeave={handleMouseLeave}
    >
      {/* Nav trigger buttons */}
      <div className="flex items-center gap-1">
        {MAIN_NAV_ITEMS.map((navItem) => {
          const hasDropdown    = Boolean(navItem.megaMenu);
          const isDropdownOpen = activeMenuKey === navItem.key;
          const isCurrentRoute = Boolean(navItem.path && location.pathname === navItem.path);

          if (!hasDropdown && navItem.path) {
            return (
              <Link
                key={navItem.key}
                to={navItem.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isCurrentRoute
                    ? 'text-[#FF7A00] bg-orange-50/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {navItem.label}
              </Link>
            );
          }

          return (
            <div key={navItem.key} onMouseEnter={() => handleMouseEnter(navItem.key)} className="relative">
              <button
                type="button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                onClick={() => setActiveMenuKey(isDropdownOpen ? null : navItem.key)}
                className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer select-none ${
                  isDropdownOpen
                    ? 'text-[#FF7A00] bg-orange-50/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span>{navItem.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-[#FF7A00]' : 'text-slate-400'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Dropdown panel */}
      {activeDropdown && (
        <div
          role="region"
          aria-label={`${activeDropdown.label} Menu Panel`}
          onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
          onMouseLeave={handleMouseLeave}
          className={`absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 z-50 ${panelWidth} max-w-[95vw] rounded-2xl bg-white border border-slate-200/80 shadow-2xl animate-scaleIn overflow-hidden`}
          style={{ transitionDuration: '200ms' }}
        >
          {/* Main body */}
          <div className="flex">

            {/* Left sidebar: categories (multi-section only) */}
            {isMultiSection && (
              <div className="w-44 shrink-0 border-r border-slate-100 bg-slate-50/50 p-3 space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Categories
                </div>
                {activeDropdown.sections.map((sec, idx) => {
                  const isActive = idx === activeCategoryIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onMouseEnter={() => setActiveCategoryIndex(idx)}
                      onClick={() => setActiveCategoryIndex(idx)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#FF7A00] shadow-xs border border-slate-200/70'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      <span>{sec.title}</span>
                      <ArrowRight
                        className={`w-3 h-3 transition-opacity ${
                          isActive ? 'opacity-100 text-[#FF7A00]' : 'opacity-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Center: feature cards */}
            <div className="flex-1 min-w-0 p-4">
              <div className="flex items-center justify-between mb-3 px-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {currentSection?.title}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {currentSection?.items.length} items
                </span>
              </div>
              <div className={`grid ${cardCols} gap-1`}>
                {currentSection?.items.map((item) => (
                  <FeatureCard key={item.path} item={item} onNavigate={closeMenu} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom strip: slim featured CTA */}
          {activeDropdown.featuredCta && (
            <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 flex items-center justify-between gap-4">
              <span className="text-[11.5px] text-slate-500 leading-snug">
                {activeDropdown.featuredCta.description}
              </span>
              <Link
                to={activeDropdown.featuredCta.path}
                onClick={closeMenu}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#FF7A00] hover:text-orange-500 transition-colors shrink-0 whitespace-nowrap"
              >
                {activeDropdown.featuredCta.buttonLabel}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
