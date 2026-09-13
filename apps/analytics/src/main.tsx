import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AnalyticsMF from './AnalyticsMF';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <AnalyticsMF
      locale="ru"
    />
  </StrictMode>
);
