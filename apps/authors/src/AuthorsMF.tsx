import type { AuthorsMFProps } from '@bookhub/contracts';

export default function AuthorsMF({ locale, onBookClick }: AuthorsMFProps) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Authors MF</h1>
      <p>Locale: {locale}</p>
      <button onClick={() => onBookClick('book-1')}>Select book 1</button>
    </div>
  );
}