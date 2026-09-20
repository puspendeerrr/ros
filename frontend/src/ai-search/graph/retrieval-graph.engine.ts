/**
 * Retrieval Graph Engine
 * Expands the Knowledge Graph into a Question-Answer-Entity retrieval mesh for LLM traversal.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type {
  RetrievalGraphEdge,
  RetrievalGraphNode,
  RetrievalGraphSummary
} from '../types/ai-search.types.ts';
import { AnswerExtractorEngine } from '../answers/answer-extractor.engine.ts';
import { ConversationalQueryEngine } from '../conversation/conversational-query.engine.ts';

export class RetrievalGraphEngine {
  /**
   * Constructs the full LLM Retrieval Graph from content, answers, and queries.
   */
  public static buildGraph(items: BaseContentItem[]): RetrievalGraphSummary {
    const nodes: RetrievalGraphNode[] = [];
    const edges: RetrievalGraphEdge[] = [];
    const answers = AnswerExtractorEngine.extractAllAnswers(items);
    const queries = ConversationalQueryEngine.generateIntents(items);

    // 1. Entity Nodes
    for (const item of items) {
      nodes.push({
        id: `node-entity-${item.id}`,
        label: item.title,
        nodeType: 'Entity',
        contentId: item.id,
        metadata: {
          contentType: item.contentType,
          productArea: item.productArea
        }
      });
    }

    // 2. Answer Nodes & Answer Edges
    for (const ans of answers) {
      nodes.push({
        id: `node-ans-${ans.id}`,
        label: ans.shortAnswer.slice(0, 60) + '...',
        nodeType: 'Answer',
        contentId: ans.contentId,
        metadata: {
          type: ans.type,
          confidence: ans.confidenceScore
        }
      });

      // Edge: Entity has_answer_block Answer
      edges.push({
        fromId: `node-entity-${ans.contentId}`,
        toId: `node-ans-${ans.id}`,
        relationship: 'has_answer_block',
        weight: 0.95
      });
    }

    // 3. Question Nodes & Question Edges
    for (const q of queries) {
      nodes.push({
        id: `node-query-${q.intentId}`,
        label: q.userQuery,
        nodeType: 'Question',
        contentId: q.targetContentId,
        metadata: {
          category: q.category
        }
      });

      // Edge: Question answers_question Answer
      edges.push({
        fromId: `node-ans-${q.matchedAnswerId}`,
        toId: `node-query-${q.intentId}`,
        relationship: 'answers_question',
        weight: 0.90
      });
    }

    return {
      nodesCount: nodes.length,
      edgesCount: edges.length,
      nodes,
      edges
    };
  }
}
