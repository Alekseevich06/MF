import type { Author, Book } from '@bookhub/contracts';

export const ANALYTICS_AUTHORS: Author[] = [
  { id: 'author-1', name: 'Лев Толстой', bio: '', avatarUrl: 'https://i.pravatar.cc/100?u=a1', bookIds: [] },
  { id: 'author-2', name: 'Фёдор Достоевский', bio: '', avatarUrl: 'https://i.pravatar.cc/100?u=a2', bookIds: [] },
  { id: 'author-3', name: 'Антон Чехов', bio: '', avatarUrl: 'https://i.pravatar.cc/100?u=a3', bookIds: [] },
  { id: 'author-4', name: 'Иван Тургенев', bio: '', avatarUrl: 'https://i.pravatar.cc/100?u=a4', bookIds: [] },
  { id: 'author-5', name: 'Михаил Булгаков', bio: '', avatarUrl: 'https://i.pravatar.cc/100?u=a5', bookIds: [] },
];

export const ANALYTICS_BOOKS: Book[] = [
  { id: 'ab-1', title: 'Война и мир', authorId: 'author-1', coverUrl: 'https://picsum.photos/seed/ab1/200/300', publishedYear: 1869, pageCount: 1225 },
  { id: 'ab-2', title: 'Анна Каренина', authorId: 'author-1', coverUrl: 'https://picsum.photos/seed/ab2/200/300', publishedYear: 1877, pageCount: 864 },
  { id: 'ab-3', title: 'Преступление и наказание', authorId: 'author-2', coverUrl: 'https://picsum.photos/seed/ab3/200/300', publishedYear: 1866, pageCount: 671 },
  { id: 'ab-4', title: 'Идиот', authorId: 'author-2', coverUrl: 'https://picsum.photos/seed/ab4/200/300', publishedYear: 1869, pageCount: 640 },
  { id: 'ab-5', title: 'Вишнёвый сад', authorId: 'author-3', coverUrl: 'https://picsum.photos/seed/ab5/200/300', publishedYear: 1903, pageCount: 96 },
  { id: 'ab-6', title: 'Отцы и дети', authorId: 'author-4', coverUrl: 'https://picsum.photos/seed/ab6/200/300', publishedYear: 1862, pageCount: 320 },
  { id: 'ab-7', title: 'Мастер и Маргарита', authorId: 'author-5', coverUrl: 'https://picsum.photos/seed/ab7/200/300', publishedYear: 1967, pageCount: 480 },
  { id: 'ab-8', title: 'Собачье сердце', authorId: 'author-5', coverUrl: 'https://picsum.photos/seed/ab8/200/300', publishedYear: 1925, pageCount: 128 },
];