import type { Author, Book } from '@bookhub/contracts';

const FIRST_NAMES = ['Лев', 'Фёдор', 'Антон', 'Иван', 'Михаил', 'Александр', 'Николай', 'Сергей', 'Владимир', 'Борис'];
const LAST_NAMES = ['Толстой', 'Достоевский', 'Чехов', 'Тургенев', 'Булгаков', 'Пушкин', 'Гоголь', 'Лермонтов', 'Некрасов', 'Салтыков'];

export const AUTHORS: Author[] = Array.from({ length: 10 }, (_, i) => ({
  id: `author-${i + 1}`,
  name: `${FIRST_NAMES[i]} ${LAST_NAMES[i]}`,
  bio: `Биография ${FIRST_NAMES[i]} ${LAST_NAMES[i]}`,
  avatarUrl: `https://i.pravatar.cc/100?u=author-${i + 1}`,
  bookIds: [], // заполним ниже
}));

export const BOOKS: Book[] = (() => {
  const books: Book[] = [];
  let bookIndex = 1;

  for (const author of AUTHORS) {
    // Каждый автор имеет 11-25 книг — рандомно, но детерминированно
    const count = 11 + (bookIndex % 15);

    for (let j = 0; j < count; j++) {
      const bookId = `book-${bookIndex}`;
      books.push({
        id: bookId,
        title: `Книга ${bookIndex} (${author.name.split(' ')[1]})`,
        authorId: author.id,
        coverUrl: `https://picsum.photos/seed/${bookId}/200/300`,
        publishedYear: 1800 + (bookIndex % 200),
        pageCount: 100 + (bookIndex % 400),
      });
      author.bookIds.push(bookId);
      bookIndex++;
    }
  }

  return books;
})();