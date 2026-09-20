/**
 * Publish History Manager (Ring Buffer: Last 5 Successful Builds)
 * Provides build snapshots for telemetry audit and rollback support.
 */

import fs from 'fs';
import path from 'path';
import type { ContentManifest, ContentArtifactsManifest, ContentStatsReport, RuntimeDiagnostics } from '../types.ts';

export interface PublishHistoryRecord {
  buildId: string;
  timestamp: string;
  totalDurationMs: number;
  contentManifestSnapshot: ContentManifest;
  artifactsManifestSnapshot: ContentArtifactsManifest;
  statsSnapshot?: ContentStatsReport;
  diagnostics: RuntimeDiagnostics;
}

export class PublishHistoryManager {
  private static readonly MAX_HISTORY_ITEMS = 5;
  private historyFilePath: string;

  constructor(historyDir: string) {
    this.historyFilePath = path.join(historyDir, 'publish-history.json');
  }

  public recordBuild(record: PublishHistoryRecord): void {
    const dir = path.dirname(this.historyFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let history: PublishHistoryRecord[] = [];
    if (fs.existsSync(this.historyFilePath)) {
      try {
        const raw = fs.readFileSync(this.historyFilePath, 'utf-8');
        history = JSON.parse(raw);
      } catch {
        history = [];
      }
    }

    // Prepend latest build record
    history.unshift(record);

    // Keep ring buffer capped at 5 records
    if (history.length > PublishHistoryManager.MAX_HISTORY_ITEMS) {
      history = history.slice(0, PublishHistoryManager.MAX_HISTORY_ITEMS);
    }

    fs.writeFileSync(this.historyFilePath, JSON.stringify(history, null, 2), 'utf-8');
  }

  public getHistory(): PublishHistoryRecord[] {
    if (!fs.existsSync(this.historyFilePath)) return [];
    try {
      const raw = fs.readFileSync(this.historyFilePath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}
