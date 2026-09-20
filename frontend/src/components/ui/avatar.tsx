/**
 * UI Primitive: Avatar
 * Identity badge with image and fallback initials.
 */

import React, { useState } from 'react';
import { cn } from '../../design-system/utils.ts';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  default: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  size = 'default',
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 font-bold text-slate-700 select-none items-center justify-center',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="uppercase text-slate-600">{fallback.slice(0, 2)}</span>
      )}
    </div>
  );
};
