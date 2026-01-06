export interface Article {
  id: string;
  title: string;
  subtitle?: string; // Optional subtitle for articles
  excerpt: string;
  content: string[]; // Array of paragraphs
  date: string;
  readTime: string;
  imageIds?: number[]; // IDs for picsum images (optional)
  customImages?: string[]; // Custom image URLs (optional)
  tags: string[];
  metadata?: {
    note?: string;
    originalLink?: string;
    platform?: string;
    author?: string;
    editor?: string;
    publicationDate?: string;
  };
}