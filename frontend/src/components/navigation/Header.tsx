/**
 * Enterprise SaaS Sticky Header (Sprint 2 Redesign)
 * - Height: 72px (h-[72px])
 * - Glassmorphic white 90% opacity with backdrop blur (blur-md)
 * - Soft bottom border (border-slate-100/80)
 * - Brand Logo (Left) — large wordmark, 80–88px image height to compensate for PNG canvas padding
 * - Center: Desktop MegaMenu
 * - Right: Command Search (⌘K), Dashboard CTA, and Mobile Trigger
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MegaMenu } from './MegaMenu.tsx';
import { CommandPalette } from './CommandPalette.tsx';
import { MobileNav } from './MobileNav.tsx';
import { Button } from '../ui/button.tsx';
import { Search, Menu } from '../../lib/icons.ts';
import { useAuthStore } from '../../store/auth.store.ts';
import logo from '../../assets/logo.png';

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Listen for scroll for subtle shadow enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header
        role="banner"
        className={`sticky top-0 z-40 h-[72px] w-full bg-white/90 backdrop-blur-md border-b transition-all duration-200 select-none ${
          isScrolled
            ? 'border-slate-200/80 shadow-sm shadow-slate-900/5'
            : 'border-slate-100/80'
        } ${className || ''}`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* Brand Logo (Left) — large wordmark, always fully visible */}
          <div className="flex items-center shrink-0 min-w-[200px] lg:min-w-[240px]">
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex items-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] rounded-lg -ml-3 px-2"
              aria-label="Restaurant OS — Go to homepage"
            >
              {/*
                Logo PNG has a ~4:1 whitespace-to-content ratio baked into the canvas.
                The actual wordmark occupies ~25% of canvas height.
                At h-[160px] the wordmark renders at ~40px — correct visual size.
                Header has no overflow-hidden so vertical overflow is fine.
              */}
              <img
                src={logo}
                alt="Restaurant OS"
                className="h-[148px] sm:h-[160px] w-auto max-w-[240px] sm:max-w-[260px] object-contain object-left"
                draggable={false}
              />
            </button>
          </div>

          {/* Center: Desktop Mega Menu Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <MegaMenu />
          </div>

          {/* Right: Command Search Trigger & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Command Palette Trigger (⌘K) */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Search site content"
              className="hidden sm:inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 text-xs font-medium text-slate-500 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xl:inline">Search docs & features...</span>
              <span className="xl:hidden">Search</span>
              <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Search"
              className="sm:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth CTA Actions */}
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="font-semibold shadow-xs"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/signup')}
                    className="font-semibold shadow-xs"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={mobileNavOpen}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      {/* Mobile Slide-Over Navigation */}
      <MobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        onOpenCommand={() => setCommandOpen(true)}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
};
