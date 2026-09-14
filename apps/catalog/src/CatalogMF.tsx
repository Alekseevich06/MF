import type { CatalogMFProps } from '@bookhub/contracts';
import { BooksByAuthors } from './features/BooksByAuthors/BooksByAuthors';

export default function CatalogMF({ locale, onBookSelect }: CatalogMFProps) {
  return (
    <div style={{ padding: 24 }}>
      <BooksByAuthors locale={locale} onBookClick={onBookSelect}/>
    </div>
  );
}