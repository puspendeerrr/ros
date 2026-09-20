/**
 * Stage 1: Compile Stage
 * Ingests content, computes composite fingerprints, checks compile cache,
 * resolves dependency graph, and builds ASTs.
 */

import path from 'path';
import type { StageContext, StageExecutionTiming } from '../types.ts';
import { ContentSourceLoader } from '../content-sources.ts';
import { ContentFingerprint } from '../fingerprint.ts';
import { DependencyGraph } from '../dependency-graph.ts';
import { StageCacheManager } from '../cache/stage-cache.ts';
import { BuildTimeMdxCompiler } from '../mdx-compiler.node.ts';

export class CompileStage {
  public static async execute(context: StageContext): Promise<void> {
    const startTime = new Date().toISOString();
    const startMs = Date.now();

    const compileCache = new StageCacheManager<any>(context.cacheDir, 'compile');
    compileCache.load();

    // 1. Ingest raw content items
    const rawItems = await ContentSourceLoader.loadAll();
    context.rawContent = rawItems;

    // 2. Build dependency graph
    const depGraph = new DependencyGraph();
    depGraph.build(rawItems);

    if (context.isDev) {
      depGraph.exportDebugJson(path.join(context.cacheDir, 'dependency-graph.json'));
    }

    // 3. Compute fingerprints & identify directly dirty items
    const dirtyItemIds: string[] = [];
    const itemFingerprints = new Map<string, string>();

    for (const item of rawItems) {
      const rawBody = (item as any).markdownBody || item.summary || item.description || '';
      const fingerprint = ContentFingerprint.compute(item, rawBody);
      itemFingerprints.set(item.id, fingerprint);

      const cached = compileCache.get(item.id);
      if (!cached || cached.fingerprint !== fingerprint) {
        dirtyItemIds.push(item.id);
      }
    }

    // 4. Resolve downstream dependent items that must recompile
    const allAffectedIds = depGraph.getAffectedDependents(dirtyItemIds);

    // 5. Determine topological priority order
    const orderedIds = depGraph.getDeterministicOrder(rawItems.map(i => i.id));
    context.dependencyOrder = orderedIds;

    // 6. Compile items in topological sequence
    for (const id of orderedIds) {
      const item = rawItems.find(i => i.id === id)!;
      const isDirty = allAffectedIds.has(id);
      const fingerprint = itemFingerprints.get(id)!;

      if (!isDirty && compileCache.has(id)) {
        // Cache hit
        const cached = compileCache.get(id);
        context.compiledMap.set(id, {
          item,
          ast: cached.ast,
          headings: cached.headings,
          readingTimeMinutes: cached.readingTimeMinutes,
          fingerprint,
          isDirty: false,
        });
      } else {
        // Compile AST
        const rawBody = (item as any).markdownBody || item.summary || item.description || '';
        const { ast, headings, readingTimeMinutes } = BuildTimeMdxCompiler.compile(rawBody);

        context.compiledMap.set(id, {
          item,
          ast,
          headings,
          readingTimeMinutes,
          fingerprint,
          isDirty: true,
        });

        // Update cache
        compileCache.set(id, {
          fingerprint,
          ast,
          headings,
          readingTimeMinutes,
          compiledAt: new Date().toISOString(),
        });
      }
    }

    compileCache.save();

    const endMs = Date.now();
    const timing: StageExecutionTiming = {
      stageName: 'Compile',
      startTime,
      endTime: new Date().toISOString(),
      durationMs: endMs - startMs,
      status: 'success',
      itemsProcessed: rawItems.length,
    };
    context.stageTimings.push(timing);
  }
}
