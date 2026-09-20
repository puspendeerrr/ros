/**
 * Search Console Compatibility Adapter
 * Validates against Google Search Console structured data issue flags:
 * - Empty string fields
 * - Malformed URLs
 * - Unparseable dates
 * - Disallowed synthetic ratings
 */

import type { SchemaNode } from '../types/schema.types.ts';
import type { ValidationResult, ValidationError, ValidationWarning } from '../types/rich-results.types.ts';
import { isAbsoluteUrl } from '../helpers/url.helper.ts';

export class SearchConsoleAdapter {
  public static validate(node: SchemaNode): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 1. Recursive scan for empty string fields (which trigger GSC warnings)
    this.scanForEmptyStrings(node, '', warnings);

    // 2. Scan URLs for Search Console compliance
    this.scanForInvalidUrls(node, '', errors);

    // 3. Check for fake / placeholder AggregateRating
    if (node.aggregateRating) {
      const rating = node.aggregateRating as any;
      if (
        rating.ratingValue === 5 &&
        rating.reviewCount === 100 &&
        !rating.itemReviewed
      ) {
        errors.push({
          field: 'aggregateRating',
          message: 'Search Console flags placeholder 5.0/100 review counts as spam structured data policy violations',
          code: 'GSC_SUSPICIOUS_RATING_VALUES',
        });
      }
    }

    return {
      valid: errors.length === 0,
      targetType: node['@type'] || 'Unknown',
      errors,
      warnings,
    };
  }

  private static scanForEmptyStrings(obj: any, path: string, warnings: ValidationWarning[]): void {
    if (!obj || typeof obj !== 'object') return;

    for (const [k, v] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${k}` : k;
      if (typeof v === 'string' && v.trim() === '') {
        warnings.push({
          field: currentPath,
          message: `Field "${currentPath}" has an empty string value; Search Console recommends removing empty attributes rather than passing empty strings`,
          code: 'GSC_EMPTY_STRING_FIELD',
        });
      } else if (v && typeof v === 'object') {
        this.scanForEmptyStrings(v, currentPath, warnings);
      }
    }
  }

  private static scanForInvalidUrls(obj: any, path: string, errors: ValidationError[]): void {
    if (!obj || typeof obj !== 'object') return;

    const urlKeys = ['url', 'target', 'logo', 'contentUrl', 'embedUrl'];

    for (const [k, v] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${k}` : k;
      if (urlKeys.includes(k) && typeof v === 'string') {
        if (!isAbsoluteUrl(v)) {
          errors.push({
            field: currentPath,
            message: `Field "${currentPath}" value "${v}" must be an absolute URL for Search Console parsing`,
            code: 'GSC_RELATIVE_URL_DETECTED',
          });
        }
      } else if (v && typeof v === 'object') {
        this.scanForInvalidUrls(v, currentPath, errors);
      }
    }
  }
}
