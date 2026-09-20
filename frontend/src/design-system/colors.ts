/**
 * Design System Color Tokens
 * Centralized palette definitions mapped to CSS variables and brand standards.
 */

export const colors = {
  // Brand Primary (Orange)
  primary: {
    DEFAULT: 'var(--primary, #FF7A00)',
    hover: '#EA580C',
    active: '#C2410C',
    subtle: '#FFF7ED',
    foreground: 'var(--primary-foreground, #FFFFFF)',
  },

  // Surfaces & Backgrounds
  background: 'var(--background, #FFFFFF)',
  surface: {
    DEFAULT: 'var(--card, #F8FAFC)',
    elevated: '#FFFFFF',
    muted: 'var(--muted, #F1F5F9)',
    dark: '#0F172A',
  },

  // Typography
  text: {
    primary: 'var(--foreground, #0F172A)',
    secondary: 'var(--muted-foreground, #475569)',
    muted: '#64748B',
    inverted: '#FFFFFF',
  },

  // Borders & Dividers
  border: {
    DEFAULT: 'var(--border, #E2E8F0)',
    muted: '#F1F5F9',
    focus: '#FF7A00',
  },

  // Semantic Status Colors
  success: {
    DEFAULT: '#16A34A',
    surface: '#DCFCE7',
    text: '#15803D',
  },
  warning: {
    DEFAULT: '#F59E0B',
    surface: '#FEF3C7',
    text: '#B45309',
  },
  destructive: {
    DEFAULT: '#DC2626',
    surface: '#FEE2E2',
    text: '#B91C1C',
  },
  info: {
    DEFAULT: '#2563EB',
    surface: '#DBEAFE',
    text: '#1D4ED8',
  },
} as const;

export type ColorTokens = typeof colors;
