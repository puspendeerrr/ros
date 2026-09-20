import React from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export interface ProsAndConsProps {
  pros: string[];
  cons: string[];
  prosTitle?: string;
  consTitle?: string;
}

export const ProsAndCons: React.FC<ProsAndConsProps> = ({
  pros,
  cons,
  prosTitle = 'Advantages',
  consTitle = 'Trade-offs & Considerations'
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      margin: '24px 0'
    }}>
      {/* Pros Block */}
      <div style={{
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <div style={{ color: '#166534', fontWeight: 800, fontSize: '15px', marginBottom: '12px' }}>
          {prosTitle}
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {pros.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#166534' }}>
              <CheckOutlined style={{ color: '#16A34A', marginTop: '3px' }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons Block */}
      <div style={{
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <div style={{ color: '#991B1B', fontWeight: 800, fontSize: '15px', marginBottom: '12px' }}>
          {consTitle}
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cons.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#991B1B' }}>
              <CloseOutlined style={{ color: '#DC2626', marginTop: '3px' }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
