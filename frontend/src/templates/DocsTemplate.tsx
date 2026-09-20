import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Select, Card } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, BookOutlined } from '@ant-design/icons';
import { DOCUMENTATION_REGISTRY, DOC_VERSIONS } from '../config/resources.config.js';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';
import { getAdjacentDocs } from '../utils/internalLinking.js';

const { Title, Paragraph } = Typography;

export const DocsTemplate: React.FC = () => {
  const params = useParams<{ version?: string; category?: string; slug?: string }>();
  const navigate = useNavigate();

  const currentVersion = params.version && DOC_VERSIONS.includes(params.version as any)
    ? params.version
    : 'latest';

  const defaultCategoryKey = Object.keys(DOCUMENTATION_REGISTRY)[0];
  const currentCategoryKey = params.category || defaultCategoryKey;
  const currentCategory = DOCUMENTATION_REGISTRY[currentCategoryKey] || DOCUMENTATION_REGISTRY[defaultCategoryKey];

  const defaultArticle = currentCategory.articles[0];
  const currentSlug = params.slug || defaultArticle.slug;
  const currentArticle = currentCategory.articles.find(a => a.slug === currentSlug) || defaultArticle;

  const adjacent = getAdjacentDocs(currentCategoryKey, currentSlug);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '32px 24px 80px 24px' }}>
      <SEOManager
        title={`${currentArticle.title} — Documentation (${currentVersion})`}
        description={currentArticle.summary}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Breadcrumbs />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>DOCS VERSION:</span>
            <Select
              value={currentVersion}
              size="small"
              onChange={(val) => navigate(`/docs/${val}/${currentCategoryKey}/${currentSlug}`)}
              options={DOC_VERSIONS.map(v => ({ value: v, label: v.toUpperCase() }))}
              style={{ width: '100px' }}
            />
          </div>
        </div>

        <Row gutter={[36, 36]} style={{ marginTop: '24px' }}>
          {/* Docs Sidebar Navigation */}
          <Col xs={24} md={6}>
            <div style={{ position: 'sticky', top: '90px', borderRight: '1px solid #F1F5F9', paddingRight: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <BookOutlined style={{ color: '#F97316', fontSize: '18px' }} />
                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '15px' }}>Documentation</span>
              </div>

              {Object.entries(DOCUMENTATION_REGISTRY).map(([catId, cat]) => (
                <div key={catId} style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.6px', marginBottom: '8px' }}>
                    {cat.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {cat.articles.map(art => {
                      const isCurrent = catId === currentCategoryKey && art.slug === currentSlug;
                      return (
                        <Link
                          key={art.slug}
                          to={`/docs/${currentVersion}/${catId}/${art.slug}`}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? '#F97316' : '#475569',
                            background: isCurrent ? '#FFF7ED' : 'transparent',
                            textDecoration: 'none',
                          }}
                        >
                          {art.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {/* Main Doc Article Body */}
          <Col xs={24} md={18}>
            <article style={{ maxWidth: '800px' }}>
              <header style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '24px', marginBottom: '32px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#F97316', textTransform: 'uppercase' }}>
                  {currentCategory.name}
                </div>
                <Title level={1} style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: '8px 0 12px 0' }}>
                  {currentArticle.title}
                </Title>
                <Paragraph style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                  {currentArticle.summary}
                </Paragraph>
              </header>

              <div style={{ minHeight: '260px' }}>
                <Card style={{ borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC', padding: '16px', marginBottom: '32px' }}>
                  <Title level={3} style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0' }}>
                    Architecture Specification & Workflow
                  </Title>
                  <Paragraph style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    This section documents the technical implementation parameters for {currentArticle.title.toLowerCase()}.
                    All workflows are engineered for sub-second synchronization and offline fault-tolerance.
                  </Paragraph>
                </Card>
              </div>

              {/* Prev / Next Pagination */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                {adjacent.previous ? (
                  <Link
                    to={adjacent.previous.url}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#0F172A', fontWeight: 700, fontSize: '14px' }}
                  >
                    <ArrowLeftOutlined style={{ color: '#F97316' }} /> Previous: {adjacent.previous.title}
                  </Link>
                ) : <div />}

                {adjacent.next && (
                  <Link
                    to={adjacent.next.url}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#0F172A', fontWeight: 700, fontSize: '14px', marginLeft: 'auto' }}
                  >
                    Next: {adjacent.next.title} <ArrowRightOutlined style={{ color: '#F97316' }} />
                  </Link>
                )}
              </div>
            </article>
          </Col>
        </Row>
      </div>
    </div>
  );
};
