/**
 * UI Primitive: Skeleton
 * Accessible placeholder indicator for content loading states.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200/70', className)}
      {...props}
    />
  );
};
