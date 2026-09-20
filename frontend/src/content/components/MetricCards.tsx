import React from 'react';

export interface MetricCardItem {
  value: string;
  label: string;
  subtext?: string;
}

export interface MetricCardsProps {
  metrics: MetricCardItem[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
      gap: '16px',
      margin: '24px 0'
    }}>
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#F97316', marginBottom: '4px' }}>
            {metric.value}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {metric.label}
          </div>
          {metric.subtext && (
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
              {metric.subtext}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
