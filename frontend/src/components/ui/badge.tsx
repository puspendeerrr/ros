/**
 * UI Primitive: Badge
 * Status indicators, tags, and category pills using CVA.
 */

import React from 'react';
import { type VariantProps } from '../../design-system/cva.ts';
import { cn } from '../../design-system/utils.ts';
import { badgeVariants } from './badge.variants.ts';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  size,
  dot = false,
  children,
  ...props
}) => {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {children}
    </div>
  );
};
