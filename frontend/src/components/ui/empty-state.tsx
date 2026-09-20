/**
 * UI Primitive: EmptyState
 * Reusable zero-data feedback view with illustration, title, description, and primary CTA.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 mb-4">
          {icon}
        </div>
      )}
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mt-1 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
