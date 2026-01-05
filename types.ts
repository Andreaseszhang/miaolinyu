export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[]; // Array of paragraphs
  date: string;
  readTime: string;
  imageIds: number[]; // IDs for picsum images
  tags: string[];
}