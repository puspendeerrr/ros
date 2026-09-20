/**
 * Layout Primitive: Stack
 * Vertical flex stack ensuring consistent rhythm between elements.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
}

const gapClasses: Record<NonNullable<StackProps['gap']>, string> = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
};

const alignClasses: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClasses: Record<NonNullable<StackProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export const Stack: React.FC<StackProps> = ({
  gap = 4,
  align = 'stretch',
  justify = 'start',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
