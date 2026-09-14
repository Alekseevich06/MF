import type { Book } from '@bookhub/contracts';
import { BOOKS } from './mockData';

export interface BooksPage {
  data: Book[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const NETWORK_DELAY_MS = 300;

export async function fetchBooksPage(
  authorIds: string[],
  page: number,
  limit: number,
  signal: AbortSignal
): Promise<BooksPage> {
  // Симулируем сетевую задержку с уважением к отмене
  await delay(NETWORK_DELAY_MS, signal);

  // Фильтруем книги по authorIds
  const filtered = BOOKS.filter((b) => authorIds.includes(b.authorId));
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Пагинация
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = filtered.slice(start, end);

  return {
    data,
    meta: { page, limit, total, totalPages },
  };
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timer = setTimeout(resolve, ms);

    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}