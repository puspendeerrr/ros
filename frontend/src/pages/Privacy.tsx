import React from 'react';
import { Typography, Alert } from 'antd';
import { SEOManager } from '../components/SEOManager.js';

const { Title, Paragraph } = Typography;

export const Privacy: React.FC = () => {
  return (
    <div style={{ padding: '100px 24px', background: '#FFFFFF' }}>
      <SEOManager 
        title="Privacy Policy" 
        description="Review the Restaurant OS privacy policies. Learn about how we secure restaurant profile parameters, database credentials, and session tokens." 
      />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Title level={1} style={{ fontSize: '42px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1.5px', marginBottom: '8px' }}>
          Privacy Policy
        </Title>
        <Paragraph style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px' }}>
          Last updated: August 30, 2026
        </Paragraph>

        <Alert 
          message="Important Commitment to Data Security"
          description="At Restaurant OS, we protect your business metrics and customer data. We do not sell restaurant transaction metrics, menus, or customer telemetry to advertising platforms." 
          type="info"
          showIcon
          style={{ borderRadius: '14px', marginBottom: '40px', padding: '16px' }}
        />

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          1. Introduction
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          This Privacy Policy outlines how Restaurant OS ("we", "our", "us") collects, secures, processes, and stores data from restaurant owners ("Merchants") and their end customers who access digital menus ("Guests").
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          2. Information We Collect
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          We collect Merchant data during account creation and setup, alongside Guest telemetry during menu scans.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          3. Personal Information
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Merchant personal information includes your legal name, email addresses, billing addresses, passwords hashes, and verification phone numbers.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          4. Restaurant Data
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          This includes parameters required to display menus: restaurant names, operating hours, geolocation, category names, descriptions, pricing matrices, and cover assets.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          5. Usage Data
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          We track scan logs, menu view counts, loading performance times, and browser client types to generate dashboard statistics for Merchants.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          6. Cookies Policy
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          We utilize essential cookies to manage authenticated sessions, prevent cross-site request forgery, and keep restaurant layout settings.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          7. Authentication Security
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Merchant sessions are protected using secure HTTP-only cookie tokens that prevent JavaScript accessibility, mitigating cross-site scripting (XSS) exposures.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          8. Data Storage
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Your profiles are saved inside encrypted databases hosted in secure cloud availability zones with automated continuous backups.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          9. Security Measures
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          We enforce Secure Sockets Layer (SSL) transport encryption on all API pathways, strict CORS controls, and regular vulnerability audits.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          10. Third-Party Services
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Data is shared with hosting infrastructure partners and mail delivery platforms solely to maintain operations and email notifications.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          11. Analytics Integration
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          We aggregate page load metrics anonymously to optimize response times and generate dashboard metrics.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          12. Payment Processing
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Payment features run directly on secure payment gateways. Restaurant OS never stores card digits, CVVs, or account credentials.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          13. Email Communications
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          We issue system emails for password updates, email validation, and critical billing statements. You can opt out of newsletter lists at any time.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          14. User Rights
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          You possess the right to audit, correct, limit, or export your restaurant profile parameters in structured JSON formats.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          15. Data Retention
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Merchant configuration files and menu lists are retained as long as your workspace account remains active.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          16. Account Deletion
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          You can request account termination by opening a support ticket. All related profile entries, databases, and assets are permanently purged within 30 business days.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          17. Children's Privacy
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Our dashboard software is not intended for users under the age of 18. We do not intentionally compile minor records.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          18. International Users
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          By accessing the console, you recognize that data is saved and processed globally in accordance with standard data privacy clauses.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          19. Changes to Policy
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          We modify this Privacy Policy as our features grow. We will post notification alerts inside the merchant dashboard whenever updates are made.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          20. Contact Information
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          For inquiries regarding telemetry, privacy policies, or details retrieval:
          <br />
          Email: <a href="mailto:support@ros.algorithyum.in">support@ros.algorithyum.in</a>
        </Paragraph>
      </div>
    </div>
  );
};
