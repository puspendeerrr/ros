/**
 * Link Graph Analyzer
 * Computes click distance from root, in/out degree distribution, and link density metrics.
 */

import type { InternalLinkReference } from '../types/programmatic.types.ts';

export interface LinkGraphTelemetry {
  totalNodes: number;
  totalEdges: number;
  averageInternalLinks: number;
  maxClickDistance: number;
  clickDistanceMap: Record<string, number>;
  inDegreeMap: Record<string, number>;
  outDegreeMap: Record<string, number>;
  isolatedNodeIds: string[];
}

export class LinkGraphAnalyzer {
  public static analyze(
    pages: Array<{ id: string; url: string; internalLinks: InternalLinkReference[] }>
  ): LinkGraphTelemetry {
    const totalNodes = pages.length;
    let totalEdges = 0;

    const inDegreeMap: Record<string, number> = {};
    const outDegreeMap: Record<string, number> = {};
    const adjacency = new Map<string, string[]>();

    pages.forEach(p => {
      inDegreeMap[p.id] = 0;
      outDegreeMap[p.id] = p.internalLinks.length;
      totalEdges += p.internalLinks.length;
      adjacency.set(p.id, p.internalLinks.map(l => l.targetId));
    });

    // Compute in-degree
    pages.forEach(p => {
      p.internalLinks.forEach(l => {
        if (inDegreeMap[l.targetId] !== undefined) {
          inDegreeMap[l.targetId] += 1;
        }
      });
    });

    // Breadth-First Search for Click Distance from homepage or primary hubs
    const clickDistanceMap: Record<string, number> = {};
    const queue: Array<{ id: string; depth: number }> = [];

    // Seed hubs (items with slug 'quickstart' or features)
    const seedPages = pages.filter(p => p.url === '/' || p.url.includes('features') || p.url.includes('quickstart'));
    seedPages.forEach(p => {
      clickDistanceMap[p.id] = 1;
      queue.push({ id: p.id, depth: 1 });
    });

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      const neighbors = adjacency.get(id) || [];

      for (const neighborId of neighbors) {
        if (clickDistanceMap[neighborId] === undefined) {
          clickDistanceMap[neighborId] = depth + 1;
          queue.push({ id: neighborId, depth: depth + 1 });
        }
      }
    }

    // Nodes not reached by BFS get default depth
    pages.forEach(p => {
      if (clickDistanceMap[p.id] === undefined) {
        clickDistanceMap[p.id] = 2; // Default reasonable crawl depth
      }
    });

    let maxClickDistance = 1;
    for (const d of Object.values(clickDistanceMap)) {
      if (d > maxClickDistance) maxClickDistance = d;
    }

    const isolatedNodeIds = pages.filter(p => (inDegreeMap[p.id] || 0) === 0).map(p => p.id);

    return {
      totalNodes,
      totalEdges,
      averageInternalLinks: totalNodes > 0 ? Math.round((totalEdges / totalNodes) * 10) / 10 : 0,
      maxClickDistance,
      clickDistanceMap,
      inDegreeMap,
      outDegreeMap,
      isolatedNodeIds,
    };
  }
}
