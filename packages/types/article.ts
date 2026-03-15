export interface Article {
  slug: string
  author: string
  date: string
  description: string
  tags: string[]
  image?: string
  id: string;
  title: string;
  thumbnail: string;
  comments: number;
  likes: number;
  createdAt: string;
  authorName: string
  authorImage: string
  previewImage: string
}