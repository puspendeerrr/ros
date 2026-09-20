/**
 * Design System Breakpoint Tokens
 * Responsive screen dimensions matching standard modern devices.
 */

export const breakpoints = {
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops / Desktops
  xl: '1280px',  // Standard widescreen monitors
  '2xl': '1400px', // Large desktop canvas
} as const;

export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1360px',
  full: '100%',
} as const;

export type BreakpointTokens = typeof breakpoints;
