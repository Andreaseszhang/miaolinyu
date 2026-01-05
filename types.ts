export interface Article {
  id: string;
  title: string;
  subtitle?: string; // Optional subtitle for articles
  excerpt: string;
  content: string[]; // Array of paragraphs
  date: string;
  readTime: string;
  imageIds: number[]; // IDs for picsum images
  tags: string[];
}