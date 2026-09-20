import React from 'react';

export interface TimelineItem {
  stageNumber?: number | string;
  title: string;
  description: string;
  badge?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div style={{ margin: '28px 0', paddingLeft: '8px' }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: idx === items.length - 1 ? 0 : '24px' }}>
          {/* Vertical Connecting Line */}
          {idx !== items.length - 1 && (
            <div style={{
              position: 'absolute',
              left: '15px',
              top: '32px',
              bottom: 0,
              width: '2px',
              background: '#E2E8F0'
            }} />
          )}

          {/* Circle Node */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#FFF7ED',
            border: '2px solid #F97316',
            color: '#F97316',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            zIndex: 1
          }}>
            {item.stageNumber || idx + 1}
          </div>

          {/* Content */}
          <div style={{ flex: 1, paddingTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontWeight: 750, fontSize: '15px', color: '#0F172A' }}>{item.title}</span>
              {item.badge && (
                <span style={{
                  fontSize: '11px',
                  background: '#F1F5F9',
                  color: '#475569',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  {item.badge}
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
