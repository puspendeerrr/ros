/**
 * Data Component: DataCard & MetricCard
 * Reusable analytical cards for dashboard metrics and operations.
 */

import React from 'react';
import { cn } from '../../design-system/utils.ts';
import { Card } from '../ui/card.tsx';
import { TrendingUp } from '../../lib/icons.ts';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: string | number;
  trend?: 'up' | 'down' | 'neutral';
  timeframe?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  trend = 'up',
  timeframe = 'vs last 30d',
  icon,
  className,
  ...props
}) => {
  const isUp = trend === 'up';

  return (
    <Card hoverable className={cn('p-6 bg-white', className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF7A00] flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md',
              isUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
            )}
          >
            <TrendingUp className={cn('w-3 h-3', !isUp && 'rotate-180')} />
            {change}
          </span>
          <span className="text-slate-400 font-medium">{timeframe}</span>
        </div>
      )}
    </Card>
  );
};

export const DataCard = MetricCard;
export type DataCardProps = MetricCardProps;

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  badge,
  className,
  ...props
}) => {
  return (
    <Card className={cn('p-6 bg-white', className)} {...props}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-600">{title}</h4>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-black text-slate-900">{value}</div>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
    </Card>
  );
};
