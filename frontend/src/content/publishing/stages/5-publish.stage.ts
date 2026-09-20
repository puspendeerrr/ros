/**
 * Stage 5: Publish Stage
 * Generates manifests, runtime diagnostics, publish report,
 * and atomically promotes staging outputs into public/ and dist/.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  StageContext,
  StageExecutionTiming,
  ContentManifest,
  ContentArtifactsManifest,
  PublishReport,
  RuntimeDiagnostics,
} from '../types.ts';
import { PublishHistoryManager } from '../history/publish-history.ts';

export class PublishStage {
  public static async execute(context: StageContext): Promise<void> {
    const startTime = new Date().toISOString();
    const startMs = Date.now();

    const items = context.rawContent;

    // -------------------------------------------------------------
    // 1. Generate content-manifest.json
    // -------------------------------------------------------------
    const manifestEntries: Record<string, any> = {};
    for (const item of items) {
      const compiled = context.compiledMap.get(item.id);
      manifestEntries[item.id] = {
        id: item.id,
        slug: item.slug,
        contentType: item.contentType,
        version: item.version || 'latest',
        checksum: compiled?.fingerprint || '',
        updatedAt: item.updatedAt,
        url: item.seo?.canonicalUrl || `https://ros.algorithyum.in/${item.contentType}/${item.slug}`,
        editorialStatus: item.editorialStatus,
      };
    }

    const contentManifest: ContentManifest = {
      schemaVersion: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalEntries: Object.keys(manifestEntries).length,
      entries: manifestEntries,
    };

    const contentManifestJson = JSON.stringify(contentManifest, null, 2);
    fs.writeFileSync(path.join(context.stagingDir, 'content-manifest.json'), contentManifestJson, 'utf-8');

    // -------------------------------------------------------------
    // 2. Generate content-artifacts.json
    // -------------------------------------------------------------
    const stagedFiles = fs.readdirSync(context.stagingDir);
    for (const filename of stagedFiles) {
      const filePath = path.join(context.stagingDir, filename);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const content = fs.readFileSync(filePath);
        const checksum = crypto.createHash('sha256').update(content).digest('hex');

        context.artifacts[filename] = {
          path: filename,
          version: '1.0.0',
          sizeBytes: stat.size,
          checksumSha256: checksum,
          generatedAt: new Date().toISOString(),
          contentType: filename.endsWith('.json') ? 'application/json' : filename.endsWith('.xml') ? 'application/xml' : 'text/plain',
        };
      }
    }

    const artifactsManifest: ContentArtifactsManifest = {
      manifestVersion: '1.0.0',
      generatedAt: new Date().toISOString(),
      artifacts: context.artifacts,
    };
    fs.writeFileSync(path.join(context.stagingDir, 'content-artifacts.json'), JSON.stringify(artifactsManifest, null, 2), 'utf-8');

    // -------------------------------------------------------------
    // 3. Collect Runtime Diagnostics & Write publish-report.json
    // -------------------------------------------------------------
    const mem = process.memoryUsage();
    const cpu = process.cpuUsage();

    const diagnostics: RuntimeDiagnostics = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      peakMemoryRssMb: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      peakHeapUsedMb: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
      peakHeapTotalMb: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
      cpuUserMs: Math.round(cpu.user / 1000),
      cpuSystemMs: Math.round(cpu.system / 1000),
    };

    const publishReport: PublishReport = {
      buildId: context.buildId,
      status: context.errors.length === 0 ? 'success' : 'failed',
      startTime: context.stageTimings[0]?.startTime || startTime,
      endTime: new Date().toISOString(),
      totalDurationMs: Date.now() - new Date(context.stageTimings[0]?.startTime || startTime).getTime(),
      stageTimings: context.stageTimings,
      diagnostics,
      stats: {
        totalPages: items.length,
        rebuiltPages: Array.from(context.compiledMap.values()).filter(c => c.isDirty).length,
        cachedPages: Array.from(context.compiledMap.values()).filter(c => !c.isDirty).length,
        warningsCount: context.warnings.length,
        errorsCount: context.errors.length,
      },
      warnings: context.warnings,
      errors: context.errors,
    };

    fs.writeFileSync(path.join(context.stagingDir, 'publish-report.json'), JSON.stringify(publishReport, null, 2), 'utf-8');

    // -------------------------------------------------------------
    // 4. Record to Publish History (Ring Buffer)
    // -------------------------------------------------------------
    if (context.errors.length === 0) {
      const historyManager = new PublishHistoryManager(context.historyDir);
      historyManager.recordBuild({
        buildId: context.buildId,
        timestamp: new Date().toISOString(),
        totalDurationMs: publishReport.totalDurationMs,
        contentManifestSnapshot: contentManifest,
        artifactsManifestSnapshot: artifactsManifest,
        statsSnapshot: context.stats,
        diagnostics,
      });
    }

    // -------------------------------------------------------------
    // 5. Atomic Promotion: Copy all files from staging into public/ and dist/
    // -------------------------------------------------------------
    if (context.errors.length === 0) {
      const finalFiles = fs.readdirSync(context.stagingDir);
      for (const f of finalFiles) {
        const src = path.join(context.stagingDir, f);
        const destPublic = path.join(context.publicDir, f);
        fs.copyFileSync(src, destPublic);

        const distDir = path.join(context.workspaceDir, 'dist');
        if (fs.existsSync(distDir)) {
          const destDist = path.join(distDir, f);
          fs.copyFileSync(src, destDist);
        }
      }
    }

    const endMs = Date.now();
    const timing: StageExecutionTiming = {
      stageName: 'Publish',
      startTime,
      endTime: new Date().toISOString(),
      durationMs: endMs - startMs,
      status: context.errors.length === 0 ? 'success' : 'failed',
      itemsProcessed: items.length,
    };
    context.stageTimings.push(timing);
  }
}
