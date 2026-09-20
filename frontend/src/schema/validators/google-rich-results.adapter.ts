/**
 * Google Rich Results Validation Adapter
 * Validates schemas against Google Search Central requirements for Rich Snippets.
 */

import type { SchemaNode } from '../types/schema.types.ts';
import type { ValidationResult, ValidationError, ValidationWarning } from '../types/rich-results.types.ts';
import { isValidIso8601 } from '../helpers/date.helper.ts';
import { isAbsoluteUrl } from '../helpers/url.helper.ts';

export class GoogleRichResultsAdapter {
  public static validate(node: SchemaNode): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const type = node['@type'];

    if (!type) {
      errors.push({
        field: '@type',
        message: 'Schema node is missing required @type declaration',
        code: 'MISSING_TYPE',
      });
      return { valid: false, targetType: 'Unknown', errors, warnings };
    }

    switch (type) {
      case 'Article':
      case 'TechArticle':
      case 'BlogPosting':
        this.validateArticle(node, errors, warnings);
        break;
      case 'BreadcrumbList':
        this.validateBreadcrumbList(node, errors, warnings);
        break;
      case 'FAQPage':
        this.validateFAQPage(node, errors, warnings);
        break;
      case 'HowTo':
        this.validateHowTo(node, errors, warnings);
        break;
      case 'SoftwareApplication':
        this.validateSoftwareApplication(node, errors, warnings);
        break;
      case 'DefinedTerm':
      case 'DefinedTermSet':
      case 'ItemList':
        this.validateItemListOrTerm(node, errors, warnings);
        break;
      case 'Organization':
      case 'Brand':
      case 'WebSite':
      case 'WebPage':
        this.validateGlobalEntity(node, errors, warnings);
        break;
      default:
        warnings.push({
          field: '@type',
          message: `Node type "${type}" has no dedicated Google Rich Result adapter; validating as standard Schema.org entity`,
          code: 'UNSPECIFIED_RICH_RESULT_TYPE',
        });
        break;
    }

    return {
      valid: errors.length === 0,
      targetType: type,
      errors,
      warnings,
    };
  }

  private static validateArticle(
    node: SchemaNode,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!node.headline || typeof node.headline !== 'string') {
      errors.push({ field: 'headline', message: 'Articles require a headline', code: 'MISSING_HEADLINE' });
    } else if (node.headline.length > 110) {
      warnings.push({ field: 'headline', message: 'Article headlines are typically truncated after 110 characters by Google', code: 'LONG_HEADLINE' });
    }

    if (!node.image) {
      warnings.push({ field: 'image', message: 'Google recommends high-resolution images (min 1200px wide) for Article rich results', code: 'MISSING_IMAGE' });
    }

    if (!node.datePublished || !isValidIso8601(String(node.datePublished))) {
      errors.push({ field: 'datePublished', message: 'Articles require a valid ISO 8601 datePublished', code: 'INVALID_DATE_PUBLISHED' });
    }

    if (node.dateModified && !isValidIso8601(String(node.dateModified))) {
      errors.push({ field: 'dateModified', message: 'Article dateModified must be valid ISO 8601 if present', code: 'INVALID_DATE_MODIFIED' });
    }

    if (!node.author) {
      errors.push({ field: 'author', message: 'Articles require an author (Person or Organization)', code: 'MISSING_AUTHOR' });
    }

    if (!node.publisher) {
      warnings.push({ field: 'publisher', message: 'Articles should link to a publisher Organization', code: 'MISSING_PUBLISHER' });
    }
  }

  private static validateBreadcrumbList(
    node: SchemaNode,
    errors: ValidationError[],
    _warnings: ValidationWarning[]
  ): void {
    const itemListElement = node.itemListElement as unknown[];
    if (!itemListElement || !Array.isArray(itemListElement) || itemListElement.length === 0) {
      errors.push({ field: 'itemListElement', message: 'BreadcrumbList must contain at least one ListItem', code: 'EMPTY_BREADCRUMBS' });
      return;
    }

    itemListElement.forEach((item: any, idx: number) => {
      if (!item.position || typeof item.position !== 'number') {
        errors.push({ field: `itemListElement[${idx}].position`, message: 'Breadcrumb item must have a 1-based numeric position', code: 'INVALID_BREADCRUMB_POSITION' });
      }
      if (!item.name) {
        errors.push({ field: `itemListElement[${idx}].name`, message: 'Breadcrumb item must have a name', code: 'MISSING_BREADCRUMB_NAME' });
      }
      if (item.item && !isAbsoluteUrl(String(item.item))) {
        errors.push({ field: `itemListElement[${idx}].item`, message: 'Breadcrumb item URL must be an absolute URL', code: 'INVALID_BREADCRUMB_URL' });
      }
    });
  }

  private static validateFAQPage(
    node: SchemaNode,
    errors: ValidationError[],
    _warnings: ValidationWarning[]
  ): void {
    const mainEntity = node.mainEntity as unknown[];
    if (!mainEntity || !Array.isArray(mainEntity) || mainEntity.length === 0) {
      errors.push({ field: 'mainEntity', message: 'FAQPage must contain at least one Question in mainEntity', code: 'EMPTY_FAQ' });
      return;
    }

    mainEntity.forEach((q: any, idx: number) => {
      if (q['@type'] !== 'Question' || !q.name) {
        errors.push({ field: `mainEntity[${idx}].name`, message: 'Each FAQ item must be a Question with a name (question text)', code: 'INVALID_FAQ_QUESTION' });
      }
      if (!q.acceptedAnswer || q.acceptedAnswer['@type'] !== 'Answer' || !q.acceptedAnswer.text) {
        errors.push({ field: `mainEntity[${idx}].acceptedAnswer`, message: 'Each Question must have an acceptedAnswer with text', code: 'MISSING_FAQ_ANSWER' });
      }
    });
  }

  private static validateHowTo(
    node: SchemaNode,
    errors: ValidationError[],
    _warnings: ValidationWarning[]
  ): void {
    if (!node.name) {
      errors.push({ field: 'name', message: 'HowTo must have a name', code: 'MISSING_HOWTO_NAME' });
    }
    const step = node.step as unknown[];
    if (!step || !Array.isArray(step) || step.length === 0) {
      errors.push({ field: 'step', message: 'HowTo must contain at least one step', code: 'EMPTY_HOWTO_STEPS' });
    }
  }

  private static validateSoftwareApplication(
    node: SchemaNode,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!node.name) {
      errors.push({ field: 'name', message: 'SoftwareApplication must have a name', code: 'MISSING_APP_NAME' });
    }
    if (!node.applicationCategory) {
      errors.push({ field: 'applicationCategory', message: 'SoftwareApplication must declare an applicationCategory', code: 'MISSING_APP_CATEGORY' });
    }
    if (!node.offers) {
      warnings.push({ field: 'offers', message: 'SoftwareApplication offers recommended for commercial pricing signals', code: 'MISSING_OFFERS' });
    }
    // Check for illicit placeholder reviews
    if (node.aggregateRating) {
      const rating = node.aggregateRating as any;
      if (!rating.ratingValue || !rating.reviewCount) {
        errors.push({ field: 'aggregateRating', message: 'aggregateRating requires both ratingValue and reviewCount', code: 'INVALID_AGGREGATE_RATING' });
      }
    }
  }

  private static validateItemListOrTerm(
    node: SchemaNode,
    errors: ValidationError[],
    _warnings: ValidationWarning[]
  ): void {
    if (!node.name && !node.termCode) {
      errors.push({ field: 'name', message: 'Entity must provide a name or termCode', code: 'MISSING_NAME' });
    }
  }

  private static validateGlobalEntity(
    node: SchemaNode,
    errors: ValidationError[],
    _warnings: ValidationWarning[]
  ): void {
    if (!node.name) {
      errors.push({ field: 'name', message: `${node['@type']} must have a name`, code: 'MISSING_NAME' });
    }
    if (node['@type'] === 'WebPage' && !node.url) {
      errors.push({ field: 'url', message: 'WebPage must have a url', code: 'MISSING_URL' });
    }
  }
}
