import type { BaseContentItem } from '../models/base.model.js';
import type { MediaAsset } from '../media/media.model.js';
import type { ValidationIssue, ContentValidationReport } from './validation.types.js';
import { AUTHORS_REGISTRY } from '../authors/authors.registry.ts';
import { TAXONOMY_REGISTRY } from '../taxonomy/taxonomy.registry.ts';

export class ContentValidator {
  public static validateItem(item: BaseContentItem, allItems: BaseContentItem[] = [], mediaAssets: MediaAsset[] = []): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    // 1. Slug Syntax & Presence
    if (!item.slug || !SLUG_REGEX.test(item.slug)) {
      issues.push({
        contentId: item.id,
        field: 'slug',
        message: `Invalid slug format "${item.slug}". Must be lowercase alphanumeric kebab-case.`,
        severity: 'error',
        ruleCode: 'INVALID_SLUG_FORMAT'
      });
    }

    // 2. Duplicate Detection (Slug & ID)
    const duplicateSlugs = allItems.filter(i => i.id !== item.id && i.contentType === item.contentType && i.slug === item.slug);
    if (duplicateSlugs.length > 0) {
      issues.push({
        contentId: item.id,
        field: 'slug',
        message: `Duplicate slug "${item.slug}" detected in contentType "${item.contentType}".`,
        severity: 'error',
        ruleCode: 'DUPLICATE_SLUG'
      });
    }

    // 3. Duplicate Title Detection
    const duplicateTitles = allItems.filter(i => i.id !== item.id && i.title.toLowerCase().trim() === item.title.toLowerCase().trim());
    if (duplicateTitles.length > 0) {
      issues.push({
        contentId: item.id,
        field: 'title',
        message: `Duplicate title "${item.title}" detected in content item "${duplicateTitles[0].id}".`,
        severity: 'error',
        ruleCode: 'DUPLICATE_TITLE'
      });
    }

    // 4. Duplicate Description Detection
    if (item.description) {
      const duplicateDesc = allItems.filter(i => i.id !== item.id && i.description.toLowerCase().trim() === item.description.toLowerCase().trim());
      if (duplicateDesc.length > 0) {
        issues.push({
          contentId: item.id,
          field: 'description',
          message: `Duplicate description detected matching content item "${duplicateDesc[0].id}".`,
          severity: 'warning',
          ruleCode: 'DUPLICATE_DESCRIPTION'
        });
      }
    } else {
      issues.push({
        contentId: item.id,
        field: 'description',
        message: `Missing meta description on content "${item.id}".`,
        severity: 'error',
        ruleCode: 'MISSING_DESCRIPTION'
      });
    }

    // 5. Author Verification
    if (!item.authorId) {
      issues.push({
        contentId: item.id,
        field: 'authorId',
        message: `Content item "${item.id}" is missing an author ID.`,
        severity: 'error',
        ruleCode: 'MISSING_AUTHOR'
      });
    } else if (!AUTHORS_REGISTRY[item.authorId]) {
      issues.push({
        contentId: item.id,
        field: 'authorId',
        message: `Author ID "${item.authorId}" does not exist in AUTHORS_REGISTRY.`,
        severity: 'error',
        ruleCode: 'BROKEN_AUTHOR_REFERENCE'
      });
    }

    // 6. Category Verification
    if (!item.categoryId) {
      issues.push({
        contentId: item.id,
        field: 'categoryId',
        message: `Content item "${item.id}" is missing categoryId.`,
        severity: 'error',
        ruleCode: 'MISSING_CATEGORY'
      });
    } else {
      const categoryExists = TAXONOMY_REGISTRY.categories.some(c => c.id === item.categoryId || c.slug === item.categoryId);
      if (!categoryExists) {
        issues.push({
          contentId: item.id,
          field: 'categoryId',
          message: `Category "${item.categoryId}" does not exist in TAXONOMY_REGISTRY.`,
          severity: 'warning',
          ruleCode: 'BROKEN_CATEGORY_REFERENCE'
        });
      }
    }

    // 7. Canonical URL Verification
    if (!item.seo?.canonicalUrl) {
      issues.push({
        contentId: item.id,
        field: 'seo.canonicalUrl',
        message: `Content item "${item.id}" is missing an explicit canonicalUrl.`,
        severity: 'error',
        ruleCode: 'MISSING_CANONICAL'
      });
    }

    // 8. Broken Relationships Check
    if (item.relatedContentIds) {
      for (const relId of item.relatedContentIds) {
        const found = allItems.some(i => i.id === relId);
        if (!found) {
          issues.push({
            contentId: item.id,
            field: 'relatedContentIds',
            message: `Related content ID "${relId}" does not exist in content store.`,
            severity: 'warning',
            ruleCode: 'BROKEN_RELATIONSHIP_REFERENCE'
          });
        }
      }
    }

    // 9. Media & Alt Text Verification
    for (const media of mediaAssets) {
      if (!media.altText || media.altText.trim().length === 0) {
        issues.push({
          contentId: item.id,
          field: 'media.altText',
          message: `Media asset "${media.id}" is missing required altText.`,
          severity: 'error',
          ruleCode: 'MISSING_ALT_TEXT'
        });
      }
      if (!media.url || media.url.trim().length === 0) {
        issues.push({
          contentId: item.id,
          field: 'media.url',
          message: `Media asset "${media.id}" has an empty or broken URL path.`,
          severity: 'error',
          ruleCode: 'BROKEN_MEDIA_PATH'
        });
      }
    }

    return issues;
  }

  public static validateAll(items: BaseContentItem[], mediaAssets: MediaAsset[] = []): ContentValidationReport {
    const allIssues: ValidationIssue[] = [];

    for (const item of items) {
      const itemIssues = this.validateItem(item, items, mediaAssets);
      allIssues.push(...itemIssues);
    }

    const errorCount = allIssues.filter(i => i.severity === 'error').length;
    const warningCount = allIssues.filter(i => i.severity === 'warning').length;

    return {
      timestamp: new Date().toISOString(),
      totalItemsChecked: items.length,
      errorCount,
      warningCount,
      issues: allIssues,
      passed: errorCount === 0
    };
  }
}
