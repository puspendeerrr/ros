/**
 * Core Type Definitions for Enterprise Publishing Pipeline (Phase 4B)
 */

import type { BaseContentItem, ContentType, EditorialStatus, TargetAudience, SearchIntent, ProductArea } from '../models/base.model.ts';
import type { MDXCompiledNode } from '../mdx/mdx.types.ts';

export interface ContentFingerprintPayload {
  contentId: string;
  hash: string;
  timestamp: string;
  dependenciesHash: string;
}

export interface ContentManifestEntry {
  id: string;
  slug: string;
  contentType: ContentType;
  version: string;
  checksum: string;
  updatedAt: string;
  url: string;
  editorialStatus: EditorialStatus;
}

export interface ContentManifest {
  schemaVersion: string;
  generatedAt: string;
  totalEntries: number;
  entries: Record<string, ContentManifestEntry>;
}

export interface ArtifactVersionRecord {
  path: string;
  version: string;
  sizeBytes: number;
  checksumSha256: string;
  generatedAt: string;
  contentType: string;
}

export interface ContentArtifactsManifest {
  manifestVersion: string;
  generatedAt: string;
  artifacts: Record<string, ArtifactVersionRecord>;
}

export interface ContentStatsReport {
  generatedAt: string;
  totalItems: number;
  byType: Record<ContentType, number>;
  byStatus: Record<EditorialStatus, number>;
  byAudience: Record<TargetAudience, number>;
  byIntent: Record<SearchIntent, number>;
  byProductArea: Record<ProductArea, number>;
}

export interface ResponsiveImageDescriptor {
  id: string;
  originalUrl: string;
  aspectRatio: string;
  width: number;
  height: number;
  dominantColor: string;
  blurPlaceholder: string;
  srcset: Array<{
    width: number;
    url: string;
  }>;
}

export interface ResponsiveAssetsManifest {
  schemaVersion: string;
  generatedAt: string;
  totalAssets: number;
  assets: Record<string, ResponsiveImageDescriptor>;
}

export interface StageExecutionTiming {
  stageName: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  status: 'success' | 'skipped' | 'failed';
  itemsProcessed: number;
}

export interface RuntimeDiagnostics {
  nodeVersion: string;
  platform: string;
  arch: string;
  peakMemoryRssMb: number;
  peakHeapUsedMb: number;
  peakHeapTotalMb: number;
  cpuUserMs: number;
  cpuSystemMs: number;
}

export interface PublishReport {
  buildId: string;
  status: 'success' | 'failed';
  startTime: string;
  endTime: string;
  totalDurationMs: number;
  stageTimings: StageExecutionTiming[];
  diagnostics: RuntimeDiagnostics;
  stats: {
    totalPages: number;
    rebuiltPages: number;
    cachedPages: number;
    warningsCount: number;
    errorsCount: number;
  };
  warnings: string[];
  errors: string[];
}

export interface HeadingItem {
  level: number;
  text: string;
  id: string;
  children?: HeadingItem[];
}

export interface CompiledContentItem {
  item: BaseContentItem;
  ast?: MDXCompiledNode;
  headings: HeadingItem[];
  readingTimeMinutes: number;
  fingerprint: string;
  isDirty: boolean;
}

export interface StageContext {
  buildId: string;
  workspaceDir: string;
  stagingDir: string;
  publicDir: string;
  cacheDir: string;
  historyDir: string;
  isDev: boolean;
  rawContent: BaseContentItem[];
  compiledMap: Map<string, CompiledContentItem>;
  dependencyOrder: string[];
  stageTimings: StageExecutionTiming[];
  warnings: string[];
  errors: string[];
  artifacts: Record<string, ArtifactVersionRecord>;
  stats?: ContentStatsReport;
}
