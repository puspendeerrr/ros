export type AuthorRole =
  | 'author'
  | 'reviewer'
  | 'editor'
  | 'contributor'
  | 'organization';

export interface AuthorSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface AuthorProfile {
  id: string;
  slug: string;
  name: string;
  role: AuthorRole;
  jobTitle: string;
  bio: string;
  avatarUrl: string;
  email?: string;
  socials: AuthorSocialLinks;
  expertise: string[];
  credentials?: string;
  isStaff: boolean;
  organizationName?: string;
  publishedArticleCount?: number;
}
