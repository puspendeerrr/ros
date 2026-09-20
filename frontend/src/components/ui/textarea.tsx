/**
 * UI Primitive: Textarea
 * Multiline text input with focus rings and responsive resizing.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
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
Textarea.displayName = 'Textarea';
