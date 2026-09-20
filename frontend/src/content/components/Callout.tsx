import React from 'react';
import {
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  BulbOutlined,
  FileTextOutlined
} from '@ant-design/icons';

export type CalloutType = 'info' | 'warning' | 'danger' | 'tip' | 'note';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const CALLOUT_STYLES: Record<CalloutType, { bg: string; border: string; text: string; iconColor: string; defaultTitle: string }> = {
  info: {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E40AF',
    iconColor: '#3B82F6',
    defaultTitle: 'Note'
  },
  tip: {
    bg: '#F0FDF4',
    border: '#BBF7D0',
    text: '#166534',
    iconColor: '#22C55E',
    defaultTitle: 'Tip & Best Practice'
  },
  warning: {
    bg: '#FFFBEB',
    border: '#FDE68A',
    text: '#92400E',
    iconColor: '#F59E0B',
    defaultTitle: 'Warning'
  },
  danger: {
    bg: '#FEF2F2',
    border: '#FECACA',
    text: '#991B1B',
    iconColor: '#EF4444',
    defaultTitle: 'Critical Requirement'
  },
  note: {
    bg: '#F8FAFC',
    border: '#E2E8F0',
    text: '#334155',
    iconColor: '#64748B',
    defaultTitle: 'Background Context'
  }
};

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  title,
  children
}) => {
  const style = CALLOUT_STYLES[type];

  const renderIcon = () => {
    switch (type) {
      case 'tip': return <BulbOutlined style={{ fontSize: '18px', color: style.iconColor }} />;
      case 'warning': return <WarningOutlined style={{ fontSize: '18px', color: style.iconColor }} />;
      case 'danger': return <CloseCircleOutlined style={{ fontSize: '18px', color: style.iconColor }} />;
      case 'note': return <FileTextOutlined style={{ fontSize: '18px', color: style.iconColor }} />;
      default: return <InfoCircleOutlined style={{ fontSize: '18px', color: style.iconColor }} />;
    }
  };

  return (
    <aside
      role="note"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '10px',
        padding: '16px 20px',
        margin: '20px 0',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start'
      }}
    >
      <div style={{ marginTop: '2px', flexShrink: 0 }}>
        {renderIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: style.text, marginBottom: '4px' }}>
          {title || style.defaultTitle}
        </div>
        <div style={{ fontSize: '14px', lineHeight: '1.6', color: style.text }}>
          {children}
        </div>
      </div>
    </aside>
  );
};
