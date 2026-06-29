// ─── Blog / Article Types ────────────────────────────────────────────────────

export interface BlogAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string; // full HTML/markdown (populated on detail page)
  coverImage: string;
  category: BlogCategory;
  tags: string[];
  author: BlogAuthor;
  publishedAt: string; // ISO 8601
  readingTime: number; // minutes
  isFeatured?: boolean;
  isHidden?: boolean;
}

export type BlogCategory =
  | "tips"
  | "guides"
  | "news"
  | "coliving"
  | "student-life"
  | "city-guide";

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  tips: "Tips & Tricks",
  guides: "Guides",
  news: "News",
  coliving: "Coliving",
  "student-life": "Student Life",
  "city-guide": "City Guide",
};

// ─── Community Post Types ─────────────────────────────────────────────────────

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  city: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string; // ISO 8601
}

// ─── Testimonial Types ────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  city: string;
  occupation: string;
  rating: number; // 1-5
  review: string;
  pgName?: string;
}
