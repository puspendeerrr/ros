/**
 * Extensible Publishing Plugin API
 * Allows modular lifecycle interception without modifying the core publishing engine.
 */

import type { StageContext } from '../types.ts';

export interface PublishingPlugin {
  readonly name: string;
  readonly version: string;

  beforeCompile?(context: StageContext): Promise<void> | void;
  afterCompile?(context: StageContext): Promise<void> | void;
  beforeValidate?(context: StageContext): Promise<void> | void;
  afterValidate?(context: StageContext): Promise<void> | void;
  beforeOptimize?(context: StageContext): Promise<void> | void;
  afterOptimize?(context: StageContext): Promise<void> | void;
  beforeGenerate?(context: StageContext): Promise<void> | void;
  afterGenerate?(context: StageContext): Promise<void> | void;
  beforePublish?(context: StageContext): Promise<void> | void;
  afterPublish?(context: StageContext): Promise<void> | void;
}

export class PluginRunner {
  private plugins: PublishingPlugin[] = [];

  public register(plugin: PublishingPlugin): void {
    this.plugins.push(plugin);
  }

  public async runHook(
    hookName: keyof Omit<PublishingPlugin, 'name' | 'version'>,
    context: StageContext
  ): Promise<void> {
    for (const plugin of this.plugins) {
      const hook = plugin[hookName];
      if (typeof hook === 'function') {
        try {
          await hook.call(plugin, context);
        } catch (err) {
          console.error(`[PluginRunner] Error in plugin "${plugin.name}" on hook "${hookName}":`, err);
          context.warnings.push(`Plugin "${plugin.name}" error in "${hookName}": ${String(err)}`);
        }
      }
    }
  }
}
