/**
 * Button Variants Definition
 */

import { cva } from '../../design-system/cva.ts';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-[#FF7A00] text-white hover:bg-[#EA580C] shadow-sm hover:shadow-md hover:shadow-orange-500/15 border border-transparent',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200/80',
        outline:
          'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs',
        ghost:
          'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
        link:
          'text-[#FF7A00] underline-offset-4 hover:underline p-0 h-auto font-medium',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-xs border border-transparent',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base rounded-xl',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);
