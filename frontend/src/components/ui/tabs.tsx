/**
 * UI Primitive: Tabs
 * Accessible tabbed content switching.
 */

import React, { createContext, useContext } from 'react';
import { cn } from '../../design-system/utils.ts';

interface TabsContextType {
  value: string;
  onValueChange: (val: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, className, children, ...props }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      'inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-500 border border-slate-200/80',
      className
    )}
    {...props}
  />
);

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children, ...props }) => {
  const ctx = useContext(TabsContext);
  const isActive = ctx?.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx?.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        isActive
          ? 'bg-white text-slate-900 shadow-xs'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, className, children, ...props }) => {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn('mt-4 focus-visible:outline-none animate-fadeIn', className)}
      {...props}
    >
      {children}
    </div>
  );
};
