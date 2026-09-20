/**
 * UI Primitive: Select
 * Clean accessible dropdown select with chevron indicator.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';
import { ChevronDown } from '../../lib/icons.ts';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error = false, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            'flex h-10 w-full appearance-none rounded-xl border bg-white px-3.5 py-2 pr-10 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
            error
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-slate-200 hover:border-slate-300',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      </div>
    );
  }
);
Select.displayName = 'Select';
