/**
 * Stage 4: Generate Stage
 * Generates:
 * - Versioned Search Index (search-index.json and minified search-index.min.json)
 * - Public-Only Syndication Feeds (rss.xml, atom.xml, jsonfeed.json) truncated to 100 items
 * - Content Breakdown Statistics (content-stats.json)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { StageContext, StageExecutionTiming, ContentStatsReport } from '../types.ts';
import { ContentSearchIndexer } from '../../search/search-indexer.ts';
import type { ContentType, EditorialStatus, TargetAudience, SearchIntent, ProductArea } from '../../models/base.model.ts';

export class GenerateStage {
  public static readonly MAX_FEED_ITEMS = 100;
  public static readonly SEARCH_SCHEMA_VERSION = '2.0.0';
  public static readonly SEARCH_VERSION = '1.0.0';

  public static async execute(context: StageContext): Promise<void> {
    const startTime = new Date().toISOString();
    const startMs = Date.now();

    const items = context.rawContent;

    // -------------------------------------------------------------
    // 1. Generate Search Index (Full & Minified)
    // -------------------------------------------------------------
    const searchDocs = items.map(item => {
      const compiled = context.compiledMap.get(item.id);
      const headings = compiled ? compiled.headings.map(h => h.text) : [];
      return {
        ...ContentSearchIndexer.mapToSearchDocument(item, headings),
        checksum: compiled?.fingerprint || '',
        lastIndexed: new Date().toISOString(),
        headingHierarchy: compiled?.headings || [],
        entityIds: [
          `https://ros.algorithyum.in/#${item.contentType}`,
          `https://ros.algorithyum.in/#organization`,
        ],
      };
    });

    const searchPayload = {
      version: GenerateStage.SEARCH_VERSION,
      schemaVersion: GenerateStage.SEARCH_SCHEMA_VERSION,
      generatedAt: new Date().toISOString(),
      totalDocuments: searchDocs.length,
      documents: searchDocs,
    };

    const searchJson = JSON.stringify(searchPayload, null, 2);
    const searchMinJson = JSON.stringify(searchPayload);
    const searchChecksum = crypto.createHash('sha256').update(searchMinJson).digest('hex');

    fs.writeFileSync(path.join(context.stagingDir, 'search-index.json'), searchJson, 'utf-8');
    fs.writeFileSync(path.join(context.stagingDir, 'search-index.min.json'), searchMinJson, 'utf-8');

    // Record artifact versioning
    context.artifacts['search-index.json'] = {
      path: 'search-index.json',
      version: GenerateStage.SEARCH_VERSION,
      sizeBytes: Buffer.byteLength(searchJson),
      checksumSha256: searchChecksum,
      generatedAt: new Date().toISOString(),
      contentType: 'application/json',
    };
    context.artifacts['search-index.min.json'] = {
      path: 'search-index.min.json',
      version: GenerateStage.SEARCH_VERSION,
      sizeBytes: Buffer.byteLength(searchMinJson),
      checksumSha256: searchChecksum,
      generatedAt: new Date().toISOString(),
      contentType: 'application/json',
    };

    // -------------------------------------------------------------
    // 2. Generate Public-Only Syndication Feeds (Max 100)
    // Excludes Draft, Scheduled, Deprecated, and Archived
    // -------------------------------------------------------------
    const publicItems = items
      .filter(i => i.editorialStatus === 'published' && !i.seo?.noIndex)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, GenerateStage.MAX_FEED_ITEMS);

    // RSS 2.0
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Restaurant OS Knowledge &amp; Engineering</title>
    <link>https://ros.algorithyum.in</link>
    <description>Enterprise restaurant operating system blueprints, guides, and technical architecture.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://ros.algorithyum.in/rss.xml" rel="self" type="application/rss+xml"/>
${publicItems.map(i => `    <item>
      <title>${this.escapeXml(i.title)}</title>
      <link>${i.seo?.canonicalUrl || `https://ros.algorithyum.in/${i.contentType}/${i.slug}`}</link>
      <guid isPermaLink="true">${i.seo?.canonicalUrl || `https://ros.algorithyum.in/${i.contentType}/${i.slug}`}</guid>
      <pubDate>${new Date(i.publishedAt).toUTCString()}</pubDate>
      <description>${this.escapeXml(i.description)}</description>
    </item>`).join('\n')}
  </channel>
</rss>`;

    // Atom 1.0
    const atomXml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Restaurant OS Knowledge &amp; Engineering</title>
  <link href="https://ros.algorithyum.in/atom.xml" rel="self"/>
  <link href="https://ros.algorithyum.in/"/>
  <updated>${new Date().toISOString()}</updated>
  <id>https://ros.algorithyum.in/</id>
${publicItems.map(i => `  <entry>
    <title>${this.escapeXml(i.title)}</title>
    <link href="${i.seo?.canonicalUrl || `https://ros.algorithyum.in/${i.contentType}/${i.slug}`}"/>
    <id>${i.seo?.canonicalUrl || `https://ros.algorithyum.in/${i.contentType}/${i.slug}`}</id>
    <updated>${i.updatedAt}</updated>
    <summary>${this.escapeXml(i.description)}</summary>
  </entry>`).join('\n')}
</feed>`;

    // JSON Feed 1.1
    const jsonFeed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Restaurant OS Knowledge & Engineering',
      home_page_url: 'https://ros.algorithyum.in/',
      feed_url: 'https://ros.algorithyum.in/jsonfeed.json',
      description: 'Enterprise restaurant operating system blueprints, guides, and technical architecture.',
      items: publicItems.map(i => ({
        id: i.seo?.canonicalUrl || `https://ros.algorithyum.in/${i.contentType}/${i.slug}`,
        url: i.seo?.canonicalUrl || `https://ros.algorithyum.in/${i.contentType}/${i.slug}`,
        title: i.title,
        summary: i.description,
        date_published: i.publishedAt,
        date_modified: i.updatedAt,
      })),
    };

    const jsonFeedStr = JSON.stringify(jsonFeed, null, 2);

    fs.writeFileSync(path.join(context.stagingDir, 'rss.xml'), rssXml, 'utf-8');
    fs.writeFileSync(path.join(context.stagingDir, 'atom.xml'), atomXml, 'utf-8');
    fs.writeFileSync(path.join(context.stagingDir, 'jsonfeed.json'), jsonFeedStr, 'utf-8');

    // -------------------------------------------------------------
    // 3. Generate Content Breakdown Stats (content-stats.json)
    // -------------------------------------------------------------
    const stats: ContentStatsReport = {
      generatedAt: new Date().toISOString(),
      totalItems: items.length,
      byType: {} as Record<ContentType, number>,
      byStatus: {} as Record<EditorialStatus, number>,
      byAudience: {} as Record<TargetAudience, number>,
      byIntent: {} as Record<SearchIntent, number>,
      byProductArea: {} as Record<ProductArea, number>,
    };

    for (const i of items) {
      stats.byType[i.contentType] = (stats.byType[i.contentType] || 0) + 1;
      stats.byStatus[i.editorialStatus] = (stats.byStatus[i.editorialStatus] || 0) + 1;
      stats.byAudience[i.audience] = (stats.byAudience[i.audience] || 0) + 1;
      stats.byIntent[i.intent] = (stats.byIntent[i.intent] || 0) + 1;
      stats.byProductArea[i.productArea] = (stats.byProductArea[i.productArea] || 0) + 1;
    }
    context.stats = stats;
    fs.writeFileSync(path.join(context.stagingDir, 'content-stats.json'), JSON.stringify(stats, null, 2), 'utf-8');

    const endMs = Date.now();
    const timing: StageExecutionTiming = {
      stageName: 'Generate',
      startTime,
      endTime: new Date().toISOString(),
      durationMs: endMs - startMs,
      status: 'success',
      itemsProcessed: items.length,
    };
    context.stageTimings.push(timing);
  }

  private static escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
