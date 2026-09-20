import React from 'react';

export type BadgeVariant = 'orange' | 'blue' | 'green' | 'red' | 'gray' | 'purple';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const BADGE_COLORS: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  orange: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  blue: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  green: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  red: { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  gray: { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
  purple: { bg: '#FAF5FF', text: '#7E22CE', border: '#E9D5FF' }
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  size = 'md'
}) => {
  const c = BADGE_COLORS[variant];
  const isSm = size === 'sm';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: isSm ? '2px 8px' : '4px 10px',
      borderRadius: '6px',
      fontSize: isSm ? '11px' : '12px',
      fontWeight: 750,
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      letterSpacing: '0.02em',
      textTransform: 'uppercase'
    }}>
      {children}
    </span>
  );
};
