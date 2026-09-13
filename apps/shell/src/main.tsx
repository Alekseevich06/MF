import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EventBusProvider, PreloaderProvider } from '@bookhub/react-contexts';
import { App } from './App';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
  <BrowserRouter>
  <EventBusProvider>
        <PreloaderProvider>
          <App />
        </PreloaderProvider>
      </EventBusProvider>
    </BrowserRouter>
  </StrictMode>
);
