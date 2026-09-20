/**
 * Class Variance Authority (CVA) Implementation
 * Type-safe variant management for design system components without external dependencies.
 */

import { cn, type ClassValue } from './utils.ts';

export type ConfigSchema = Record<string, Record<string, ClassValue>>;

export type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: keyof T[Variant] | null | undefined;
};

export interface CVAConfig<T extends ConfigSchema> {
  variants?: T;
  defaultVariants?: ConfigVariants<T>;
  compoundVariants?: Array<ConfigVariants<T> & { className?: ClassValue; class?: ClassValue }>;
}

export type VariantProps<T extends (...args: any) => any> = T extends (props?: infer P) => any
  ? P extends Record<string, unknown>
    ? Omit<{ [K in keyof P]?: P[K] }, 'className' | 'class'>
    : never
  : never;

export function cva<T extends ConfigSchema>(
  base?: ClassValue,
  config?: CVAConfig<T>
) {
  return (props?: ConfigVariants<T> & { className?: ClassValue; class?: ClassValue }): string => {
    if (!config?.variants) {
      return cn(base, props?.className, props?.class);
    }

    const { variants, defaultVariants, compoundVariants } = config;

    const variantClasses = Object.keys(variants).map((variantName) => {
      const variantProp = props?.[variantName];
      const defaultVariantProp = defaultVariants?.[variantName];
      const value = variantProp !== undefined ? variantProp : defaultVariantProp;

      if (value === null || value === undefined) return null;

      return variants[variantName]?.[value as string] || null;
    });

    const compoundClasses = compoundVariants?.map((compound) => {
      const { className, class: compoundClass, ...matcher } = compound;
      const matches = Object.entries(matcher).every(([key, value]) => {
        const propValue = props?.[key] !== undefined ? props[key] : defaultVariants?.[key];
        return propValue === value;
      });

      return matches ? cn(className, compoundClass) : null;
    });

    return cn(
      base,
      ...variantClasses,
      compoundClasses,
      props?.className,
      props?.class
    );
  };
}
