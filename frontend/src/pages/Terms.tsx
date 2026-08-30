import React from 'react';
import { Typography, Alert } from 'antd';
import { SEOManager } from '../components/SEOManager.js';

const { Title, Paragraph } = Typography;

export const Terms: React.FC = () => {
  return (
    <div style={{ padding: '100px 24px', background: '#FFFFFF' }}>
      <SEOManager 
        title="Terms of Service" 
        description="Review the terms and conditions governing the Restaurant OS platform. Understand merchant responsibilities, account management, billing, and cancellations." 
      />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Title level={1} style={{ fontSize: '42px', fontWeight: 900, color: '#0F172A', letterSpacing: '-1.5px', marginBottom: '8px' }}>
          Terms of Service
        </Title>
        <Paragraph style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px' }}>
          Last updated: August 30, 2026
        </Paragraph>

        <Alert 
          message="Legal Agreement Notice"
          description="By creating a merchant account, printing QR stands, or uploading menus, you agree to comply fully with these terms. Please read all clauses before deploying to your restaurant floor." 
          type="warning"
          showIcon
          style={{ borderRadius: '14px', marginBottom: '40px', padding: '16px' }}
        />

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          1. Acceptance of Terms
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          This Terms of Service document governs your access to and usage of the Restaurant OS platforms, including hosted consoles and public menu portals. By creating a Merchant account, you accept these terms in full.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          2. Eligibility
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          You must be at least 18 years old and possess the legal capacity to enter binding agreements for your restaurant or business entity to create a Restaurant OS account.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          3. Account Registration & Credentials
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Merchants must register with accurate, complete, and current info. You are fully responsible for preserving the confidentiality of your credentials and all actions taken under your account.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          4. Restaurant Responsibilities
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Merchants assume sole responsibility for the operational parameters of their dining rooms, customer interactions, menu item safety, pricing updates, and conformity with local hospitality regulations.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          5. User Conduct
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          You agree not to bypass security configurations, inject malicious SQL strings, scrape public menu targets in bulk, or engage in actions that degrade platform network load speeds.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          6. Menu Content Ownership
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Merchants retain full copyright ownership of all menu items, descriptions, and uploaded photographs. By publishing, you grant Restaurant OS a non-exclusive license to host and render these assets.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          7. Intellectual Property
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          All platform interfaces, proprietary source codes, logos, trademarks, database patterns, and console layouts are the exclusive property of Restaurant OS.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          8. Service Availability
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          While we target 99.9% edge system uptime, we do not guarantee uninterrupted availability during system maintenance, cloud outages, or local network disruptions.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          9. Pricing Plans
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Our packages are detailed on our official pricing page. We reserve the right to modify subscription prices, introducing notice periods before any billing adjustments apply.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          10. Billing and Payments
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Paid packages are billed on a recurring monthly cycle. Merchants must maintain active credit card coordinates on their billing profile.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          11. Subscriptions Auto-Renewal
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Paid plans renew automatically at the end of each billing cycle unless you disable renewal or cancel from your dashboard console.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          12. Cancellation Policy
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          You can cancel your paid subscription plan at any time. Your premium features will remain active until the end of your current paid billing period.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          13. Refund Policy
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Subscription payments are non-refundable unless requested within our 14-day money-back guarantee window following initial plan upgrade.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          14. Limitation of Liability
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Restaurant OS is not liable for indirect, incidental, or consequential damages—including loss of restaurant revenues, profits, customer goodwill, or data.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          15. Warranty Disclaimer
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          The services are provided on an "as-is" and "as-available" basis, without warranties of any kind, whether express or implied, including merchantability.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          16. Indemnification
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          You agree to defend, indemnify, and hold harmless Restaurant OS from any claims, damages, liabilities, or expenses arising from your usage of our tools or menu content.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          17. Account Suspension
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          We reserve the right to suspend or block merchant console access in cases of unpaid invoices, terms violations, or legal requests.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          18. Termination
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Both parties may terminate these terms. Upon account termination, your data is marked for permanent deletion in our systems.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          19. Governing Law
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          These Terms of Service are governed by and construed in accordance with the laws of India, without regard to conflicts of law provisions.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          20. Dispute Resolution
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          Any controversies or legal claims arising from these terms will be settled exclusively through binding arbitration in Delhi NCR, India.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          21. Changes to Terms
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          We modify these terms as our services evolve. The last updated timestamp will always reflect the latest active version.
        </Paragraph>

        <Title level={2} style={{ fontSize: '20px', fontWeight: 800, marginTop: '32px', marginBottom: '12px' }}>
          22. Contact Information
        </Title>
        <Paragraph style={{ color: '#475569', fontSize: '14.5px', lineHeight: '1.75' }}>
          For inquiries or notices regarding these terms:
          <br />
          Email: <a href="mailto:support@ros.algorithyum.in">support@ros.algorithyum.in</a>
        </Paragraph>
      </div>
    </div>
  );
};
