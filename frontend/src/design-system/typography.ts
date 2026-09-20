/**
 * Design System Typography Tokens
 * Standardized type hierarchy calibrated for enterprise clarity.
 */

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    display: 'clamp(2.5rem, 2rem + 3vw, 4rem)',      // 40px - 64px
    h1: 'clamp(2rem, 1.8rem + 1.5vw, 3rem)',          // 32px - 48px
    h2: 'clamp(1.75rem, 1.5rem + 1vw, 2.25rem)',      // 28px - 36px
    h3: '1.5rem',                                     // 24px
    h4: '1.25rem',                                    // 20px
    bodyLg: '1.125rem',                               // 18px
    body: '1rem',                                     // 16px
    bodySm: '0.875rem',                               // 14px
    caption: '0.75rem',                               // 12px
    label: '0.6875rem',                               // 11px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.15',
    snug: '1.3',
    normal: '1.5',
    relaxed: '1.625',
    loose: '1.75',
  },
  letterSpacing: {
    tighter: '-0.04em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export type TypographyTokens = typeof typography;
