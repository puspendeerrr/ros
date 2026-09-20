import type { SchemaLocalBusiness, SchemaNode } from '../types/schema.types.ts';

export interface VerifiedReviewData {
  authorName: string;
  reviewRating: number; // 1 to 5
  reviewBody: string;
  datePublished: string;
  isVerifiedRealData?: boolean;
}

export interface VerifiedAggregateRatingData {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
  isVerifiedRealData?: boolean;
}

/**
 * Review & AggregateRating Policy Gatekeeper:
 * Only generates valid schema nodes if verified reviews exist.
 * Returns null if data is empty, unverified, or invalid.
 */
export function createVerifiedReviewSchema(
  itemReviewedId: string,
  review: VerifiedReviewData
): SchemaNode | null {
  if (!review.isVerifiedRealData || !review.authorName || !review.reviewBody || review.reviewRating < 1) {
    return null; // Strict policy: zero synthetic or unverified reviews
  }

  return {
    '@type': 'Review',
    itemReviewed: { '@id': itemReviewedId },
    author: {
      '@type': 'Person',
      name: review.authorName
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.reviewRating,
      bestRating: 5
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished
  };
}

export function createVerifiedAggregateRatingSchema(
  itemReviewedId: string,
  aggregate: VerifiedAggregateRatingData
): SchemaNode | null {
  if (!aggregate.isVerifiedRealData || !aggregate.reviewCount || aggregate.reviewCount <= 0 || aggregate.ratingValue <= 0) {
    return null; // Strict policy: zero synthetic or unverified aggregate ratings
  }

  return {
    '@type': 'AggregateRating',
    itemReviewed: { '@id': itemReviewedId },
    ratingValue: aggregate.ratingValue,
    reviewCount: aggregate.reviewCount,
    bestRating: aggregate.bestRating || 5,
    worstRating: aggregate.worstRating || 1
  };
}

/**
 * Stubs prepared for future customer & merchant showcase pages.
 * Kept dormant and not injected into current SaaS platform pages.
 */
export function createRestaurantStub(props: {
  restaurantId: string;
  name: string;
  url: string;
  servesCuisine?: string[];
  priceRange?: string;
  menuUrl?: string;
  telephone?: string;
}): SchemaLocalBusiness {
  return {
    '@type': 'Restaurant',
    '@id': props.restaurantId,
    name: props.name,
    servesCuisine: props.servesCuisine,
    priceRange: props.priceRange || '₹₹',
    hasMenu: props.menuUrl,
    telephone: props.telephone
  };
}

export function createPhysicalProductStub(props: {
  productId: string;
  name: string;
  description: string;
  price: string;
  currency?: string;
}): SchemaNode {
  return {
    '@type': 'Product',
    '@id': props.productId,
    name: props.name,
    description: props.description,
    offers: {
      '@type': 'Offer',
      price: props.price,
      priceCurrency: props.currency || 'INR',
      availability: 'https://schema.org/InStock'
    }
  };
}
