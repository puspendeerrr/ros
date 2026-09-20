import React, { useState } from 'react';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

export interface TerminalCommand {
  command: string;
  output?: string;
}

export interface TerminalProps {
  title?: string;
  commands: TerminalCommand[];
}

export const Terminal: React.FC<TerminalProps> = ({
  title = 'bash',
  commands
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (cmd: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // Ignore copy error
    }
  };

  return (
    <div style={{
      background: '#090D16',
      borderRadius: '10px',
      border: '1px solid #1E293B',
      margin: '24px 0',
      overflow: 'hidden',
      fontFamily: 'monospace'
    }}>
      {/* Terminal Titlebar Chrome */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px',
        background: '#0F172A',
        borderBottom: '1px solid #1E293B',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
        </div>
        <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '8px' }}>{title}</span>
      </div>

      {/* Terminal Body */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {commands.map((c, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontSize: '13.5px' }}>
                <span style={{ color: '#F97316', fontWeight: 700 }}>$</span>
                <span>{c.command}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(c.command, idx)}
                aria-label="Copy command"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copiedIdx === idx ? '#10B981' : '#64748B',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedIdx === idx ? <CheckOutlined /> : <CopyOutlined />}
              </button>
            </div>
            {c.output && (
              <pre style={{ margin: '6px 0 0 16px', color: '#94A3B8', fontSize: '12.5px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                {c.output}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
