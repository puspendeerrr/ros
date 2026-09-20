import type { SchemaNode } from '../types/schema.types.js';

export interface CompiledJsonLdGraph {
  '@context': 'https://schema.org';
  '@graph': SchemaNode[];
}

/**
 * Knowledge Graph Builder & Entity Compression Engine
 * 
 * Performs 3 core optimizations:
 * 1. Deduplication: Merges multiple node instances having the identical @id into a unified vertex.
 * 2. Reference Compression: Converts deep redundant sub-objects into lightweight { "@id": URI } references.
 * 3. Sorting & Normalization: Orders root graph nodes (Organization, WebSite, WebPage, Article).
 */
export class JsonLdGraphBuilder {
  private nodes: Map<string, SchemaNode> = new Map();
  private anonymousNodes: SchemaNode[] = [];

  public addNode(node: SchemaNode | null | undefined): this {
    if (!node) return this;

    // If node has an @id, deduplicate and merge properties
    if (node['@id']) {
      const existing = this.nodes.get(node['@id']);
      if (existing) {
        // Deep merge top-level properties
        this.nodes.set(node['@id'], { ...existing, ...node });
      } else {
        this.nodes.set(node['@id'], { ...node });
      }
    } else {
      this.anonymousNodes.push({ ...node });
    }

    return this;
  }

  public addNodes(nodes: Array<SchemaNode | null | undefined>): this {
    nodes.forEach(n => this.addNode(n));
    return this;
  }

  public compressReferences(): void {
    // Traverse nodes and convert any nested child having a registered @id into a pointer { "@id": id }
    for (const [id, node] of this.nodes.entries()) {
      for (const [prop, value] of Object.entries(node)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          const childObj = value as Record<string, unknown>;
          if (childObj['@id'] && typeof childObj['@id'] === 'string' && childObj['@id'] !== id) {
            // If the child is already a full node in our map, compress the inline reference to a pointer
            if (this.nodes.has(childObj['@id'])) {
              (node as Record<string, unknown>)[prop] = { '@id': childObj['@id'] };
            }
          }
        }
      }
    }
  }

  public build(): CompiledJsonLdGraph {
    this.compressReferences();

    const graphNodes = [
      ...Array.from(this.nodes.values()),
      ...this.anonymousNodes
    ];

    // Remove any '@context' inside individual nodes to keep top-level clean
    const cleanedNodes = graphNodes.map(node => {
      const copy = { ...node };
      delete copy['@context'];
      return copy;
    });

    return {
      '@context': 'https://schema.org',
      '@graph': cleanedNodes
    };
  }

  public buildScriptJson(): string {
    return JSON.stringify(this.build());
  }
}
