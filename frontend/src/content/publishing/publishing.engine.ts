/**
 * Master Enterprise Publishing Engine Orchestrator
 * Coordinates:
 * - Exclusive build lock
 * - Plugins and lifecycle hooks
 * - Clean temporary staging directory (.publish-staging)
 * - Stage 1: Compile
 * - Parallel execution of Stage 2 (Validate) & Stage 3 (Optimize)
 * - Stage 4: Generate
 * - Stage 5: Publish & Atomic Promotion
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { StageContext, PublishReport } from './types.ts';
import { BuildLock } from './lock.ts';
import { PluginRunner, type PublishingPlugin } from './plugins/plugin.interface.ts';
import { CompileStage } from './stages/1-compile.stage.ts';
import { ValidateStage } from './stages/2-validate.stage.ts';
import { OptimizeStage } from './stages/3-optimize.stage.ts';
import { GenerateStage } from './stages/4-generate.stage.ts';
import { PublishStage } from './stages/5-publish.stage.ts';

export class PublishingEngine {
  private pluginRunner = new PluginRunner();

  public registerPlugin(plugin: PublishingPlugin): void {
    this.pluginRunner.register(plugin);
  }

  public async run(workspaceDir: string, isDev = false): Promise<PublishReport> {
    const buildId = `pub-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const stagingDir = path.join(workspaceDir, '.publish-staging');
    const publicDir = path.join(workspaceDir, 'public');
    const cacheDir = path.join(workspaceDir, '.cache');
    const historyDir = path.join(cacheDir, 'history');
    const lockFile = path.join(workspaceDir, '.publishing.lock');

    // 1. Acquire Build Lock
    if (!BuildLock.acquire(lockFile, buildId)) {
      throw new Error(`[PublishingEngine] Execution aborted: build lock is active.`);
    }

    try {
      // 2. Initialize directories
      if (fs.existsSync(stagingDir)) {
        fs.rmSync(stagingDir, { recursive: true, force: true });
      }
      fs.mkdirSync(stagingDir, { recursive: true });
      fs.mkdirSync(publicDir, { recursive: true });
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.mkdirSync(historyDir, { recursive: true });

      const context: StageContext = {
        buildId,
        workspaceDir,
        stagingDir,
        publicDir,
        cacheDir,
        historyDir,
        isDev,
        rawContent: [],
        compiledMap: new Map(),
        dependencyOrder: [],
        stageTimings: [],
        warnings: [],
        errors: [],
        artifacts: {},
      };

      // 3. Stage 1: Compile
      await this.pluginRunner.runHook('beforeCompile', context);
      await CompileStage.execute(context);
      await this.pluginRunner.runHook('afterCompile', context);

      // 4. Parallel Stages: Validate & Optimize
      await Promise.all([
        (async () => {
          await this.pluginRunner.runHook('beforeValidate', context);
          await ValidateStage.execute(context);
          await this.pluginRunner.runHook('afterValidate', context);
        })(),
        (async () => {
          await this.pluginRunner.runHook('beforeOptimize', context);
          await OptimizeStage.execute(context);
          await this.pluginRunner.runHook('afterOptimize', context);
        })(),
      ]);

      // If validation produced fatal errors, abort before generation
      if (context.errors.length > 0) {
        throw new Error(`Validation stage failed with ${context.errors.length} blocking errors:\n${context.errors.join('\n')}`);
      }

      // 5. Stage 4: Generate (Search, Feeds, Stats)
      await this.pluginRunner.runHook('beforeGenerate', context);
      await GenerateStage.execute(context);
      await this.pluginRunner.runHook('afterGenerate', context);

      // 6. Stage 5: Publish & Atomic Promotion
      await this.pluginRunner.runHook('beforePublish', context);
      await PublishStage.execute(context);
      await this.pluginRunner.runHook('afterPublish', context);

      // Read final publish report from publicDir
      const reportPath = path.join(publicDir, 'publish-report.json');
      const report: PublishReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

      // 7. Cleanup staging directory
      if (fs.existsSync(stagingDir)) {
        fs.rmSync(stagingDir, { recursive: true, force: true });
      }

      return report;
    } finally {
      // 8. Release Build Lock
      BuildLock.release(lockFile);
    }
  }
}
