/**
 * Layout Primitive: SectionHeading
 * Consistent enterprise section headers with eyebrow pill, heading, and comfortable subtitle.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: 'left' | 'center' | 'right';
  badgeColor?: 'orange' | 'slate' | 'green' | 'blue';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  badgeColor = 'orange',
  className,
  ...props
}) => {
  const alignClass =
    align === 'center'
      ? 'text-center mx-auto items-center'
      : align === 'right'
        ? 'text-right ml-auto items-end'
        : 'text-left mr-auto items-start';

  const badgeColorClass =
    badgeColor === 'orange'
      ? 'bg-orange-50 text-orange-700 border-orange-200/80'
      : badgeColor === 'green'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
        : badgeColor === 'blue'
          ? 'bg-blue-50 text-blue-700 border-blue-200/80'
          : 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      className={cn(
        'flex flex-col max-w-3xl mb-12 sm:mb-16',
        alignClass,
        className
      )}
      {...props}
    >
      {eyebrow && (
        <div
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-4 shadow-xs',
            badgeColorClass
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {eyebrow}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};
