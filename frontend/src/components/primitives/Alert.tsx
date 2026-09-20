/**
 * Component Layer: Alert
 * Feedback banner with title, description, and status indicator.
 */

import React from 'react';
import { cva, type VariantProps } from '../../design-system/cva.ts';
import { cn } from '../../design-system/utils.ts';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from '../../lib/icons.ts';

export const alertVariants = cva(
  'relative w-full rounded-2xl border p-4 text-sm flex items-start gap-3.5 shadow-xs',
  {
    variants: {
      variant: {
        default: 'bg-white text-slate-900 border-slate-200',
        info: 'bg-blue-50/70 text-blue-900 border-blue-200/80 [&>svg]:text-blue-600',
        success: 'bg-emerald-50/70 text-emerald-900 border-emerald-200/80 [&>svg]:text-emerald-600',
        warning: 'bg-amber-50/70 text-amber-900 border-amber-200/80 [&>svg]:text-amber-600',
        destructive: 'bg-red-50/70 text-red-900 border-red-200/80 [&>svg]:text-red-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconMap = {
  default: <Info className="w-5 h-5 shrink-0 text-slate-500 mt-0.5" />,
  info: <Info className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />,
  success: <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />,
  warning: <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />,
  destructive: <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  className,
  children,
  ...props
}) => {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {iconMap[variant || 'default']}
      <div className="flex-1">
        {title && <h5 className="font-bold tracking-tight text-current mb-0.5">{title}</h5>}
        <div className="text-xs sm:text-sm text-current/90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
