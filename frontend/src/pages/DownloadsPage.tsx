import React from 'react';
import { Typography, Row, Col, Card, Button, Tag } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileImageOutlined } from '@ant-design/icons';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const DownloadsPage: React.FC = () => {
  const assets = [
    {
      title: 'A6 Acrylic Table Stand Vector Template (SVG & PDF)',
      desc: 'Standard commercial table tent card dimensions with crop marks and 3mm bleed margin for professional print shops.',
      format: 'SVG / PDF',
      icon: <FilePdfOutlined style={{ fontSize: '24px', color: '#F97316' }} />
    },
    {
      title: 'A7 Compact QR Stand Stickers (SVG & PNG)',
      desc: 'Compact square sticker layouts for narrow tables, bar tops, and takeaway delivery packaging.',
      format: 'SVG / PNG',
      icon: <FileImageOutlined style={{ fontSize: '24px', color: '#F97316' }} />
    },
    {
      title: 'Restaurant Floor Setup & Table Scan Checklist',
      desc: 'An operational PDF guide for staff training and dining room rollout readiness.',
      format: 'PDF',
      icon: <FilePdfOutlined style={{ fontSize: '24px', color: '#F97316' }} />
    }
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title="Printable QR Stand Downloads & Graphic Assets | Restaurant OS"
        description="Download vector acrylic table stand templates, sticker formats, and staff rollout checklists for your restaurant."
      />

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 56px 0', textAlign: 'center' }}>
          <Tag color="orange" style={{ textTransform: 'uppercase', fontWeight: 800, padding: '4px 12px', fontSize: '11px', marginBottom: '16px' }}>
            PRINT & ROLLOUT ASSETS
          </Tag>
          <Title level={1} style={{ fontSize: 'clamp(2rem, 1.8rem + 2vw, 3.2rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 16px 0' }}>
            Printable Downloads
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Vector print files, acrylic stand templates, and staff checklists ready for commercial printing.
          </Paragraph>
        </header>

        <Row gutter={[24, 24]}>
          {assets.map((item, idx) => (
            <Col xs={24} md={8} key={idx}>
              <Card style={{ borderRadius: '16px', border: '1px solid #E2E8F0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    {item.icon}
                    <Tag>{item.format}</Tag>
                  </div>
                  <Title level={3} style={{ fontSize: '16px', fontWeight: 750, color: '#0F172A', margin: '0 0 8px 0' }}>
                    {item.title}
                  </Title>
                  <Paragraph style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                    {item.desc}
                  </Paragraph>
                </div>
                <Button
                  type="default"
                  icon={<DownloadOutlined />}
                  block
                  style={{ borderRadius: '8px', fontWeight: 600, borderColor: '#CBD5E1' }}
                  onClick={() => window.open('/assets/logo.png', '_blank')}
                >
                  Download Asset
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
