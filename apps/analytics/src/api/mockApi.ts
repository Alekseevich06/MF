import type { Author, Book } from '@bookhub/contracts';
import { ANALYTICS_AUTHORS, ANALYTICS_BOOKS } from './mockData';

const NETWORK_DELAY_MIN = 200;
const NETWORK_DELAY_MAX = 1500;

function delay(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const ms = NETWORK_DELAY_MIN + Math.random() * (NETWORK_DELAY_MAX - NETWORK_DELAY_MIN);
    const timer = setTimeout(resolve, ms);

    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

// ─── critical ─────────────────────────────────────────

export interface UserHeader {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
}

export async function fetchUserHeader(signal: AbortSignal): Promise<UserHeader> {
  await delay(signal);
  return {
    id: 'user-1',
    name: 'Roman',
    avatarUrl: 'https://i.pravatar.cc/100?u=roman',
    role: 'Senior Frontend',
  };
}

// ─── high ─────────────────────────────────────────────

export interface Notifications {
  count: number;
  items: string[];
}

export async function fetchNotifications(signal: AbortSignal): Promise<Notifications> {
  await delay(signal);
  return {
    count: 3,
    items: ['Новая книга от Толстого', 'Комментарий к обзору', 'Еженедельный отчёт'],
  };
}

export async function fetchTopBooks(signal: AbortSignal): Promise<Book[]> {
  await delay(signal);
  return ANALYTICS_BOOKS.slice(0, 5);
}

export async function fetchRecentAuthors(signal: AbortSignal): Promise<Author[]> {
  await delay(signal);
  return ANALYTICS_AUTHORS;
}

export interface SalesPoint {
  date: string;
  value: number;
}

export interface SalesChart {
  points: SalesPoint[];
}

export async function fetchSalesChart(signal: AbortSignal): Promise<SalesChart> {
  await delay(signal);
  const points: SalesPoint[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86_400_000).toISOString().slice(0, 10),
    value: Math.round(50 + Math.random() * 100),
  }));
  return { points };
}

// ─── low ──────────────────────────────────────────────

export interface CategoryStat {
  category: string;
  count: number;
}

export async function fetchCategoryBreakdown(signal: AbortSignal): Promise<CategoryStat[]> {
  await delay(signal);
  return [
    { category: 'Классика', count: 42 },
    { category: 'Фантастика', count: 28 },
    { category: 'Детективы', count: 19 },
    { category: 'Поэзия', count: 11 },
  ];
}

export interface ReadingTime {
  totalHours: number;
  avgPerDay: number;
}

export async function fetchReadingTime(signal: AbortSignal): Promise<ReadingTime> {
  await delay(signal);
  return { totalHours: 128, avgPerDay: 1.8 };
}

export async function fetchRecommendations(signal: AbortSignal): Promise<Book[]> {
  await delay(signal);
  return ANALYTICS_BOOKS.slice(3, 8);
}

export interface ActivityItem {
  id: string;
  text: string;
  ts: number;
}

export async function fetchActivityFeed(signal: AbortSignal): Promise<ActivityItem[]> {
  await delay(signal);
  return [
    { id: 'af-1', text: 'Прочитал «Войну и мир»', ts: Date.now() - 3600_000 },
    { id: 'af-2', text: 'Добавил в избранное «Идиот»', ts: Date.now() - 7200_000 },
    { id: 'af-3', text: 'Оставил отзыв на «Мастера и Маргариту»', ts: Date.now() - 86_400_000 },
  ];
}

export async function fetchSimilarBooks(signal: AbortSignal): Promise<Book[]> {
  await delay(signal);
  return ANALYTICS_BOOKS.slice(1, 6);
}