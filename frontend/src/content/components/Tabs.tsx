import React, { useState } from 'react';

export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, defaultActiveKey }) => {
  const [activeKey, setActiveKey] = useState<string>(defaultActiveKey || items[0]?.key || '');

  const activeItem = items.find(item => item.key === activeKey) || items[0];

  return (
    <div style={{ margin: '24px 0', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        background: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        overflowX: 'auto'
      }}>
        {items.map(item => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveKey(item.key)}
              style={{
                padding: '10px 18px',
                border: 'none',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#F97316' : '#64748B',
                fontWeight: isActive ? 750 : 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid #F97316' : '2px solid transparent',
                marginBottom: '-1px',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div style={{ padding: '20px', background: '#FFFFFF' }}>
        {activeItem?.content}
      </div>
    </div>
  );
};
