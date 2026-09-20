import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography, Input, Card, Tag, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { searchService } from '../services/search.service.js';
import { SEARCH_ENTITY_METADATA, type SearchableDocument } from '../config/search.config.js';
import { SEOManager } from '../components/SEOManager.js';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.js';

const { Title, Paragraph } = Typography;

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchableDocument[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      const hits = searchService.search({ query, limit: 30 });
      setResults(hits);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '40px 24px 80px 24px' }}>
      <SEOManager
        title={query ? `Search: "${query}" | Restaurant OS` : 'Search Platform Documentation & Features | Restaurant OS'}
        description="Search across Restaurant OS features, hospitality industries, playbooks, API documentation, and FAQs."
        noIndex={true}
      />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Breadcrumbs />

        <header style={{ margin: '32px 0 40px 0', textAlign: 'center' }}>
          <Title level={1} style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', margin: '0 0 12px 0' }}>
            Platform Search
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#64748B' }}>
            Instant search across features, solutions, industries, playbooks, and API documentation.
          </Paragraph>

          <div style={{ maxWidth: '640px', margin: '24px auto 0 auto' }}>
            <Input
              size="large"
              placeholder="Search features, guides, FAQs, industries (e.g. QR Stand, POS, Cafes, GST)..."
              prefix={<SearchOutlined style={{ color: '#94A3B8', marginRight: '8px' }} />}
              value={query}
              onChange={handleSearchChange}
              style={{ borderRadius: '12px', height: '52px', fontSize: '15px' }}
              allowClear
              autoFocus
            />
          </div>
        </header>

        {query.trim() ? (
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, marginBottom: '20px' }}>
              Found {results.length} results for "{query}"
            </div>

            {results.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {results.map(item => {
                  const meta = SEARCH_ENTITY_METADATA[item.entityType] || { label: item.entityType, badgeColor: '#64748B' };
                  return (
                    <Card
                      key={item.id}
                      hoverable
                      onClick={() => navigate(item.url)}
                      style={{ borderRadius: '14px', border: '1px solid #E2E8F0' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <Tag color={meta.badgeColor} style={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '11px' }}>
                          {meta.label}
                        </Tag>
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>{item.category}</span>
                      </div>
                      <Title level={3} style={{ fontSize: '18px', fontWeight: 750, color: '#0F172A', margin: '0 0 8px 0' }}>
                        {item.title}
                      </Title>
                      <Paragraph style={{ color: '#64748B', fontSize: '13.5px', margin: 0 }}>
                        {item.description}
                      </Paragraph>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Empty
                description={`No matching results found for "${query}"`}
                style={{ padding: '64px 0' }}
              />
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#94A3B8' }}>
            <p>Type keywords to search all 5,000+ platform assets, documentation articles, and guides.</p>
          </div>
        )}
      </div>
    </div>
  );
};
