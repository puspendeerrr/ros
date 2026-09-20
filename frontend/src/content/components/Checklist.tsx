import React, { useState } from 'react';
import { CheckSquareFilled, BorderOutlined } from '@ant-design/icons';

export interface ChecklistProps {
  items: string[];
  interactive?: boolean;
}

export const Checklist: React.FC<ChecklistProps> = ({ items, interactive = false }) => {
  const [checkedState, setCheckedState] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    if (!interactive) return;
    setCheckedState(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div style={{
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '10px',
      padding: '20px',
      margin: '20px 0'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, idx) => {
          const isChecked = checkedState[idx] || false;
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: interactive ? 'pointer' : 'default',
                userSelect: 'none'
              }}
            >
              {isChecked || !interactive ? (
                <CheckSquareFilled style={{ color: '#F97316', fontSize: '18px' }} />
              ) : (
                <BorderOutlined style={{ color: '#94A3B8', fontSize: '18px' }} />
              )}
              <span style={{
                fontSize: '14px',
                color: isChecked ? '#94A3B8' : '#1E293B',
                textDecoration: isChecked ? 'line-through' : 'none',
                lineHeight: '1.5'
              }}>
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
