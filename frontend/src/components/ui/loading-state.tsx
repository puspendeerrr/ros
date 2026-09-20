/**
 * UI Primitive: LoadingState
 * Full container loading skeleton or spinner block.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';
import { Spinner } from './spinner.tsx';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white/60 min-h-[200px]',
        className
      )}
      {...props}
    >
      <Spinner size="lg" />
      {message && <p className="mt-3 text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );
};
