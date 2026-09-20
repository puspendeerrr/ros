/**
 * UI Primitive: Command
 * Fast, keyboard-navigable command palette primitives.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';
import { Search } from '../../lib/icons.ts';

export const Command: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-slate-900 border border-slate-200/80 shadow-2xl',
      className
    )}
    {...props}
  />
);

export const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-slate-100 px-4">
    <Search className="mr-3 h-4 w-4 shrink-0 text-slate-400" />
    <input
      ref={ref}
      className={cn(
        'flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900',
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = 'CommandInput';

export const CommandList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden p-2 space-y-1', className)} {...props} />
);

export const CommandEmpty: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('py-8 text-center text-sm text-slate-500', className)} {...props} />
);

export const CommandGroup: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { heading?: string }
> = ({ className, heading, children, ...props }) => (
  <div className={cn('overflow-hidden p-1 text-slate-900', className)} {...props}>
    {heading && (
      <div className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        {heading}
      </div>
    )}
    {children}
  </div>
);

export const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean }
>(({ className, disabled = false, ...props }, ref) => (
  <div
    ref={ref}
    aria-disabled={disabled}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      className
    )}
    {...props}
  />
));
CommandItem.displayName = 'CommandItem';

export const CommandShortcut: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span
    className={cn('ml-auto text-xs tracking-widest text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200', className)}
    {...props}
  />
);
