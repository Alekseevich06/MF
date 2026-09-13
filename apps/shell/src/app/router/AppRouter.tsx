import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { NavBar } from '../../NavBar';
import { MFBoundary } from '../../components/MFBoundary';   // ← путь под твою структуру

const CatalogMF = lazy(() => import('catalog/CatalogMF'));
const AuthorsMF = lazy(() => import('authors/AuthorsMF'));
const AnalyticsMF = lazy(() => import('analytics/AnalyticsMF'));

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route
          path="catalog/*"
          element={
            <MFBoundary name="catalog">
              <Suspense fallback={<div>Loading catalog...</div>}>
                <CatalogMF locale="ru" onBookSelect={() => {}} />
              </Suspense>
            </MFBoundary>
          }
        />
        <Route
          path="authors/*"
          element={
            <MFBoundary name="authors">
              <Suspense fallback={<div>Loading authors...</div>}>
                <AuthorsMF locale="ru" onBookClick={() => {}} />
              </Suspense>
            </MFBoundary>
          }
        />
        <Route
          path="analytics/*"
          element={
            <MFBoundary name="analytics">
              <Suspense fallback={<div>Loading analytics...</div>}>
                <AnalyticsMF
                  locale="ru"
                  initialDateRange={{ from: '2025-01-01', to: '2025-12-31' }}
                  onExportRequested={() => {}}
                />
              </Suspense>
            </MFBoundary>
          }
        />
      </Route>
    </Routes>
  );
}