/**
 * Answer Registry
 * In-memory index of verified answer objects for LLM retrieval and conversational routing.
 */

import { MASTER_CONTENT_REGISTRY } from '../../content/registries/content.registry.ts';
import type { StructuredAnswerObject } from '../types/ai-search.types.ts';
import { AnswerExtractorEngine } from './answer-extractor.engine.ts';

export class AnswerRegistry {
  private answers: Map<string, StructuredAnswerObject> = new Map();

  constructor(customAnswers?: StructuredAnswerObject[]) {
    const list = customAnswers || AnswerExtractorEngine.extractAllAnswers(MASTER_CONTENT_REGISTRY);
    for (const ans of list) {
      this.answers.set(ans.id, ans);
    }
  }

  /**
   * Retrieves all answer objects.
   */
  public getAll(): StructuredAnswerObject[] {
    return Array.from(this.answers.values());
  }

  /**
   * Retrieves an answer object by ID.
   */
  public getById(id: string): StructuredAnswerObject | undefined {
    return this.answers.get(id);
  }

  /**
   * Retrieves all answer objects associated with a specific content ID.
   */
  public getByContentId(contentId: string): StructuredAnswerObject[] {
    return Array.from(this.answers.values()).filter(a => a.contentId === contentId);
  }

  /**
   * Finds the best matching answer for a user prompt.
   */
  public findBestMatch(query: string): StructuredAnswerObject | undefined {
    const qLower = query.toLowerCase();
    return Array.from(this.answers.values()).find(a =>
      a.question.toLowerCase().includes(qLower) ||
      qLower.includes(a.question.toLowerCase()) ||
      a.entitiesMentioned.some(e => qLower.includes(e.toLowerCase()))
    );
  }
}

export const answerRegistry = new AnswerRegistry();
