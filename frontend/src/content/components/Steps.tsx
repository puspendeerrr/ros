import React from 'react';

export interface StepItem {
  title: string;
  description: React.ReactNode;
}

export interface StepsProps {
  steps: StepItem[];
}

export const Steps: React.FC<StepsProps> = ({ steps }) => {
  return (
    <div style={{ margin: '24px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {steps.map((step, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#0F172A',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            {idx + 1}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '15.5px', fontWeight: 750, color: '#0F172A' }}>
              {step.title}
            </h4>
            <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
              {step.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
