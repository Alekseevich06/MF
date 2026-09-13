import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CatalogMF from './CatalogMF';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <CatalogMF
      locale="ru"
      onBookSelect={(id) => console.log('Selected book:', id)}
    />
  </StrictMode>
);
