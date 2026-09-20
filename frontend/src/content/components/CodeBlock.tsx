import React, { useState } from 'react';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'bash',
  filename,
  showLineNumbers = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div style={{
      background: '#0F172A',
      borderRadius: '10px',
      border: '1px solid #1E293B',
      margin: '20px 0',
      overflow: 'hidden',
      fontFamily: 'monospace'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: '#1E293B',
        borderBottom: '1px solid #334155',
        fontSize: '12px',
        color: '#94A3B8'
      }}>
        <span>{filename || language.toUpperCase()}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          style={{
            background: 'transparent',
            border: 'none',
            color: copied ? '#10B981' : '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px'
          }}
        >
          {copied ? <CheckOutlined /> : <CopyOutlined />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      <pre style={{
        margin: 0,
        padding: '16px',
        overflowX: 'auto',
        fontSize: '13.5px',
        lineHeight: '1.6',
        color: '#E2E8F0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <code>
          {lines.map((line, idx) => (
            <div key={idx} style={{ display: 'flex' }}>
              {showLineNumbers && (
                <span style={{
                  width: '36px',
                  userSelect: 'none',
                  color: '#475569',
                  textAlign: 'right',
                  paddingRight: '16px'
                }}>
                  {idx + 1}
                </span>
              )}
              <span>{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};
