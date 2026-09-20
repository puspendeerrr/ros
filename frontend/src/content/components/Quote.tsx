import React from 'react';

export interface QuoteProps {
  quote: string;
  authorName: string;
  authorTitle?: string;
  authorAvatarUrl?: string;
  sourceUrl?: string;
}

export const Quote: React.FC<QuoteProps> = ({
  quote,
  authorName,
  authorTitle,
  authorAvatarUrl,
  sourceUrl
}) => {
  return (
    <blockquote style={{
      margin: '28px 0',
      padding: '24px',
      background: '#F8FAFC',
      borderLeft: '4px solid #F97316',
      borderRadius: '0 10px 10px 0'
    }}>
      <p style={{
        fontSize: '16px',
        fontStyle: 'italic',
        lineHeight: '1.7',
        color: '#1E293B',
        margin: '0 0 16px 0'
      }}>
        “{quote}”
      </p>

      <footer style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {authorAvatarUrl && (
          <img
            src={authorAvatarUrl}
            alt={authorName}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div>
          <cite style={{ fontStyle: 'normal', fontWeight: 750, fontSize: '14px', color: '#0F172A', display: 'block' }}>
            {authorName}
          </cite>
          {authorTitle && (
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              {authorTitle}
            </span>
          )}
          {sourceUrl && (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#F97316', display: 'block', marginTop: '2px' }}>
              Source Link
            </a>
          )}
        </div>
      </footer>
    </blockquote>
  );
};
