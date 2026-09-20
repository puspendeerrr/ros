import React from 'react';

export interface MathBlockProps {
  formula: string;
  explanation?: string;
  name?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({
  formula,
  explanation,
  name
}) => {
  return (
    <div style={{
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '10px',
      padding: '20px 24px',
      margin: '24px 0',
      textAlign: 'center'
    }}>
      {name && (
        <div style={{
          fontSize: '12px',
          fontWeight: 750,
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px'
        }}>
          {name}
        </div>
      )}

      <div style={{
        fontFamily: 'serif',
        fontSize: '20px',
        fontWeight: 600,
        color: '#0F172A',
        letterSpacing: '0.5px',
        padding: '12px 0'
      }}>
        {formula}
      </div>

      {explanation && (
        <div style={{
          fontSize: '13px',
          color: '#64748B',
          marginTop: '8px',
          fontStyle: 'italic'
        }}>
          {explanation}
        </div>
      )}
    </div>
  );
};
