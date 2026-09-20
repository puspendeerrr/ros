import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Table, Card, Button, Collapse, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { COMPARISONS_REGISTRY } from '../config/comparisons.config.js';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const ComparisonTemplate: React.FC<{ forcedSlug?: string }> = ({ forcedSlug }) => {
  const params = useParams<{ slug: string }>();
  const slug = forcedSlug || params.slug || 'vs-paper-menus';
  const navigate = useNavigate();

  const comparison = COMPARISONS_REGISTRY[slug] || COMPARISONS_REGISTRY['vs-paper-menus'];

  const columns = [
    {
      title: 'Capability / Metric',
      dataIndex: 'featureName',
      key: 'featureName',
      render: (text: string, record: any) => (
        <div>
          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>{text}</span>
          {record.importance === 'critical' && (
            <Tag color="orange" style={{ marginLeft: '8px', fontSize: '10px' }}>Critical</Tag>
          )}
        </div>
      )
    },
    {
      title: 'Restaurant OS',
      dataIndex: 'restaurantOs',
      key: 'restaurantOs',
      render: (val: any) => {
        if (typeof val === 'boolean') {
          return val ? <CheckCircleOutlined style={{ color: '#16A34A', fontSize: '18px' }} /> : <CloseCircleOutlined style={{ color: '#DC2626', fontSize: '18px' }} />;
        }
        return <span style={{ fontWeight: 700, color: '#16A34A', fontSize: '14px' }}>{val}</span>;
      }
    },
    {
      title: comparison.competitorName,
      dataIndex: 'competitor',
      key: 'competitor',
      render: (val: any) => {
        if (typeof val === 'boolean') {
          return val ? <CheckCircleOutlined style={{ color: '#16A34A', fontSize: '18px' }} /> : <CloseCircleOutlined style={{ color: '#DC2626', fontSize: '18px' }} />;
        }
        return <span style={{ color: '#64748B', fontSize: '14px' }}>{val}</span>;
      }
    }
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title={`${comparison.title} | Restaurant OS Comparisons`}
        description={comparison.summary}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#F1F5F9', padding: '6px 16px', borderRadius: '30px', marginBottom: '16px' }}>
            <span style={{ color: '#475569', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              COMMERCIAL COMPARISON MATRIX
            </span>
          </div>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1.5px', margin: '0 0 16px 0' }}>
            {comparison.title}
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '720px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            {comparison.tagline}
          </Paragraph>
        </header>

        {/* Why Switch Summary */}
        <section style={{ marginBottom: '48px' }}>
          <Card style={{ borderRadius: '16px', border: '1px solid #E2E8F0', background: '#F8FAFC', padding: '16px' }}>
            <Title level={2} style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 12px 0', color: '#0F172A' }}>
              Strategic Verdict
            </Title>
            <Paragraph style={{ color: '#475569', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
              {comparison.whySwitchSummary}
            </Paragraph>
          </Card>
        </section>

        {/* Side-by-Side Comparison Table */}
        <section style={{ marginBottom: '64px' }}>
          <Title level={2} style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 20px 0', color: '#0F172A' }}>
            Side-by-Side Capability Breakdown
          </Title>
          <Table
            dataSource={comparison.matrix.map((m, i) => ({ ...m, key: String(i) }))}
            columns={columns}
            pagination={false}
            bordered
            style={{ background: '#FFFFFF', borderRadius: '12px', overflow: 'hidden' }}
          />
        </section>

        {/* Key Advantages */}
        <section style={{ marginBottom: '64px' }}>
          <Title level={3} style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 16px 0', color: '#0F172A' }}>
            Key Advantages of Restaurant OS
          </Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comparison.keyAdvantages.map((adv, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <CheckCircleOutlined style={{ color: '#16A34A', fontSize: '20px' }} />
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B' }}>{adv}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison FAQs */}
        {comparison.faqs.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <Title level={3} style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 16px 0', color: '#0F172A' }}>
              Comparison FAQs
            </Title>
            <Collapse
              accordion
              ghost
              items={comparison.faqs.map((faq, idx) => ({
                key: String(idx),
                label: <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>{faq.question}</span>,
                style: { background: '#F8FAFC', borderRadius: '12px', marginBottom: '8px', border: '1px solid #E2E8F0' },
                children: <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{faq.answer}</Paragraph>
              }))}
            />
          </section>
        )}

        {/* CTA */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '20px',
            padding: '48px 32px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <Title level={2} style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 800, margin: '0 0 12px 0' }}>
            Ready to Upgrade from {comparison.competitorName}?
          </Title>
          <Paragraph style={{ color: '#94A3B8', fontSize: '15px', maxWidth: '520px', margin: '0 auto 24px auto' }}>
            Launch your commission-free digital menu and dynamic QR stands in under 5 minutes.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/signup')}
            style={{ background: '#F97316', borderColor: '#F97316', height: '48px', padding: '0 32px', borderRadius: '10px', fontWeight: 700 }}
          >
            Start Free
          </Button>
        </section>
      </div>
    </div>
  );
};
