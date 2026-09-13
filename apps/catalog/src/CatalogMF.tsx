import type { CatalogMFProps } from '@bookhub/contracts';

export default function CatalogMF({ locale, onBookSelect }: CatalogMFProps) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Catalog MF</h1>
      <p>Locale: {locale}</p>
      <button onClick={() => onBookSelect('book-1')}>Select book 1</button>
    </div>
  );
}