/**
 * UI Primitive: Spinner
 * Animated loading spinner indicator.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';
import { Loader2 } from '../../lib/icons.ts';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
  color?: 'primary' | 'white' | 'muted';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  default: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const colorClasses = {
  primary: 'text-[#FF7A00]',
  white: 'text-white',
  muted: 'text-slate-400',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'default',
  color = 'primary',
  className,
  ...props
}) => {
  return (
    <div role="status" aria-label="Loading" className={cn('inline-flex items-center justify-center', className)} {...props}>
      <Loader2 className={cn('animate-spin', sizeClasses[size], colorClasses[color])} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
