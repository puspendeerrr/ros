import type { BaseContentItem } from './base.model.js';

export interface ChangelogEntry {
  type: 'feature' | 'improvement' | 'fix' | 'security' | 'performance';
  description: string;
}

export interface ChangelogContentItem extends BaseContentItem {
  contentType: 'changelog';
  releaseVersion: string;
  releaseDate: string;
  breakingChanges?: string[];
  changes: ChangelogEntry[];
}

export type RoadmapQuarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type RoadmapStatus = 'in_progress' | 'planned' | 'researching' | 'shipped';

export interface RoadmapItem {
  id: string;
  title: string;
  status: RoadmapStatus;
  quarter: RoadmapQuarter;
  year: number;
  productArea: string;
}

export interface RoadmapContentItem extends BaseContentItem {
  contentType: 'roadmap';
  roadmapItems: RoadmapItem[];
}

export interface DownloadAssetMeta {
  fileFormat: 'svg' | 'png' | 'pdf' | 'zip';
  fileSizeBytes: number;
  checksumSha256?: string;
  downloadUrl: string;
  previewUrl?: string;
}

export interface DownloadContentItem extends BaseContentItem {
  contentType: 'download';
  assetType: 'qr_stand_template' | 'pos_manual' | 'kitchen_cheat_sheet' | 'press_kit';
  assetMeta: DownloadAssetMeta;
}
