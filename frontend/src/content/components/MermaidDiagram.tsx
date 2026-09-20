import React from 'react';

export interface MermaidDiagramProps {
  chartDefinition: string;
  title?: string;
  svgContent?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chartDefinition,
  title,
  svgContent
}) => {
  return (
    <figure style={{
      margin: '28px 0',
      padding: '24px',
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      overflowX: 'auto',
      textAlign: 'center'
    }}>
      {title && (
        <figcaption style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#475569',
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {title}
        </figcaption>
      )}

      {svgContent ? (
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{ display: 'inline-block', maxWidth: '100%' }}
        />
      ) : (
        <div style={{
          fontFamily: 'monospace',
          fontSize: '12.5px',
          background: '#0F172A',
          color: '#38BDF8',
          padding: '16px 20px',
          borderRadius: '8px',
          textAlign: 'left',
          whiteSpace: 'pre-wrap',
          lineHeight: '1.6'
        }}>
          <div style={{ color: '#94A3B8', fontSize: '11px', marginBottom: '8px' }}>
            // Mermaid Diagram Source Definition
          </div>
          {chartDefinition}
        </div>
      )}
    </figure>
  );
};
