/**
 * Semantic Anchor Diversity Engine
 * Generates natural, varied anchor texts (Exact, Descriptive, Contextual Action)
 * to avoid keyword stuffing and build natural internal link equity.
 */

import type { BaseContentItem } from '../../content/models/base.model.ts';
import type { SemanticAnchorVariants, InternalLinkReference } from '../types/programmatic.types.ts';

export class AnchorDiversityEngine {
  /**
   * Constructs 3 semantic anchor variations for a target content item.
   */
  public static getAnchorVariants(item: BaseContentItem): SemanticAnchorVariants {
    const title = item.title.trim();
    const typeLabel = item.contentType.replace(/_/g, ' ');

    let exact = title;
    let descriptive = `${title} (${typeLabel})`;
    let action = `Explore ${title}`;

    if (item.contentType === 'feature') {
      exact = title;
      descriptive = `${title} feature architecture`;
      action = `See how ${title} works`;
    } else if (item.contentType === 'comparison') {
      exact = title;
      descriptive = `${title} commercial analysis`;
      action = `Compare ${title}`;
    } else if (item.contentType === 'guide') {
      exact = title;
      descriptive = `complete guide to ${title.toLowerCase()}`;
      action = `Read the ${title} blueprint`;
    } else if (item.contentType === 'documentation') {
      exact = title;
      descriptive = `${title} technical documentation`;
      action = `View ${title} implementation docs`;
    }

    return { exact, descriptive, action };
  }

  /**
   * Binds internal links using rotating anchor text variants.
   */
  public static bindInternalLinks(
    _sourceItem: BaseContentItem,
    targetItems: BaseContentItem[]
  ): InternalLinkReference[] {
    const links: InternalLinkReference[] = [];
    const variantKeys: Array<'exact' | 'descriptive' | 'action'> = ['exact', 'descriptive', 'action'];

    targetItems.forEach((target, index) => {
      const variants = this.getAnchorVariants(target);
      const chosenVariant = variantKeys[index % variantKeys.length];
      const anchor = variants[chosenVariant];

      let relType: InternalLinkReference['relationshipType'] = 'feature';
      if (target.contentType === 'guide') relType = 'guide';
      else if (target.contentType === 'documentation') relType = 'doc';
      else if (target.contentType === 'faq') relType = 'faq';
      else if (target.contentType === 'industry') relType = 'industry';

      links.push({
        targetId: target.id,
        targetUrl: target.seo?.canonicalUrl || `/${target.contentType}/${target.slug}`,
        anchor,
        anchorVariant: chosenVariant,
        relationshipType: relType,
      });
    });

    return links;
  }
}
