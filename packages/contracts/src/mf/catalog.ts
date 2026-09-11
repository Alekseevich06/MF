import type { Locale } from '../domain';

export interface CatalogMFProps {
  initialAuthorId?: string;
  locale: Locale;
  onBookSelect: (bookId: string) => void;
}

export interface CatalogMFHandle {
  mount(el: HTMLElement, props: CatalogMFProps): void;
  unmount(): void;
}
