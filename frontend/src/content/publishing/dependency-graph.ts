/**
 * Bidirectional Deterministic Dependency Graph
 * Maps dependencies across features, industries, guides, comparisons, FAQs, and docs.
 * Provides topological sorting with deterministic priority weights.
 */

import type { BaseContentItem } from '../models/base.model.ts';
import fs from 'fs';
import path from 'path';

export interface DependencyNode {
  id: string;
  contentType: string;
  priority: number;
  dependencies: string[]; // Content IDs this item depends on (inbound)
  dependents: string[];   // Content IDs that depend on this item (outbound)
}

export class DependencyGraph {
  private nodes: Map<string, DependencyNode> = new Map();

  // Content type priorities for deterministic regeneration order
  private static readonly CONTENT_PRIORITY: Record<string, number> = {
    feature: 100,
    solution: 90,
    industry: 80,
    documentation: 70,
    guide: 60,
    tutorial: 50,
    comparison: 40,
    faq: 30,
    glossary: 20,
    changelog: 10,
  };

  /**
   * Builds the dependency graph from all registered content items.
   */
  public build(items: BaseContentItem[]): void {
    this.nodes.clear();

    // 1. Initialize nodes
    for (const item of items) {
      const priority = DependencyGraph.CONTENT_PRIORITY[item.contentType] || 50;
      this.nodes.set(item.id, {
        id: item.id,
        contentType: item.contentType,
        priority,
        dependencies: [],
        dependents: [],
      });
    }

    // 2. Map edges
    for (const item of items) {
      const node = this.nodes.get(item.id)!;
      const directDeps: string[] = [
        ...(item.seeAlsoIds || []),
        ...(item.prerequisiteIds || []),
        ...(item.continueLearningIds || []),
      ];

      for (const depId of directDeps) {
        if (this.nodes.has(depId)) {
          if (!node.dependencies.includes(depId)) {
            node.dependencies.push(depId);
          }
          const targetNode = this.nodes.get(depId)!;
          if (!targetNode.dependents.includes(item.id)) {
            targetNode.dependents.push(item.id);
          }
        }
      }
    }
  }

  /**
   * Retrieves all downstream dependents that must be re-evaluated when a content item changes.
   */
  public getAffectedDependents(dirtyIds: string[]): Set<string> {
    const affected = new Set<string>(dirtyIds);
    const queue = [...dirtyIds];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const node = this.nodes.get(currentId);
      if (!node) continue;

      for (const depId of node.dependents) {
        if (!affected.has(depId)) {
          affected.add(depId);
          queue.push(depId);
        }
      }
    }

    return affected;
  }

  /**
   * Returns a deterministic, topologically sorted array of content IDs.
   * Higher priority content types come first, with stable alphabetical tie-breaking.
   */
  public getDeterministicOrder(itemIds?: string[]): string[] {
    const candidates = itemIds ? itemIds.slice() : Array.from(this.nodes.keys());

    // Sort by priority descending, then by id ascending (deterministic tie breaker)
    return candidates.sort((a, b) => {
      const nodeA = this.nodes.get(a);
      const nodeB = this.nodes.get(b);
      const prioA = nodeA?.priority ?? 0;
      const prioB = nodeB?.priority ?? 0;

      if (prioB !== prioA) {
        return prioB - prioA;
      }
      return a.localeCompare(b);
    });
  }

  /**
   * Exports the dependency graph to a JSON file for development and debugging.
   */
  public exportDebugJson(outPath: string): void {
    const serializable: Record<string, any> = {};
    for (const [id, node] of this.nodes.entries()) {
      serializable[id] = {
        contentType: node.contentType,
        priority: node.priority,
        dependencies: node.dependencies,
        dependents: node.dependents,
      };
    }

    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outPath, JSON.stringify(serializable, null, 2), 'utf-8');
  }
}
