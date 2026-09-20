import React from 'react';

export interface ContentTableProps {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
  caption?: string;
}

export const ContentTable: React.FC<ContentTableProps> = ({ headers, rows, caption }) => {
  return (
    <div style={{ margin: '24px 0', overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '14px',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {caption && (
          <caption style={{
            captionSide: 'top',
            textAlign: 'left',
            fontWeight: 700,
            color: '#1E293B',
            marginBottom: '8px',
            fontSize: '14px'
          }}>
            {caption}
          </caption>
        )}
        <thead style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              style={{
                borderBottom: '1px solid #F1F5F9',
                background: rIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
              }}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} style={{ padding: '12px 16px', color: '#334155', verticalAlign: 'top' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
