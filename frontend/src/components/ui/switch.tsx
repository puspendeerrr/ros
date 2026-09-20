/**
 * UI Primitive: Switch
 * Accessible animated toggle switch.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  description,
  className,
  id,
}) => {
  const generatedId = React.useId();
  const internalId = id || generatedId;

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {(label || description) && (
        <label htmlFor={internalId} className="cursor-pointer select-none">
          {label && <span className="text-sm font-medium text-slate-900 block">{label}</span>}
          {description && <span className="text-xs text-slate-500 block mt-0.5">{description}</span>}
        </label>
      )}
      <button
        id={internalId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-[#FF7A00]' : 'bg-slate-200'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
