/**
 * Badge Variants Definition
 */

import { cva } from '../../design-system/cva.ts';

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-white',
        secondary:
          'border-transparent bg-slate-100 text-slate-900',
        outline:
          'border border-slate-200 text-slate-700 bg-white',
        orange:
          'border-orange-200/80 bg-orange-50 text-orange-700',
        success:
          'border-emerald-200/80 bg-emerald-50 text-emerald-700',
        warning:
          'border-amber-200/80 bg-amber-50 text-amber-800',
        destructive:
          'border-red-200/80 bg-red-50 text-red-700',
        enterprise:
          'border-purple-200/80 bg-purple-50 text-purple-700 font-bold',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        default: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
