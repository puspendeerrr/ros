/**
 * UI Primitive: Accordion
 * Accessible collapsible disclosure items with smooth chevron animations.
 */

import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../design-system/utils.ts';
import { ChevronDown } from '../../lib/icons.ts';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (id: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextType | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
}

export const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  defaultValue = [],
  className,
  children,
  ...props
}) => {
  const initialOpen = Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : [];
  const [openItems, setOpenItems] = useState<string[]>(initialOpen);

  const toggleItem = (id: string) => {
    if (type === 'single') {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    } else {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('space-y-3', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  return (
    <div
      data-value={value}
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white transition-all overflow-hidden shadow-xs',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { itemValue: value });
        }
        return child;
      })}
    </div>
  );
};

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemValue?: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  itemValue = '',
  className,
  children,
  ...props
}) => {
  const ctx = useContext(AccordionContext);
  const isOpen = ctx?.openItems.includes(itemValue) ?? false;

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={() => ctx?.toggleItem(itemValue)}
      className={cn(
        'flex w-full items-center justify-between p-5 text-left text-base font-bold text-slate-900 transition-all hover:text-[#FF7A00] select-none cursor-pointer',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4',
          isOpen && 'rotate-180 text-[#FF7A00]'
        )}
      />
    </button>
  );
};

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  itemValue?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemValue = '',
  className,
  children,
  ...props
}) => {
  const ctx = useContext(AccordionContext);
  const isOpen = ctx?.openItems.includes(itemValue) ?? false;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'px-5 pb-5 pt-0 text-sm text-slate-600 leading-relaxed animate-fadeIn',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
