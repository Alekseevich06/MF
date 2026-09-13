import type { ComponentType } from 'react';
import type { Locale } from '../domain';

export interface CatalogMFProps {
  initialAuthorId?: string;
  locale: Locale;
  onBookSelect: (bookId: string) => void;
}

export type CatalogMF = ComponentType<CatalogMFProps>;
