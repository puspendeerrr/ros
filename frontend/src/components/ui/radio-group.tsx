/**
 * UI Primitive: RadioGroup
 * Accessible single-choice option group.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div role="radiogroup" className={cn('space-y-3', className)}>
      {options.map((opt) => {
        const id = `${name}-${opt.value}`;
        const isSelected = value === opt.value;

        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={cn(
              'flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none',
              isSelected
                ? 'border-[#FF7A00] bg-orange-50/50 shadow-xs ring-1 ring-[#FF7A00]'
                : 'border-slate-200 hover:border-slate-300 bg-white',
              opt.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
          >
            <div className="relative flex items-center pt-0.5">
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={isSelected}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
                className="peer h-4 w-4 appearance-none rounded-full border border-slate-300 text-[#FF7A00] checked:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-1 cursor-pointer"
              />
              <span className="pointer-events-none absolute left-1 top-1.5 h-2 w-2 rounded-full bg-[#FF7A00] opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold text-slate-900 block">{opt.label}</span>
              {opt.description && (
                <span className="text-xs text-slate-500 block mt-0.5 leading-relaxed">
                  {opt.description}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};
