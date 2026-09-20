/**
 * Layout Primitive: Grid
 * Responsive CSS Grid generator with pre-calibrated column and gap tokens.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 2 | 4 | 6 | 8 | 12;
  responsive?: boolean;
}

const colClasses: Record<NonNullable<GridProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-12',
};

const gapClasses: Record<NonNullable<GridProps['gap']>, string> = {
  2: 'gap-2',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
};

export const Grid: React.FC<GridProps> = ({
  cols = 3,
  gap = 6,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'grid w-full',
        colClasses[cols],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
