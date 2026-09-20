/**
 * Bidirectional Knowledge Graph Expansion Engine
 * Enforces edge symmetry across all 15 content archetypes.
 * Computes topological sort, centrality scores, and Entity Dependency Scores.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type {
  EntityGraphNode,
  GraphEdge,
  GraphRelationType
} from '../types/authority.types.ts';

export class KnowledgeGraphEngine {
  private nodes: Map<string, EntityGraphNode> = new Map();
  private edges: GraphEdge[] = [];
  private adjacencyList: Map<string, Array<{ toId: string; relation: GraphRelationType; weight: number }>> = new Map();

  constructor(items: BaseContentItem[]) {
    this.buildGraph(items);
  }

  /**
   * Initializes and indexes all nodes and bidirectional edges.
   */
  public buildGraph(items: BaseContentItem[]): void {
    this.nodes.clear();
    this.edges = [];
    this.adjacencyList.clear();

    // 1. Register all nodes
    for (const item of items) {
      this.nodes.set(item.id, {
        id: item.id,
        title: item.title,
        contentType: item.contentType,
        productArea: item.productArea,
        inDegree: 0,
        outDegree: 0,
        centralityScore: 0,
        dependencyScore: 0,
        prerequisiteChain: [],
        dependentIds: []
      });
      this.adjacencyList.set(item.id, []);
    }

    // 2. Extract and establish bidirectional relationships
    for (const item of items) {
      // Prerequisites: A prerequisiteOf B  <===> B dependsOn A
      if (item.prerequisiteIds && item.prerequisiteIds.length > 0) {
        for (const prereqId of item.prerequisiteIds) {
          if (this.nodes.has(prereqId)) {
            this.addBidirectionalEdge(item.id, prereqId, 'depends_on', 'prerequisite_for', 0.9);
          }
        }
      }

      // See Also: Symmetric see_also
      if (item.seeAlsoIds && item.seeAlsoIds.length > 0) {
        for (const targetId of item.seeAlsoIds) {
          if (this.nodes.has(targetId)) {
            this.addBidirectionalEdge(item.id, targetId, 'see_also', 'see_also', 0.6);
          }
        }
      }

      // Continue Learning: A subtopic/continues B
      if (item.continueLearningIds && item.continueLearningIds.length > 0) {
        for (const nextId of item.continueLearningIds) {
          if (this.nodes.has(nextId)) {
            this.addBidirectionalEdge(item.id, nextId, 'subtopic_of', 'supports_pillar', 0.7);
          }
        }
      }

      // Related Features: Feature references
      if (item.relatedFeatureIds && item.relatedFeatureIds.length > 0) {
        for (const featId of item.relatedFeatureIds) {
          if (this.nodes.has(featId)) {
            this.addBidirectionalEdge(item.id, featId, 'powers_solution', 'supports_pillar', 0.8);
          }
        }
      }

      // Related Industries: Industry references
      if (item.relatedIndustryIds && item.relatedIndustryIds.length > 0) {
        for (const indId of item.relatedIndustryIds) {
          if (this.nodes.has(indId)) {
            this.addBidirectionalEdge(item.id, indId, 'industry_variant_of', 'powers_solution', 0.75);
          }
        }
      }
    }

    // 3. Compute graph metrics (degrees, centrality, dependencies)
    this.computeGraphMetrics();
  }

  /**
   * Adds an edge and its guaranteed inverse edge.
   */
  private addBidirectionalEdge(
    fromId: string,
    toId: string,
    relation: GraphRelationType,
    inverseRelation: GraphRelationType,
    weight: number
  ): void {
    if (fromId === toId) return;

    // Avoid duplicate edges
    const exists = this.edges.some(e => e.fromId === fromId && e.toId === toId && e.relation === relation);
    if (!exists) {
      this.edges.push({ fromId, toId, relation, inverseRelation, weight });
      this.adjacencyList.get(fromId)?.push({ toId, relation, weight });
    }

    const inverseExists = this.edges.some(e => e.fromId === toId && e.toId === fromId && e.relation === inverseRelation);
    if (!inverseExists) {
      this.edges.push({ fromId: toId, toId: fromId, relation: inverseRelation, inverseRelation: relation, weight });
      this.adjacencyList.get(toId)?.push({ toId: fromId, relation: inverseRelation, weight });
    }
  }

  /**
   * Computes degrees, network centrality, and Entity Dependency Scores.
   */
  private computeGraphMetrics(): void {
    const totalNodes = this.nodes.size;
    if (totalNodes === 0) return;

    // 1. Calculate inDegree and outDegree
    for (const [nodeId, node] of this.nodes.entries()) {
      const neighbors = this.adjacencyList.get(nodeId) || [];
      node.outDegree = neighbors.length;

      let inCount = 0;
      for (const edge of this.edges) {
        if (edge.toId === nodeId) inCount++;
      }
      node.inDegree = inCount;

      // Centrality based on degree and edge weights
      const totalDegree = node.inDegree + node.outDegree;
      node.centralityScore = Math.min(100, Math.round((totalDegree / Math.max(1, totalNodes * 2)) * 100));
    }

    // 2. Calculate Entity Dependency Score & Topological Chains
    for (const [nodeId, node] of this.nodes.entries()) {
      const visited = new Set<string>();
      const prereqChain: string[] = [];
      const dependentSet = new Set<string>();

      // Traverse prerequisites (upstream dependencies)
      const findPrereqs = (currentId: string, depth = 0) => {
        if (visited.has(currentId) || depth > 8) return;
        visited.add(currentId);

        for (const edge of this.edges) {
          if (edge.fromId === currentId && edge.relation === 'depends_on') {
            prereqChain.push(edge.toId);
            findPrereqs(edge.toId, depth + 1);
          }
        }
      };

      findPrereqs(nodeId);
      node.prerequisiteChain = Array.from(new Set(prereqChain));

      // Find nodes that depend on this node (downstream dependents)
      for (const edge of this.edges) {
        if (edge.toId === nodeId && edge.relation === 'depends_on') {
          dependentSet.add(edge.fromId);
        }
      }
      node.dependentIds = Array.from(dependentSet);

      // Dependency Score: A node has a higher dependency score if many other nodes rely on it
      // Foundational nodes (like Cloud POS or Base Menu) have high dependency scores
      const downstreamWeight = node.dependentIds.length * 25;
      const chainDepthWeight = node.prerequisiteChain.length * 10;
      node.dependencyScore = Math.min(100, Math.max(15, downstreamWeight + chainDepthWeight + node.inDegree * 5));
    }
  }

  /**
   * Retrieves all graph nodes.
   */
  public getAllNodes(): EntityGraphNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Retrieves a specific node by ID.
   */
  public getNode(id: string): EntityGraphNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Retrieves all edges.
   */
  public getAllEdges(): GraphEdge[] {
    return this.edges;
  }

  /**
   * Returns graph summary serialization.
   */
  public toSerializableGraph(): {
    nodesCount: number;
    edgesCount: number;
    nodes: EntityGraphNode[];
    edges: GraphEdge[];
  } {
    return {
      nodesCount: this.nodes.size,
      edgesCount: this.edges.length,
      nodes: this.getAllNodes(),
      edges: this.getAllEdges()
    };
  }
}
