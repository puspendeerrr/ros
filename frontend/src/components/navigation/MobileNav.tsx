/**
 * Mobile Navigation (Slide-Over Drawer)
 * - Accordion sections for Platform, Solutions, Industries, Resources, and Company
 * - Large touch targets (>44px)
 * - Search bar trigger at top
 * - Pinned bottom Auth / Dashboard CTA
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet } from '../ui/sheet.tsx';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion.tsx';
import { Button } from '../ui/button.tsx';
import { Badge } from '../ui/badge.tsx';
import {
  Search,
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
import { MAIN_NAV_ITEMS } from '../../config/navigation.config.ts';
import logo from '../../assets/logo.png';

const renderMobileIcon = (name?: string) => {
  switch (name) {
    case 'QrCode':
      return <QrCode className="w-4 h-4" />;
    case 'Smartphone':
      return <Smartphone className="w-4 h-4" />;
    case 'Globe':
      return <Globe className="w-4 h-4" />;
    case 'ShoppingBag':
      return <ShoppingBag className="w-4 h-4" />;
    case 'Utensils':
      return <Utensils className="w-4 h-4" />;
    case 'Tablet':
      return <Tablet className="w-4 h-4" />;
    case 'Receipt':
      return <Receipt className="w-4 h-4" />;
    case 'Printer':
      return <Printer className="w-4 h-4" />;
    case 'Layers':
      return <Layers className="w-4 h-4" />;
    case 'Building2':
      return <Building2 className="w-4 h-4" />;
    case 'BarChart3':
      return <BarChart3 className="w-4 h-4" />;
    case 'Users':
      return <Users className="w-4 h-4" />;
    case 'Star':
      return <Star className="w-4 h-4" />;
    case 'Award':
      return <Award className="w-4 h-4" />;
    case 'Store':
      return <Store className="w-4 h-4" />;
    case 'Coffee':
      return <Coffee className="w-4 h-4" />;
    case 'Zap':
      return <Zap className="w-4 h-4" />;
    case 'BookOpen':
      return <BookOpen className="w-4 h-4" />;
    case 'FileText':
      return <FileText className="w-4 h-4" />;
    case 'HelpCircle':
      return <HelpCircle className="w-4 h-4" />;
    case 'Download':
      return <Download className="w-4 h-4" />;
    case 'RefreshCw':
      return <RefreshCw className="w-4 h-4" />;
    case 'TrendingUp':
      return <TrendingUp className="w-4 h-4" />;
    case 'Sparkles':
      return <Sparkles className="w-4 h-4" />;
    case 'Mail':
      return <Mail className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
};

export interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenCommand: () => void;
  isAuthenticated: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  open,
  onOpenChange,
  onOpenCommand,
  isAuthenticated,
}) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right" className="p-0 flex flex-col w-full max-w-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 pr-12">
        <img
          src={logo}
          alt="Restaurant OS"
          className="h-10 w-auto object-contain cursor-pointer"
          onClick={() => handleNavigate('/')}
        />
      </div>

      {/* Top Search Button */}
      <div className="p-4 pb-2 border-b border-slate-100">
        <button
          type="button"
          onClick={() => {
            onOpenChange(false);
            onOpenCommand();
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-500 text-sm hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search docs & features...</span>
          </div>
          <kbd className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Scrollable Navigation Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Accordions for Multi-item Sections */}
        <Accordion type="single" className="space-y-2">
          {MAIN_NAV_ITEMS.map((item) => {
            if (!item.megaMenu) {
              return (
                <div key={item.key} className="py-1">
                  <Link
                    to={item.path || '/'}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-slate-900 hover:bg-orange-50 hover:text-[#FF7A00] transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              );
            }

            return (
              <AccordionItem key={item.key} value={item.key} className="border-0 shadow-none bg-transparent">
                <AccordionTrigger className="px-4 py-3 rounded-xl text-base font-bold text-slate-900 hover:bg-slate-50 hover:text-[#FF7A00]">
                  {item.label}
                </AccordionTrigger>
                <AccordionContent className="px-2 pt-1 pb-3 space-y-3">
                  {item.megaMenu.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {section.title}
                      </div>
                      <div className="space-y-1">
                        {section.items.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => onOpenChange(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-[#FF7A00] hover:bg-orange-50/70 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-[#FF7A00] shrink-0">
                                {renderMobileIcon(subItem.iconName)}
                              </span>
                              <span className="truncate">{subItem.label}</span>
                            </div>
                            {subItem.badge && (
                              <Badge variant="orange" size="sm">
                                {subItem.badge}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Pinned Bottom Dashboard / Auth CTA */}
      <div className="p-4 border-t border-slate-200/80 bg-white/95 backdrop-blur-sm space-y-2">
        {isAuthenticated ? (
          <Button
            variant="primary"
            fullWidth="full"
            size="lg"
            onClick={() => handleNavigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              fullWidth="full"
              size="lg"
              onClick={() => handleNavigate('/signup')}
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              fullWidth="full"
              size="default"
              onClick={() => handleNavigate('/login')}
            >
              Sign In
            </Button>
          </>
        )}
      </div>
    </Sheet>
  );
};
