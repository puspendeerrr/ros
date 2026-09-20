/**
 * UI Primitive: Input
 * Accessible form input with standard focus rings and error states.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'border-slate-200 hover:border-slate-300',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
