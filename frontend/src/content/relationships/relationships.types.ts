import type { BaseContentItem } from '../models/base.model.js';

export type RelationshipEdgeType =
  | 'related'
  | 'prerequisite'
  | 'see_also'
  | 'continue_learning'
  | 'series_next'
  | 'series_prev';

export interface ContentRelationshipEdge {
  sourceId: string;
  targetId: string;
  type: RelationshipEdgeType;
  weight: number; // 0 to 1
}

export interface SeriesNavigation {
  seriesId: string;
  currentIndex: number;
  totalSteps: number;
  prevItem?: BaseContentItem;
  nextItem?: BaseContentItem;
}
