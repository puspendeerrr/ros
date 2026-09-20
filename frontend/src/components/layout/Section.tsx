/**
 * Layout Primitive: Section
 * Enforces standardized vertical section spacing on the 8-point system.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'surface' | 'muted' | 'dark';
}

const spacingClasses: Record<NonNullable<SectionProps['spacing']>, string> = {
  none: 'py-0',
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-24',
  lg: 'py-20 sm:py-32',
  xl: 'py-24 sm:py-40',
};

const variantClasses: Record<NonNullable<SectionProps['variant']>, string> = {
  default: 'bg-white text-slate-900',
  surface: 'bg-slate-50 text-slate-900 border-y border-slate-200/80',
  muted: 'bg-slate-100 text-slate-900',
  dark: 'bg-slate-950 text-white border-t border-slate-900',
};

export const Section: React.FC<SectionProps> = ({
  spacing = 'md',
  variant = 'default',
  className,
  children,
  ...props
}) => {
  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        spacingClasses[spacing],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
