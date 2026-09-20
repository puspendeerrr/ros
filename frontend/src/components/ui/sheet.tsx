/**
 * UI Primitive: Sheet
 * Accessible slide-over drawer panel for mobile navigation, side filters, and configuration.
 */

import React, { useEffect } from 'react';
import { cn } from '../../design-system/utils.ts';
import { X } from '../../lib/icons.ts';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
  className?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  side = 'right',
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onOpenChange(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const sideClasses = {
    left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r',
    right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l',
    top: 'inset-x-0 top-0 w-full border-b',
    bottom: 'inset-x-0 bottom-0 w-full border-t',
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'fixed z-50 bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out border-slate-200 overflow-y-auto',
          sideClasses[side],
          className
        )}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-2 text-left mb-6', className)} {...props} />
);

export const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-bold tracking-tight text-slate-900', className)} {...props} />
);

export const SheetDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm text-slate-500 leading-relaxed', className)} {...props} />
);
