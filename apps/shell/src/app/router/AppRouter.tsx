import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { NavBar } from "../../NavBar";

const CatalogMF = lazy(() => import('catalog/CatalogMF'));

const AuthorsMF = lazy(() => import('authors/AuthorsMF'));

const AnalyticsMF = lazy(() => import('analytics/AnalyticsMF'));

export function AppRouter(){

    return (
        <Routes>
            <Route path="/" element={<NavBar />}>
            <Route
                path="/catalog/*"
                element={
                        <Suspense fallback={<div>Loading catalog...</div>}>
                        <CatalogMF locale="ru" onBookSelect={() => {}} />
                        </Suspense>
                }
            />
            <Route path="/authors/*" 
                element={
                        <Suspense fallback={<div>Loading authors...</div>}>
                        <AuthorsMF locale="ru" onBookClick={(id) => {}} />
                        </Suspense>
                } 
            />
            <Route path="/analytics/*" 
                element={
                        <Suspense fallback={<div>Loading analytics...</div>}>
                        <AnalyticsMF locale="ru"/>
                        </Suspense>
                } 
            />
            </Route>
        </Routes>
    )
}