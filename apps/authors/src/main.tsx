import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AuthorsMF from './AuthorsMF';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <AuthorsMF
      locale="ru"
      onBookClick={(id) => console.log('Selected book:', id)}
    />
  </StrictMode>
);
