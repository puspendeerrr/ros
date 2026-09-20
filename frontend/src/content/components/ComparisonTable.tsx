import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ComparisonMatrixRow } from '../models/knowledge.model.js';

export interface ComparisonTableProps {
  competitorName: string;
  rows: ComparisonMatrixRow[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  competitorName,
  rows
}) => {
  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <CheckCircleOutlined style={{ color: '#16A34A', fontSize: '18px' }} />
      ) : (
        <CloseCircleOutlined style={{ color: '#DC2626', fontSize: '18px' }} />
      );
    }
    return <span style={{ fontWeight: 600 }}>{val}</span>;
  };

  return (
    <div style={{ margin: '28px 0', overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <thead style={{ background: '#0F172A', color: '#FFFFFF' }}>
          <tr>
            <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700 }}>Capability</th>
            <th style={{ padding: '14px 20px', textAlign: 'center', background: '#F97316', color: '#FFFFFF', fontWeight: 800 }}>
              Restaurant OS
            </th>
            <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 600, color: '#94A3B8' }}>
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              style={{
                borderBottom: '1px solid #E2E8F0',
                background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
              }}
            >
              <td style={{ padding: '14px 20px', color: '#1E293B', fontWeight: 600 }}>
                {row.capability}
              </td>
              <td style={{ padding: '14px 20px', textAlign: 'center', background: idx % 2 === 0 ? '#FFF7ED' : '#FFEDD5', color: '#C2410C' }}>
                {renderValue(row.restaurantOs)}
              </td>
              <td style={{ padding: '14px 20px', textAlign: 'center', color: '#64748B' }}>
                {renderValue(row.competitor)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
