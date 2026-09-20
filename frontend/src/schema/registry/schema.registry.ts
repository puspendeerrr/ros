/**
 * Enterprise Schema Generator Registry
 * Supports priority-tiered generators: global, content, conditional, and experimental.
 */

import type { SchemaNode } from '../types/schema.types.ts';

export type GeneratorPriority = 'global' | 'content' | 'conditional' | 'experimental';

export const PRIORITY_WEIGHTS: Record<GeneratorPriority, number> = {
  global: 100,
  content: 75,
  conditional: 50,
  experimental: 25,
};

export interface RegisteredGenerator<TContext = any> {
  id: string;
  name: string;
  priority: GeneratorPriority;
  targetType: string;
  generate: (context: TContext) => SchemaNode | SchemaNode[] | null | undefined;
}

export class SchemaRegistry {
  private static instance: SchemaRegistry;
  private generators: Map<string, RegisteredGenerator> = new Map();

  private constructor() {}

  public static getInstance(): SchemaRegistry {
    if (!SchemaRegistry.instance) {
      SchemaRegistry.instance = new SchemaRegistry();
    }
    return SchemaRegistry.instance;
  }

  /**
   * Registers a schema generator with priority tier.
   */
  public register<TContext = any>(generator: RegisteredGenerator<TContext>): void {
    if (this.generators.has(generator.id)) {
      console.warn(`[SchemaRegistry] Overwriting existing generator "${generator.id}"`);
    }
    this.generators.set(generator.id, generator);
  }

  /**
   * Retrieves a generator by id.
   */
  public get(id: string): RegisteredGenerator | undefined {
    return this.generators.get(id);
  }

  /**
   * Returns all generators sorted descending by priority tier weight.
   */
  public getAllSorted(): RegisteredGenerator[] {
    return Array.from(this.generators.values()).sort(
      (a, b) => PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority]
    );
  }

  /**
   * Returns generators for a specific priority tier.
   */
  public getByPriority(priority: GeneratorPriority): RegisteredGenerator[] {
    return Array.from(this.generators.values()).filter((g) => g.priority === priority);
  }

  /**
   * Removes all registered generators.
   */
  public clear(): void {
    this.generators.clear();
  }
}

export const schemaRegistry = SchemaRegistry.getInstance();
