import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography, Row, Col } from 'antd';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface LegalTemplateProps {
  documentTitle?: string;
  lastUpdated?: string;
  description?: string;
  sections?: LegalSection[];
}

export const LegalTemplate: React.FC<LegalTemplateProps> = ({
  documentTitle,
  lastUpdated,
  description,
  sections,
}) => {
  const location = useLocation();

  const isPrivacy = location.pathname.includes('privacy');
  const resolvedTitle = documentTitle || (isPrivacy ? 'Privacy Policy' : 'Terms of Service');
  const resolvedUpdated = lastUpdated || 'September 2026';
  const resolvedDescription = description || (isPrivacy 
    ? 'Official privacy policy detailing merchant data sovereignty, encryption, and guest privacy.'
    : 'Terms of service and service level agreement for Restaurant OS cloud platform.');

  const resolvedSections: LegalSection[] = sections || (isPrivacy ? [
    {
      id: 'data-collection',
      title: '1. Information We Collect',
      content: 'Restaurant OS collects essential contact information during merchant registration, and guest table interaction telemetry necessary to fulfill live table orders and generate digital receipts.'
    },
    {
      id: 'merchant-sovereignty',
      title: '2. Merchant Data Sovereignty',
      content: 'Unlike food delivery aggregators, Restaurant OS does not withhold customer contacts or monetize merchant dining data. You maintain complete ownership over your customer records, menus, and transaction history.'
    },
    {
      id: 'security-standards',
      title: '3. Data Protection and Encryption',
      content: 'All communication with Restaurant OS is encrypted in transit using TLS 1.3. Merchant databases and credentials are safeguarded following industry security standards.'
    }
  ] : [
    {
      id: 'acceptance',
      title: '1. Agreement to Terms',
      content: 'By accessing or using Restaurant OS, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
    },
    {
      id: 'merchant-conduct',
      title: '2. Merchant Account Responsibilities',
      content: 'Merchants are responsible for maintaining accurate dish pricing, applicable GST disclosures, allergen notices, and maintaining the confidentiality of staff access credentials.'
    },
    {
      id: 'commission-guarantee',
      title: '3. Zero-Commission SaaS Model',
      content: 'Restaurant OS charges zero platform commission on dining room orders or direct takeaway transactions. Payment gateway processing fees (e.g. UPI, card acquirers) are direct merchant relationships.'
    }
  ]);

  const legalNavLinks = [
    { label: 'Privacy Policy', path: '/legal/privacy-policy' },
    { label: 'Terms of Service', path: '/legal/terms-of-service' },
    { label: 'Security Policy', path: '/.well-known/security.txt', isExternal: true },
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title={`${resolvedTitle} | Restaurant OS Legal`}
        description={resolvedDescription}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Breadcrumbs />

        <Row gutter={[48, 36]} style={{ marginTop: '32px' }}>
          {/* Legal Navigation Sidebar */}
          <Col xs={24} md={6}>
            <div style={{ position: 'sticky', top: '90px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.6px', marginBottom: '16px' }}>
                LEGAL POLICIES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {legalNavLinks.map(link => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#F97316' : '#475569',
                        background: isActive ? '#FFF7ED' : 'transparent',
                        textDecoration: 'none',
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </Col>

          {/* Legal Document Content */}
          <Col xs={24} md={18}>
            <article style={{ maxWidth: '800px' }}>
              <header style={{ marginBottom: '32px' }}>
                <Title level={1} style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', margin: '0 0 12px 0' }}>
                  {resolvedTitle}
                </Title>
                <Paragraph style={{ color: '#64748B', fontSize: '14px' }}>
                  Last Updated: {resolvedUpdated}
                </Paragraph>
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {resolvedSections.map(sec => (
                  <section key={sec.id} id={sec.id}>
                    <Title level={2} style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                      {sec.title}
                    </Title>
                    <div style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7' }}>
                      {sec.content}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </Col>
        </Row>
      </div>
    </div>
  );
};
