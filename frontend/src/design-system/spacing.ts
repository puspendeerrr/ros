/**
 * Design System Spacing Tokens
 * Strict 8-point geometric scale eliminating arbitrary offsets.
 */

export const spacing = {
  0: '0px',
  1: '4px',    // 0.5 * 8
  2: '8px',    // 1 * 8
  3: '12px',   // 1.5 * 8
  4: '16px',   // 2 * 8
  6: '24px',   // 3 * 8
  8: '32px',   // 4 * 8
  12: '48px',  // 6 * 8
  16: '64px',  // 8 * 8
  24: '96px',  // 12 * 8
  32: '128px', // 16 * 8
} as const;

export type SpacingTokens = typeof spacing;
