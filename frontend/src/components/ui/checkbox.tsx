/**
 * UI Primitive: Checkbox
 * Accessible checkbox with custom styled check state.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';
import { Check } from '../../lib/icons.ts';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const internalId = id || generatedId;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center pt-0.5">
          <input
            id={internalId}
            ref={ref}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              'peer h-4 w-4 shrink-0 rounded-md border border-slate-300 bg-white text-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-[#FF7A00] checked:border-[#FF7A00] cursor-pointer transition-colors',
              className
            )}
            {...props}
          />
          <Check className="pointer-events-none absolute left-0.5 top-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]" />
        </div>
        {(label || description) && (
          <label htmlFor={internalId} className="cursor-pointer select-none text-sm">
            {label && <span className="font-medium text-slate-900 block">{label}</span>}
            {description && <span className="text-xs text-slate-500 block mt-0.5">{description}</span>}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
