/**
 * Design System Z-Index Tokens
 * Strict stacking hierarchy preventing overlapping z-index conflicts.
 */

export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 100,
  sticky: 200,
  banner: 300,
  overlay: 400,
  modal: 500,
  popover: 600,
  toast: 700,
  tooltip: 800,
  max: 9999,
} as const;

export type ZIndexTokens = typeof zIndex;
