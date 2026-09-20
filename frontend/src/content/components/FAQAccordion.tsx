import React from 'react';
import { Collapse } from 'antd';
import type { FAQQuestionAnswer } from '../models/knowledge.model.js';

export interface FAQAccordionProps {
  faqs: FAQQuestionAnswer[];
  injectSchema?: boolean;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs, injectSchema = false }) => {
  const items = faqs.map((faq, idx) => ({
    key: String(idx),
    label: <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>{faq.question}</span>,
    children: <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>{faq.answer}</div>
  }));

  const schemaJson = injectSchema ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  } : null;

  return (
    <div style={{ margin: '28px 0' }}>
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}
      <Collapse
        items={items}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '10px'
        }}
      />
    </div>
  );
};
