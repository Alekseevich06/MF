export interface Book {
  id: string;
  title: string;
  authorId: string;
  coverUrl: string;
  publishedYear: number;
  pageCount: number;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  bookIds: string[];
}

export type Locale = 'ru' | 'en';
