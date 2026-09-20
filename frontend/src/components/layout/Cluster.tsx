/**
 * Layout Primitive: Cluster
 * Horizontal inline flex cluster with automatic wrapping for tags, badges, and action buttons.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 1 | 2 | 3 | 4 | 6 | 8;
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
}

const gapClasses: Record<NonNullable<ClusterProps['gap']>, string> = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
};

const alignClasses: Record<NonNullable<ClusterProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
};

const justifyClasses: Record<NonNullable<ClusterProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export const Cluster: React.FC<ClusterProps> = ({
  gap = 2,
  align = 'center',
  justify = 'start',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-wrap',
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
